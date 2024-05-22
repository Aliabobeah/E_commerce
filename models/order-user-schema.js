const mongoose = require("mongoose");
const User = require("./userSchema");
const OrderItemModel = require("./orderItemSchema");

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
          default: 1,
        },
      },
    ],
    shippingAddress: {
      type: String,
      required: false,
    },
    orderNumber: Number,

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

exports.OrderUser = mongoose.model("UserOrder", orderSchema);
