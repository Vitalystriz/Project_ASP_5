const express = require('express')
const router = express.Router()
const controller = require('../controllers/search')

router.route('/:query')
    .get(controller.getSearchByQuery)

module.exports = router