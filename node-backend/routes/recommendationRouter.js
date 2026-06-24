const express = require('express')
const router = express.Router({ mergeParams: true });

const authentication = require('../services/authMiddleware')
const verifyAuth = authentication.verifyAuth

const RecommendationController = require('../controllers/recommendationController')

router.get('/',verifyAuth, RecommendationController.getRecommendationsById )

module.exports = router