/**
 * Created by itdwyy on 6/1/2017.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;


passport.use(new Strategy(function (username,password) {
    
}))

router.get('/',function (req,res,next) {
    res.render('login');
})


module.exports = router;