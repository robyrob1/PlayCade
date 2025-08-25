require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'sqlite:./db/dev.sqlite',
    dialect: 'sqlite',
    storage: './db/dev.sqlite',
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data',
    migrationStoragePath: path.resolve(__dirname, '../db/migrations'),
    seederStoragePath: path.resolve(__dirname, '../db/seeders')
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data',
    migrationStoragePath: path.resolve(__dirname, '../db/migrations'),
    seederStoragePath: path.resolve(__dirname, '../db/seeders')
  }
};
