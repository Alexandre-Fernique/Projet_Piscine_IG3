const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

//fonction qui retourne l'identifiant du professeur
function getProfId (nom,prenom) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `professeurs` WHERE prenom LIKE ? AND nom LIKE  ? ;";
        db.query(sql,[prenom, nom], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
module.exports = {getProfId};