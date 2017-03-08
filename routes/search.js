/**
 * Created by itdwyy on 3/7/2017.
 */
var express = require('express');
var router = express.Router();

var sql = require('mssql');

var config = {
    user: 'ian',
    password: 'airmacau',
    server: '192.168.110.70',
    database: 'INTRANET'
};

router.get('/', function (req, res, next) {
    getSearchResult(req.query.val,function (json) {
        res.render('search', {title: 'search'});
    });

});

function getSearchResult(searchVal,callback) {
    var selectInfo = '[EMPLID],[DEPT],[DIV],[NAME],[PREFER],[JOBTITLE],[BUSNPHONE],[EMAIL],[OFFICE],[JOB_LEVEL]';
    sql.connect(config,function (err) {
        try{
            new sql.Request().query('SELECT '+selectInfo+' FROM [INTRANET].[dbo].[TEL_ORDER_VW] where PREFER LIKE ')
        }catch(e){}
    })
}



module.exports = router;