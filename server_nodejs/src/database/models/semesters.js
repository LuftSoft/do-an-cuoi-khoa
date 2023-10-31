"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class semester extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  semester.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      semester: {
        type: DataTypes.INTEGER,
      },
      year: {
        type: DataTypes.INTEGER,
      },
      from_date: {
        type: DataTypes.DATE,
      },
      to_date: {
        type: DataTypes.DATE,
      },
    },
    {
      uniqueKeys: {
        fields: ["semester", "year"],
      },
      sequelize,
      timestamps: false,
      modelName: "semester",
    }
  );
  return semester;
};
