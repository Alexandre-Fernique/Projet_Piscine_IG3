var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({path: __dirname + '/process.env'});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var GroupeRouter = require('./routes/groupe');
var adminEventRouter = require("./routes/admin_event");
var adminRouter = require("./routes/admin");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cette partie est utile dans l'URL pour le premier appel et savoir vers quel routeur il va rediriger
// C'est similaire au routeur qui redirige l'utilisateur vers le bon controlleur
// www.exemple.fr/user
app.use('/', indexRouter); //localhost:3000/
app.use('/users', usersRouter); //localhost:3000/users
app.use('/creerGroupe', GroupeRouter); //localhost:3000/creerGroupe
app.use('/admin/evenement', adminEventRouter); //localhost:3000/admin/evenement
app.use('/admin', adminRouter); //localhost:3000/admin

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
