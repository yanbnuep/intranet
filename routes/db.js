var express = require('express');
var router = express.Router();
var sql = require('mssql');

/* GET users listing. */

var config = {
        user: 'ian',
        password: 'airmacau',
        server: '192.168.110.70',
        database: 'INTRANET'
    },
    teleAutoSearchConfig = {
        teleReqInfo: ' [PREFER],[BUSNPHONE],[DIV],[NAME]',
        tableName: ' [INTRANET].[dbo].[TEL_VW]'
    };
router.get('/', function (req, res, next) {

});

router.get('/autoSearch', function (req, res, next) {
    var dataSQL = telephoneSearch(req.query['name'], req.query['number'], 20),
        dataSend =  function (result) {
            res.send(result);
        };
    sqlRunner(dataSQL,dataSend);
});




function telephoneSearch(searchName, number, topNum) {
    var //sql pre define
        name = searchName.length > 0 ? searchName : '*',
        tele = number.length > 0 ? number : '*',
        top = topNum,
        teleReqInfo = teleAutoSearchConfig.teleReqInfo,
        tableName = teleAutoSearchConfig.tableName,
        sqlByName = 'SELECT TOP '+ top + teleReqInfo+'FROM '+tableName +
            '\n WHERE CHARINDEX(\''+name+'\',REPLACE( UPPER(PREFER),\' \',\'\'))=1 '+
            '\n OR CHARINDEX(\''+name+'\',REPLACE( UPPER(NAME),\' \',\'\'))>=1'+
            '\n ORDER BY CHARINDEX(\''+name+'\',REPLACE( UPPER(PREFER),\' \',\'\')) + CHARINDEX(\''+name+'\',REPLACE( UPPER(NAME),\' \',\'\')) ASC',
        sqlByNum = 'SELECT TOP '+ top + teleReqInfo+' FROM '+tableName +' WHERE CHARINDEX(\'' + tele + '\',REPLACE(BUSNPHONE,\' \',\'\'))>=1';
        console.log(sqlByName);
        if(name != '*' && tele === '*'){
            return sqlByName;
        }else if(name === '*' && tele != '*'){
            return sqlByNum;
        }
}

function parseRecord(jsonData) {
    return JSON.stringify(jsonData);
}

function sqlRunner(sqlStr,callback){
    sql.connect(config,function(err){
        new sql.Request().query(sqlStr,function(err,recordset){
            if(err){console.log("sql runner erro:"+err)}
            var result = parseRecord(recordset);
            callback(result);
        });
    })
}

module.exports = router;
