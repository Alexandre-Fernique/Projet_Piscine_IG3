var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

    fs.readFile(__dirname +  '/view/index.html', (err, template) => {
        if (err)
            throw err;
        fs.readFile(__dirname +  '/view/header.html', (err, header) => {
            if (err)
                throw err;
            const html = template.toString().replace("<header>%</header>", header.toString());
            res.end(html);
        });
    });

    //res.status(200).sendFile(__dirname +  '/view/index.html'); -> Pour envoyer un fichier html
    //res.render('index', { title: 'Express' }); -> Si on veut utiliser pug
});

module.exports = router;
