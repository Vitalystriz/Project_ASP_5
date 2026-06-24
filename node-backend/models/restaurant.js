const crypto = require('crypto');

const restaurants = [];

const getAllRestaurants = () => {
    return restaurants;
};

const createRestaurant = (name, type, description, x, y) => {
    const newRestaurant = {
        id: crypto.randomUUID(), 
        name: name,
        type: type,
        description: description,
        x: parseFloat(x) || 0,
        y: parseFloat(y) || 0,
        products: []
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
};

const getRestaurantByID = (id) => {
    return restaurants.find((restaurant) => restaurant.id === id);
};

const deleteRestaurantByID = (id) => {
    const restaurant = getRestaurantByID(id);
    if (restaurant){
        const index = restaurants.indexOf(restaurant);
        restaurants.splice(index, 1);
        return restaurant;
    }
    return null;
}; 

const updateRestaurantByID = (id, name, type, description, x, y) => {
    const restaurant = getRestaurantByID(id);
    if (restaurant){
        if (name) restaurant.name = name;
        if (type) restaurant.type = type;
        if (description) restaurant.description = description;
        if (x !== undefined) restaurant.x = parseFloat(x) || 0;
        if (y !== undefined) restaurant.y = parseFloat(y) || 0;
        
        return restaurant;
    }
    return null;
};

const findTarget = (target) => {
    return restaurants.filter((restaurant) => 
        restaurant.name.toLowerCase().includes(target) || 
        restaurant.description.toLowerCase().includes(target) || 
        restaurant.type.toLowerCase().includes(target)
    );
};

module.exports = {
    getAllRestaurants,
    createRestaurant,
    getRestaurantByID,
    deleteRestaurantByID,
    updateRestaurantByID,
    findTarget
};