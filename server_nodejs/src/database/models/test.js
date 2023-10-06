'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test.init({
    subject: DataTypes.STRING,
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    start_time: DataTypes.DATE,
    schedule_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    easy_question: DataTypes.INTEGER,
    medium_question: DataTypes.INTEGER,
    difficult_question: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'test',
  });
  return test;
};