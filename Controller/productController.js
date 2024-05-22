const multer = require("multer");

const { Product } = require("../models/productSchema");
const { Seller } = require("../models/sellerSchema");
const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");
const { uploadFileToDrive } = require("../Controller/uploadController");
const {
  getOneDocbyId,
  getAllDocs,
  deleteOneDoc,
  updateOneDocById,
} = require("./factoryController");
/**
 * @desc      seller add a new product
 * @method     POST
 * @route      /api/v1/product/add-product
 * @access      (seller => login)
 */

const addNewProduct = asyncWrapper(async (req, res, next) => {
  const {
    categoryId,
    describe,
    name,
    price,
    quantity,
    sellerId,
    subCategoryId,
  } = req.body;

  const productCover = req.productCover;
  const productImagesUrls = req.productImagesUrls;
  let imageUrls = [];
  let productCoverUrl;

  if (!productCover) {
    return next(new AppError("productCover is required", 400));
  }

  productCoverUrl = await uploadFileToDrive(
    productCover,
    "1CWZhx9EtgSg5kQItJeDwgKk88YH-KKvM"
  );

  if (productImagesUrls.length > 0) {
    imageUrls = await Promise.all(
      productImagesUrls.map((image) =>
        uploadFileToDrive(image, "1Bjx584b_fgAoCCjDJjh4GnFKjREzWoKk")
      )
    );
  }

  const newProduct = new Product({
    category: categoryId,
    describe,
    name,
    subCategory: subCategoryId,
    price,
    quantity,
    productCover: productCoverUrl,
    images: imageUrls,
    seller: sellerId,
  });

  await newProduct.save();

  res
    .status(201)
    .json({ message: "new product added successfully", data: newProduct });
});

/**
 *
 * @desc      seller delete a Product
 * @method     delete
 * @route      /api/v1/product/delete-product
 * @access      (seller => login)
 */
const deleteProduct = deleteOneDocById(Product);

/**
 * @desc      seller update a Product
 * @method     Put
 * @route      /api/v1/products/:id
 * @access      (seller => login)
 */
const updateProduct = asyncWrapper(async (req, res, next) => {
  const { describe, name, price, quantity } = req.body;
  const updatedFields = { ...req.body };

  const productCover = req.productCover;
  const productImagesUrls = req.productImagesUrls;
  let imageUrls = [];
  let productCoverUrl;

  if (productCover) {
    productCoverUrl = await uploadFileToDrive(
      productCover,
      "1CWZhx9EtgSg5kQItJeDwgKk88YH-KKvM"
    );
    updatedFields.productCover = productCoverUrl;
  }

  if (productImagesUrls.length > 0) {
    imageUrls = await Promise.all(
      productImagesUrls.map((image) =>
        uploadFileToDrive(image, "1Bjx584b_fgAoCCjDJjh4GnFKjREzWoKk")
      )
    );
    updatedFields.images = imageUrls;
  }
  updatedDocument = updateOneDocById(Product, updatedFields, { new: true });

  res.status(201).json({ data: updatedDocument });
});

/**
 * @desc      get all products
 * @method     get
 * @route      /api/v1/products
 * @access      (public)
 */

//  const getAllProducts = getAll(Product)
const getAllProducts = asyncWrapper(async (req, res, next) => {
  let queryObject = {};

  const filterQuery = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "keyword"];

  // Remove excludeFields from filterQuery
  excludeFields.forEach((field) => delete filterQuery[field]);

  // Apply filtration using [gte, gt, lte, lt]
  let queryStr = JSON.stringify(filterQuery);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  queryObject = JSON.parse(queryStr);

  // Search
  if (req.query.keyword) {
    const keyword = req.query.keyword;
    queryObject.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { describe: { $regex: keyword, $options: "i" } },
    ];
  }

  // Initialize the query with the queryObject
  let productQuery = Product.find(queryObject);

  // Apply sorting if provided
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    productQuery = productQuery.sort(sortBy);
  }
  if (req.query.limit) {
    const limit = req.query.limit;
    const page = req.query.page;

    const skip = (page - 1) * limit;
    productQuery = productQuery.skip(skip).limit(limit);
  }

  // Fetch products
  const products = await productQuery;

  console.log(req.query);
  res.status(200).json({ data: products });
});

/**
 * @desc      get Product By Id
 * @method     get
 * @route      /api/v1/products/:productId
 * @access      (public)
 */
const getProductById = getOneDocbyId(Product);

/**
 * @desc      get Product By Id
 * @method     get
 * @route      /api/v1/products/:productId
 * @access      (public)
 */

module.exports = {
  addNewProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getProductById,
};
