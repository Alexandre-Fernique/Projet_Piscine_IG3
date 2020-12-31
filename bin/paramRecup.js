/*
* Cette fonction va permettre au développeur de ne pas se soucier de si les données sont passées en GET ou en POST
* Le fonction va rechercher le paramètre dans l'url de la requête (GET) puis les retourner s'il y en a
* Sinon elle va le rechercher dans le corps de la requête (POST) puis les retourner
* Et si rien de tout ça ne marche, elle va retourner Vide
*/

/*
req est la requête dans laquelle il faut rechercher le paramètre
param est le paramètre qu'il faut rechercher
 */
module.exports = (req, para) => {
    if (req.query[para]) {
        return req.query[para];
    } else {
        return req.body[para]; //Il retournera vide si le paramètre n'existe pas
    }
}