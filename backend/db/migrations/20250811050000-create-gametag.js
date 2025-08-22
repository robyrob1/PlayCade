'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GameTags', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      gameId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Games', key: 'id' }, onDelete: 'CASCADE' },
      tagId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Tags', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    }, options);
    await queryInterface.addConstraint({ ...options, tableName: 'GameTags' }, { fields: ['gameId','tagId'], type: 'unique', name: 'game_tag_unique' });
  },
  async down(queryInterface) { options.tableName = 'GameTags'; return queryInterface.dropTable(options); }
};
