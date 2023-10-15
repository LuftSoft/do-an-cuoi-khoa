'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class credit_classes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  credit_classes.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    semester_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'semesters', key: 'id' }
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    subject_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: { model: 'subjects', key: 'id' }
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'credit_classes',
  });
  return credit_classes;
};