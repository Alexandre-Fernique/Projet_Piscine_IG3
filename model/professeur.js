const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

//fonction qui retourne l'identifiant du professeur
function getProfId (nom,prenom) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT `id` FROM `professeurs` WHERE nom= ? AND prenom= ? ;";
        db.query(sql,[nom,prenom], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(result);
                resolve(result);
            }
        });
    });
}
module.exports = {getProfId};