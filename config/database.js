const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432, // Puerto por defecto de PostgreSQL
    max: 20, // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo máximo que una conexión puede estar inactiva en el pool
    connectionTimeoutMillis: 2000, // Tiempo máximo para establecer una conexión
});

module.exports = pool;