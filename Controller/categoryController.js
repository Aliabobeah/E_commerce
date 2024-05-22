const { Category } = require("../models/categorySchema");
const asyncWrapper = require("../Middleware/asyncWrapper");
const AppError = require("../utils/AppError");
const {getOneDoc,
    getAllDocs,
    deleteOneDoc} = require('./factoryController')
/**
 * @desc      create new category
 * @method     post
 * @route     /api/v1/categories/create-category
 * @access      (private)
 */
const createNewCategory =  asyncWrapper(async (req, res, next) => { 
    const {name} = req.body;
    if (!name) {
        return next(new AppError("You must add name filed", 400));
    }
    const newCategory = new Category({name})
    await newCategory.save
  res.status(201).json({data:newCategory})   
 });
/**
 * @desc       update category
 * @method     put
 * @route     /api/v1/categories/:id
 * @access      (private)
 */
 const updateCategory =  asyncWrapper(async (req, res, next) => { 
    const { name } = req.body;
    const { id } = req.params 

    if (!name) {
        return next(new AppError("You must add name filed", 400));
    }
const isNameExist = await Category.findOne({name})
if (isNameExist) {
    return next(new AppError("this name is exist", 400));
}
    const categoryUpdated =  await Category.findByIdAndUpdate(id, {name}, {new:true})
    if (!categoryUpdated) {
        return next(new AppError("Server Error", 500));
      }
  res.status(201).json({data:categoryUpdated})   
 });

 const deleteCategory = deleteOneDoc(Category)

 /**
 * @desc      get all categorys
 * @method     get
 * @route      /api/v1/category
 * @access      (public)
 */
 const getAllCategorys = getAllDocs(Category)

/**
 * @desc      get Category By Id
 * @method     get
 * @route     /api/v1/category/:id
 * @access      (public)
 */
 const getCategoryById = getOneDoc(Category)

 module.exports = {
    getCategoryById,
    getAllCategorys,
    createNewCategory,
    updateCategory,
    deleteCategory

 }