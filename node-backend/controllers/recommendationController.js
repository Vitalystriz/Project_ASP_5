const {fetchRecommendations} = require('../services/client');
const UserModel = require('../models/users');

const getRecommendationsById = async (req, res) => {
    try {
        const userId = req.headers['user-id']
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Missing verificated userId in the header"
            })
        }
        const productId = req.params.pId;
        console.log(`[DEBUG] Sending to C++: GET ${userId} ${productId}`);
        // We get here an array of product's id [100, 101, 200]
        const recommendationIds = await fetchRecommendations(userId, productId)


        res.status(200).json({
            success: true,
            userId: userId,
            target: productId,
            data: recommendationIds
        })
    }
    catch (error) {
        if (error.message && error.message.includes('404 Not Found')) {
            return res.status(200).json({
                success: true,
                userId: req.headers['user-id'],
                target: req.params.pId,
                data: []
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



module.exports = {
    getRecommendationsById
}