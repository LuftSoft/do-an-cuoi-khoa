"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: "11e6-fe27-df22-c78c-3137-46a3-7bf3-5c23",
        firstName: "Default",
        lastName: "Account",
        email: "admin@ptithcm.edu.vn",
        age: null,
        avatar: null,
        passwordHash: "JIaDhoDlWj9OnPmCso4/NYkuQCSClGjH84p9AWL/cPU=",
        refreshToken: null,
        oauthToken: null,
        resetPasswordToken: null,
      },
      {
        id: "e0d2-446f-6170-e42e-e085-64a9-0467-2b33",
        firstName: "Default",
        lastName: "Account",
        email: "gv@ptithcm.edu.vn",
        age: null,
        avatar: null,
        passwordHash: "JIaDhoDlWj9OnPmCso4/NYkuQCSClGjH84p9AWL/cPU=",
        refreshToken: null,
        oauthToken: null,
        resetPasswordToken: null,
      },
      {
        id: "bc7d-1e2d-863b-0256-7539-dc5e-cc3e-899e",
        firstName: "Default",
        lastName: "Account",
        email: "sv@student.ptithcm.edu.vn",
        age: null,
        avatar: null,
        passwordHash: "JIaDhoDlWj9OnPmCso4/NYkuQCSClGjH84p9AWL/cPU=",
        refreshToken: null,
        oauthToken: null,
        resetPasswordToken: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users");
  },
};
