'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  result.init({
    test_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    mark: DataTypes.DOUBLE,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    tab_switch: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'result',
  });
  return result;
};