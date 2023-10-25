"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("group_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: { model: "users", key: "id" },
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "groups", key: "id" },
      },
      is_ban: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("group_details");
  },
};
