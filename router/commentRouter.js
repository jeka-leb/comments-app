const express = require('express');
const CommentController = require('../controllers/commentController');
const { check } = require('express-validator');
const validateCaptcha = require('../middlewares/validateCaptcha');
const auth = require('../middlewares/auth');
const { upload } = require('../utils/fileUpload');
const validateHtml = require('../middlewares/validateHtml');

const router = express.Router();

router.post(
  '/',
  auth,
  upload.single('file'),
  [
    check('text').not().isEmpty().withMessage('Text is required'),
    validateCaptcha,
    validateHtml,
  ],
  (req, res, next) => {
    req.wss = req.app.get('wss');
    next();
  },
  CommentController.createComment
);

router.get('/', CommentController.getComments);

module.exports = router;
