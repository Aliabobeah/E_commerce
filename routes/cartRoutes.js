const express = require('express')
const router = express.Router();
const { addProductToCart, removeProductFromCart, changeProductQuantity } = require('../Controller/cartController')
const { verifyToken } = require('../Middleware/verifyToken')
const allowTo = require('../Middleware/allowTo')
 
  
  router.post('/addToCart', verifyToken, addProductToCart)
 router.delete('/removeFromCart', verifyToken, removeProductFromCart)
 router.post('/changeQuantity', verifyToken, changeProductQuantity)

  
    
module.exports = router;

