const fs = require("fs");
const path = require("path");
const pg = require("pg");
const fp = require("fastify-plugin");

module.exports = fp(async (fastify) => {
  const { Pool } = pg;
  const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    database: process.env.DBNAME,
  });

  const sql = fs
    .readFileSync(path.join(__dirname, "../../db_schema.sql"))
    .toString();
  pool.query(sql, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
  fastify.decorate("pool", pool);
});
