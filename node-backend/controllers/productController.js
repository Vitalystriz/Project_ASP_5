const productService = require('../services/productService')
const { sendToCppServer } = require('../services/client');

const getAllProducts = async (req, res) => {
    try {
        const restaurantId = req.params.id; 
        const data = await productService.getAllProducts(restaurantId);
        
        if (!data) return res.status(404).json({ error: "Restaurant was not found" });
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const  restaurantID = req.params.id; 
        const { name, type, description, price } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });
        
        const newProduct = await productService.createProduct(restaurantID ,name, type, description, price);
        if (!newProduct) return res.status(404).json({ error: "Restaurant was not found" });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

const getProductByID = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const productId = req.params.pId;
        const userId = req.headers['user-id'];

        const product = await productService.getProductByID(restaurantId, productId);
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
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
}
const updateProductByID = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const productId = req.params.pId;
        const { name, type, description, price } = req.body;    

        const updatedProduct = await productService.updateProductByID(restaurantId, productId, name, type, description, price);
        
        if (!updatedProduct) return res.status(404).json({ error: "Product was not found" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
}

const deleteProductByID = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const productId = req.params.pId;
        const userId = req.headers['user-id'];

        const deletedProduct = await productService.deleteProductByID(restaurantId, productId);

        try {
            if (userId) {
                await sendToCppServer(`DELETE ${userId} ${productId}`);
            }
        } catch (err) {
            console.error("C++ Server error:", err);
        }

        if (!deletedProduct) return res.status(404).json({ error: "Product was not found" });
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};


module.exports = { 
    getAllProducts,
    createProduct,
    getProductByID,
    updateProductByID,
    deleteProductByID 
}
