const User = require('../models/users');

exports.userLogin = (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'missing fields' });
    }
    
    const user = User.authentication(username, password);
    
    if (user) {
        res.status(200).json({ token: "fake-jwt-token-for-now", user: user });
    } else {
        res.status(401).json({ message: 'authentication failed' });
    }
};