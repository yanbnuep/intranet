var express = require('express');
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var sql = require('mssql');
var dbconfig = require('./databaseConfig');

var router = express.Router();



module.exports = function(passport){
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        sql.connect(dbconfig,function (err) {
            if(err) throw err;
            try{
                new sql.Request().query('SELECT * FROM [INTRANET].[dbo].[intranetUsers] WHERE id = \''+id+ '\'',function (err,rows) {
                    done(null,rows[0])
                })
            }catch (err){
                if(err) throw err;
            }
        });

    });
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function (req,username,password,done) {// callback with email and password from our form
        sql.connect(dbconfig,function (err) {

            try {
                new sql.Request().query('SELECT * FROM [INTRANET].[dbo].[intranetUsers] WHERE login = \''+username+ '\'',function (err,rows) {
                    if(err){
                        return done(err)
                    }
                    if(!rows.length){
                        return done(null,false,req.flash('loginMessage','no user found'))//req.flash is the way to set flashdata using connect-flash
                    }
                    //if the user is found but the password is wrong
                    // if(!bcrypt.compareSync(passport,rows[0].password)){
                    //     return done(null,false,req.flash('loginMessage','Oops! Wrong password.'))// create the loginMessage and save it to session as flashdata
                    // }
                    if(password.trim() !== rows[0].password.trim()){
                        return done(null,false,req.flash('loginMessage','Oops! Wrong password.'))// create the loginMessage and save it to session as flashdata
                    }
                    return done(null,rows[0])

                })
            }catch (e){
                console.log('error in login'+e);
            }
        })
    }))
}
