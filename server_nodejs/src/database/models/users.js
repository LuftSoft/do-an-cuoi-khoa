'use strict';
const {
    Model
} = require('sequelize');
const tests = require('./tests');
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
            type: DataTypes.STRING(512),
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.STRING(512),
        },
        oauthToken: {
            type: DataTypes.STRING(512),
        },
        resetPasswordToken: {
            type: DataTypes.STRING(512),
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