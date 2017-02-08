/**
 * Created by itdwyy on 12/13/2016.
 */
$(document).ready(function () {
    getConstructor(addDepartment);
    smoothScrollInit();
    windowScrollListener();
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
    var departmenthtml = $(),
        menuSub = $();
    divhtml = $();
    console.log(constructor);
    for (var department in constructor) {
        departmenthtml = $('<li><a href="/" class="sidebar-link">' + department + '</a></li>');
        if (constructor.hasOwnProperty(department)) {
            (function (department) {
                departmenthtml.children('a').click(function (event) {
                    event.preventDefault() ? event.preventDefault() : (event.returnValue = false);
                    //add cur remove others class cur
                    activeLinkReset();
                    am.oneClass($(this), 'cur');
                    var firstlink = $($(this).next('.menu-sub').find(".section-link")[0]);
                    am.oneClass(firstlink, 'cur');
                    menuSub = $($(this).next('ul.menu-sub'));
                    if (!menuSub.hasClass('cur')) {
                        $('ul.menu-sub.cur').removeClass('cur');
                        menuSub.addClass('cur');
                    }
                    //get html by department
                    $('#contacts-content').html('');
                    searchByDepartment(department);
                });
            })(department)
        }
        if (constructor.hasOwnProperty(department) && constructor[department].length > 0) {
            var subMenu = $('<ul class="menu-sub"></ul>');
            for (var i = 0; i < constructor[department].length; i++) {
                var div = constructor[department][i];
                divhtml = $('<li><a class="section-link" data-scroll href="#' + am.rgxGet("enChar", div).replace(" ", "-") + '"> ' + div + '</a></li>');
                subMenu.append(divhtml);
            }
            departmenthtml.append(subMenu);
        }

        $('#headQuarter').append(departmenthtml);
    }
    //Activate first link
    var firstLink = $('#headQuarter .sidebar-link').first();
    firstLink.addClass('cur');
    searchByDepartment(firstLink.html());
    var firstChildMenu = firstLink.next('.menu-sub');
    firstChildMenu.addClass('cur');
    var firstChildLink = $('#headQuarter .section-link').first();
    firstChildLink.addClass('cur');
}


function searchByDepartment(department) {
    $.ajax({
        url: '/tele/department',
        data: {department: department},
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
                    person.name = contact['NAME']+" . "+contact['PREFER'];
                    person.companyPhone = contact['BUSNPHONE'];
                    person.email = contact['EMAIL'];
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
        name = $('<td class="td-name"><span class="name">'+contactList.name+'</span>'+'<span class="jobTitle">'+contactList.jobtitle+'</span>'+'</td>'),
        tele = $('<td class="td-tele"><span class="tele">'+contactList.companyPhone+'</span></td>'),
        email = $('<td class="td-email"><span class="email">'+'<a href="'+'mailto:'+contactList.email+'\">'+contactList.email+'</span></td>');
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