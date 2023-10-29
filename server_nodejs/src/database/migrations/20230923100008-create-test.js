"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tests", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(255),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      schedule_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      easy_question: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      medium_question: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      difficult_question: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      show_correct_answer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      show_mark: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      submit_when_switch_tab: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      subject_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
      },
      test_schedule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "test_schedules",
          key: "id",
        },
      },
      chapters: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      swap_question: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      swap_answer: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      total_mark: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tests");
  },
};
