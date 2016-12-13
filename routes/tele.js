/**
 * Created by itdwyy on 12/13/2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('tele', { title: 'telephone' });
});

module.exports = router;