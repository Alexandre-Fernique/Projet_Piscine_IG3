const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

function createCreneau (values) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO `creneaux` (`date`, `heureDebut`, `idEvenement`) VALUES (?, ?, ?);";
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

function modifier (values) {
    return new Promise((resolve, reject) => {
        let sql = "UPDATE `creneaux` SET  `date` = ? , `heureDebut` = ? WHERE `id` = ?";
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


function getEvent (idEvent) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT `nom` FROM `evenements` WHERE anneePromo=? ";
        db.query(sql, idEvent,(err, result) => {
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
function getCreneau(annee){
    return new Promise((resolve ,reject)=>{
        //requete pour avoir tout les creneaux
        //"SELECT creneaux.id,`date`, `heureDebut`, `dureeCreneau`,`salle` FROM `evenements`,`creneaux` WHERE evenements.id=idEvenement and anneePromo='" + anne + "';"

        let sql = "SELECT creneaux.id,`date`, `heureDebut`, `dureeCreneau`,`salle`,`idGroupeProjet` FROM `evenements`,`creneaux` WHERE evenements.id=idEvenement and anneePromo='" + anne + "' GROUP BY creneaux.id;"
        //requete pour avoir les prof en plus
        // SELECT creneaux.id,`date`, `heureDebut`, `dureeCreneau`,`salle`, professeurs.nom,`prenom` FROM `evenements`,`creneaux`,`participe`,`professeurs` WHERE evenements.id=idEvenement and creneaux.id=idCreneaux and idProfesseur= professeurs.id and anneePromo='IG3';
        db.query(sql, annee,(err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function getGroupe(idGroupe) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM `groupeprojet` WHERE id= ? ";
        db.query(sql,idGroupe, (err, result) => {
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

function getDureeCreneau(idCreneau) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT dureeCreneau FROM `evenements` WHERE anneePromo= ? ";
        db.query(sql, idCreneau,(err, result) => {
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


function clearByEvent (idEvenement) {
    return new Promise(((resolve, reject) => {
        let sql = "DELETE " +
            "FROM creneaux " +
            "WHERE id IN (" +
                "SELECT c.id " +
                "FROM (SELECT * FROM creneaux) AS c " +
                "JOIN evenements e ON e.id = c.idEvenement " +
                "WHERE e.anneePromo = ?);";
        db.query(sql, [idEvenement], (err, result) => {
            if (err) {
                console.log(err);
                console.log("------------------------");
                reject(err);
            }
            else
                resolve(result);
        });
    }));
}

module.exports = {createCreneau ,modifier, getEvent, getGroupe , getDureeCreneau, clearByEvent}