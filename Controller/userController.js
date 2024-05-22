const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");
const { User } = require("../models/userSchema");
const { Seller } = require("../models/sellerSchema");
const { Cart } = require("../models/cartSchema");
const { OrderUser } = require("../models/order-user-schema");
const { Comment } = require("../models/commentSchema");

/**
 * @desc     add product to favorite
 * @method     post
 * @route        /addToFavorite
 * @access      (login)
 */
const addProductToFavorite = asyncWrapper(async (req, res, next) => {
  const { productId, userId } = req.body;
  if (!productId) {
    return next(new AppError("plase add product", 404));
  }
  const addToFavorite = await User.findByIdAndUpdate(userId, {
    $push: { favorite: productId },
  });
  if (!addToFavorite) {
    return next(new AppError("fail", 500));
  }
  res.status(200).json({ message: "done" });
});

/**
 * @desc     remove product from favorite
 * @method     post
 * @route        /removeProduct
 * @access      (login)
 */
const removeProductFromFavorite = asyncWrapper(async (req, res, next) => {
  const { productId, userId } = req.body;
  if (!productId) {
    return next(new AppError("plase add product", 404));
  }
  const removeFromFavorite = await User.findByIdAndUpdate(userId, {
    $pull: { favorite: productId },
  });
  if (!removeFromFavorite) {
    return next(new AppError("fail", 500));
  }
  res.status(200).json({ message: "done" });
});

/**
 * @desc     show Favorite Products
 * @method     get
 * @route        /favorite
 * @access      (login)
 */

const showFavoriteProducts = asyncWrapper(async (req, res, next) => {
  const userId = req.query.userId;
  const favoriteProducts = await User.findById(userId).populate("favorite");
  if (!favoriteProducts) {
    return next(new AppError("fail", 404));
  }
  if (favoriteProducts.length === 0) {
    return res.status(204).json({ message: "there is no favorite products" });
  }

  res.status(200).json({ data: favoriteProducts });
});

/**
 * @desc     show cart
 * @method     get
 * @route        /cart
 * @access      (login)
 */
const showCart = asyncWrapper(async (req, res, next) => {
  const userId = req.query.userId;
  const cartProducts = await Cart.findOne({ user: userId });
  if (!cartProducts) {
    return next(new AppError("fail", 404));
  }

  res.status(200).json({ data: cartProducts });
});

/**
 * @desc     show cancelled orders
 * @method     get
 * @route        /cancelledOrders
 * @access      (login)
 */

const showCancelledOrders = asyncWrapper(async (req, res, next) => {
  const userId = req.query.userId;
  const cancelledOrders = await OrderUser.find({
    user: userId,
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
  const userId = req.query.userId;
  const pendingOrders = await OrderUser.find({
    user: userId,
    status: "pending",
  });
  if (!pendingOrders) {
    return next(new AppError("fail", 404));
  }

  res.status(200).json({ data: pendingOrders });
});

/**
 * @desc     show received orders
 * @method     get
 * @route        /receivedOrders
 * @access      (login)
 */
const showReceivedOrders = asyncWrapper(async (req, res, next) => {
  const userId = req.query.userId;
  const receivedOrders = await OrderUser.find({
    user: userId,
    status: "received",
  });
  if (!receivedOrders) {
    return next(new AppError("fail", 404));
  }

  res.status(200).json({ data: receivedOrders });
});

/**
 * @desc     add comment
 * @method     post
 * @route        /addComment
 * @access      (login)
 */
const addComment = asyncWrapper(async (req, res, next) => {
  const { productId, userId, comment } = req.body;
  if (!productId && !userId && !comment) {
    return next(new AppError("plase add product, user and comment", 404));
  }
  const addComment = new Comment({
    product: productId,
    user: userId,
    comment: comment,
  });
  await addComment.save({ new: true });
  if (!addComment) {
    return next(new AppError("fail", 500));
  }
  res.status(201).json({ data: addComment });
});

/**
 * @desc     delete comment
 * @method     delete
 * @route        /deleteComment
 * @access      (login)
 */
const deleteComment = asyncWrapper(async (req, res, next) => {
  const { commentId } = req.body;
  if (!commentId) {
    return next(new AppError("plase add comment", 404));
  }
  const deleteComment = await Comment.findByIdAndDelete(commentId);
  if (!deleteComment) {
    return next(new AppError("fail", 500));
  }
  res.status(200).json({ message: "done" });
});
/**
 * @desc     show comments
 * @method     get
 * @route        /comments
 * @access      (public)
 */
const showComments = asyncWrapper(async (req, res, next) => {
  const { productId } = req.body;
  const documents = getAllDocs(Comment, { product: productId });

  if (!documents) {
    return next(new AppError("fail", 404));
  }
  res.status(200).json({ data: documents });
});
module.exports = {
  addProductToFavorite,
  removeProductFromFavorite,
  showFavoriteProducts,
  showCart,
  showCancelledOrders,
  showPendingOrders,
  showReceivedOrders,
  addComment,
  deleteComment,
  showComments,
};
