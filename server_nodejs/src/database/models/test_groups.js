'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class test_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_group.init({
    test_id: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    test_schedule_id: DataTypes.STRING,
    test_time_count: DataTypes.INTEGER,
    is_notify: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'test_group',
  });
  return test_group;
};