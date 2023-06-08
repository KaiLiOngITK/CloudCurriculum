const { Pool, Client } = require('pg');

const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'order-services-database-postgres',
    database: 'postgres',
    port: 5433
});

module.exports = pool;