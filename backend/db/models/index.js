const { Sequelize, DataTypes } = require('sequelize');

const databaseUrl = process.env.DATABASE_URL || 'sqlite:./db/dev.sqlite';
const sequelize = new Sequelize(databaseUrl, {
  logging: false,
  dialectOptions: process.env.DATABASE_URL?.startsWith('postgres') ? { ssl: process.env.NODE_ENV==='production' ? { require: true, rejectUnauthorized: false } : false } : {}
});

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
});

const Game = sequelize.define('Game', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  playUrl: { type: DataTypes.STRING, allowNull: false },
  thumbnailUrl: { type: DataTypes.STRING },
  authorUserId: { type: DataTypes.INTEGER, allowNull: false }
});

const Tag = sequelize.define('Tag', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true }
});

const GameTag = sequelize.define('GameTag', {
  gameId: { type: DataTypes.INTEGER, allowNull: false },
  tagId: { type: DataTypes.INTEGER, allowNull: false }
});

const Review = sequelize.define('Review', {
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: false }
});

const Comment = sequelize.define('Comment', {
  body: { type: DataTypes.TEXT, allowNull: false }
});

// associations
User.hasMany(Game, { foreignKey: 'authorUserId' });
Game.belongsTo(User, { as: 'author', foreignKey: 'authorUserId' });

Game.belongsToMany(Tag, { through: GameTag, foreignKey: 'gameId', otherKey: 'tagId' });
Tag.belongsToMany(Game, { through: GameTag, foreignKey: 'tagId', otherKey: 'gameId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Game.hasMany(Review, { foreignKey: 'gameId' });
Review.belongsTo(Game, { foreignKey: 'gameId' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Game.hasMany(Comment, { foreignKey: 'gameId' });
Comment.belongsTo(Game, { foreignKey: 'gameId' });

async function initDb() {
  await sequelize.sync();
}

module.exports = { sequelize, Sequelize, User, Game, Tag, GameTag, Review, Comment, initDb };
