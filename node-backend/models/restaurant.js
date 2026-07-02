const crypto = require('crypto');
const mongoose = require('mongoose')

const schema = mongoose.Schema

const restaurantSchema = new schema ({
    name: {type:String, required: true},
    type: {type:String},
    description: {type:String},
    x: {type: Number, default: 0},
    y: {type: Number, default: 0},
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })



module.exports = mongoose.model('Restaurant', restaurantSchema)