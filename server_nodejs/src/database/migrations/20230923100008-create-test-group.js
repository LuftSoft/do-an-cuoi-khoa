'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('test_groups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: { model: 'tests', key: 'id' }
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'groups', key: 'id' }
      },
      test_schedule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'test_schedules', key: 'id' }
      },
      test_time_count: {
        type: Sequelize.INTEGER
      },
      is_notify: {
        type: Sequelize.BOOLEAN
      }
    });
    await queryInterface.addConstraint('test_groups', {
      fields: ['test_id', 'group_id', 'test_schedule_id'],
      type: 'unique',
      name: 'UK_TEST_GROUPS_TEST_ID_GROUP_ID_TEST_SCHEDULE_ID'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('test_groups');
  }
};