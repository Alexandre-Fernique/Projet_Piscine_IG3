const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require (path.join(__dirname, '..', 'bin', 'auth'));
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash'); // Permet le hashage du mot de passe
//Lorsqu'on veut afficher quelque chose rentré par l'utilsateur on empêche la page d'intépreter l'html
//Si son nom est "<h1>Chiant" on ne veut pas que cela détruise notre affiche en interprétant la balise h1 mais bien qu'il affiche cela comme le nom
const htmlspecialchars = require('htmlspecialchars');
const recupParam = require(path.join(__dirname, '..', 'bin', 'paramRecup'));

const modelEtudiant = require(path.join(__dirname, '..', 'model', 'etudiant'));
const modelEvenement = require(path.join(__dirname, '..', 'model', 'evenement'));

/* GET users listing. */

// Cette partie est utile dans l'URL pour la deuxième partie et vers quelle fonction on redirige l'utilisateur
// C'est similaire aux controlleur (ControlleurUtilisateur ici) qui redirige l'utilisateur vers la bonne fonction
// www.exemple.fr/user/cequonveut

//localhost:3000/users/list
// La clé nous permet de renfocer les mots de passes qui peuvent être considéré comme "faible"
//ici, le mot de passe "lapin" devient "96706546lapin"
var cle = "96706546"; // Il faudra sécuriser l'accès avec un fichier externe vérouillé

router.get('/', (req, res, next) => { //Page d'accueil utilisateur
    let rang_utilisateur = auth(req, res, next);
    if (rang_utilisateur !== 0) { //Si ce n'est pas étudiant, on le redirige vers la page / qui gère les redirection en fonction de son rang
        res.writeHead(302, {'Location': '/'});
        res.end();
    }
    else {
        fs.readFile(path.join(__dirname, 'view', 'User', 'Accueil_User.html'), (err, template) => { //Page d'accueil -> étudiant connecté
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, 'view', 'header.html'), (err, header) => {
                if (err)
                    throw err;
                let token = req.cookies['token'];
                const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                modelEtudiant.get("prenom,anneePromo", decodedToken["numeroEt"]).then((requete) => {
                    //On ajoute Bonjour, <Prénom> dans l'entête
                    let headerPerso = header.toString().replace('%NOM%', htmlspecialchars(requete[0].prenom));
                    //On ajoute l'entête dans notre page
                    let accueil = template.toString().replace('<header>%</header>', headerPerso);
                    //console.log(template.toString());
                    //requete SQL des créneaux en fonction de la promo
                    modelEtudiant.getGrpId(decodedToken["numeroEt"]).then((IdProjet) => {
                        try {
                            if (IdProjet[0] === undefined)
                                throw "Error"
                            modelEtudiant.getEvent(requete[0].anneePromo).then((listEvent) => {
                                modelEtudiant.getProfEvent(requete[0].anneePromo).then((profEvent) => {
                                    //convertit en JSON le resultat des requetes SQL et les envois coté front
                                    let donne = "<script>let tampon=" + JSON.stringify(listEvent) + ";let IdProjet=" + JSON.stringify(IdProjet) + ";let ProfEvent=" + JSON.stringify(profEvent) + "</script>"
                                    res.end(accueil.replace('<lesevents></lesevents>', donne))
                                    //ajout à la page html la liste des creneaux et la durée générale de tout les créneaux

                                }).catch(() => {
                                    console.log("Problème Prof event")
                                })
                            }).catch(() => {
                                console.log("Problème event ou groupe");
                                //Si l'étudiant n'a pas de groupe ou erreur dans la requête SQL des events
                            })
                        }
                        catch (err){
                            console.log(err)
                            res.end(accueil.replace("<div id='calendar'></div>", '<h1>Veuillez créer un groupe</h1>').replace('href="/creerGroupe"', 'href="/creerGroupe" style="color:red;animation: blink 2s infinite;"').replace('<script src="script.js"></script>',""));

                        }
                    }).catch(() => {
                        console.log("Problème get Idprojet");
                    })
                }).catch( () => {
                    console.log("Problème");
                    res.end("Huston on a un problème"); // Faire une page d'erreur
                });
            });
        });
    }
});


router.get('/modifierMDP',(req,res,next)=>{
    let rang_utilisateur = auth(req, res, next);
    if (rang_utilisateur !== 0) { //Si ce n'est pas étudiant, on le redirige vers la page / qui gère les redirection en fonction de son rang
        res.writeHead(302, {'Location': '/'});
        res.end();
    }
    else {
        fs.readFile(path.join(__dirname, 'view', 'User', 'ModificationMDP.html'), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, 'view', 'header.html'), (err, header) => {
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

                }).catch(() => {
                    console.log("Problème");
                    res.end("Huston on a un problème"); // Faire une page d'erreur
                });
            })
        })
    }
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

//S'occupe de la réservation d'un créneau pour un étudiant
router.get('/reservation/:id', function(req, res, next) {
    let rang_utilisateur = auth(req, res, next);
    if (rang_utilisateur !== 0) { //Si ce n'est pas étudiant, on le redirige vers la page / qui gère les redirection en fonction de son rang
        res.writeHead(302, {'Location': '/'});
        res.end();
    }
    else {
        let token = req.cookies['token'];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        modelEtudiant.get("anneePromo",decodedToken["numeroEt"]).then((annee)=>{
            modelEvenement.getDateFinResa(annee[0].anneePromo).then((date)=> {
                try {
                    if (Date.now() - new Date(date[0].dateLimiteResa) > 0)
                        throw "Fin des résa"
                    modelEtudiant.getGrpId(decodedToken["numeroEt"]).then((result) => {
                        modelEtudiant.changeCreneaux(req.params.id, result[0].idGroupe, annee[0].anneePromo).catch(() => {
                            res.end("problème");
                        })
                    }).catch(() => {
                    })
                }catch (err){
                    console.log(err)
                    res.writeHead(302, {'Location': '/users'});
                    res.status(200).end();
            }
            }).catch(()=>{

            })
        }).catch(() => {
            res.end("problème");
        });
        res.writeHead(302, {'Location': '/users'});
        res.status(200).end();
    }
});

module.exports = router;