var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).sendFile(__dirname +  '/view/index.html');
    //res.render('index', { title: 'Express' }); -> Si on veut utiliser pug
});

module.exports = router;
