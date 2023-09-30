'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class userRoles extends Model {
        static associate(models) {
            // associations can be defined here
        }
    }
    userRoles.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        },
        {
            timestamps: false,
            sequelize,
            modelName: 'userRoles',
        });
    return userRoles;
}