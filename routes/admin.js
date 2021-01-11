const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require (path.join(__dirname, '..', 'bin', 'auth'));
const jwt = require('jsonwebtoken');
const htmlspecialchars = require('htmlspecialchars');
const modelEtudiant = require(path.join(__dirname, '..', 'model', 'etudiant'));
const passwordHash = require('password-hash'); // Permet le hashage du mot de passe
const recupParam = require(path.join(__dirname, '..', 'bin', 'paramRecup'));
// La clé nous permet de renfocer les mots de passes qui peuvent être considéré comme "faible"
//ici, le mot de passe "lapin" devient "96706546lapin"
var cle = "96706546"; // Il faudra sécuriser l'accès avec un fichier externe vérouillé

router.get('/', (req, res, next) => {
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        //Page d'accueil administrateur
        fs.readFile(path.join(__dirname, "view/Admin/index.html"), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, "view/Admin/header.html"), (err, header) => {
                let accueil = template.toString().replace('<header>%</header>', header.toString());
                if (err)
                    throw err;
                res.end(accueil.toString());
            })
        });
    }
});

router.get('/evenement', (req, res, next) => { // On délègue la gestion des évenements à un routeur à part
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        res.writeHead(302, {'Location': '/admin/evenement/list'});
        res.status(200).end();
    }
});

router.get('/modifierMDP',(req,res,next)=>{
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    }
    fs.readFile(path.join(__dirname, 'view', 'Admin', 'ModificationMDP.html'),(err,template)=>{
        if(err)
            throw err;
        fs.readFile(path.join(__dirname, 'view','Admin', 'header.html'), (err, header) => {
            if (err)
                throw err;

            let token = req.cookies['token'];
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            modelEtudiant.get("prenom,anneePromo", decodedToken["numeroEt"]).then((requete) => {
                //On ajoute Bonjour, <Prénom> dans l'entête
                let headerPerso = header.toString().replace('%NOM%', htmlspecialchars(requete[0].prenom));
                //On ajoute l'entête dans notre page
                let accueil = template.toString().replace('<header>%</header>', headerPerso);
                res.end(accueil);

            }).catch( () => {
                console.log("Problème");
                res.end("Huston on a un problème"); // Faire une page d'erreur
            });
        })
    })
});

router.post('/modifier',(req,res,)=>{

    let oldPassword = cle + recupParam(req,"oldPassword")
    let newPassword = passwordHash.generate(cle+recupParam(req,"newPassword"))
    let token = req.cookies['token'];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    modelEtudiant.changePassword(oldPassword,newPassword,decodedToken["numeroEt"]).then((requete) => {
        res.end("okay")
    }).catch( () => {
        res.end("Problème huston"); // Faire une page d'erreur
    });
})

module.exports = router;