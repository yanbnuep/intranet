var express = require('express');
var router = express.Router();

var sql = require('mssql');

/* GET users listing. */


var config = {
        user: 'ian',
        password: 'ian6691',
        server: '192.168.101.114',
        database: 'CSD'
    },
    teleAutoSearchConfig = {
        teleReqInfo: '[PREFER],[BUSNPHONE],[DIV]',
        tableName: '[CSD].[dbo].[TEL_VW]'
    };

router.get('/', function (req, res, next) {

});

router.get('/phone', function (req, res, next) {

})

function telephoneSearch(searchName, number, topNum) {
    var request = new sql.Request(conn),
        //sql pre define
        name = searchName.length > 0 ? searchName : '*',
        tele = number.length > 0 ? number : '*',
        top = topNum,
        teleReqInfo = teleAutoSearchConfig.teleReqInfo,
        tableName = teleAutoSearchConfig.tableName,
        sqlUsr = 'SELECT TOP ' + top +' '+teleReqInfo +
            'FROM'+ tableName +'WHERE  CHARINDEX(' + name + '\',UPPER(PREFER))=1' +
            'OR CHARINDEX(' + name + '\',UPPER(NAME))>=1 ORDER BY CHARINDEX(' +
            'CHARINDEX(' + name + '\',UPPER(PREFER))*100+CHARINDEX('+name+'\',UPPER(NAME)) DESC',
        sqlNum = 'SELECT TOP '+top+' '+teleReqInfo+ 'FROME'+tableName+
            'WHERE CHARINDEX('+tele+'\',REPLACE(BUSNPHONE,\' \',\'\')>=1';

        console.log(sqlReq);
    var conn = new sql.Connection(config, function (err) {
        if (err) {
            console.log('error search telephone ' + err)
        }
        else {
           if(name === '*' && tele != '*'){

           }else if(tele != '*' && name === '*') {
               request.query(sqlUsr,function (err,resultJSON) {
                   if(err){console.log('err searching: '+err)}
                   else {
                       conn.close();
                       return parseRecord(resultJSON);
                   }
               })
           }
        }
    });
}

function parseRecord(data) {
    var names = []

}

module.exports = router;
