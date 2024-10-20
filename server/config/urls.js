'use strict'
const DIALECT = 'postgres';
const HOST = 'localhost';
const PORT = 5432;
const DB = 'ticket';
const DB_USR = process.env.POSTGRES_USER;
const DB_PASS = process.env.POSTGRES_PASSWORD;

module.exports = {
  default: 3002,
  database: `${DIALECT}://${DB_USR}:${DB_PASS}@${HOST}:${PORT}/${DB}`
};
