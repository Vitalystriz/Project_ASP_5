const express = require('express');
const router = express.Router();

const { userLogin } = require('../controllers/tokens'); 
router.post('/', userLogin); 

module.exports = router;