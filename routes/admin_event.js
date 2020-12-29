const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require(path.join(__dirname, '../bin/bdd')); // Permet la connexion à la base de données
const auth = require (path.join(__dirname, '../bin/auth'));
const jwt = require('jsonwebtoken');
const htmlspecialchars = require('htmlspecialchars');

const modelEvenement = require(path.join(__dirname, '../model/evenement'));


function miseAJourPage (template, donnee) {
    let dateDebut = new Date(String(donnee.dateDebut));
    let mois = dateDebut.getMonth()+1;
    donnee.dateDebut = dateDebut.getFullYear() + "-" + mois + "-" + dateDebut.getDate();

    let dateLimiteResa = new Date(String(donnee.dateLimiteResa));
    let mois2 = dateLimiteResa.getMonth()+1;
    donnee.dateLimiteResa = dateLimiteResa.getFullYear() + "-" + mois2 + "-" + dateLimiteResa.getDate();

    template = template.toString().replace('%id%', htmlspecialchars(donnee.id));
    template = template.toString().replace('%dateDebut%', htmlspecialchars(donnee.dateDebut));
    template = template.toString().replace(new RegExp('%nomEvent%', 'gi'), htmlspecialchars(donnee.nom));
    template = template.toString().replace('%Duree%', htmlspecialchars(donnee.Duree));
    template = template.toString().replace('%dateLimiteResa%', htmlspecialchars(donnee.dateLimiteResa));
    template = template.toString().replace('%dureeCreneau%', htmlspecialchars(donnee.dureeCreneau));
    template = template.toString().replace('%nombreMembresJury%', htmlspecialchars(donnee.nombreMembresJury));
    template = template.toString().replace('%anneePromo%', htmlspecialchars(donnee.anneePromo));
    return template;
}

router.get('/create', (req, res, next) => { //Création de l'évenement
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    }
    console.log("OK");
    fs.readFile(path.join(__dirname, "view/Admin/evenement/creationEvenement.html"), (err, template) => {
        if (err)
            throw err;
        fs.readFile(path.join(__dirname, "view/Admin/header.html"), (err, header) => {
            let accueil = template.toString().replace('<header>%</header>', header.toString());
            res.end(accueil)
        });    
    });
});

router.get('/created', (req, res, next) => { 
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    }
    let nomEvent = req.query.nomEvent;
    let dateDebut = req.query.dateDebut;
    let Duree = req.query.Duree;
    let dateLimiteResa = req.query.dateLimiteResa;
    let dureeCreneau = req.query.dureeCreneau;
    let nombreMembresJury = req.query.nombreMembresJury;
    let anneePromo = req.query.anneePromo;

    let sql = "SELECT * FROM `evenements` WHERE nom='"+nomEvent+"' && anneePromo='"+anneePromo+"';";
    db.query(sql, (err, row) => {    
        if (err) throw err;
        if (row && row.length ) {
            console.log('Evenement existe déjà dans la base de données!');
            let alert = require('alert');  
            alert("L'évenement "+ nomEvent +" concernant la promo "+ anneePromo +" existe déjà !")
            res.writeHead(302, {'Location': '/admin/evenement/create'});
            res.end();
        } else {
            modelEvenement.create([nomEvent ,dateDebut, Duree, dateLimiteResa, dureeCreneau, nombreMembresJury, anneePromo])
                .then((retour) => {
                    console.log(retour);
                    res.writeHead(302, {'Location': '/admin/evenement/list'}); //On le redirige vers la vue de cet évenement
                    res.end();
                })
                .catch(
                    function () {
                        console.log("Une erreur est survenue dans la fonction");
                        res.end("ssaussure");
                    }
                );
        }
    });
});


router.get('/list', (req, res, next) => { //Afficher le détail de l'évenement
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    }
    fs.readFile(path.join(__dirname, "view/Admin/evenement/detail.html"), (err, template) => {
        if (err)
            throw err;
        fs.readFile(path.join(__dirname, "view/Admin/header.html"), (err, header) => {
            let accueil = template.toString().replace('<header>%</header>', header.toString());
            modelEvenement.getAll()
                .then((data) => {
                    console.log("data : " + data.length > 0);
                    if (data.length > 0) {
                        accueil = miseAJourPage(accueil, data[0]);
                        //template = template.toString().replace('disabled', ''); Pour la modification de l'événement, si on utilise la même page hmtl
                        res.end(accueil);
                    }
                    else {
                        fs.readFile(path.join(__dirname, "view/Admin/evenement/pasEvenement.html"), (err, content) => {
                            res.end(content);
                        });
                    }
                })
                .catch((err) => {
                    throw err; //Pour le moment on stoppe tout et on génère une erreur
                })
        });
    });
});

