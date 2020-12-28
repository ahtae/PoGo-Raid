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
          'https://d.newsweek.com/en/full/822411/pikachu-640x360-pokemon-anime.jpg?w=1600&h=1200&q=88&f=3ed1c0d6e3890cbc58be90f05908a8f5',
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
    await queryInterface.bulkDelete('users', null, {});
  },
};
