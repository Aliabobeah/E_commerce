const jwt = require("jsonwebtoken");

const generateAccessToken = (payload, secretKey, options) => {
  if (typeof payload !== 'object') {
    payload = { id: payload };
  }
  return jwt.sign(payload, secretKey, options);
};

const generateRefreshToken = (payload, secretKey, options) => {
  if (typeof payload !== 'object') {
    payload = { id: payload };
  }
  return jwt.sign(payload, secretKey, options);
};

module.exports = { generateAccessToken, generateRefreshToken };
