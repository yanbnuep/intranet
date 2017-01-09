/**
 * Created by itdwyy on 12/13/2016.
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
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('tele', {title: 'telephone'});
});

router.get('/construct', function (req, res, nex) {
    console.log('start get constructor');
    try {
        getConstruction(function (data) {
            res.send(data);
        })
    } catch (e) {
        console.log('error in get constructor: ' + e);
    }

});


function getConstruction(callback) {
    var constructor = {},
        department = '',
        div = '';
    sql.connect(config, function (err) {
        try {
            new sql.Request().query('SELECT DISTINCT DEPT,DIV FROM [INTRANET].[dbo].[TEL_VW] WHERE LOCATION = \'MFM\' order by DEPT', function (err, record) {
                if (err) {
                    console.log('error search department: ' + err);
                    return err;
                }
                try{
                    for (var i = 0; i < record.length; i++) {
                        department = record[i]['DEPT'];
                        div = record[i]['DIV'];
                        //init department
                        if (department !== null && constructor[department]=== undefined && div !== undefined) {
                            constructor[department] = [];
                            constructor[department].push(div);
                        }else if( constructor[department] !== undefined && div !== undefined){
                            constructor[department].push(div);
                        }
                    }
                }catch (e){
                    console.log('error in create constructor: '+e);
                }
                if (typeof callback === 'function') {
                    callback(constructor);
                } else {
                    return constructor;
                }
            });
        } catch (e) {
            console.log('error in get telephone constructor: ' + e);
        }
    })
}

router.get('/department',function(req,res,next){
    try{
        byDepartment(req.query['department'],function (data) {
            res.send(data);
        })
    }catch (e){
        console.log('error search by department: '+ e);
    }
});


function byDepartment(department,callback) {
    var result = [],
        div = {};
    console.log('SELECT * FROM [INTRANET].[dbo].[TEL_VW] where DEPT = \''+department+'\' and LOCATION = \'MFM\' order by DIV ');
    sql.connect(config, function (err){
        if(err){
            console.log('error in search by department'+err);
            return null;
        }
        try{
            new sql.Request().query('SELECT * FROM [INTRANET].[dbo].[TEL_VW] where DEPT = \''+department+'\' and LOCATION = \'MFM\' order by DIV ',function (error,data) {
                if(error){
                    console.log('error search by department: '+error);
                    return null;
                }
                if (typeof callback === 'function') {
                    callback(data);
                } else {
                    return data;
                }
            });
        }catch (e){
            console.log('error in sql search by department'+e);
        }
    });
}

module.exports = router;