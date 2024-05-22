const express = require("express");
const router = express.Router();
const {   getSubcategoryById,
    getAllSubcategories,
    deleteSubcategory,
    updateSubcategory,
    createNewSubcategory}
= require("../Controller/subCategoryController");

router.get('/', getAllSubcategories)
router.get('/:id', getSubcategoryById)
router.post('/create-subcategory', createNewSubcategory)
router.put('/:id', updateSubcategory)
router.delete('/:id', deleteSubcategory)
module.exports = router