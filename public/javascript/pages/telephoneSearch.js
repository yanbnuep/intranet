/**
 * Created by itdwyy on 12/13/2016.
 */
$(document).ready(function () {
    getConstructor(addDepartment);
    smoothScrollInit();
    // windowScrollListener();
});


function smoothScrollInit() {
    var options = {
        offset: 100, easing: 'easeOutCubic', speed: 350, callback: function (anchor, toggle) {
            am.oneClass($(toggle), 'cur');
        }
    };
    smoothScroll.init(options);
}

function getConstructor(callback) {
    $.ajax({
        url: '/tele/construct',
        method: 'get',
        success: function (json) {
            callback(json);
        }
    });
}


function addDepartment(constructor) {
    var headquarter = constructor['headquarter'],
        outstation = constructor['outStation'];
    departmentHtml(headquarter, $('#headQuarter'));
    departmentHtml(outstation, $('#outStation'));

    function departmentHtml(department, locateNode) {
        var html = $();
        for (var departmentName in department) {
            if (department.hasOwnProperty(departmentName)) {
                var curDept = department[departmentName];
                var displayName = (sortLocationName(departmentName)? sortLocationName(departmentName): departmentName);
                html = $('<li><a id="'+departmentName+'" class="sidebar-link" onclick="loadDepartment(this)">' + displayName + '</a></li>');
                if (curDept.length > 0) {
                    addDiv(curDept, html);
                }
                locateNode.append(html);
            }
        }
    }
    function addDiv(departmentObj, node) {
        var container = $('<ul class="menu-sub"></ul>');
        if (Object.prototype.toString.call(departmentObj) === '[object Array]') {
            $.each(departmentObj, function (index, val) {
                var divName = val.split(' ').join('');
                var link = $('<a class="section-link" data-scroll href="#' + divName + '">' + val + '</a>');
                container.append(link);
            });
        }
        node.append(container);
    }
}

function sortLocationName(locationCode) {
    var locationTranslator = {
        BKK: 'Bangkok(曼谷)',
        CGO: 'ZhengZhou(郑州)',
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
        NX: 'Macau(澳门)',
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
    if (locationCode in locationTranslator) {
        return (locationCode + "-" + locationTranslator[locationCode])
    } else return false;
}


function loadDepartment(link) {
    $('#contacts-content').empty();
    searchByDeptOrSta(link.id,sortLocationName(link.id));
}

function searchByDeptOrSta(name,outstation) {
    //department or outstation
    var url = 'tele/search',data;
    data = (outstation ? {station: name,department: ''} : {department: name,station: ''});
    $.ajax({
        url: url,
        data: data,
        method: 'get',
        success: function (data) {
            renderPhoneResult(data);
        }
    });
}

function renderPhoneResult(data) {
    var person = {},
        card = $(),
        tablehead,
        contactCards = [];
    console.log(data);
    for (var div in data) {
        if (data.hasOwnProperty(div) && div !== null) {
            card = $('<div id="' + am.rgxGet("enChar", div).replace(" ", "-") + '" class="contact-group">' + '<div class="title">' + div + '</div>' + '</div>');
            tablehead = $('<table class="contact-table"><thead><tr><th>Name</th><th>Telephone</th><th>Email</th><tr></thead></table>');

            var tb = $('<tbody></tbody>');
            for (var i = 0; i < data[div].length; i++) {
                (function (contact) {
                    person.name = contact['NAME'] + " . " + contact['PREFER'];
                    person.companyPhone = contact['BUSNPHONE'];
                    person.email = contact['EMAIL'];
                    person.office = contact['OFFICE'];
                    person.jobtitle = contact['JOBTITLE'];
                    (function (person) {
                        contactCards = makeContactCard(person);
                        tb.append(contactCards);
                    })(person)
                })(data[div][i]);
            }
            tablehead.append(tb);
            card.append(tablehead);
        }
        $('#contacts-content').append(card);
    }
}

function makeContactCard(contactList) {
    var person = $('<tr class="person"></tr>'),
        name = $('<td class="td-name"><span class="name">' + contactList.name + '</span>' + '<span class="jobTitle">' + contactList.jobtitle + '</span>' + '</td>'),
        tele = $('<td class="td-tele"><span class="tele">' + contactList.companyPhone + '</span></td>'),
        email = $('<td class="td-email"><span class="email">' + '<a href="' + 'mailto:' + contactList.email + '\">' + contactList.email + '</a></span>'+'<span class="td-office">'+contactList.office+'</span>'+'</td>');
    person.append(name);
    person.append(tele);
    person.append(email);
    return person;
}

function windowScrollListener() {
    (function () {
        var didScroll,
            lastScrollTop = 0,
            curScrollTop = 0,
            scrollDown;
        $(window).scroll(function (event) {
            didScroll = true;
        });
        setInterval(function () {
            if (didScroll) {
                //detect if window is scroll up or down
                curScrollTop = $(this).scrollTop();
                scrollDown = curScrollTop > lastScrollTop;
                lastScrollTop = curScrollTop;
                scrollSetActive(scrollDown);
                didScroll = false;
            }
        }, 100);
    })()
}

function scrollSetActive(scrollDown) {
    var curIndex, curGroup, nextLink, nextElment, distance, change;
    curGroup = $('.menu-sub.cur .section-link');
    curIndex = curGroup.index($('.section-link.cur'));
    //init change to false
    change = false;
    if (scrollDown && curGroup.length > curIndex + 1) {
        nextLink = $(curGroup[curIndex + 1]);
        nextElment = $(nextLink.attr('href'));
        distance = $(window).scrollTop() - nextElment.offset().top + 220;
    }
    else if (!scrollDown && curIndex != 0) {
        nextLink = $(curGroup[curIndex - 1]);
        nextElment = $(nextLink.attr('href'));
        distance = $(window).scrollTop() - nextElment.offset().top - 220;
    } else if ($(window).scrollTop() + $(window).height() == $(document).height() && $(window).scrollTop() > 112) {
        // already scroll to the bottom
        nextLink = $(curGroup).last();
        nextElment = $(nextLink.attr('href'));
        change = true;
    } else if ($(window).scrollTop() === 0) {
        //112 is the top of navbar
        //and window already top
        nextLink = $(curGroup).first();
        nextElment = $(nextLink.attr('href'));
        change = true;
    }
    if ((distance > 0 && scrollDown) || (distance < 0 && !scrollDown)) {
        change = true;
    }

    if (change) {
        am.oneClass(nextElment, 'cur');
        am.oneClass(nextLink, 'cur');
    }
}

function activeLinkReset() {
    var activeLinks = $('.section-link.cur');
    $.each(activeLinks, function (s, o) {
        $(o).removeClass('cur');
    });
}