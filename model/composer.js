const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

function create(idgroup,numEtudiants){
    return new Promise((resolve,reject)=>{
        for ( num in numEtudiants){
            let sql = "INSERT INTO `composer` (`idGroupe`,`numeroEtudiant`) VALUES (?,?);";
            db.query(sql,(idgroup,num),(err)=>{
                if (err) {
                    console.log(err);
                    reject(err);
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