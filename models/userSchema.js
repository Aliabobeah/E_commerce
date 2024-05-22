const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Product } = require("./productSchema");
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    image: String,
    age: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      trim: true,
      default: "User",
    },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female"],
      required: true,
    },

    favorite: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
