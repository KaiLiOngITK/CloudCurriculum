const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'user-services-database-postgres',
    database: 'postgres',
    port: 5432
});

module.exports = pool;