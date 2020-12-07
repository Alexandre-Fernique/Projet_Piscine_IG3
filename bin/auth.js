const jwt = require("jsonwebtoken");

/*
Cette fonction lit le token dans les cookies et retourne le rang de l'utilisateur
0 -> L'utilisateur est un étudiant
1 -> Il s'agit de l'admistrateur
2 -> Erreur dans la lecture du Token
 */
module.exports = (req, res, next) => {
    // On récupère le token qu'on avait mis dans nos cookies
    let token = req.cookies['token']; // jwt must be provided peut être généré si le token n'existe pas
    if ( ! token) // Si le token est vide
        return 2;
    else {
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        return decodedToken.rang_utilisateur; // Retourne 1 ou 2 qui est le rang de l'utilisateur
    }
};