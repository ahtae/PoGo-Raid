'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('messages', [
      {
        uuid: '2c7be0f4-c145-4116-925e-ff802ebe0b1e',
        content: 'Hey Sven!',
        from: 'hansel',
        to: 'sven',
        createdAt: '2020-12-12 08:00:00',
        updatedAt: '2020-12-12 08:00:00',
      },
      {
        uuid: '2281c4fb-4c00-493a-ad8e-a5f9e0c76701',
        content: 'Hey Hansel, are you ready to join the raid?',
        from: 'sven',
        to: 'hansel',
        createdAt: '2020-12-12 08:12:00',
        updatedAt: '2020-12-12 08:12:00',
      },
      {
        uuid: 'faa5bc4a-8ef9-43f9-9b8d-81dc6dc9763d',
        content: 'Yes!',
        from: 'hansel',
        to: 'sven',
        createdAt: '2020-12-12 08:13:00',
        updatedAt: '2020-12-12 08:13:00',
      },
      {
        uuid: 'ffdb1703-eb56-4d82-8d5a-efa705fd2aec',
        content: 'Gretel, leave the raid. There are not enough people. :(',
        from: 'hansel',
        to: 'gretel',
        createdAt: '2020-12-12 9:00:00',
        updatedAt: '2020-12-12 9:00:00',
      },
      {
        uuid: '60b57d8c-571c-4cd2-8978-312065b56a08',
        content: 'Okay, lets try again later!',
        from: 'gretel',
        to: 'hansel',
        createdAt: '2020-12-12 9:01:00',
        updatedAt: '2020-12-12 9:01:00',
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
