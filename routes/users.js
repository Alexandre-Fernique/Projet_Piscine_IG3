var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */

// Cette partie est utile dans l'URL pour la deuxième partie et vers quelle fonction on redirige l'utilisateur
// C'est similaire aux controlleur (ControlleurUtilisateur ici) qui redirige l'utilisateur vers la bonne fonction
// www.exemple.fr/user/cequonveut

//localhost:3000/users/list

router.get('/', function(req, res, next) { //Page d'accueil utilisateur
    fs.readFile(__dirname +  '/view/User/Accueil_User.html', (err, template) => { //Page d'accueil -> Utilisateur connecté
        if (err)
            throw err;
        res.end(template)
    });
});

router.get('/list', function(req, res, next) {
    res.status(200).sendFile(__dirname +  '/view/users.html');
});

module.exports = router;