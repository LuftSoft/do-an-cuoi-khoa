'use strict';

const user_roles = require('../models/user_roles');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false
      },
      avatar: {
        type: Sequelize.BLOB('long'),
      },
      passwordHash: {
        type: Sequelize.STRING(511),
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.STRING(511),
      },
      oauthToken: {
        type: Sequelize.STRING(511),
      },
      resetPasswordToken: {
        type: Sequelize.STRING(511),
      },
    }
    );
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(127),
        unique: true,
        allowNull: false
      },
      normalizeName: {
        type: Sequelize.STRING(127),
        unique: true,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      }
    });
    await queryInterface.createTable('user_roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.STRING(255),
        references: {
          model: 'users',
          key: 'id'
        }
      },
      role_id: {
        type: Sequelize.STRING(255),
        references: {
          model: 'roles',
          key: 'id'
        }
      }
    }
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('users', { cascade: true });
    queryInterface.dropTable('roles', { cascade: true });
    queryInterface.dropTable('user_roles', { cascade: true });
  }
};
