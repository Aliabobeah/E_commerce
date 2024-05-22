const asyncWrapper = require("../Middleware/asyncWrapper");
const { SellerOrder } = require("../models/order-seller-schema");
const { OrderUser } = require("../models/order-user-schema");
const { Seller } = require("../models/sellerSchema");
const { Product } = require("../models/productSchema");
const { groupBy } = require("../utils/groupBy");
const generateRandomNumber = require("../utils/randomNumber");
const { User } = require("../models/userSchema");
const AppError = require("../utils/AppError");
const { getOneDoc } = require("./factoryController");

const createNewOrder = asyncWrapper(async (req, res, next) => {
  const { orderItems, shippingAddress, city, zip, country, phone, userId } =
    req.body.orderData;
  const numberOrder = generateRandomNumber();
  let totalPriceForUser = 0;
  let orderItemUser = [];
  let productUpdates = [];
  let sellerOrderPromises = [];
  const groupedOrders = groupBy(orderItems, (orderItem) => orderItem.sellerId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    for (const [sellerId, items] of groupedOrders.entries()) {
      let orderItemSeller = [];
      let totalPriceForSeller = 0;

      for (const item of items) {
        const productQuantity = item.quantity;
        const productPrice = item.price;
        const productId = item.product;

        orderItemSeller.push({
          quantity: productQuantity,
          product: productId,
        });

        orderItemUser.push({
          quantity: productQuantity,
          product: productId,
        });

        const calculateProductPrice = productPrice * productQuantity;

        totalPriceForSeller += calculateProductPrice;
        totalPriceForUser += calculateProductPrice;
        productUpdates.push({
          updateOne: {
            filter: { _id: productId },
            update: { $inc: { productSales: productQuantity } },
            session,
          },
        });
      }

      const saveSellerOrder = new SellerOrder({
        products: orderItemSeller,
        orderNumber: numberOrder,
        seller: sellerId,
        shippingAddress,
        city,
        zip,
        country,
        phone,
        user: userId,
        totalPrice: totalPriceForSeller,
      });
      sellerOrderPromises.push(saveSellerOrder.save({ session }));
    }

    const productUpdatePromise = Product.bulkWrite(productUpdates, { session });
    await Promise.all([productUpdatePromise, ...sellerOrderPromises]);

    const orderUser = new OrderUser({
      products: orderItemUser,
      orderNumber: numberOrder,
      shippingAddress,
      city,
      zip,
      country,
      phone,
      user: userId,
      totalPrice: totalPriceForUser,
    });
    await orderUser.save({ session });
    await session.commitTransaction();
    session.endSession();
    res
      .status(201)
      .json({
        message: "order created  successfully",
        data: totalPriceForUser,
        numberOrder,
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

/**
 * @desc       User cancled an order
 * @method     POST
 * @route      /api/v1/orders/:id
 * @access      (user => login)
 */

const cancelOrderByUser = asyncWrapper(async (req, res, next) => {
  const { orderId, userId } = req.body;
  let bulkProductUpdates = [];
  let sellerOrderUpdates = [];

  const orderInfo = await OrderUser.findById(orderId).select(
    "products orderNumber"
  );

  orderInfo.products.forEach((item) => {
    bulkProductUpdates.push({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { productSales: -item.quantity } },
      },
    });

    sellerOrderUpdates.push({
      updateMany: {
        filter: { orderNumber: orderInfo.orderNumber },
        update: {
          $set: { status: "Canceled By User" },
        },
      },
    });
  });

  await Promise.all([
    Product.bulkWrite(bulkProductUpdates),
    sellerOrder.bulkWrite(sellerOrderUpdates),
    OrderUser.findByIdAndUpdate(orderId, {
      $set: { status: "Canceled By Me" },
    }),
  ]);

  res.json({ message: "Orders canceled successfully" });
});

/**
 * @desc       User update an order
 * @method     Put
 * @route       /api/v1/orders/:id
 * @access      (user => login)
 */

const updateOrderByUser = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { orderData } = req.body;
  const { orderItems, orderNumber } = orderData;

  const updateTasks = [];

  for (const item of orderItems) {
    const productId = item.product;
    const changeQuantity = item.quantity;
    const productPrice = item.price;
    const sellerId = item.sellerId;
    const deleteProduct = item.deleteProduct;

    const [sellerOrder, userOrder] = await Promise.all([
      SellerOrder.findOne({ _id: sellerId, orderNumber: orderNumber }),
      OrderUser.findById(id),
    ]);

    if (!sellerOrder || !userOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (changeQuantity) {
      const sellerProductIndex = sellerOrder.products.findIndex(
        (product) => product._id.toString() === productId.toString()
      );
      const userProductIndex = userOrder.products.findIndex(
        (product) => product._id.toString() === productId.toString()
      );

      if (sellerProductIndex === -1 || userProductIndex === -1) {
        return res.status(400).json({ message: "Product not found in order" });
      }

      sellerOrder.products[sellerProductIndex].quantity += changeQuantity;
      sellerOrder.totalPrice += changeQuantity * productPrice;
      userOrder.products[userProductIndex].quantity += changeQuantity;
      userOrder.totalPrice += changeQuantity * productPrice;

      updateTasks.push(
        {
          updateOne: {
            filter: { _id: sellerOrder._id },
            update: { $set: sellerOrder },
          },
        },
        {
          updateOne: {
            filter: { _id: userOrder._id },
            update: { $set: userOrder },
          },
        }
      );
    }

    if (deleteProduct) {
      const sellerProductIndex = sellerOrder.products.findIndex(
        (product) => product._id.toString() === productId.toString()
      );
      const userProductIndex = userOrder.products.findIndex(
        (product) => product._id.toString() === productId.toString()
      );

      if (sellerProductIndex === -1 || userProductIndex === -1) {
        return res.status(400).json({ message: "Product not found in order" });
      }

      sellerOrder.products.splice(sellerProductIndex, 1);
      sellerOrder.totalPrice -= changeQuantity * productPrice;
      userOrder.products.splice(userProductIndex, 1);

      updateTasks.push(
        {
          updateOne: {
            filter: { _id: sellerOrder._id },
            update: { $set: sellerOrder },
          },
        },
        {
          updateOne: {
            filter: { _id: userOrder._id },
            update: { $set: userOrder },
          },
        }
      );

      updateTasks.push({
        updateOne: {
          filter: { _id: productId },
          update: { $inc: { productSales: -changeQuantity } },
        },
      });
    }
  }

  const updateResults = await Product.bulkWrite(updateTasks);

  const hasUpdateErrors = updateResults.some(
    (result) => result.updateOne.modifiedCount === 0
  );
  if (hasUpdateErrors) {
    return res
      .status(500)
      .json({ message: "Failed to update some or all orders" });
  }

  res.json({ message: "Orders updated successfully" });
});

const getOrderByOrderNumber = asyncWrapper(async (req, res, next) => {
  const { orderNumber } = req.body;
  
 const document = await getOneDoc(OrderUser, orderNumber);
 if (!document) {
  return next(new AppError(`There is no order with this ${orderNumber}`, 404));
 }
  res.status(200).json(document);
});
module.exports = {
  createNewOrder,
  cancelOrderByUser,
  updateOrderByUser,
  getOrderByOrderNumber,
};


