var express = require('express');
var router = express.Router();
const fs = require('fs');
var passwordHash = require('password-hash');
var db = require(__dirname + "/../bin/bdd");

// La clé nous permet de renfocer les mots de passes qui peuvent être considéré comme "faible"
//ici, le mot de passe "lapin" devient "96706546lapin"
var cle = "96706546";
/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readFile(__dirname +  '/view/accueil/connexion.html', (err, template) => { //Page de connexion -> Utilisateur non connecté
        if (err)
            throw err;
        res.end(template)
    });
});

router.get('/inscrit', function(req, res, next) {
    fs.readFile(__dirname +  '/view/accueil/inscription.html', (err, template) => { //Page d'inscription -> Utilisateur non connecté
        if (err)
            throw err;
        res.end(template)
    });
});

/*
On ne vérifie pas la mdp et la confirmation mdp (à faire)
Faire une redirection vers une page correcte quand la création est faite
Rediriger vers une page d'erreur si jamais il y a un problème:
    - Numéro étudiant incorrect
    - adresse mail pas correct (Pas mail étudiant ?)
    - (Il faut proposer uniquement les promotions qui sont disponibles)
    - Gérer si l'utilisateur à déjà un compte avec ce numéro étudiant
 */
router.get("/inscription", (req, res, next) => {
    //req.query -> Récupérer dans l'url
    //req.body -> Récupérer en POST (Dans le corps de la requête)
    //req.method -> Connaitre la méthode utilisée
    let numero = req.query.numeroEt;
    let nom = req.query.inputNom;
    let mail = req.query.inputEmail;
    //Pour le mot de passe "qsd" (entré par l'utilisateur), on obtient le hash suivant : sha1$f83e199e$1$91fb956a0417ad5a1726e19c37b046f2f7582324
    let mdp = passwordHash.generate(cle +req.query.inputMdp); //On va hasher le mot de passer, c'est à dire qu'on va faire plein de modification dessus pour qu'il en soit pas lisible ou facilement trouvable si jamais la base de données fuite
    let prenom = req.query.inputPrenom;
    let promo = req.query.selectPromo;
    //On fait une requête préparée (Elle permet de contrer les injections SQL)
    //Par la fonction query les '?' vont être remplacés par les valeurs du tableau (2è argument), ici values
    let sql = "INSERT INTO `etudiants` (`numero`, `nom`, `prenom`, `mail`, `motDePasse`, `anneePromo`) VALUES (?, ?, ?, ?, ?, ?);";
    let values = [numero, nom, prenom, mail, mdp, promo];
    db.query(sql, values, (err, result) => {
        if (err)
            throw err;
        console.log(result);
    });
    res.end("J'ai fini"); //Retourner une page d'inscription terminée
});

/*
Gérer la redirection de l'utilisateur en fonction de ce qui a été capté :
    - Adresse mail non reconnue (On utilise plutôt le numéro étudiant parce que c'est notre clé primaire ?)
    - Mauvais mot de passe
    - Utilisateur connecté
 */
router.get("/connexion", (req, res, next) => {
    let mail = req.query.Email;
    //console.log("MON MAIL : " + mail);
    let mdp = cle + req.query.mdp;
    //console.log(mdp);
    //let mdp = req.query.mdp;
    let sql = "SELECT `motDePasse` FROM `etudiants` WHERE mail=?";
    let values = [mail];
    db.query(sql, values, (err, result) => {
        if (err)
            throw err;
        if (result[0] == null ) {
            res.end("mail"); //Adresse mail inexistante
        } else if (passwordHash.verify(mdp, result[0].motDePasse)) {
            res.end("Connecté"); //L'utilisateur est connecté
        } else {
            res.end("Erreur de mot de passe"); //Il a un problème de mot de passe
        }

    });
});

module.exports = router;
