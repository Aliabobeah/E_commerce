const mongoose = require("mongoose");
const { Product } = require("./productSchema");
const { User } = require("./userSchema");

const Cart = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", Cart);
