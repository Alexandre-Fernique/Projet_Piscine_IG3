const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "123456",
    port: 5432
});
pool.connect();
console.log("Connexion réussie à la base de données");

module.exports = pool;
