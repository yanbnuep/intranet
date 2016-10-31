var express = require('express');
var router = express.Router();

var mssql = require('mssql');

/* GET users listing. */

var config = {
    user: 'ian',
    password: 'airmacau2016',
    server: '192.168.101.114',
    database: 'CSD'
}

function getDb() {
    var conn = new mssql.Connection(config);
    conn.connect().then(function(){
        var req = new mssql.Request(conn);
        req.query("SELECT "+" FROM [CSD].[dbo].[TEL_VW]").then(function(recordset){
            console.log(recordset);
            conn.close();
        }).catch(function(err){
            console.log("error1:"+err);
        });
    }).catch(function(err){
        console.log("error2:"+err);
    });
}
router.get('/', function(req, res, next) {

});

module.exports = router;
