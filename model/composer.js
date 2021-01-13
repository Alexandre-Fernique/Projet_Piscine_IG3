const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

function create(idgroup,numEtudiants){
    return new Promise((resolve,reject)=>{
        console.log("toto : " + numEtudiants);
        for (let i = 0; i < numEtudiants.length; ++i){
            let numEt = numEtudiants[i];
            console.log(numEt)
            let sql = "INSERT INTO `composer` (`idGroupe`,`numeroEtudiant`) VALUES (?,?);";
            db.query(sql,[idgroup,numEt],(err, result)=>{
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }
    });
}
function truncate () {
    return new Promise(((resolve, reject) => {
        let sql = "DELETE FROM `composer`;";
        db.query(sql, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    }));
}
// function clearByEvent () {
//     return new Promise(((resolve, reject) => {
//         let sql = "DELETE FROM `composer`;";
//         db.query(sql, (err, result) => {
//             if (err)
//                 reject(err);
//             else
//                 resolve(result);
//         });
//     }));
// }

module.exports = {create,truncate}