router.get('/update', (req, res, next) => { //Afficher le détail de l'évenement
    if (auth(req, res, next) !== 1) {
        res.end("Tu n'as rien à faire là");
    }
    fs.readFile(path.join(__dirname, "view/Admin/evenement/update.html"), (err, template) => {
        if (err)
            throw err;
        fs.readFile(path.join(__dirname, "view/Admin/header.html"), (err, header) => {
            if (err)
                throw err;
            let accueil = template.toString().replace('<header>%</header>', header.toString());
            modelEvenement.getAll()
                .then((data) => {
                    modelEvenement.getAllPromotion()
                        .then((listePromotion) => {
                            let txt = ""; let promo;
                            for (let i = 0; i < listePromotion.length; i ++) {
                                promo = listePromotion[i].annee;
                                if (promo === data[0].anneePromo) {
                                    txt += "<option value = \"" + promo + "\" selected>" + promo +"</option>";
                                } else {
                                    txt += "<option value = \"" + promo + "\">" + promo +"</option>"
                                }
                                txt += "\n";
                            }
                            accueil = accueil.toString().replace("%option%", txt);
                            accueil = miseAJourPage(accueil, data[0]);
                            res.end(accueil);
                        })
                })
                .catch((err) => {
                    throw err; //Pour le moment on stoppe tout et on génère une erreur
                })
        });
    });
});

router.get('/updated', (req, res, next) => {
    if (auth(req, res, next) !== 1) { //On test si la personne qui tente de rentrer est un administrateur
        res.end("Tu n'as rien à faire là");
    }
    let id = req.query.id;
    let nomEvent = req.query.nomEvent;
    let dateDebut = req.query.dateDebut;
    let Duree = req.query.Duree;
    let dateLimiteResa = req.query.dateLimiteResa;
    let dureeCreneau = req.query.dureeCreneau;
    let nombreMembresJury = req.query.nombreMembresJury;
    let anneePromo = req.query.anneePromo;
    modelEvenement.update([nomEvent, dateDebut, Duree, dateLimiteResa, dureeCreneau, nombreMembresJury, anneePromo, id])
        .then((retour) => {
            console.log(retour);
            res.writeHead(302, {'Location': '/admin/evenement/list'}); //On le redirige vers la vue de cet évenement
            res.end();
        })
        .catch(
            function () {
                console.log("Une erreur est survenue dans la fonction");
                res.end("ssaussure");
            }
        );
});

router.get("/delete", (req, res, next) => {
    if (auth(req, res, next) !== 1) { //On test si la personne qui tente de rentrer est un administrateur
        res.end("Tu n'as rien à faire là");
    }
    const modelCreneaux = require(path.join(__dirname, '../model/creneaux'));
    const modelParticipe = require(path.join(__dirname, '../model/participe'));
    const modelgroupeProjet = require(path.join(__dirname, '../model/participe'));
    const modelComposer = require(path.join(__dirname, '../model/participe'));
    modelParticipe.truncate()
        .then((pa) => {
            console.log("Participe : " + pa)
            modelCreneaux.truncate()
                .then((ev) => {
                    console.log("Creneaux : " + ev)
                    modelEvenement.truncate()
                        .then((cr) => {
                            console.log("Evenement : " + cr)
                            //TODO ?
                        })
                        .catch((err) => {
                            console.log("Une erreur dans le truncate des événements");
                            res.end(err);
                        })
                })
                .catch((err) => {
                    console.log("Une erreur dans le truncate des créneaux");
                    res.end(err);
                });
        })
        .catch((err) => {
            console.log("Une erreur dans le truncate de participe (Créneaux / Prof)");
            res.end(err);
        })
    modelComposer.truncate()
        .then((com) => {
            console.log("Composer : " + com)
            modelgroupeProjet.truncate()
                .then((pr) => {
                    console.log("Groupe Projet : " + pr)
                    //TODO ?
                })
                .catch((err) => {
                    console.log("Une erreur dans le truncate des groupeprojet");
                    res.end(err);
                })
        })
        .catch((err) => {
            console.log("Une erreur dans le truncate des Composer (Etudiants / groupeprojet)");
            res.end(err);
        })
    res.end("événement supprimé");
});

module.exports = router;