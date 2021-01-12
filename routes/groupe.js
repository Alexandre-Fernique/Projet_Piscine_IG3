const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require(path.join(__dirname, '..', 'bin', 'bdd'));
const auth = require (path.join(__dirname, '../bin/auth'));
const jwt = require('jsonwebtoken');
const recupParam = require(path.join(__dirname, '..', 'bin', 'paramRecup'));
const modelEtudiant = require(path.join(__dirname, '../model/etudiant'));
const modelGroup = require(path.join(__dirname,'../model/groupeprojet'));
const modelProf = require(path.join(__dirname,'../model/professeur'));
const modelComposer = require(path.join(__dirname,'../model/composer'));

router.all('/', (req, res, next) => { //Page d'accueil utilisateur
    let rang_utilisateur = auth(req, res, next);
    if (rang_utilisateur === 0) { // C'est un étudiant
        fs.readFile(__dirname + '/view/User/creerGroupe.html', (err, template) => { //Page d'accueil -> étudiant connecté -> CreerGroupe
            if (err)
                throw err;
            fs.readFile(__dirname + '/view/header.html', (err, header) => {
                if (err)
                    throw err;
                let token = req.cookies['token'];
                const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                modelEtudiant.get("prenom", decodedToken["numeroEt"]).then((requete) => {
                    //On ajoute Bonjour, <Prénom> dans l'entête
                    let headerPerso = header.toString().replace('%NOM%', requete[0].prenom);
                    //On ajoute l'entête dans notre page
                    let groupe = template.toString().replace('<header>%</header>', headerPerso);
                    //console.log(template.toString());
                    modelEtudiant.get("anneePromo",decodedToken["numeroEt"]).then((annee)=>{
                        let sql = "SELECT `nom` FROM `etudiants` WHERE anneePromo ='"+ annee[0].anneePromo +"';";
                        db.query(sql,(err, result)=> {
                            if (err) throw err;
                            let text = '<option selected disabled> Etudiants </option>'
                            let string = JSON.parse(JSON.stringify(result))
                            for (let etudiant of string) {
                                text += '<option value=' + etudiant['nom'] + '>' + etudiant['nom'] + '</option> ';
                            }
                            res.end(result.toString().replace('<option/>', text));
                        });
                    });
                    res.end(groupe);
                }).catch(() => {
                    console.log("Problème");
                    res.end("On a un problème"); // Faire une page d'erreur
                });
            });
        });
    }
});

router.all("/created", (req, res, next) => {
    let nomTuteurEntreprise= recupParam(req,"nomTuteurEntreprise");
    let nomEntreprise= recupParam(req,"nomEntreprise");
    let prenomTuteurEntreprise = recupParam(req,"prenomTuteurEntreprise");
    let nom=recupParam(req,"nomT");
    let prenom=recupParam(req,"prenomT");
    modelProf.getProfId(nom,prenom).then(value =>{
        console.log(value);
        if (value.length==0){
            console.log("Erreur");
            res.end("")
        }else{
            modelGroup.create([nomTuteurEntreprise,prenomTuteurEntreprise,nomEntreprise,value[0].id]).then((values) => {
                modelGroup.select(nomTuteurEntreprise).then((tuteur)=>{
                    let token = req.cookies['token'];
                    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                    modelComposer.create([tuteur[0].id,decodedToken["numeroEt"]]).then((requete)=>{
                        console.log(requete);
                        res.writeHead(302, {'Location': '/users'});
                        res.end("end");
                    });
                });
            }).catch(function () {
                console.log("Une erreur est survenue dans la fonction");
                res.end("");
            });
        }
    });
});

module.exports = router;