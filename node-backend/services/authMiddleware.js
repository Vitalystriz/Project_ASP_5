const usersService = require('./usersService');

const verifyAuth = async (req, res, next) => {
    try {
        const userId = req.headers['user-id']

        if (!userId) return res.status(401).json({error:"Unauthorized: Missing user-id header"})

        const user = await usersService.getUserByID(userId)
        if (!user) return res.status(401).json({error: "Unauthorized: Invalid user-id"})

        const validateAuth = await usersService.isAuthorized(userId)
        if (!validateAuth) return res.status(401).json({error: "Unauthorized: Non authorized user"})

        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({error: "Internal server error during authentication"})
    }
}

module.exports = {
    verifyAuth
}