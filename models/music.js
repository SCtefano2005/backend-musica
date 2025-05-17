'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Music extends Model {

    static associate(models) {
      Music.belongsTo(models.User, {
        foreignKey: 'UserId',
        as: 'user'
      });
    }
  }
  Music.init({
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    format: DataTypes.STRING,
    filePath: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Music',
  });
  return Music;
};