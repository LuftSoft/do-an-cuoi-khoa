'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class result_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  result_detail.init({
    test_id: DataTypes.STRING,
    question_id: DataTypes.INTEGER,
    answer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'result_detail',
  });
  return result_detail;
};