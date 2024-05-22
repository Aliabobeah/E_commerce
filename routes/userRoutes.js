const express = require("express");
const router = express.Router();

const { verifyToken } = require("../Middleware/verifyToken");

const allowTo = require("../Middleware/allowTo");

const { verifyToken } = require("../Middleware/verifyToken");

const {
  showCancelledOrders,
  showPendingOrders,
} = require("../Controller/userController");
const { verifyToken } = require("../Middleware/verifyToken");

router.get("/pendingOrders", verifyToken, allowTo("User"), showPendingOrders);
router.get("/doneOrders", verifyToken, allowTo("User"), showDoneOrders);
router.get("/cancelOrders", verifyToken, allowTo("User"), showCancelledOrders);

module.exports = router;
