// Equivalent des controlleurs
var express = require('express');
var router = express.Router();

/* GET users listing. */

// Cette partie est utile dans l'URL pour la deuxième partie et vers quelle fonction on redirige l'utilisateur
// C'est similaire aux controlleur (ControlleurUtilisateur ici) qui redirige l'utilisateur vers la bonne fonction
// www.exemple.fr/user/cequonveut

//localhost:3000/users/list

router.get('/list', function(req, res, next) { //Page d'acueil de la partie utilisateur
    res.status(200).sendFile(__dirname +  '/view/users.html');
});

module.exports = router;