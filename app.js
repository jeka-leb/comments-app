const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dotenv = require('dotenv');

const { sequelize } = require('./utils/db');

const commentRouter = require('./router/commentRouter');
const captchaRouter = require('./router/captchaRouter');
const authRouter = require('./router/authRouter');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

sessionStore.sync().catch((err) => {
  console.error('Unable to sync session store:', err);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/comments', commentRouter);
app.use('/auth', authRouter);
app.use('/captcha', captchaRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `The resource associated with the url ${req.originalUrl} cannot be find`,
      404
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
