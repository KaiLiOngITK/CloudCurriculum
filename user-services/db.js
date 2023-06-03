const { Pool } = require('pg');

const pool = new Pool({
    host: 'user-services-database',
    user: 'user',
    password: 'password',
    port: process.env.POSTGRESS_PORT,
    database: 'user-services-database'
});

module.exports = pool;