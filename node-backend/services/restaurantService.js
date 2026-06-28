const Restaurant = require('../models/restaurant')


const getAllRestaurants = async  () => {
    return Restaurant.find();
};

const createRestaurant = async (name, type, description, x, y) => {
    const restaurant = new Restaurant({
        name: name,
        type: type,
        description: description,
        x: x,
        y: y
    })
    return await restaurant.save();
};

const getRestaurantByID = async (id) => {
    return Restaurant.findById(id);
};

const deleteRestaurantByID = async (id) => {
    return await Restaurant.findByIdAndDelete(id);
};

const updateRestaurantByID = async (id, name, type, description, x, y) => {
    const restaurant = await getRestaurantByID(id);
    if (restaurant){
        if (name) restaurant.name = name;
        if (type) restaurant.type = type;
        if (description) restaurant.description = description;
        if (x !== undefined) restaurant.x = parseFloat(x) || 0;
        if (y !== undefined) restaurant.y = parseFloat(y) || 0;

        return await restaurant.save();
    }
    return null;
};

const findTarget = async (target) => {
    const restaurants = await getAllRestaurants();
    const mongoose = require('mongoose');
    const isId = mongoose.Types.ObjectId.isValid(target);
    return restaurants.filter((restaurant) =>
        (isId && restaurant._id.toString() === target) ||
        (restaurant.name && restaurant.name.toLowerCase().includes(target)) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(target)) ||
        (restaurant.type && restaurant.type.toLowerCase().includes(target))
    );
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getRestaurantByID,
    findTarget,
    deleteRestaurantByID,
    updateRestaurantByID
}