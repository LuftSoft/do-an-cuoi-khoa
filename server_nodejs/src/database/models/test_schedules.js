'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class test_schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_schedule.init({
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    semester_id: DataTypes.INTEGER,
    begin_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'test_schedule',
  });
  return test_schedule;
};