'use strict';
const {
    Model, ENUM
} = require('sequelize');
const tests = require('./tests');
const { CONSTANTS } = require('../../shared/constant');
const { CONFIG } = require('../../shared/common.constants');
module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    users.init({
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        age: {
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        avatar: {
            type: DataTypes.BLOB,
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM(Object.values(CONSTANTS.USER.TYPE)),
            allowNull: false,
            defaultValue: CONSTANTS.USER.TYPE.SV
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        oauthToken: {
            type: DataTypes.STRING,
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
        }
    }, {
        sequelize,
        timestamps: false,
        modelName: 'users',
    });
    users.associate = (models) => {
        users.hasMany(models.tests, { as: 'tests' });
    }
    return users;
};