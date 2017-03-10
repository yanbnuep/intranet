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
        console.log(json);
        res.render('search', {title: 'search',message:json});
    });

});

function getSearchResult(searchVal,callback) {
    var selectInfo = '[EMPLID],[DEPT],[DIV],[NAME],[PREFER],[JOBTITLE],[BUSNPHONE],[EMAIL],[OFFICE],[JOB_LEVEL]';
    var name = String(searchVal).replace(/\W|\d/g,'').toUpperCase();
    var phone = String(searchVal).replace(/\D/g,'');
    var queryStr = '';
    var tableName = '[INTRANET].[dbo].[TEL_ORDER_VW]';
    sql.connect(config,function (err) {
        try{
            if(name.length && !phone.length) {
                queryStr = 'SELECT ' + selectInfo+' FROM '+tableName +
                    '\n WHERE CHARINDEX(\''+name+'\',REPLACE( UPPER(PREFER),\' \',\'\'))=1 '+
                    '\n OR CHARINDEX(\''+name+'\',REPLACE( UPPER(NAME),\' \',\'\'))>=1'+
                    '\n ORDER BY CHARINDEX(\''+name+'\',REPLACE( UPPER(PREFER),\' \',\'\')) + CHARINDEX(\''+name+'\',REPLACE( UPPER(NAME),\' \',\'\')) ASC';
            }
            else if(!name.length && phone.length){
               queryStr = 'SELECT '+selectInfo+' FROM '+tableName+
                       '\n WHERE REPLACE(BUSNPHONE,\' \',\'\') LIKE %'+ phone +'%';
            }else if(name.length && phone.length){
                queryStr = 'SELECT ' + selectInfo + ' FROM '+tableName+
                        '\n WHERE (REPLACE( UPPER(PREFER),\' \',\'\') + REPLACE( UPPER(NAME),\' \',\'\') + REPLACE(BUSNPHONE,\' \',\'\') ) LIKE %'+(name+phone)+'%';
            }
            else{
                return null;
            }
            if(queryStr){
                new sql.Request().query(queryStr,function (err,record) {
                    if (err) {
                        console.log('error search department: ' + err);
                        return err;
                    }
                    if(record){
                        callback(record)
                    }
                })
            }

        }catch(e){}
    })
}



module.exports = router;