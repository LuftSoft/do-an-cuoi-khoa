'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subject.init({
    name: DataTypes.STRING,
    credit: DataTypes.INTEGER,
    theoretical_lesson: DataTypes.INTEGER,
    pratical_lesson: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'subject',
  });
  return subject;
};