const express = require('express');
const router = express.Router();
const musicController = require('../controllers/MusicController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/download', authMiddleware, musicController.downloadAndServeMusic);


module.exports = router;
