const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Middleware/verifyJWT");
const {
  getAllProducts,
  getProductById,
} = require("../Controller/productController");
const allowTo = require("../Middleware/allowTo");
const {
  addComment,
  deleteComment,
  showComments,
} = require("../Controller/commentsController");

const { uploadFields } = require("../Controller/uploadController");
const allowTo = require("../Middleware/allowTo");

router.post("/:id/addcomment", verifyToken, allowTo("User"), addComment);
router.post("/:id/deletecomment", verifyToken, allowTo("User"), deleteComment);
router.get("/:id/showcomments", showComments);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;
