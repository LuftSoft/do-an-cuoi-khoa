/* eslint-disable-next-line @typescript-eslint/no-var-requires */
require('dotenv').config({ path: '.env.local' });

const configs = {
  type: 'postgres',
  host: 'localhost',
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/backend/entities/**/*.ts'],
  migrations: ['src/backend/migration/**/*.ts'],
  subscribers: ['src/backend/subscribers/**/*.ts'],
};

module.exports = configs;
