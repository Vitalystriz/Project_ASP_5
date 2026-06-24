const users = require('../models/users')

const verifyAuth = (req, res, next) => {
    const userId = req.headers['user-id']

    if (!userId) return res.status(401).json({error:"Unauthorized: Missing user-id header"})

    const user = users.getUserByID(userId)
    if (!user) return res.status(401).json({error: "Unauthorized: Invalid user-id"})

    const validateAuth = users.isAuthorized(userId)
    if (!validateAuth) return res.status(401).json({error: "Unauthorized: Non authorized user"})

    req.user = user
    next()

}

module.exports = {
    verifyAuth
}