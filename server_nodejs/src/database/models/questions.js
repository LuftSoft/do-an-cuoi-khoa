'use strict';
const {
  Model
} = require('sequelize');
const chapters = require('./chapters');
const tests = require('./tests');
const test_details = require('./test_details');
const { CONSTANTS } = require('../../shared/constant');
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  questions.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    level: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.QUESTION.LEVEL)),
      allowNull: false
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer_a: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer_b: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer_c: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer_d: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correct_answer: {
      type: DataTypes.ENUM(Object.values(CONSTANTS.QUESTION.ANSWER)),
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }

  }, {
    sequelize,
    timestamps: false,
    modelName: 'questions',
  });
  questions.associate = (models) => {
    questions.belongsTo(models.chapters, { as: 'chapters' });
    questions.belongsToMany(models.tests, { as: 'tests', through: test_details });
  }
  return questions;
};