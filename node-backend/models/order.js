const crypto = require('crypto');
const mongoose = require('mongoose')


const schema = mongoose.Schema

const orderSchema = new schema({
    userId: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    restaurantId: {type: mongoose.Schema.ObjectId, ref: 'Restaurant', required: true},
    status: {type: String, default: "created"},
    products: [{
        productId: {type: mongoose.Schema.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, default: 1}
    }]
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

module.exports = mongoose.model('Order', orderSchema);