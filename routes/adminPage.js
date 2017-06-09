/**
 * Created by itdwyy on 6/9/2017.
 */
var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    if(req.user){
        for(var n in req.user){
            console.log(n+" "+req.user.n);
        }
        res.render('adminPage',{pageData:{username:req.user.username}});
    }else {
        res.redirect('../login')
    }
});

module.exports = router;