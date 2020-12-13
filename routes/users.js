const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require (path.join(__dirname, '../bin/auth'));
const jwt = require('jsonwebtoken');
//Lorsqu'on veut afficher quelque chose rentré par l'utilsateur on empêche la page d'intépreter l'html
//Si son nom est "<h1>Chiant" on ne veut pas que cela détruise notre affiche en interprétant la balise h1 mais bien qu'il affiche cela comme le nom
const htmlspecialchars = require('htmlspecialchars');

const modelEtudiant = require(path.join(__dirname, '../model/etudiant'));

/* GET users listing. */

// Cette partie est utile dans l'URL pour la deuxième partie et vers quelle fonction on redirige l'utilisateur
// C'est similaire aux controlleur (ControlleurUtilisateur ici) qui redirige l'utilisateur vers la bonne fonction
// www.exemple.fr/user/cequonveut

//localhost:3000/users/list

router.get('/', (req, res, next) => { //Page d'accueil utilisateur
    let rang_utilisateur = auth(req, res, next);
    if (rang_utilisateur !== 0) { //Si ce n'est pas étudiant, on le redirige vers la page / qui gère les redirection en fonction de son rang
        res.writeHead(302, {'Location': '/'});
        res.end();
    }
    fs.readFile(__dirname +  '/view/User/Accueil_User.html', (err, template) => { //Page d'accueil -> étudiant connecté
        if (err)
            throw err;
        fs.readFile(__dirname + '/view/header.html', (err, header) => {
            if (err)
                throw err;
            let token = req.cookies['token'];
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            modelEtudiant.get("prenom,anneePromo", decodedToken["numeroEt"]).then( (requete) => {
                //On ajoute Bonjour, <Prénom> dans l'entête
                let headerPerso = header.toString().replace('%NOM%', htmlspecialchars(requete[0].prenom));
                //On ajoute l'entête dans notre page
                let accueil = template.toString().replace('<header>%</header>', headerPerso);
                //console.log(template.toString());
                //requete SQL des créneaux en fonction de la promo
                modelEtudiant.getGrpId(decodedToken["numeroEt"]).then( (IdProjet) => {
                    modelEtudiant.getEvent(requete[0].anneePromo).then((listEvent) => {
                        //convertit en JSON le resultat de la requete SQL
                        const tampon = JSON.parse(JSON.stringify(listEvent))
                        //initialise la balise script contenant tout les events du calendrier
                        let resultat = '<script>let liste=[';
                        for (let event of tampon) {
                            let data ={};
                            //Si c'est le créneaux du groupe contenant l'étdiant qui à chargé la page
                            if(IdProjet[0].idGroupe == event.idGroupeProjet){
                                data = {
                                    id: event.id,
                                    title: event.salle+" Votre créneaux",
                                    start: event.date.split("T")[0] + "T" + event.heureDebut,
                                };
                            }
                            //Si c'est le créneaux d'un autre étudiant
                            else if(event.idGroupeProjet!=null){
                                data = {
                                    id: event.id,
                                    title: event.salle+" Non disponible",
                                    start: event.date.split("T")[0] + "T" + event.heureDebut,
                                };
                            }
                            //Si le créneaux est vide
                            else {
                                data = {
                                    id: event.id,
                                    title: event.salle+" Disponible",
                                    start: event.date.split("T")[0] + "T" + event.heureDebut           ,
                                    url: '/users/reservation/' + event.id
                                };
                            }
                            resultat += JSON.stringify(data) + ","
                        }
                        resultat = resultat.substring(0, resultat.length - 1) + '];let duree ="' + tampon[0].dureeCreneau.substring(0, 5) + '";</script>'
                        res.end(accueil.replace('<lesevents></lesevents>', resultat))
                        //ajout à la page html la liste des creneaux et la durée générale de tout les créneaux
                    }).catch(() => {
                        console.log("Problème event");
                    })
                }).catch(() => {
                    console.log("Problème get Idprojet");
                })
            }).catch( () => {
                console.log("Problème");
                res.end("Huston on a un problème"); // Faire une page d'erreur
            });
        });
    });
});

router.get('/list', function(req, res, next) {
    res.status(200).sendFile(__dirname +  '/view/users.html');
});
//S'occupe de la réservation d'un créneau pour un étudiant
router.get('/reservation/:id', function(req, res, next) {
    let token = req.cookies['token'];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    modelEtudiant.getGrpId(decodedToken["numeroEt"]).then((result)=>{
        modelEtudiant.changeCreneaux(req.params.id,result[0].idGroupe).catch(()=>{
            res.end("problème");
        })
    }).catch(()=>{
        res.end("problème");
    });
    res.writeHead(302, {'Location': '/users'});
    res.status(200).end();
});

module.exports = router;