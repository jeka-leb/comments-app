const express = require('express');
const CaptchaController = require('../controllers/captchaController');
const router = express.Router();

router.get('/', CaptchaController.generateCaptcha);

module.exports = router;
