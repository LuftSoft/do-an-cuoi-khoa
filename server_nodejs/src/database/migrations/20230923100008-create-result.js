'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test_id: {
        type: Sequelize.STRING(255),
        references: { model: 'tests', key: 'id' },
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING(255),
        references: { model: 'users', key: 'id' },
        allowNull: false
      },
      mark: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      tab_switch: {
        type: Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('results');
  }
};