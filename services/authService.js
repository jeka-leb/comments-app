const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

class AuthService {
  static register = catchAsync(async (username, email, password) => {
    let user = await User.findOne({ where: { email } });

    if (user) {
      throw new AppError('User already exists', 400);
    }

    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 12),
    });

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP_TIME,
    });

    return user;
  });

  static login = catchAsync(async (email, password) => {
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Incorrect email or password', 401);
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP_TIME,
    });

    return token;
  });
}

module.exports = AuthService;
