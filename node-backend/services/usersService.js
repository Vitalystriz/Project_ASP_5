const User = require('../models/users')
const crypto = require("crypto");


const createUser = async (displayName, username, password, profilePic, x, y) => {
    const user = new User({
        displayName: displayName,
        username: username,
        password: password,
        profilePic: profilePic,
        x: x,
        y: y
    })
    return await user.save();
};
const getUserByID = async (id) => {
    try {
        return await User.findById(id)
    }
    catch (error) {
        return null
    }
};

const getUserByUsername = async (username) => {
    try {
        return await User.findOne({'username': username})
    }
    catch (error) {
        return null
    }
};

const authentication = async (username, password) => {
    try {
        const user = await User.findOne({'username': username, 'password': password})
        if (user) {
            user.authorized = true
            await user.save()
            return user
        }
        return null
    }
    catch (error) {
        return null
    }
};

const isAuthorized = async (id) => {
    const user = await getUserByID(id)
    return user ? user.authorized : false;
};

module.exports = {

    createUser,
    getUserByID,
    getUserByUsername,
    authentication,
    isAuthorized
};