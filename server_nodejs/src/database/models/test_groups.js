'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class test_groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  test_groups.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    test_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: { model: 'tests', key: 'id' }
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'groups', key: 'id' }
    },
    test_schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'test_schedules', key: 'id' }
    },
    test_time_count: {
      type: DataTypes.INTEGER
    },
    is_notify: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    timestamps: false,
    uniqueKeys: {
      fields: ['test_id', 'group_id', 'test_schedule_id']
    },
    modelName: 'test_groups',
  });
  return test_groups;
};