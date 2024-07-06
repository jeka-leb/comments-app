const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('./user');

const Comment = sequelize.define('Comment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    validate: {
      is: /^[a-zA-Z0-9]+$/i,
      notEmpty: true,
    },
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  homePage: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  },
});

module.exports = Comment;
