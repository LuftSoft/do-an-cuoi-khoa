"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("subjects", [
      {
        id: "21fb-43ff-38a0-7b5e-7d9d-5e9e-8083-9e6c",
        name: "Lập trình web",
        credit: 3,
        theoretical_lesson: 30,
        pratical_lesson: 15,
      },
      {
        id: "30c3-532c-fe95-6e28-f406-ce4e-bc0c-42b0",
        name: "Cấu trúc dữ liệu và giải thuật",
        credit: 3,
        theoretical_lesson: 30,
        pratical_lesson: 15,
      },
      {
        id: "4487-1ab5-3db9-efc3-b0ff-5e77-56db-9542",
        name: "Cơ sở dữ liệu",
        credit: 3,
        theoretical_lesson: 30,
        pratical_lesson: 15,
      },
      {
        id: "4bdb-215e-883c-3761-8c8d-6fa8-bf72-41a7",
        name: "Lập trình hướng đối tượng",
        credit: 3,
        theoretical_lesson: 30,
        pratical_lesson: 15,
      },
      {
        id: "6f38-3b10-3e5a-6e65-dfee-b21a-1651-c802",
        name: "Tiếng Anh course 1",
        credit: 4,
        theoretical_lesson: 45,
        pratical_lesson: 15,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");
  },
};
