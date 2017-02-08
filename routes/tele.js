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
        console.log('error in get constructor: ' + e);
    }

});


function getConstruction(callback) {
    var constructor = {},
        department = '',
        location = '',
        div = '';
    var locationTranslator = {
        BKK: 'Bangkok(曼谷)',
        CGO : 'ZhengZhou(郑州)',
        CKG: 'ChongQing(重庆)',
        CTU: 'ChengDu(成都)',
        FUK: 'Fukuoka(福冈)',
        HFE: 'HeFei(合肥)',
        HGH: 'HangZhou(杭州)',
        KHH: 'Kaohsiung(高雄)',
        KWE: 'GuiYang(贵阳)',
        MFM: 'Macau(澳门)',
        NGB: 'NingBo(宁波)',
        NKG: 'NanJing(南京)',
        NNG: 'NanNing(南宁)',
        NX : 'Macau(澳门)',
        OSA: 'KAYAK(大阪)',
        PEK: 'BeiJing(北京)',
        SEL: 'Seoul,South Korea(南韩)',
        SHA: 'ShangHai(上海)',
        SHE: 'Shengyang(沈阳)',
        SZX: 'ShenZhen(深圳)',
        TPE: 'TaiWan Taoyuan(台北)',
        TSN: 'TianJin(天津)',
        TXG: 'TaiWan TaiChung(台春)',
        TYN: 'TaiYuan(太原)',
        TYO: 'Tokyo Haneda(东京)',
        XMN: 'XiaMen(厦门)',
        ZHU: 'ZhuHai(珠海)'
    };
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
                        // //init department
                        // if (department !== null && constructor[department]=== undefined && div !== undefined) {
                        //     constructor[department] = [];
                        //     constructor[department].push(div);
                        // }else if( constructor[department] !== undefined && div !== undefined){
                        //     constructor[department].push(div);
                        // }
                        if (location == 'MFM' || location == 'NX') {
                            addDivStructure(headquarter,div,department);
                        } else if (location != null && (location in locationTranslator)) {
                            
                            addDivStructure(outStation,div,department);
                        }
                    }
                } catch (e) {
                    console.log('error in create constructor: ' + e);
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
        function addDivStructure(o,div,department) {
             if(department != null && !(department in o)){
                o[department] = [];
            }
            if(!(o[department].includes(div))){
                o[department].push(div);
            }

        }
    })
}


router.get('/department', function (req, res, next) {
    try {
        byDepartment(req.query['department'], function (data) {
            console.log(data);
            res.send(data);
        })
    } catch (e) {
        console.log('error search by department: ' + e);
    }
});


function byDepartment(department, callback) {
    var result = {};
    sql.connect(config, function (err) {
        if (err) {
            console.log('error in search by department' + err);
            return null;
        }
        try {
            new sql.Request().query('SELECT * FROM [INTRANET].[dbo].[TEL_VW] where DEPT = \'' + department + '\' and LOCATION = \'MFM\' order by DIV ', function (error, data) {
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