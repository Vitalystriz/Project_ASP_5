const crypto = require('crypto');

const orders = [];


const getAllOrders = () => {
    return orders;
};

const createOrder = (userId, restarauntId, products) => {
    const newOrder = {
            id: crypto.randomUUID(),
            userId: userId,
            restaurantId: restarauntId,
            status: "created",
            createdAt: new Date().toISOString(),
            products: products
        };
        orders.push(newOrder);
        return newOrder; //Wolfenstein - the new order. My favourite game btv 
}

const getOrderById = (id) => {
    return orders.find((order) => order.id === id)
}

const updateOrderById = (id, updates) => {
    const order = getOrderById(id)
    if (!order) return null
    if (updates.restaurantId) order.restaurantId = updates.restaurantId
    if (updates.products) order.products = updates.products
    if (updates.status) order.status = updates.status
    return order
}

const deleteOrderById = (id) => {
    const order = getOrderById(id)
    if (order) {
        const index = orders.indexOf(order)
        orders.splice(index, 1)
        return order
    }
    return null
}

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderById,
    deleteOrderById
}