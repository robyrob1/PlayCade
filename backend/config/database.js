const cfg = require('./index');
module.exports = {
  development: {
    storage: cfg.dbFile,
    dialect: 'sqlite',
    seederStorage: 'sequelize'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    define: { schema: process.env.SCHEMA }
  }
};
