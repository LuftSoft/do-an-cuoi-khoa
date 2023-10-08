'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('test_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: 'tests',
          key: 'id'
        }
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        }
      },
      order: {
        type: Sequelize.INTEGER(5)
      }
    });
    await queryInterface.addConstraint('test_details', {
      fields: ['test_id', 'question_id'],
      type: 'unique',
      name: 'unique_key_test_details_test_id_-question_id'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('test_details');
  }
};