const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/', upload.single('picture'), usersController.userSignIn);
router.get('/:id', usersController.getUserByID);

module.exports = router;