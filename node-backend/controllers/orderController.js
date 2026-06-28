const orderService = require('../services/orderService')
const productService = require('../services/productService')

const getAllOrders = async (req, res) => {
    const data = await orderService.getAllOrders()
    res.status(200).json(data)
}

const createOrder = async (req, res) => {
    try {
        const { restaurantId, products} = req.body;

        if (!restaurantId) return res.status(400).json({ error: "restaurantId is required" });
        if (!Array.isArray(products) || products.length === 0) return res.status(400).json({ error: "Your order is empty, products are required" });

        const userId = req.user?.id
        if (!userId) return res.status(400).json({ error: "Unknown user" });

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            if (!product || typeof product !== 'object') {
                return res.status(400).json({ error: `Product at index ${i} must be an object` });
            }

            const productId = product.productId ?? product.id;
            if (!productId) {
                return res.status(400).json({ error: `Product at index ${i} must include productId` });
            }

           
            const existing = await productService.getProductByID(restaurantId, productId);
            if (!existing) {
                return res.status(404).json({ error: `Product at index ${i} not found in this restaurant` });
            }

            const quantity = product.quantity ?? 1;
            if (!Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({ error: `Product at index ${i} must include quantity >= 1` });
            }



            product.productId = productId;
            product.quantity = quantity;
        }

        const newOrder = await orderService.createOrder(userId, restaurantId, products);

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};

const getOrderById = async (req, res) => {
    const id = req.params.id
    const order = await orderService.getOrderById(id)
    if (!order) return res.status(404).json({error: "order wasn't found"})
    res.status(200).json(order)
}

const updateOrderById = async (req, res) => {
    const id = req.params.id
    const { restaurantId, products, status } = req.body
    const updatedOrder = await orderService.updateOrderById(id, { restaurantId, products, status })
    if (!updatedOrder) return res.status(404).json({ error: "order wasn't found" })
    res.status(200).json(updatedOrder)
}

const deleteOrderById = async (req, res) => {
    const id = req.params.id
    const deletedOrder = await orderService.deleteOrderById(id)
    if (!deletedOrder) return res.status(404).json({error: "Order not found"})
    res.status(204).send()
}

module.exports = {
    deleteOrderById,
    getOrderById,
    updateOrderById,
    getAllOrders,
    createOrder
}