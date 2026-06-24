const crypto = require('crypto');

const users = [];

const createUser = (displayName, username, password, profilePic, x, y) => {
    const user = {
        id: crypto.randomUUID(),
        displayName: displayName,
        username: username,
        password: password,
        profilePic: profilePic,
        authorized: false,
        x: parseFloat(x), 
        y: parseFloat(y)
    };
    users.push(user);
    return user;
};

const getUserByID = (id) => {
    return users.find(user => user.id === id);
};

const getUserByUsername = (username) => {
    return users.find(user => user.username === username);
};

const authentication = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        user.authorized = true;
        return user;
    }
    return null;
};

const isAuthorized = (id) => {
    const user = users.find(user => user.id === id);
    return user ? user.authorized : false;
}; 

module.exports = {
    createUser,
    getUserByID,
    getUserByUsername,
    authentication,
    isAuthorized
};