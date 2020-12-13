'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('Password1234!', 6);
    const createdAt = new Date();
    const updatedAt = createdAt;

    await queryInterface.bulkInsert('users', [
      {
        username: 'sven',
        email: 'sven@email.com',
        password: password,
        imageUrl: 'https://avatarfiles.alphacoders.com/181/181475.jpg',
        createdAt,
        updatedAt,
      },
      {
        username: 'hansel',
        email: 'hansel@email.com',
        password: password,
        imageUrl:
          'https://i.pinimg.com/474x/17/cf/a8/17cfa8d9320a6091dd6908bb3a219080.jpg',
        createdAt,
        updatedAt,
      },
      {
        username: 'gretel',
        email: 'gretel@email.com',
        password: password,
        imageUrl:
          'https://lh3.googleusercontent.com/proxy/v5teosDIXft9tVxH_Q6IOlHRRAOPCQ_5eTYzYEtzQAH4w5wOTL8TJtKHnxVh742XBLFIM3GW4M9u4pVkgTaSiC86t3Z3AULBYFM0meZS5YYP6qM0VsT5oJiv4yFFHKDsw_ELvg',
        createdAt,
        updatedAt,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
