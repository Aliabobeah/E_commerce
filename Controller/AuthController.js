const { User } = require("../models/userSchema");
const { Seller } = require("../models/sellerSchema");

const asyncWrapper = require("../Middleware/asyncWrapper");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generaterefreshToken,
} = require("../utils/generateJWT");

const AppError = require("../utils/AppError");
const path = require("path");

const saltRounds = 10;

/*
desc      sign up 
route      /signup
method     post 
access     puplic
*/
const signUp = asyncWrapper(async (req, res, next) => {
  const { name, email, age, phoneNumber, password, gender, role, image } =
    req.body;

  if (
    !name ||
    !age ||
    !phoneNumber ||
    !email ||
    !password ||
    !gender ||
    !role
  ) {
    return next(new AppError("All fileds are require", 400));
  }
  const dbModel = role;
  const isEmailExist = await dbModel.findOne({ email });
  if (isEmailExist) {
    return next(new AppError("Email already exist", 400));
  }
  const hashPassword = await bcrypt.hash(password, saltRounds);
  const newAccount = await dbModel.create({
    name,
    email,
    age,
    phoneNumber,
    password: hashPassword,
    gender,
    role,
    image,
  });
  const accessToken = generateAccessToken(
    { id: newAccount._id, email: newAccount.email, role: newAccount.role},
    process.env.ACCESSTOKEN,
    { expiresIn: "2h" }
  );

  const refreshToken = generaterefreshToken(
    { id: newAccount._id, email: newAccount.email, role: newAccount.role },
    process.env.REFRESHTOKEN,
    { expiresIn: "1week" }
  );
  Promise.all([accessToken, refreshToken]);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  Promise.all([accessToken, refreshToken]);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(201).json({
    data: { newAccount, accessToken: accessToken, refreshToken: refreshToken },
  });
});

/*
desc      login 
route      signin
method     post
access     puplic
*/
const signIn = asyncWrapper(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new AppError("All fileds are require", 400));
  }
  const dbModel = role;
  const isExeits = await dbModel.findOne({ Email: email });

  if (!isExeits) {
    return next(new AppError("invalid Email or Password", 401));
  }

  const passwordMatch = await bcrypt.compare(password, isExeits.password);

  if (!passwordMatch) {
    return next(new AppError("invalid Email or Password"), 401);
  }

  const accessToken = generateAccessToken(
    { id: isExeits._id, email: isExeits.email },
    process.env.ACCESSTOKEN,
    { expiresIn: "2h" }
  );

  const refreshToken = generaterefreshToken(
    { id: isExeits._id, email: isExeits.email },
    process.env.REFRESHTOKEN,
    { expiresIn: "1week" }
  );
  Promise.all([accessToken, refreshToken]);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  Promise.all([accessToken, refreshToken]);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res
    .status(201)
    .json({ data: { accessToken: accessToken, refreshToken: refreshToken } });

  // const refreshToken = await generateJWT(
  //   { id: User._id },
  //   process.env.REFRESHTOKEN,
  //   { expiresIn: "7day" }
  // );
  // res.cookie("jwt", refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  // });

  res.status(200).json({ data: isExeits, accessToken });
});

/**
 * @desc     forgot password
 * @method     post
 * @route        forgotpassword
 * @access      (public)
 */

const forgetPassword = asyncWrapper(async (req, res, next) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return next(new AppError("All fileds are require", 400));
  }
  const dbModel = role;
  const isEmailExist = await dbModel.findOne({ email });

  if (!isEmailExist) {
    return next(new AppError("this email is not exists", 404));
  }
  const token = jwt.sign({ id: isEmailExist._id }, process.env.ACCESSTOKEN, {
    expiresIn: "10m",
  });

  const id = isEmailExist._id;
  const accountRole = isEmailExist.role;
  const link = `${process.env.BASE_URL}/reset-password/${id}/${accountRole}/${token}`;

  res.status(200).json(link);
});
/**
 * @desc      reset password
 * @method     post
 * @route       /reset-password/:id/:token
 * @access      (public)
 */
const resetPassword = asyncWrapper(async (req, res, next) => {
  const { newPassword } = req.body;
  const { id, accountRole, token } = req.params;
  const dbModel = accountRole;
  const verifyToken = jwt.compare(token, process.env.ACCESSTOKEN);
  if (!verifyToken) {
    return next(new AppError("expire out", 404));
  }
  const hashPassword = await bcrypt.hash(newPassword, saltRounds);
  const updatePassword = await dbModel.findByIdAndUpdate(id, {
    password: hashPassword,
  });
  if (!updatePassword) {
    return next(new AppError("this id is not exists", 404));
  }
  res.status(201).json({ massage: "password reset is done" });
});

const updateAccount = asyncWrapper(async (req, res, next) => {
  const { name, email, age, phoneNumber, password, gender, image, role } =
    req.body;
  const { id } = req.params;
  if (
    !name ||
    !email ||
    !age ||
    !phoneNumber ||
    !password ||
    !gender ||
    !image
  ) {
    return next(new AppError("All fileds are require", 400));
  }
  const updatedFields = { ...req.body };
  delete updatedFields.role;
  const dbModel = role;
  const updatedAccount = await dbModel.findByIdAndUpdate(id, updatedFields);
  if (!updatedAccount) {
    return next(new AppError("this id is not exists", 404));
  }
  res.status(201).json({ data: updateAccount });
});
const logout = asyncWrapper(async (req, res, next) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 0,
  });
  res.status(200).json({ message: "Logout successful" });
});
module.exports = {
  signUp,
  signIn,
  forgetPassword,
  resetPassword,
  updateAccount,
  logout
};
