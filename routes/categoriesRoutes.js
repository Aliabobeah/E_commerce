const express = require("express");
const router = express.Router();
const { getCategoryById,
    getAllCategorys,
    createNewCategory,
    updateCategory,
    deleteCategory}
= require("../Controller/categoryController");

router.get('/', getAllCategorys)
router.get('/:id', getCategoryById)
router.post('/create-category', createNewCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)
module.exports = router