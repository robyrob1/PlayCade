'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') options.schema = process.env.SCHEMA;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      gameId: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Games', key: 'id' }, onDelete: 'CASCADE' },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      body: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    }, options);
    await queryInterface.addConstraint({ ...options, tableName: 'Reviews' }, { fields: ['userId','gameId'], type: 'unique', name: 'user_game_review_unique' });
  },
  async down(queryInterface) { options.tableName = 'Reviews'; return queryInterface.dropTable(options); }
};
