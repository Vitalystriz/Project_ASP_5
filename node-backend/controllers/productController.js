const productModel = require('../models/product')
const { sendToCppServer } = require('../services/client');

const getAllProducts = (req, res) => {
    const restaurantId = req.params.id; 
    const data = productModel.getAllProducts(restaurantId);
    
    if (!data) return res.status(404).json({ error: "Restaurant was not found" });
    
    res.status(200).json(data);
};

const createProduct = (req, res) => {
    const  restaurantID = req.params.id; 
    const { name, type, description, price } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    
    const newProduct = productModel.createProduct(restaurantID ,name, type, description, price);
    if (!newProduct) return res.status(404).json({ error: "Restaurant was not found" });
    res.status(201).json(newProduct);
};

const getProductByID = async (req, res) => {
    const restaurantId = req.params.id;
    const productId = req.params.pId;
    const userId = req.headers['user-id'];

    const product = productModel.getProductByID(restaurantId, productId);
    if (!product) return res.status(404).json({ error: "Product was not found" });
    if (!userId) return res.status(404).json({ error: "Mark user in header" });

    try {

        const response = await sendToCppServer(`POST ${userId} ${productId}`);

        if (response && response.includes("404 Not Found")) {
            await sendToCppServer(`PATCH ${userId} ${productId}`);
        }
    } catch (err) {
        console.error("C++ Server error:", err);
    }

    res.status(200).json(product);
}
const updateProductByID = (req, res) => {
    const restaurantId = req.params.id;
    const productId = req.params.pId;
    const { name, type, description, price } = req.body;    

    const updatedProduct = productModel.updateProductByID(restaurantId, productId, name, type, description, price);
    
    if (!updatedProduct) return res.status(404).json({ error: "Product was not found" });
    res.status(200).json(updatedProduct);
}

const deleteProductByID = async (req, res) => {
    const restaurantId = req.params.id;
    const productId = req.params.pId;
    const userId = req.headers['user-id'];

    const deletedProduct = productModel.deleteProductByID(restaurantId, productId);

    try {
        if (userId) {
            await sendToCppServer(`DELETE ${userId} ${productId}`);
        }
    } catch (err) {
        console.error("C++ Server error:", err);
    }

    if (!deletedProduct) return res.status(404).json({ error: "Product was not found" });
    res.status(204).send(); 
};


module.exports = { 
    getAllProducts,
    createProduct,
    getProductByID,
    updateProductByID,
    deleteProductByID 
}
