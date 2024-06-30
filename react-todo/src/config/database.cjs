const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER || 'your_user',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'your_database',
    password: process.env.DB_PASSWORD || 'your_password',
    port: process.env.DB_PORT || 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
