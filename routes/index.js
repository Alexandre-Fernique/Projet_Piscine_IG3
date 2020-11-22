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
    //res.status(200).sendFile(__dirname +  '/view/connexion.html'); -> Pour envoyer un fichier html
    //res.render('index', { title: 'Express' }); -> Si on veut utiliser pug
});

router.get('/inscrit', function(req, res, next) {
    fs.readFile(__dirname +  '/view/accueil/inscription.html', (err, template) => { //Page de connexion -> Utilisateur non connecté
        if (err)
            throw err;
        res.end(template)
    });
    //res.status(200).sendFile(__dirname +  '/view/connexion.html'); -> Pour envoyer un fichier html
    //res.render('index', { title: 'Express' }); -> Si on veut utiliser pug
});
router.get('/user', function(req, res, next) {
    fs.readFile(__dirname +  '/view/User/Accueil_User.html', (err, template) => { //Page de connexion -> Utilisateur non connecté
        if (err)
            throw err;
        res.end(template)
    });
    //res.status(200).sendFile(__dirname +  '/view/connexion.html'); -> Pour envoyer un fichier html
    //res.render('index', { title: 'Express' }); -> Si on veut utiliser pug
});

module.exports = router;

//fs.readFile(__dirname +  '/view/connexion.html', (err, template) => {
//    if (err)
//      throw err;
//  fs.readFile(__dirname +  '/view/header.html', (err, header) => {
//      if (err)
//          throw err;
//      const html = template.toString().replace("<header>%</header>", header.toString());
//      res.end(html);
//  });
//});