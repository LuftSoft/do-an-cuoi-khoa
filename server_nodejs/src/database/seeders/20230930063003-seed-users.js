'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users',
      [
        {
          id: '11e6-fe27-df22-c78c-3137-46a3-7bf3-5c23', firstName: 'Bui Ta Tan', lastName: 'Ngoc', email: 'factyel.bttn@gmail.com',
          age: null, avatar: null, passwordHash: '', refreshToken: null, oauthToken: null, resetPasswordToken: null
        }
      ]
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users');
  }
};
