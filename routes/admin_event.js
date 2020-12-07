const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
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
router.get('/list', (req, res, next) => { //Afficher le détail de l'évenement
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    }
    fs.readFile(path.join(__dirname, "view/Admin/evenement/detail.html"), (err, template) => {
        if (err)
            throw err;

        modelEvenement.getAll()
            .then((data) => {
                console.log(data[0].dateDebut);
                template = miseAJourPage(template, data[0]);
                //template = template.toString().replace('disabled', ''); Pour la modification de l'événement, si on utilise la même page hmtl
                res.end(template);
            })
            .catch((err) => {
                throw err; //Pour le moment on stoppe tout et on génère une erreur
            })
    });
});

router.get('/update', (req, res, next) => { //Afficher le détail de l'évenement
    if (auth(req, res, next) !== 1) {
        res.end("Tu n'as rien à faire là");
    }
    fs.readFile(path.join(__dirname, "view/Admin/evenement/detail.html"), (err, template) => {
        if (err)
            throw err;

        modelEvenement.getAll()
            .then((data) => {
                template = miseAJourPage(template, data[0]);
                template = template.toString().replace(new RegExp('readonly', 'gi'), ''); //On enlève tous les readonly
                template = template.toString().replace('class = "center" hidden', 'class = "center"');
                template = template.toString().replace('action="#"', 'action="/admin/evenement/updated"');
                res.end(template);
            })
            .catch((err) => {
                throw err; //Pour le moment on stoppe tout et on génère une erreur
            })
    });
});

router.get('/updated', (req, res, next) => {
    if (auth(req, res, next) !== 1) {
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
    modelEvenement.create([nomEvent, "2020-11-17", Duree, "2020-11-15", dureeCreneau, nombreMembresJury, anneePromo, id])
        .then((retour) => {
            console.log(retour);
            res.end("C'est bon");
        })
        .catch(
            function () {
                console.log("Une erreur est survenue dans la fonction");
                res.end("ssaussure");
            }
        );
});

module.exports = router;