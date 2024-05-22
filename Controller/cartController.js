const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");
const { User } = require("../models/userSchema");
const { Seller } = require("../models/sellerSchema");
const { Cart } = require("../models/cartSchema");
/**
 * @desc     add product to cart
 * @method     post
 * @route        /addToCart
 * @access      (login)
 */

const addProductToCart = asyncWrapper(async (req, res, next) => {
    const { productId, userId , productQuantity} = req.body;
    if (!productId) {
      return next(new AppError("plase add product", 404));
    }
    
    const addToCart = await Cart.create({
      items: [{
         product: productId,
          quantity: productQuantity
      }],
      user: userId
    });
    if (!addToCart) {
      return next(new AppError("failed to add product try again", 500));
    }
    res.status(201).json({ message: "done" });
  });
  
  /**
   * @desc     remove product from cart
   * @method     post
   * @route       cart/removeProduct
   * @access      (login+ owner this)
   */
  const removeProductFromCart = asyncWrapper(async (req, res, next) => {
    const { productId, cartId } = req.body;
  
    if (!productId) {
      return next(new AppError("plase select a product", 400));
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return next(new AppError("cart not found", 404));
    }
  const getProductIndex = cart.items.findIndex(productIndex => productIndex.product.toString() === productId.toString())
  if (getProductIndex === -1) {
    return next(new AppError("product not found", 404));
  }
  cart.items.splice(getProductIndex, 1);
  const updatedCart = await cart.save({new: true});
  if (!updatedCart) {
    return next(new AppError("failed to remove product try again", 500));
  }

    res.status(200).json({ data: updatedCart });
  });
/**
   * @desc     change product quantity
   * @method     post
   * @route       cart/changeProductQuantity
   * @access      (login+ owner this)
   */
  const changeProductQuantity = asyncWrapper(async (req, res, next) => {
    const { productId, cartId, newQuantity } = req.body;
  
    if (!newQuantity) {
      return next(new AppError("plase select a new quantity", 400));
    }

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return next(new AppError("cart not found", 404));
    }
  const getProductIndex = cart.items.findIndex(productIndex => productIndex.product.toString() === productId.toString())
  if (getProductIndex === -1) {
    return next(new AppError("product not found", 404));
  }
  cart.items[getProductIndex].quantity = newQuantity;
  const updatedCart = await cart.save({new: true});
  if (!updatedCart) {
    return next(new AppError("failed to remove product try again", 500));
  }

    res.status(200).json({ data: updatedCart });
  });

module.exports = {
  addProductToCart,
  removeProductFromCart,
  changeProductQuantity
}


