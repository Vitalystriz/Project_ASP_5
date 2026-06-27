const restaurantModel = require('../services/restaurantService');
const Product = require('../models/product')


const getAllProducts = async (restaurantID) => {
    try {
        return await Product.find({ restaurantId: restaurantID });
    } catch (error) {
        return null;
    }
};

const createProduct = async (restaurantId, name, type, description, price) => {
    const restaurant = await restaurantModel.getRestaurantByID(restaurantId);
    if (restaurant) {
        const product = new Product ({
            name: name,
            type: type,
            description: description,
            price: parseFloat(price),
            restaurantId: restaurant._id,
        })
        try {
            return await product.save()
        } catch (error) {
            console.error("Mongoose save error in createProduct:", error);
            throw error;
        }
    }
    return null
}


const getProductByID = async (restaurantID, productID) => {
    try {
        return await Product.findOne({ _id: productID, restaurantId: restaurantID });
    } catch (error) {
        return null;
    }
};


const deleteProductByID = async (restaurantID, productID) => {
    try {
        return await Product.findOneAndDelete({ _id: productID, restaurantId: restaurantID });
    } catch (error) {
        return null;
    }
};

const updateProductByID = async (restaurantId, productId, name, type, description, price) => {
    try {
        const product = await getProductByID(restaurantId, productId);
        if (product) {
            if (name) product.name = name;
            if (type) product.type = type;
            if (description) product.description = description;
            if (price !== undefined) product.price = price;

            return await product.save();
        }
        return null;
    } catch (error) {
        return null;
    }
};


const findTarget = async (target) => {
    try {
        return await Product.find({
            $or: [
                { name: { $regex: target, $options: 'i' } },
                { description: { $regex: target, $options: 'i' } },
                { type: { $regex: target, $options: 'i' } }
            ]
        });
    } catch (error) {
        return [];
    }
};


module.exports = {
    getAllProducts,
    createProduct,
    getProductByID,
    deleteProductByID,
    updateProductByID,
    findTarget
}