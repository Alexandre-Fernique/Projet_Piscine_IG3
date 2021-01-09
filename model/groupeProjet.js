const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

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

module.exports = {}