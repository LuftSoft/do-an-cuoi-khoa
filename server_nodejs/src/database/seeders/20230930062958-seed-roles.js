'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'roles',
      [
        { id: '3c4d-7ab3-e1d7-a853-e449-99f9-3273-b5db', name: 'admin', normalizeName: 'ADMIN' },
        { id: 'c7f5-fe05-2875-f504-af5b-d25b-2d6c-0f39', name: 'user', normalizeName: 'USER' }
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles');
  }
};
