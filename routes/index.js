var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile(__dirname +  '/view/accueil/connexion.html', (err, template) => { //Page de connexion -> Utilisateur non connecté
        if (err)
            throw err;
        res.end(template)
    });
});

router.get('/inscrit', function(req, res, next) {
    fs.readFile(__dirname +  '/view/accueil/inscription.html', (err, template) => { //Page d'inscription -> Utilisateur non connecté
        if (err)
            throw err;
        res.end(template)
    });
});

module.exports = router;