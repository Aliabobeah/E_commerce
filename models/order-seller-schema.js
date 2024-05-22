const mongoose = require("mongoose");
const User = require("./userSchema");
const OrderItemModel = require("./orderItemSchema");
const Seller = require("./sellerSchema");
const { Product } = require("./productSchema");

const orderSchema = mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
    },
    orderNumber: Number,
    shippingAddress: {
      type: String,
      required: false,
    },

    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "Pending",
    },
    totalPrice: {
      type: Number,
    },
    note: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

exports.SellerOrder = mongoose.model("SellerOrder", orderSchema);
