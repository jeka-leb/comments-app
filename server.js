const WebSocket = require('ws');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception!!!');
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

const { sequelize } = require('./utils/db');

// Sequelize sync
sequelize
  .sync()
  .then(() => {
    console.log('Database connected and models synchronized');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// WebSocket setup
const wss = new WebSocket.Server({ server });
app.set('wss', wss);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!!!');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
