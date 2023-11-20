"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("departments", [
      {
        id: 1,
        name: "Công nghệ thông tin 2",
      },
      {
        id: 1,
        name: "Kế toán",
      },
      {
        id: 1,
        name: "Điện tử, viễn thông",
      },
      {
        id: 1,
        name: "Quản trị kinh doanh",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles");
  },
};
