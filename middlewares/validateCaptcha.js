const AppError = require('../utils/appError');

const validateCaptcha = (req, res, next) => {
  const { captcha } = req.body;
  if (req.session.captcha === captcha) {
    next();
  } else {
    return next(new AppError('Invalid CAPTCHA', 400));
  }
};

module.exports = validateCaptcha;
