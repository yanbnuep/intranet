var express = require('express');
var router = express.Router();

var sql = require('mssql');

/* GET users listing. */


var config = {
    user: 'ian',
    password: 'ian6691',
    server: '192.168.101.114',
    database: 'CSD'
}

router.get('/', function(req, res, next) {

});

router.get('/phone',function(req,res,next){
    console.log('start search phone');
    var pnum = req.query['value'];
    var conn = new sql.Connection(config,function(err){
        if(err) console.log('err extablish conn'+err);
        else{
           var request = new sql.Request(conn);
            var rstxt = 'SELECT TOP 10 [NAME],[BUSNPHONE] FROM [CSD].[dbo].[TEL_VW] WHERE [BUSNPHONE] LIKE \'%'+pnum+'%\'';
            request.query(rstxt,function (err,recordset) {
                if(err) console.log('err in search'+err);
                else {
                    conn.close();
                    var rss = parseRecord(recordset);
                    console.log(rss);
                    res.send(rss);
                }
            });
        }
    })
})

function parseRecord(data){
    var names = []

}

module.exports = router;
