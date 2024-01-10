const express = require('express')
const router = express.Router()

const { addProducts, getProducts,  deleteProducts, updateProducts } = require('../ProductsControllers/ProductsController')

router.post('/', addProducts);

router.get('/', getProducts);



router.delete('/:id',  deleteProducts);

router.patch('/:id',  updateProducts);


module.exports = router;

