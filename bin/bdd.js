/**
 * Ce fichier gère la connexion à la base de donnée
 */
const mysql = require('mysql');


/*
 * Création d'une instance pour communiquer avec la base de données
 */

var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: process.env.DB_TIMEZONE,
});

db.connect(function(err) {
    if (err)
        throw err;
    console.log("Connecté à la base de données MySQL!") ;
});

// Si on arrive là alors la conenxion s'est bien passée
console.log("Connexion réussie à la base de données");

module.exports = db;
