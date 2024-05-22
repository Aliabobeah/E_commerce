const jwt = require("jsonwebtoken");
const asyncWrapper = require("./asyncWrapper");
const AppError = require("../utils/AppError");
const { generateAccessToken } = require("../utils/generateJWT");
require('dotenv').config();


const verifyToken = asyncWrapper(async (req, res, next) => {
  const tokenIsExisting =
    req.headers['authorization'] || req.headers['Authorization'];
  console.log(tokenIsExisting);

  if (!tokenIsExisting) {
    return next(new AppError('Token is required', 401));
  }

  const token = tokenIsExisting.split(' ')[1];
  jwt.verify(token, process.env.ACCESSTOKEN, (err, decoded) => {
    if (err) {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);
      if (!refreshToken) {
        return next(new AppError('Forbidden', 403));
      }

      jwt.verify(refreshToken, process.env.REFRESHTOKEN, (err, decoded) => {
        if (err) {
          return next(new AppError('Forbidden', 403));
        }
        const id = decoded.id;
        const newAccessToken = generateAccessToken(id, process.env.ACCESSTOKEN, { expiresIn: "5minutes" });
        
        req.accessToken = newAccessToken;
        req.role = decoded.role;
        return next();
      });
    } else {
      req.accessToken = token;
      req.role = decoded.role;
      return next();
    }
  });
});


module.exports = {
  verifyToken,
};

// const jwt = require("jsonwebtoken");
// const UserRegister = require("../models/registerSchma");
// const asyncWrapper = require("./asyncWrapper");
// const AppError = require("../Utilities/AppError");

// const verifyJWT = asyncWrapper(async (req, res, next) => {
//   const authHeader =
//     req.headers["authorization"] || req.headers["Authorization"];
//   if (!authHeader) {
//     return next(new AppError("Token is required"), 401);
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = await jwt.verify(token, process.env.ACCESSTOKEN);
//     req.user = decoded._id;
//     next();
//   } catch (err) {
//     return next(new AppError("Forbidden"), 403);
//   }
// });

// module.exports = {
//   verifyJWT,
// };
