const express = require('express')
const router = express.Router()

const { addProduct, getProduct,  deleteProduct, updateProduct } = require('../Productcontrollers/ProductController')

router.post('/', addProduct);

router.get('/', getProduct);



router.delete('/:id',  deleteProduct);

router.patch('/:id',  updateProduct);


module.exports = router;

