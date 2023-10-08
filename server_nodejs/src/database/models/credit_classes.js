'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class credit_class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  credit_class.init({
    semester: DataTypes.INTEGER,
    school_year: DataTypes.STRING,
    subject_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'credit_class',
  });
  return credit_class;
};