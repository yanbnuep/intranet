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
    try {
        getConstruction(function (data) {
            res.send(data);
        })
    } catch (e) {
        
    }

});

router.get('/phoneSearch',function (req,res,next) {
    try{
        var location = req.query['location'],
            dept = req.query['dept'],
            div = req.query['div'];
        phoneSearch(location,dept,div,function (data) {
            if(data)
                res.send(data);
        })

    }catch (e){
        console.log('error in get constructor: ' + e);
    }
});

function getConstruction(callback) {
    var constructor = {},
        department = '',
        location = '',
        div = '';
    var headquarter = {},
        outStation = {};
    sql.connect(config, function (err) {
        try {
            new sql.Request().query('SELECT DISTINCT DEPT,DIV,LOCATION,DIVCODE FROM [INTRANET].[dbo].[TEL_ORDER_VW] where DEPT != \'NULL\' order by DIVCODE ', function (err, record) {
                if (err) {
                    console.log('error search department: ' + err);
                    return err;
                }
                try {
                    for (var i = 0; i < record.length; i++) {
                        department = record[i]['DEPT'];
                        div = record[i]['DIV'];
                        location = record[i]['LOCATION'];
                        if (location === 'MFM' || location === 'NX') {
                            addDivStructure(headquarter,div,department);
                        } else if (location !== null) {
                            addDivStructure(outStation,div,location);
                        }
                    }
                } catch (e) {
                    console.log('error in create constructor: ' + e);
                }
                constructor['headquarter'] = headquarter;
                constructor.outStation = outStation;
                callback(constructor);
            });
        } catch (e) {
            console.log('error in get telephone constructor: ' + e);
        }
        function addDivStructure(o,div,department) {
             if(department !== null && !(department in o)){
                o[department] = [];
            }
            if(!(o[department].includes(div))){
                o[department].push(div);
            }
        }
    })
}

function phoneSearch(location,dept,div,callback) {
    var result = {},
        selectInfo = '[EMPLID],[DEPT],[DIV],[NAME],[PREFER],[JOBTITLE],[BUSNPHONE],[EMAIL],[OFFICE],[JOB_LEVEL]',
        mssql = '';
    if(location === 'headquarter'){
        if(dept&&div){
            mssql = 'SELECT '+selectInfo+' FROM [INTRANET].[dbo].[TEL_ORDER_VW] where DEPT = \'' + dept + '\'  and Div =  \''+div+' \' order by DIVCODE,JOB_LEVEL DESC';
        }else if (dept && !div){
            mssql = 'SELECT '+selectInfo+' FROM [INTRANET].[dbo].[TEL_ORDER_VW] where DEPT = \'' + dept + '\' order by DIVCODE,JOB_LEVEL DESC';
        }else {
            return false;
        }
    }else if(location === 'outStation'){
        if(dept&&div){
            mssql = 'SELECT '+selectInfo+' FROM [INTRANET].[dbo].[TEL_ORDER_VW] where LOCATION = \'' + dept + '\'  and Div =  \''+div+' \' order by DIVCODE,JOB_LEVEL DESC';
        }else if (dept && !div){
            mssql = 'SELECT '+selectInfo+' FROM [INTRANET].[dbo].[TEL_ORDER_VW] where LOCATION = \'' + dept + '\' order by DIVCODE,JOB_LEVEL DESC';
        }else {
            return false;
        }
    }else {

        return false;
    }
    if(mssql){
        sql.connect(config,function (err) {
            if (err) {
                console.log('error in search by phone' + err);
                return null;
            }
            try {
                new sql.Request().query(mssql, function (error, data) {
                    if (error) {
                        console.log('error search by department: ' + error);
                        return null;
                    }
                    for (var i = 0; i < data.length; i++) {
                        (function (peron) {
                            var div = peron['DIV'];
                            if (result[div] === undefined) {
                                result[div] = [];
                            }
                            if (div !== null && div !== undefined) {
                                result[div].push(peron);
                            }
                        })(data[i])
                    }
                    if (typeof callback === 'function') {
                        callback(result);
                    } else {
                        return result;
                    }
                });
            }catch (err){}
        })
    }
}

router.get('/search', function (req, res, next) {
    try {
        var department = req.query['department'],
            station = req.query['station'];
        searchByLocation({department: department,station: station},function (data) {
            res.send(data);
        });
    } catch (e) {
        console.log('error search by department/station: ' + e);
    }
});


function searchByLocation(location, callback) {
    var result = {},
        selectInfo = '[EMPLID],[DEPT],[DIV],[NAME],[PREFER],[JOBTITLE],[BUSNPHONE],[EMAIL],[OFFICE],[JOB_LEVEL]',
        mssql = '';
    if(location.department && !location.station){
        var department = location.department;
        mssql = 'SELECT '+selectInfo+' FROM [INTRANET].[dbo].[TEL_ORDER_VW] where DEPT = \'' + department + '\' and (LOCATION = \'MFM\' or LOCATION = \'NX\') and Div != \'null\' order by DIVCODE,JOB_LEVEL DESC';
    }else if (!location.department && location.station){
        mssql = 'SELECT * FROM [INTRANET].[dbo].[TEL_ORDER_VW] where LOCATION = \'' + location.station +'\' and Div != \'null\' order by DIVCODE,JOB_LEVEL DESC';
    }
    sql.connect(config, function (err) {
        if (err) {
            console.log('error in search by department' + err);
            return null;
        }
        try {

            new sql.Request().query(mssql, function (error, data) {
                if (error) {
                    console.log('error search by department: ' + error);
                    return null;
                }
                for (var i = 0; i < data.length; i++) {
                    (function (peron) {
                        var div = peron['DIV'];
                        if (result[div] === undefined) {
                            result[div] = [];
                        }
                        if (div !== null && div !== undefined) {
                            result[div].push(peron);
                        }
                    })(data[i])
                }
                if (typeof callback === 'function') {
                    callback(result);
                } else {
                    return result;
                }
            });
        } catch (e) {
            console.log('error in sql search by department' + e);
        }
    });
}

module.exports = router;