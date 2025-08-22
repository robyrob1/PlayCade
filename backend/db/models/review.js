'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    body: { type: DataTypes.TEXT, allowNull: false }
  }, {});
  Review.associate = function(models) {
    Review.belongsTo(models.User, { foreignKey: 'userId' });
    Review.belongsTo(models.Game, { foreignKey: 'gameId' });
  };
  return Review;
};
