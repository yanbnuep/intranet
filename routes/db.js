var express = require('express');
var router = express.Router();

var sql = require('mssql');

/* GET users listing. */

var config = {
    user: 'ian',
    password: 'airmacau2016',
    server: '192.168.101.114',
    database: 'CSD'
}



router.get('/', function(req, res, next) {
    var connection = new sql.Connection(config);
    connection.connect(function(err){
        var request = new sql.Request(connection);
        request.query('select top 10 * from [CSD].[dbo].[TEL_VW]',function(err,recordset){
            if(err){res.send(err);console.log('err:'+err)}
            else{
                console.log("recordset:"+recordset[0].EMPLID);
                res.send(recordset[1].EMPLID);
            }
            connection.close();
        });

    });
});

module.exports = router;
