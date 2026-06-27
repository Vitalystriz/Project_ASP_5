const userService = require('../services/usersService');

exports.userSignIn = async (req, res) => {
    try {
        const { displayName, username, password, x, y } = req.body;
        if (!displayName || !username || !password || x === undefined || y === undefined) {
            return res.status(400).json({ message: 'missing fields' });
        }
        
        const trimmedName = username.trim(); 
        
        const userExists = await userService.getUserByUsername(trimmedName); 
        
        if (userExists) {
            return res.status(409).json({ message: 'Username is already taken' });
        }
        
        const profilePic = req.file ? req.file.filename : null;
        const user = await userService.createUser(displayName, trimmedName, password, profilePic, parseFloat(x), parseFloat(y));
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'internal server error', error: error.message });
    }
};

exports.getUserByID = async (req, res) => {
    try {
        const id = req.params.id; 
        
        if (!id) {
            return res.status(400).json({ message: 'invalid user ID' });
        }
        
        const user = await userService.getUserByID(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'user not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error', error: error.message });
    }
};