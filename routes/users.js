const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require (path.resolve('./bin/auth'));

/* GET users listing. */

// Cette partie est utile dans l'URL pour la deuxième partie et vers quelle fonction on redirige l'utilisateur
// C'est similaire aux controlleur (ControlleurUtilisateur ici) qui redirige l'utilisateur vers la bonne fonction
// www.exemple.fr/user/cequonveut

//localhost:3000/users/list

router.get('/', (req, res, next) => { //Page d'accueil utilisateur
    let rang_utilisateur = auth(req, res, next);
    if (rang_utilisateur === 0) { // C'est un étudiant
        fs.readFile(__dirname +  '/view/User/Accueil_User.html', (err, template) => { //Page d'accueil -> étudiant connecté
            if (err)
                throw err;
            res.end(template)
        });
    } else if (rang_utilisateur === 1) { // C'est l'administrateur
        fs.readFile(__dirname +  '/view/User/', (err, template) => { //Page d'accueil -> administrateur connecté
            if (err)
                throw err;
            res.end(template)
        });
    } else { //On a un problème, on le redirige vers la page de connexion
        res.writeHead(302, {'Location': '/'});
        res.end();
    }
});

router.get('/list', function(req, res, next) {
    res.status(200).sendFile(__dirname +  '/view/users.html');
});

module.exports = router;