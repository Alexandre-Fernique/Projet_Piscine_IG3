const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require (path.join(__dirname, '../bin/auth'));
const jwt = require('jsonwebtoken');

const modelEtudiant = require(path.join(__dirname, '../model/etudiant'));

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
            fs.readFile(__dirname + '/view/header.html', (err, header) => {
                if (err)
                    throw err;
                let token = req.cookies['token'];
                const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                modelEtudiant.get("prenom,anneePromo", decodedToken["numeroEt"]).then( (requete) => {
                    //On ajoute Bonjour, <Prénom> dans l'entête
                    let headerPerso = header.toString().replace('%NOM%', requete[0].prenom);
                    //On ajoute l'entête dans notre page
                    let accueil = template.toString().replace('<header>%</header>', headerPerso);
                    //console.log(template.toString());
                    //requete SQL des créneaux en fonction de la promo
                    modelEtudiant.getEvent(requete[0].anneePromo).then((listEvent)=>{
                        const tampon =JSON.parse(JSON.stringify(listEvent))
                        let resultat='<script>let liste=[';
                        for(let event of tampon)
                        {
                            let data={
                                id: event.id,
                                title: event.salle,
                                start: event.date.split("T")[0] +"T"+event.heureDebut,
                            }
                            resultat+= JSON.stringify(data)+","
                        }
                        resultat=resultat.substring(0,resultat.length-1)+'];let duree ="'+tampon[0].dureeCreneau.substring(0,5)+'";</script>'
                        res.end(accueil.replace('<lesevents></lesevents>',resultat))
                        //ajout à la page html la liste des creneaux et la durée générale de tout les créneaux

                    }).catch(()=>{
                        console.log("Problème event");
                    })

                }).catch( () => {
                    console.log("Problème");
                    res.end("Huston on a un problème"); // Faire une page d'erreur
                });
            });
        });
    } else if (rang_utilisateur === 1) { // C'est l'administrateur
        fs.readFile(__dirname +  '/view/Admin/index.html', (err, template) => { //Page d'accueil -> administrateur connecté
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
/*
router.get('/reservation', function(req, res, next) {
    res.status(200).sendFile(__dirname +  '/view/users.html');
});*/

module.exports = router;