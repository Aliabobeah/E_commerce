const { Seller } = require("../models/sellerSchema");
const { Product } = require("../models/productSchema");
const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");
const { SellerOrder } = require("../models/order-seller-schema");
const {
  getAllDocs,
  updateOneDocById,
  aggregateQuery,
} = require("./factoryController");

/**
 * @desc     show cancelled orders
 * @method     get
 * @route        /cancelledOrders
 * @access      (login)
 */

const showCancelledOrders = asyncWrapper(async (req, res, next) => {
  const sellerId = req.query.sellerId;
  const cancelledOrders = await SellerOrder.find({
    seller: sellerId,
    status: "cancelled",
  });
  if (!cancelledOrders) {
    return next(new AppError("fail", 404));
  }

  res.status(200).json({ data: cancelledOrders });
});
/**
 * @desc     show pending orders
 * @method     get
 * @route        /pendingOrders
 * @access      (login)
 */

const showPendingOrders = asyncWrapper(async (req, res, next) => {
  const sellerId = req.query.sellerId;
  const pendingOrders = await SellerOrder.find({
    seller: sellerId,
    status: "pending",
  });
  if (!pendingOrders) {
    return next(new AppError("fail", 404));
  }

  res.status(200).json({ data: pendingOrders });
});

/**
 * @desc     show done orders
 * @method     get
 * @route        /doneOrders
 * @access      (login)
 */
const showDoneOrders = asyncWrapper(async (req, res, next) => {
  const sellerId = req.query.sellerId;
  const receivedOrders = await SellerOrder.find({
    seller: sellerId,
    status: "done",
  });
  if (!receivedOrders) {
    return next(new AppError("fail", 404));
  }

  res.status(200).json({ data: receivedOrders });
});
/**
 * @desc     show unsold products and number of unsold products
 * @method     get
 * @route        /unsoldProducts
 * @access      (login)
 */

const getAllUnSoldproducts = asyncWrapper(async (req, res, next) => {
  const sellerId = req.query.sellerId;
  const filter = { seller: sellerId, productSales: { $eq: 0 } };
  const [count, documents] = await Promise.all([
    Product.countDocuments(filter),
    getAllDocs(Product, filter),
  ]);

  if (!documents) {
    return next(new AppError("There is no documents", 404));
  }
  res.status(200).json({ data: { count, documents } });
});

/**
 * @desc     show all products and number of all products
 * @method     get
 * @route        /allProducts
 * @access      (login)
 */

const getAllproducts = asyncWrapper(async (req, res, next) => {
  const sellerId = req.query.sellerId;
  const filter = { seller: sellerId };
  const [count, documents] = await Promise.all([
    Product.countDocuments(filter),
    getAllDocs(Product, filter),
  ]);

  if (!documents) {
    return next(new AppError("There is no documents", 404));
  }
  res.status(200).json({ data: { count, documents } });
});
/**
 * @desc     add discount on product
 * @method     put
 * @route        /products/:id
 * @access      (login)
 */

const addDiscountOnProduct = asyncWrapper(async (req, res, next) => {
  const { discountPrice } = req.body;
  const updatedFields = { discountPrice };
  const options = { new: true };
  const updatedDocument = await updateOneDocById(
    Seller,
    id,
    updatedFields,
    options
  );
  if (!updatedDocument) {
    return next(new AppError("There is no document with this id", 404));
  }
  res.status(200).json({ data: updatedDocument });
});
/**
 * @desc     show most sold products for seller
 * @method     get
 * @route        /mostSoldProducts
 * @access      (login)
 */

const getMostSoldProducts = asyncWrapper(async (req, res, next) => {
  const sellerId = req.query.sellerId;
  const pipeline = [
    { $match: { seller: sellerId } },
    { $sort: { productSales: -1 } },
    { $limit: 30 },
  ];
  const result = await aggregateQuery(Product, pipeline);

  if (!result.length) {
    return next(new AppError("No products found", 404));
  }

  res.status(200).json({ data: result });
});
/**
 * @desc     show less sold products for seller
 * @method     get
 * @route        /lessSoldProducts
 * @access      (login)
 */

const getLessSoldProducts = asyncWrapper(async (req, res, next) => {
  const sellerId = req.query.sellerId;
  const pipeline = [
    { $match: { seller: sellerId } },
    { $sort: { productSales: 1 } },
    { $limit: 30 },
  ];
  const result = await aggregateQuery(Product, pipeline);

  if (!result.length) {
    return next(new AppError("No products found", 404));
  }

  res.status(200).json({ data: result });
});

module.exports = {
  showCancelledOrders,
  showPendingOrders,
  showDoneOrders,
  getAllUnSoldproducts,
  getAllproducts,
  addDiscountOnProduct,
  getMostSoldProducts,
  getLessSoldProducts,
};
