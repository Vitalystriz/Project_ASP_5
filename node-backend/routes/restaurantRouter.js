const express = require('express')
var router = express.Router()

const authentication = require('../services/authMiddleware')
const verifyAuth = authentication.verifyAuth

const restaurantController = require('../controllers/restaurantController')
router.get('/', restaurantController.getAllRestaurants);
router.post('/',verifyAuth, restaurantController.createRestaurant);

router.get('/:id', restaurantController.getRestaurantByID);
router.patch('/:id', verifyAuth, restaurantController.updateRestaurantByID);
router.delete('/:id',verifyAuth, restaurantController.deleteRestaurantByID);

const productRouter = require('./productRouter');
router.use('/:id/products', productRouter);

module.exports = router