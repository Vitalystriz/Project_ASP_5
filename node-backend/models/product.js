const crypto = require('crypto');
const mongoose = require('mongoose')


const schema = mongoose.Schema

const productSchema = new schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    restaurantId: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

module.exports = mongoose.model('Product', productSchema)