const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

function create (values) {
    return new Promise((resolve, reject) => {
        let sql = "INSERT INTO `groupeprojet` (`nomTuteurEntreprise`, `prenomTuteurEntreprise`, `nomEntreprise`, `idProfesseur`) VALUES (?, ?, ?, ?);";
        db.query(sql, values, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else{
                let id = "SELECT MAX(id) as id FROM groupeprojet;"
                db.query(id,(err,result)=>{
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else
                        resolve(result);
                });
            }

        });
    });
}
function select (nomTuteur){
    return new Promise((resolve, reject) => {
        let sql = "SELECT id FROM groupeprojet WHERE nomTuteurEntreprise = ? ;";
        db.query(sql,nomTuteur, (err,result) => {
            if (err){
                console.log(err);
                reject(err);
            }
            else
                resolve(result);
        });
    });
}
function truncate () {
    return new Promise(((resolve, reject) => {
        let sql = "DELETE FROM `groupeprojet`;";
        db.query(sql, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    }));
}
// function truncate () {
//     return new Promise(((resolve, reject) => {
//         let sql = "DELETE FROM `groupeprojet`;";
//         db.query(sql, (err, result) => {
//             if (err)
//                 reject(err);
//             else
//                 resolve(result);
//         });
//     }));
// }

module.exports = {create,truncate,select}