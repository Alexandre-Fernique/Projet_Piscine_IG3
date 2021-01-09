const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

function create (values) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO `evenements` (`nom` ,`dateDebut`, `Duree`, `dateLimiteResa`, `dureeCreneau`, `nombreMembresJury`, `anneePromo`) VALUES (?, ? ,?, ?, ?, ?, ?);";
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

function update (values) {
    return new Promise((resolve, reject) => {
        //On fait une requête préparée (Elle permet de contrer les injections SQL)
        //Par la fonction query les '?' vont être remplacés par les valeurs du tableau (2è argument), ici values
        let sql = "UPDATE `evenements` SET `nom` = ?, `dateDebut` = ?, `Duree` = ?, `dateLimiteResa` = ?, `dureeCreneau` = ?, `nombreMembresJury` = ?, `anneePromo` = ? WHERE `evenements`.`id` = ?";
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


function getByPromotion (promo) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `evenements` WHERE anneePromo=?;";
        db.query(sql, [promo], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log(result);
                resolve(result);
            }
        });
    });
}
/*
Sauf erreur, on a qu'un seul événement à la fois, donc on peut simplement retourner tout le contenu de la table et on aura toutes les infos d'un événements
 */
function getAll () {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `evenements` WHERE 1;";
        db.query(sql, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

function getAllPromotionAvailable () {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `promotion` promo WHERE promo.annee != 'Admin' AND promo.annee NOT IN ( SELECT e.anneePromo FROM evenements e)";
        db.query(sql, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

function clearByEvent (idEvenement) {
    return new Promise(((resolve, reject) => {
        let sql = "DELETE " +
            "FROM `evenements` " +
            "WHERE anneePromo = ?;";
        db.query(sql, [idEvenement], (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    }));
}

module.exports = {create, update, getByPromotion, getAll, getAllPromotionAvailable, clearByEvent};