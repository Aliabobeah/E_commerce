
const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");
const { User } = require("../models/userSchema");
const { Seller } = require("../models/sellerSchema");
const { Cart } = require("../models/cartSchema");
const { OrderUser} = require("../models/order-user-schema");
const { Comment } = require("../models/commentSchema");

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
    const addComment = new Comment({ product: productId, user: userId, comment: comment });
    await addComment.save({new: true});
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
    addComment,
    deleteComment,
    showComments,
  }


