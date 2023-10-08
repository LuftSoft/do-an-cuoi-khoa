'use strict';
const {
  Model
} = require('sequelize');
const test = require('./tests');
module.exports = (sequelize, DataTypes) => {
  class test_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_details.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    order: {
      type: DataTypes.INTEGER(5)
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'test_details',
  });
  return test_details;
};