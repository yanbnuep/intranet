/**
 * Created by itdwyy on 1/16/2017.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('uploadNews', { title: 'Intranet' });
});

module.exports = router;