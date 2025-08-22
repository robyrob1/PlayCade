'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Games', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: { type: Sequelize.STRING(120), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      playUrl: { type: Sequelize.STRING(512), allowNull: false },
      thumbnailUrl: { type: Sequelize.STRING(512) },
      authorUserId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    }, options);
    await queryInterface.addIndex({ ...options, tableName: 'Games' }, ['title']);
  },
  async down(queryInterface) { options.tableName = 'Games'; return queryInterface.dropTable(options); }
};
