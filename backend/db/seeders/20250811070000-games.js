'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;
module.exports = {
  async up (queryInterface) {
    options.tableName = 'Games';
    await queryInterface.bulkInsert(options, [
      { title: 'Meteor Dash', description: 'Dodge meteors and survive!', playUrl: 'https://example.com/meteor', thumbnailUrl: null, authorUserId: 1, createdAt: new Date(), updatedAt: new Date() },
      { title: 'Puzzle Cubes', description: 'Match-3 cube puzzler.', playUrl: 'https://example.com/cubes', thumbnailUrl: null, authorUserId: 2, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down (queryInterface, Sequelize) {
    options.tableName = 'Games';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, { title: { [Op.in]: ['Meteor Dash','Puzzle Cubes'] } }, {});
  }
};
