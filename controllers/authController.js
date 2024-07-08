const { validationResult } = require('express-validator');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const AuthService = require('../services/authService');
require('dotenv').config();

class AuthController {
  static register = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError(
          `${errors
            .array()
            .map((err) => err.msg)
            .join('; ')}`,
          400
        )
      );
    }
    const { username, email, password } = req.body;

    const newUser = await AuthService.register(username, email, password);

    res.status(201).json({
      status: 'success',
      data: { user: newUser },
    });
  });

  static login = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new AppError(
          `${errors
            .array()
            .map((err) => err.msg)
            .join('; ')}`,
          400
        )
      );
    }

    const { email, password } = req.body;
    const token = await AuthService.login(email, password);

    res.status(201).json({
      status: 'success',
      data: { token },
    });
  });
}

module.exports = AuthController;
