const AppError = require('../utils/appError');

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    // Operational error, trusted
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      error,
    });
  } else {
    // Programming error
    console.log(error);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log(err.name);

    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    console.log('error:', error);
    sendErrorProd(error, res);
  }
};
