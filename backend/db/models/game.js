'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    title: { type: DataTypes.STRING(120), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    playUrl: { type: DataTypes.STRING(512), allowNull: false },
    thumbnailUrl: { type: DataTypes.STRING(512) },
    authorUserId: { type: DataTypes.INTEGER, allowNull: false }
  }, {});
  Game.associate = function(models) {
    Game.belongsTo(models.User, { as: 'author', foreignKey: 'authorUserId' });
    Game.hasMany(models.Review, { foreignKey: 'gameId', onDelete: 'CASCADE', hooks: true });
    Game.hasMany(models.Comment, { foreignKey: 'gameId', onDelete: 'CASCADE', hooks: true });
    Game.belongsToMany(models.Tag, { through: models.GameTag, foreignKey: 'gameId', otherKey: 'tagId', as: 'tags' });
  };
  return Game;
};
