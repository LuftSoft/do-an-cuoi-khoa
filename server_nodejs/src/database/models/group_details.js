'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class group_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  group_details.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'groups', key: 'id' }
    },
    isBan: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'group_details',
  });
  return group_details;
};