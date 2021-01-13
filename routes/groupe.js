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
                        let sql = "SELECT `nom` , `prenom`, `numero` FROM `etudiants` WHERE anneePromo ='"+ annee[0].anneePromo +"';";
                        db.query(sql,(err, result)=> {
                            if (err) throw err;
                            let text = '<script>let etu=`<option selected disabled value=""> Etudiants </option>'
                            let string = JSON.parse(JSON.stringify(result))
                            for (let etudiant of string) {
                                text += '<option value="' + etudiant['numero'] +'" >' + etudiant['nom'] +' '+ etudiant['prenom']+ '</option> ';
                            }
                            console.log(text);
                            console.log(result.toString().replace('<etudiant></etudiant>', text+"`</script>"));
                            res.end(groupe.toString().replace('<etudiant></etudiant>', text+"`</script>"));
                        });
                    });
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
    let nomTuteur= recupParam(req,"nomT");
    let listeNumEtu = recupParam(req,"nom");
    console.log("Mes étudiants :" + listeNumEtu);
    if (typeof listeNumEtu === "string")
        listeNumEtu = [listeNumEtu]
    let listEtudiant = [];
    for(let i = 0; i < listeNumEtu.length; ++i){
        let numeroEtu = listeNumEtu[i];
        listEtudiant.push(numeroEtu);
    }
    console.log("Liste d'étudiant à push: " + listEtudiant);
    //Il faut faire que, peut importe le prénom, on ai : prenom nom (ex: Anne-laure Villaret)
    let prenomProf = nomTuteur.split(" ")[0]; // On récupère le prénom d'un prof ici, pas l'identifiant
    let nomProf = nomTuteur.split(" ")[1] //Ici on récupère le nom
    modelProf.getProfId(nomProf, prenomProf)
        .then((infoProf) => {
            let idProf = infoProf[0].id;
            modelGroup.create([nomTuteurEntreprise,prenomTuteurEntreprise,nomEntreprise,idProf])
                .then((values) => { // Pour la création, on lui passe un tableau qui contient toutes les valeurs et pas toutes les valeurs une par une
                    let token = req.cookies['token'];
                    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

                    console.log("on passe par là");
                    
                    listEtudiant.push(decodedToken["numeroEt"]); //Cette fonction retourne ce qu'on vient d'insrérer, il faut fonc le faire avant
                    let idGroupe = values[0].id;
                    modelComposer.create(idGroupe, listEtudiant)
                        .then((requete)=>{
                            console.log("par la aussi ");
                            console.log(requete);
                            res.writeHead(302, {'Location': '/users'});
                            res.end("end");
                        })
                        .catch(function (){
                            console.log("liaison etudiants groupe");
                            res.end("ETUDIANTS GROUPE")
                        });
                })
                .catch(function () {
                    console.log("création groupe");
                    res.end("");
            });
        })
        .catch((errProf) => {
            console.log(errProf);
            fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                content = content.toString().replace('<header>%</header>', "");
                res.end(content);
            });
        });
});

router.all("/test", (req, res, next) => {
    modelProf.getProfId("Villaret", "Anne-laure")
        .then((values) => {
            console.log(values)
            res.end("ok")
        })
        .catch((err) => {
            console.log(err)
            res.end("ko")
        })
})


module.exports = router;