const express = require('express');
const router = express.Router();
const fs = require('fs'); // Permet la lecture de fichier
const path = require('path'); // Permet la création de chemin absolu -> Evite de créer des problèmes de chemin entre les différentes OS
const passwordHash = require('password-hash'); // Permet le hashage du mot de passe
const db = require(path.join(__dirname, '../bin/bdd')); // Permet la connexion à la base de données
const jwt = require('jsonwebtoken'); // Permet l'encodage des tokens (+ sécurité)
const auth = require(path.join(__dirname, '../bin/auth')); // Permet la gestion de l'authentification de l'utilisateur

const modelEtudiant = require(path.join(__dirname, '../model/etudiant'));

// La clé nous permet de renfocer les mots de passes qui peuvent être considéré comme "faible"
//ici, le mot de passe "lapin" devient "96706546lapin"
var cle = "96706546"; // Il faudra sécuriser l'accès avec un fichier externe vérouillé

/* GET home page. */
router.get('/', function(req, res, next) {
    let identification_status = auth(req, res, next);
    if (identification_status === 2) { // Il n'est pas connecté
        fs.readFile(__dirname +  '/view/accueil/connexion.html', (err, template) => { //Page de connexion -> Utilisateur non connecté
            if (err)
                throw err;
            res.end(template)
        });
    } else if (identification_status === 0) { //C'est une étudiant
        res.writeHead(302, {'Location': '/users'}); //On le redirige vers la page d'accueil connecté (C'est elle qui différencie un admin et un étudiant)
        res.end();
    } else if (identification_status === 1) {
        res.writeHead(302, {'Location': '/admin'}); //On le redirige vers la page d'accueil connecté (C'est elle qui différencie un admin et un étudiant)
        res.end();
    } else {
        res.end("Une erreur est suvernue, vous n'avez pas de status d'identification valide"); //Faire une page d'erreur
    }
});

router.get('/inscrit', function(req, res, next) {
    fs.readFile(__dirname +  '/view/accueil/inscription.html', (err, template) => { //Page d'inscription -> Utilisateur non connecté
        if (err)
            throw err;
        //Gère l'affichage de l'inputPromo en fonction des promo dans la DB
        db.query("SELECT annee FROM promotion;",(err, result)=> {
            if (err) throw err;
            let text = '<option selected disabled>Choisi ta promo</option>'
            let string = JSON.parse(JSON.stringify(result))
            for (let promo of string) {
                text += '<option value=' + promo['annee'] + '>' + promo['annee'] + '</option> '
            }
            res.end(template.toString().replace('< option/>',text));

        })
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
    let mdp = passwordHash.generate(cle + req.query.inputMdp); //On va hasher le mot de passer, c'est à dire qu'on va faire plein de modification dessus pour qu'il en soit pas lisible ou facilement trouvable si jamais la base de données fuite
    let prenom = req.query.inputPrenom;
    let promo = req.query.selectPromo;

    modelEtudiant.create([numero, nom, prenom, mail, mdp, promo])
        .then((value) => {
            res.writeHead(302, {'Location': '/'});
            res.end("Terminé");
        })
        .catch(
            function () {
                console.log("Une erreur est survenue dans la fonction");
                res.end("ssaussure");
            }
        );
    //res.end("J'ai fini"); //Retourner une page d'inscription terminée
});

/*
Gérer la redirection de l'utilisateur en fonction de ce qui a été capté :
    - Adresse mail non reconnue (On utilise plutôt le numéro étudiant parce que c'est notre clé primaire ?)
    - Mauvais mot de passe
    - Utilisateur connecté
    - Ce système ne permet que la connexion par la base de données, c'est à dire pour les étudiants
 */
router.get("/connexion", (req, res, next) => {
    //Faudra trouver un moyen plus secure de faire ça hein
    let mdpAdmin = passwordHash.generate(cle + "secure");
    let mailAdmin = "mail@admin.fr";

    let mail = req.query.Email;
    let mdp = cle + req.query.mdp;

    if (mailAdmin === mail && passwordHash.verify(mdp, mdpAdmin)) {
        let token = jwt.sign({
                rang_utilisateur: 1, //On lui donne le rang d'un admin
                numeroEt: -1 //On lui donne comme numéro étudiant -1 pour éviter que cela génère une erreur lors de l'appel
            },
            'RANDOM_TOKEN_SECRET', //A changer lors du passage en production et à sécuriser pour ne pas l'afficher en clair
            { expiresIn: '24h' });
        res.cookie('token', token, {httpOnly: true});
        res.writeHead(302, {'Location': '/'}); //On le retourne vers la page d'accueil admin
        res.status(200).end("");
    }

    let sql = "SELECT `numero` ,`motDePasse` FROM `etudiants` WHERE mail=?";
    let values = [mail];
    db.query(sql, values, (err, result) => {
        if (err)
            throw err;
        if (result[0] == null ) {
            res.end("Mail inexistant"); //Adresse mail inexistante
        } else if (passwordHash.verify(mdp, result[0].motDePasse)) {
            let token = jwt.sign({
                rang_utilisateur: 0, //On lui donne le rang d'un étudiant
                numeroEt: result[0].numero
            },
            'RANDOM_TOKEN_SECRET', //A changer lors du passage en production et à sécuriser pour ne pas l'afficher en clair
                { expiresIn: '24h' });
            res.cookie('token', token, {httpOnly: true});
                res.writeHead(302, {'Location': '/'});
                res.status(200).end("Connecté");
        } else {
            res.end("Erreur de mot de passe"); //Il a un problème de mot de passe
        }

    });
});

/*
Fonction permettant la deconnexion et la redirection de l'utilisateur vers la page de connexion
 */
router.get('/deconnexion', (req, res, next) => {
    res.clearCookie("token");
    res.writeHead(302, {'Location': '/'});
    res.status(200).end();
});

module.exports = router;