const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require (path.join(__dirname, '..', 'bin', 'auth'));
const jwt = require('jsonwebtoken');
const htmlspecialchars = require('htmlspecialchars');

router.get('/', (req, res, next) => {
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    } else {
        //Page d'accueil administrateur
        fs.readFile(path.join(__dirname, "view/Admin/index.html"), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, "view/Admin/header.html"), (err, header) => {
                let accueil = template.toString().replace('<header>%</header>', header.toString());
                if (err)
                    throw err;
                res.end(accueil.toString());
            })
        });
    }
});

router.get('/evenement', (req, res, next) => { // On délègue la gestion des évenements à un routeur à part
    if (auth(req, res, next) !== 1) {
        res.end("T'as rien à faire là ");
    } else {
        res.writeHead(302, {'Location': '/admin/evenement/list'});
        res.status(200).end();
    }
});


module.exports = router;