const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

/*
Il faudra gérer les erreurs en fonction de ce qu'il se passe
Ou alors redirgier vers une page d'erreur
Il faut penser à faire éviter les erreurs au max avec une vérification des données avant envoie (taille des variables, ...)
 */
function create (values) {
    return new Promise((resolve, reject) => {
        //On fait une requête préparée (Elle permet de contrer les injections SQL)
        //Par la fonction query les '?' vont être remplacés par les valeurs du tableau (2è argument), ici values
        let sql = "INSERT INTO `etudiants` (`numero`, `nom`, `prenom`, `mail`, `motDePasse`, `anneePromo`) VALUES (?, ?, ?, ?, ?, ?);";
        db.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else
                resolve(result);
        });
    });
}
module.exports = {create};