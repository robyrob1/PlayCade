'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    color: { type: DataTypes.STRING(20) }
  }, {});
  Tag.associate = function(models) {
    Tag.belongsToMany(models.Game, { through: models.GameTag, foreignKey: 'tagId', otherKey: 'gameId' });
  };
  return Tag;
};
