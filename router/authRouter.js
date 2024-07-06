const express = require('express');
const { check } = require('express-validator');
const AuthController = require('../controllers/authController');
require('dotenv').config();

const router = express.Router();

router.post(
  '/register',
  [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  AuthController.register
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').exists().withMessage('Password is required'),
  ],
  AuthController.login
);

module.exports = router;
