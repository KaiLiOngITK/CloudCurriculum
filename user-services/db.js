const { Pool } = require('pg');

const pool = new Pool({
    host: "user-services-database-postgres",
    port: 5432,
    user: "user",
    password: "password",
    database: "user-services-database-postgres"
});

module.exports = pool;