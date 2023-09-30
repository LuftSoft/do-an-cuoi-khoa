'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      age: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      avatar: {
        type: Sequelize.BLOB,
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      refreshToken: {
        type: Sequelize.STRING,
      },
      oauthToken: {
        type: Sequelize.STRING,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
      }
    }
    );
    queryInterface.createTable('roles', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      normalizeName: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      }
    });
    queryInterface.createTable('userRoles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('users', { cascade: true });
    queryInterface.dropTable('roles', { cascade: true });
    queryInterface.dropTable('userRoles', { cascade: true });
  }
};
