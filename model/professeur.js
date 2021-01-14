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

function getListeProf (nom) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < nom.length; ++i){
            let idP = nom[i];
            console.log(idP)
            let sql = "SELECT id FROM `professeurs` WHERE nom LIKE  ? ;";
            db.query(sql,idP,(err, result)=>{
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                    console.log(result);
                }
            });
        }
    });
}

module.exports = {getProfId , getListeProf};