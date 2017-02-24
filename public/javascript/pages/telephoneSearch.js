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
        offset: 120, easing: 'easeOutCubic', speed: 450, callback: function (anchor, toggle) {
            activeOne($(toggle), 'active');
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
                var displayName = (sortLocationName(departmentName) ? sortLocationName(departmentName) : departmentName);
                html = $('<li><a id="' + departmentName + '" class="sidebar-link">' + displayName + '</a></li>');
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
                var link = $('<a class="section-link" data-scroll href="#' + am.rgxGet('enChar', divName) + '">' + val + '</a>');
                container.append(link);
            });
        }
        node.append(container)
    }

    (function appendClick() {
        $('a.sidebar-link').click(function (event) {
            var link = $(event.target),
                menusub = link.siblings('.menu-sub');
            activeOne([link, menusub], 'active');
            $(menusub.children('.section-link:first-child')).addClass('active');
            loadDepartment(link);
        });
    })();
}

function activeOne(ele, classname) {

    if ($.isArray(ele)) {
        $.each(ele, function (index, val) {
            switchActiveElement($(val));
        })
    }
    else {
        switchActiveElement(ele);
    }

    function switchActiveElement(element) {
        var eleClass = element.attr('class');
        var seleElementGroup = $('.' + eleClass);
        if (!element.hasClass(classname)) {
            seleElementGroup.removeClass(classname);
            element.addClass(classname);
        }
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
    var name = link.attr('id');
    searchByDeptOrSta(name, sortLocationName(name));
}

function searchByDeptOrSta(name, outstation) {
    //department or outstation
    var url = 'tele/search', data;
    data = (outstation ? {station: name, department: ''} : {department: name, station: ''});
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
        email = $('<td class="td-email"><span class="email">' + '<a href="' + 'mailto:' + contactList.email + '\">' + contactList.email + '</a></span>' + '<span class="td-office">' + contactList.office + '</span>' + '</td>');
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
    var curIndex, curGroup, nextLink, distance, change;
    curGroup = $('.menu-sub.active .section-link');
    curIndex = curGroup.index($('.section-link.active'));
    //init change to false
    change = false;
    if (!curGroup) {
        return null
    } else {
        // if (scrollDown) {
        //     if (curIndex < curGroup.length - 1) {
        //         nextLink = $(curGroup[curIndex + 1]);
        //         change = isScrollInView(nextLink);
        //     }
        // } else {
        //     if (curIndex > 0) {
        //         nextLink = $(curGroup[curIndex - 1]);
        //         change = isScrollInView(nextLink);
        //     }
        //     if (change && nextLink) {
        //         activeOne(nextLink, 'active');
        //     }
        // }
        isScrollInView($(curGroup[1]),'ele1');
        isScrollInView($(curGroup[2]),'ele2');
    }
    function isScrollInView(ele,str) {
        var windowTop = $(window).scrollTop();
        var windowBottom = $(window).height() + windowTop;

        var eleTop = $(ele).offset().top,
            eleBottom = eleTop + $(ele).height();

        console.log('windowtop: ' + windowTop + ' windowBottom : ' + windowBottom + ' eletop: ' + eleTop + ' elebottom: ' + eleBottom + str);
        return ((eleBottom <= windowBottom ) && (eleTop >= windowTop));
    }
}