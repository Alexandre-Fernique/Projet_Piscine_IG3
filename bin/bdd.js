/**
 * Ce fichier gère la connexion à la base de donnée
 */
const { Pool } = require('pg');

/*
 * Création d'une instance pour communiquer avec la base de données
 */
const pool = new Pool({
    //Nom d'utilisateur de connexion
    user: "postgres",
    //Hôte de connexion : localhost -> En local
    host: "localhost",
    //Nom de la base de données
    database: "postgres",
    //Mot de passe de superutilisateur
    password: "123456",
    //Numéro du port de connexion à la BDD
    port: 5432
});
// Mise en place de la connexion à la base de données
pool.connect();

//id SERIAL PRIMARY KEY, firstname TEXT, lastname TEXT, age INT NOT NULL, address VARCHAR(255), email VARCHAR(50)
var creation_promotions = "CREATE TABLE promotions(id SERIAL PRIMARY KEY, anneePromotion VARCHAR(15));";
var suppression_promotions = "DROP TABLE public.promotions;";
// Ce script ne sera a exectuer que lors du premier lancement de l'application car il détruit les tables puis les créent
pool.query(suppression_promotions , (err, res) => { // On essaie de supprimer la table promotion
    console.log("Table de promotions supprimées");
    pool.query(creation_promotions , (err, res) => { // Puis on créé la table de promotion
            if (err)
                throw err;
            console.log("Table de promotions créées");
            pool.end();
        }
    );
});

// Si on arrive là alors la conenxion s'est bien passée
console.log("Connexion réussie à la base de données");

module.exports = pool;
