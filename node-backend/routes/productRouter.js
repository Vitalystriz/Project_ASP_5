const express = require('express')
const router = express.Router({ mergeParams: true });

const authentication = require('../services/authMiddleware')
const verifyAuth = authentication.verifyAuth

const productController = require('../controllers/productController')
router.get('/', productController.getAllProducts);
router.post('/', verifyAuth, productController.createProduct);

router.get('/:pId', productController.getProductByID);
router.patch('/:pId', verifyAuth, productController.updateProductByID);
router.delete('/:pId', verifyAuth,  productController.deleteProductByID);

const recommendationRouter = require('./recommendationRouter')
router.use('/:pId/recommendations', recommendationRouter);



module.exports = router