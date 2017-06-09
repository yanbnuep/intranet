var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var pug = require('pug');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var routes = require('./routes/index');
var tele = require('./routes/tele');
var db = require('./routes/db');
var updateNews = require('./routes/updateNews');
var searchPage = require('./routes/search');
var adminPage = require('./routes/adminPage');

var flash    = require('connect-flash');
var app = express();



app.use(express.static(path.join(__dirname, 'public')));
require('./routes/users')(passport); // pass passport for configuration
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/news', express.static(path.join(__dirname, 'testDB')));
app.use('/images', express.static(path.join(__dirname,'public/img/news/img/test')));
app.use(session({
    secret: 'intranetisrunning',
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.use('/', routes);


app.use('/db',db);
app.use('/tele',tele);
app.use('/updateNews',updateNews);
app.use('/search',searchPage);
app.get('/login',function (req,res,next) {
    res.render('login');
});
app.post('/login',passport.authenticate('local-login',{
    successRedirect : '/adminPage', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}),function (req,res) {

    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    res.redirect('/');
    }
);

app.use('/adminPage',adminPage);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
