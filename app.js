const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("./db");
const path = require("path");
const AppError = require("./utils/AppError");
const errorHandler = require("./Controller/errorController");
const cookieParser = require("cookie-parser");

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.json());

const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");
const {
  signUp,
  signIn,
  forgetPassword,
  resetPassword,
  updateAccount,
  logout
} = require("./Controller/AuthController");
const allowTo = require("../Middleware/allowTo");

const { verifyToken } = require("../Middleware/verifyToken");

// Use routes
app.use("/seller", sellerRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subcategoryRoutes);
app.use("/cart", cartRoutes);
app.use("/user", userRoutes);
app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/forgetPassword", forgetPassword);
app.put("/reset-password/:id/:token", resetPassword);
app.post("/logout", logout);
app.put(
  "/:id/updateAccount",
  verifyToken,
  allowTo("Seller", "User"),
  updateAccount
);

// Handle non-existing routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can’t find ${req.originalUrl} on this server!`, 404));
});

// Handle errors from routes
app.use(errorHandler);

// Start server listening on specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
