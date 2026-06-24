const express = require('express')
const router = express.Router();


const orderController = require('../controllers/orderController')
const authentication = require('../services/authMiddleware')
const verifyAuth = authentication.verifyAuth


router.get('/', orderController.getAllOrders); //verifyauth
router.post('/', verifyAuth, orderController.createOrder);

router.get('/:id', verifyAuth, orderController.getOrderById);
router.patch('/:id', verifyAuth, orderController.updateOrderById);
router.delete('/:id', verifyAuth, orderController.deleteOrderById);

module.exports = router