require("dotenv").config()
const { Pool } = require('pg');

const credentials = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
}

const pool = new Pool(credentials);


module.exports = {
  query: (text,params) => pool.query(text, params),
};
