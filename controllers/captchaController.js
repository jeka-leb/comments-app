const svgCaptcha = require('svg-captcha');
const catchAsync = require('../utils/catchAsync');

class CaptchaController {
  static generateCaptcha = catchAsync(async (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text; // Сохранение CAPTCHA в сессии пользователя
    res.type('svg');
    res.status(200).send(captcha.data);
  });
}

module.exports = CaptchaController;
