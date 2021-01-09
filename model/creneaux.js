const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd'));

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

module.exports = {clearByEvent}