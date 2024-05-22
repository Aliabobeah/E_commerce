const { SubCategory } = require("../models/subCategorySchema");
const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");
const { getOneDocbyId,
  getAllDocs,
  deleteOneDoc } = require("./factoryController");
/**
 * @desc      create new sub category
 * @method     post
 * @route     /api/v1/subcategories/create-subcategory
 * @access      (private)
 */

const createNewSubcategory = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return next(new AppError("You must add name filed", 400));
  }
  const newSubcategory = new SubCategory({
    name,
    category: id,
  });
  await newSubcategory.save;
  res.status(201).json({ data: newSubcategory });
});

/**
 * @desc      update subcategory
 * @method     put
 * @route      /api/v1/subcategories/:id
 * @access      (private)
 */
const updateSubcategory = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) {
    return next(new AppError("You must add name filed", 400));
  }
  const isNameExist = await SubCategory.findOne({ name });
  if (isNameExist) {
    return next(new AppError("this name is exist", 400));
  }
  const subcategoryUpdated = await SubCategory.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!subcategoryUpdated) {
    return next(new AppError("Server Error", 500));
  }
  res.status(201).json({ data: subcategoryUpdated });
});

/**
 * @desc      delete subcategory
 * @method     delete
 * @route      /api/v1/subcategories/:id
 * @access      (private)
 */
const deleteSubcategory = deleteOneDoc(SubCategory);

/**
 * @desc      get all subcategories
 * @method     get
 * @route        /api/v1/subcategories
 * @access      (public)
 */
const getAllSubcategories = getAllDocs(SubCategory);

/**
 * @desc      get subcategory By Id
 * @method     get
 * @route        /api/v1/subcategories/:id
 * @access      (public)
 */
const getSubcategoryById = getOneDoc(SubCategory);
module.exports = {
  getSubcategoryById,
  getAllSubcategories,
  deleteSubcategory,
  updateSubcategory,
  createNewSubcategory
}