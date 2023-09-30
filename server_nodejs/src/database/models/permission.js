'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  permission.init(
    {
      name: DataTypes.STRING(150),
      normalize: DataTypes.STRING(150),
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'permission',
    }
  );
  return permission;
};