const crypto = require('crypto');
const mongoose = require('mongoose')



const schema = mongoose.Schema

const userSchema = new schema({
    displayName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profilePic: {type: String, default: ''},
    authorized: {type: Boolean, default: false},
    x: { type: Number, required: true },
    y: { type: Number, required: true }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

module.exports = mongoose.model('User', userSchema)