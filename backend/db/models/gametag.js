'use strict';
module.exports = (sequelize, DataTypes) => {
  const GameTag = sequelize.define('GameTag', {
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    tagId: { type: DataTypes.INTEGER, allowNull: false }
  }, {});
  GameTag.associate = function(models) {
    GameTag.belongsTo(models.Game, { foreignKey: 'gameId' });
    GameTag.belongsTo(models.Tag, { foreignKey: 'tagId' });
  };
  return GameTag;
};
