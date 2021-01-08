const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const admin = require(path.join(__dirname, '..', 'model', 'admin'));
const auth = require (path.join(__dirname, '..', 'bin', 'auth'));
const jwt = require('jsonwebtoken');
const htmlspecialchars = require('htmlspecialchars');

router.get('/', (req, res, next) => {
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    }
    //Page d'accueil administrateur
    fs.readFile(path.join(__dirname, "view/Admin/index.html"), (err, template) => {
        if (err)
            throw err;
        fs.readFile(path.join(__dirname, "view/Admin/header.html"), (err, header) => {
            let accueil = template.toString().replace('<header>%</header>', header.toString());
            if (err)
                throw err;
            let token = req.cookies['token'];
            const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
            admin.get("prenom,anneePromo", -1).then( (requete) => {
                //On ajoute Bonjour, <Prénom> dans l'entête
                let headerPerso = header.toString().replace('%NOM%', htmlspecialchars(requete[0].prenom));
                //On ajoute l'entête dans notre page
                let accueil = template.toString().replace('<header>%</header>', headerPerso);
                //console.log(template.toString());
                //requete SQL des créneaux en fonction de la promo
                admin.getEvent().then((listEvent) => {
                    //convertit en JSON le resultat de la requete SQL
                    const tampon = JSON.parse(JSON.stringify(listEvent))
                    //initialise la balise script contenant tout les events du calendrier
                    let resultat = '<script>let liste=[';
                    let now="";
                    for (let event of tampon) {
                        let data ={};
                        //Si le créneau a été réservé par un groupe
                        if(event.idGroupeProjet==null){
                            data = {
                                id: event.id,
                                title: event.salle+" Non Réservé",
                                color:"#c60075",
                                start: event.date.split("T")[0] + "T" + event.heureDebut,
                                end: event.date.split("T")[0] + "T" + event.heureDebut,
                                classNames:"event-display",
                            };
                            now=event.date.split("T")[0];
                        }
                        //Si le créneau n'a pas été réservé par un groupe
                        else if(event.idGroupeProjet!=null){
                            data = {
                                id: event.id,
                                title: event.salle+" Réservé",
                                color:"#343a40",
                                start: event.date.split("T")[0] + "T" + event.heureDebut,
                                end: event.date.split("T")[0] + "T" + event.heureDebut,
                                classNames:"event-display",
                            };
                        }
                        resultat += JSON.stringify(data) + ","
                    }
                    resultat = resultat.substring(0, resultat.length - 1) + '];let duree ="' + tampon[0].dureeCreneau.substring(0, 5) + '";let now="'+now+'";</script>'
                    res.end(accueil.replace('<lesevents></lesevents>', resultat))
                    //ajout à la page html la liste des creneaux et la durée générale de tout les créneaux
                }).catch(() => {
                    console.log("Problème event ou groupe");
                    //Si l'étudiant n'a pas de groupe ou erreur dans la requête SQL des events
                    res.end(accueil.replace("<div id='calendar'></div>",'<h1>Veuillez creer un groupe</h1>').replace('href="/creerGroupe"','href="/creerGroupe" style="color:red;animation: blink 2s infinite;"'));
                })
            }).catch(() => {
                console.log("Problème get Idprojet");
            })
        res.end(accueil.toString());
        })
    })
});

router.get('/evenement', (req, res, next) => { // On délègue la gestion des évenements à un routeur à part
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    }
    res.writeHead(302, {'Location': '/admin/evenement/list'});
    res.status(200).end();
});

module.exports = router;