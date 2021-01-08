const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));


/*
Il faudra gérer les erreurs en fonction de ce qu'il se passe
Ou alors redirgier vers une page d'erreur
Il faut penser à faire éviter les erreurs au max avec une vérification des données avant envoie (taille des variables, ...)
 */

/*
Cette fonction est un getteur générique
column est le nom de la colonne qu'il faut vérifier
num est le numéro de l'admin (La clé primaire de la table)
 */
function get (column, id) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT " + column + " FROM `evenements` WHERE id=" + id + ";";
        db.query(sql, (err, result) => {
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
// fonction qui permet de réserver un créneau disponible pour un groupe donné en paramètre(idGroupe) à un créneau donner(id)
function changeEvenements(id,idGroupe){
    return new Promise((resolve, reject) => {
        // modify / create créneau. Coordinate with Zahra for completion.
        db.query(sql, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                console.log("Changement fait");
                db.query(sql2, (err2) => {
                    if (err2) {
                        console.log(err);
                        reject(err);
                    }
                    console.log("Changement fait");
                });
            }
        });
    });
}
/*
Cette fonction est un getteur des créneaux(et leurs informations) en fonction de ta promo
*/
function getEvent(anne,prof=false){
    return new Promise((resolve ,reject)=>{
        //requete pour avoir tout les creneaux
        //"SELECT creneaux.id,`date`, `heureDebut`, `dureeCreneau`,`salle` FROM `evenements`,`creneaux` WHERE evenements.id=idEvenement and anneePromo='" + anne + "';"
        if(prof) {
            let sql = "SELECT creneaux.id,`date`, `heureDebut`, `dureeCreneau`,`salle`, professeurs.nom,`prenom`,`idGroupeProjet` FROM `evenements`,`creneaux`,`participe`,`professeurs` WHERE evenements.id=idEvenement and creneaux.id=idCreneaux and idProfesseur= professeurs.id" + ";"
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(result);
                    resolve(result);
                }
            });
        }
        else{
            let sql = "SELECT creneaux.id,`date`, `heureDebut`, `dureeCreneau`,`salle`,`idGroupeProjet` FROM `evenements`,`creneaux`,`participe` WHERE evenements.id=idEvenement and creneaux.id!=idCreneaux and " + ' GROUP BY creneaux.id;';
            //requete pour avoir les prof en plus
            // SELECT creneaux.id,`date`, `heureDebut`, `dureeCreneau`,`salle`, professeurs.nom,`prenom` FROM `evenements`,`creneaux`,`participe`,`professeurs` WHERE evenements.id=idEvenement and creneaux.id=idCreneaux and idProfesseur= professeurs.id and anneePromo='IG3';
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(result);
                    resolve(result);
                }
            });
        }
    });
}
module.exports = {get,getEvent,changeEvenements };