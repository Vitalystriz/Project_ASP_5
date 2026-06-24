const crypto = require('crypto');

const restaurantModel = require('./restaurant');

const getAllProducts = (restaurantID) => {
    const restaurant = restaurantModel.getRestaurantByID(restaurantID);
    if (restaurant) {
        return restaurant.products; 
    }
    return null;
};

const createProduct = (restaurantId, name, type, description, price) => {
    const restaurant = restaurantModel.getRestaurantByID(restaurantId);
    
    if (restaurant) {
        const newProduct = {
        id: crypto.randomUUID(), 
        name: name,
        type: type,
        description: description,
        price: price,
        restaurantId: restaurantId
    };
    restaurant.products.push(newProduct);
    return newProduct;
}
return null
}


const getProductByID = (restaurantID, productID) => {
  const restaurant = restaurantModel.getRestaurantByID(restaurantID);
    if (restaurant) {
        return restaurant.products.find((product) => product.id === productID);
    }
    return null;
};


const deleteProductByID = (restaurantID, productID) => {
    const restaurant = restaurantModel.getRestaurantByID(restaurantID);
    
    if (restaurant) {
        const index = restaurant.products.findIndex((product) => product.id === productID);
        
        if (index !== -1) {
            const deletedProduct = restaurant.products.splice(index, 1);
            return deletedProduct[0];
        }
    }
    return null;
};
  const updateProductByID = (restaurantId, productId, name, type, description, price) => {
    const product = getProductByID(restaurantId, productId);
    
    if (product) {
        if (name) product.name = name;
        if (type) product.type = type;
        if (description) product.description = description;
        if (price) product.price = price;
        if (restaurantId) product.restaurantId = restaurantId;
        
        return product;
    }
    return null;
};


// const findTarget = (target) => {
//     return products.filter((product) => product.name.includes(target) || product.description.includes(target)
//         || product.type.includes(target))
// }

const findTarget = (target) => {
    const restaurants = restaurantModel.getAllRestaurants();
    let allProducts = [];


    restaurants.forEach(restaurant => {
        if (restaurant.products) {
            allProducts = allProducts.concat(restaurant.products);
        }
    });


    return allProducts.filter((product) =>
        (product.id && product.id.toLowerCase() === target) ||
        (product.name && product.name.toLowerCase().includes(target)) ||
        (product.description && product.description.toLowerCase().includes(target)) ||
        (product.type && product.type.toLowerCase().includes(target))
    );
};


module.exports = {
    getAllProducts,
    createProduct,
    getProductByID,
    deleteProductByID,
    updateProductByID,
    findTarget
 }