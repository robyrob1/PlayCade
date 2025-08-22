'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;
module.exports = {
  async up (queryInterface) {
    options.tableName = 'Tags';
    await queryInterface.bulkInsert(options, [
      { name: 'Retro', slug: 'retro', color: '#ffb300', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Multiplayer', slug: 'multiplayer', color: '#00bcd4', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pixel Art', slug: 'pixel-art', color: '#8bc34a', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'Tags';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { slug: { [Op.in]: ['retro','multiplayer','pixel-art'] } }, {});
  }
};
