const userService = require('../services/usersService');

exports.userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ message: 'missing fields' });
        }
        
        const user = await userService.authentication(username, password);
        
        if (user) {
            res.status(200).json({ token: "fake-jwt-token-for-now", user: user });
        } else {
            res.status(401).json({ message: 'authentication failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'internal server error', error: error.message });
    }
};