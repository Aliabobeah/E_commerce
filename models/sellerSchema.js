const mongoose = require("mongoose");
const { Schema } = mongoose;
const Product = require("./productSchema");
const User = require("./userSchema");
const { sellerOrder } = require("./order-seller-schema");

const sellerSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  phoneNumber: Number,
  image: String,

  role: {
    type: String,
    trim: true,
    default: "seller",
  },
  age: Number,

  gender: {
    type: String,
    trim: true,
    enum: ["male", "female"],
  },
});

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = { Seller };
