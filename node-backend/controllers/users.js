const User = require('../models/users');

exports.userSignIn = (req, res) => {
    const { displayName, username, password, x, y } = req.body;
        if (!displayName || !username || !password || x === undefined || y === undefined) {
        return res.status(400).json({ message: 'missing fields' });
    }
    
    const trimmedName = username.trim(); 
    
    const userExists = User.getUserByUsername && User.getUserByUsername(trimmedName); 
    
    if (userExists) {
        return res.status(409).json({ message: 'Username is already taken' });
    }
    
    const profilePic = req.file ? req.file.filename : null;
    const user = User.createUser(displayName, trimmedName, password, profilePic, parseFloat(x), parseFloat(y));
    res.status(201).json(user);
};

exports.getUserByID = (req, res) => {
    const id = req.params.id; 
    
    if (!id) {
        return res.status(400).json({ message: 'invalid user ID' });
    }
    
    const user = User.getUserByID(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'user not found' });
    }
};