const express = require("express");
const router = express.Router();
const { uploadFields } = require("../Controller/uploadController");
const allowTo = require("../Middleware/allowTo");

const {
  showCancelledOrders,
  showPendingOrders,
  showDoneOrders,
  getAllUnSoldproducts,
  getAllproducts,
  addDiscountOnProduct,
  getMostSoldProducts,
  getLessSoldProducts,
} = require("../Controller/sellerController");
const { verifyToken } = require("../Middleware/verifyToken");
const { getOrderByOrderNumber } = require("../Controller/order-system");
const {
  addNewProduct,
  deleteProduct,
  updateProduct,
} = require("../Controller/productController");

router.get(
  "/cancelledOrders",
  verifyToken,
  allowTo("Seller"),
  showCancelledOrders
);
router.get("/pendingOrders", verifyToken, allowTo("Seller"), showPendingOrders);
router.get("/doneOrders", verifyToken, allowTo("Seller"), showDoneOrders);
router.get("/allUnSoldproducts", verifyToken, allowTo("Seller"), getAllUnSoldproducts);
router.get("/productsSeller", verifyToken, allowTo("Seller"), getAllproducts);
router.post("/productsSeller/:id", verifyToken, allowTo("Seller"), addDiscountOnProduct);
router.get("/mostSoldProducts", verifyToken, allowTo("Seller"), getMostSoldProducts);
router.get("/lessSoldProducts", verifyToken, allowTo("Seller"), getLessSoldProducts);
router.get("/orderNumber", verifyToken, allowTo("Seller"), getOrderByOrderNumber);
router.post(
  "/productsSeller/add-product",
  verifyToken,
  allowTo("Seller"),
  uploadFields,
  addNewProduct
);
router.delete(
  "productsSeller/:id",
  verifyToken,
  allowTo("Seller"),
  deleteProduct
);
router.put(
  "productsSeller/:id",
  verifyToken,
  allowTo("Seller"),
  uploadFields,
  updateProduct
);

module.exports = router;
