const Order = require('../models/order')

const getAllOrders = async () => {
    return await Order.find();
};

const createOrder = async (userId, restaurantId, products) => {

    const newOrder = new Order({
        userId: userId,
        restaurantId: restaurantId,
        products: products
    })
    return await newOrder.save() //Wolfenstein - the new order. My favourite game btv
}

const getOrderById = async (id) => {
    return await Order.findById(id);
}

const updateOrderById = async (id, updates) => {
    const order = await getOrderById(id)
    if (!order) return null
    if (updates.restaurantId) order.restaurantId = updates.restaurantId
    if (updates.products) order.products = updates.products
    if (updates.status) order.status = updates.status
    return await order.save()
}

const deleteOrderById = async (id) => {
    return await Order.findByIdAndDelete(id);
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderById,
    deleteOrderById
}