/**
 * Created by itdwyy on 12/13/2016.
 */
$(document).ready(function () {
    getConstructor(addDepartment);
    smoothScrollInit();
    windowScrollListener();
});


function smoothScrollInit() {
    var options = {offset:100,easing: 'easeOutCubic',speed: 350,callback:function (anchor, toggle) {
        am.oneClass($(toggle),'cur');
    }};
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
    for (var department in constructor) {
        departmenthtml = $('<li><a href="/" class="sidebar-link">' + department + '</a></li>');

        if (constructor.hasOwnProperty(department)) {
            (function (department) {
                departmenthtml.children('a').click(function (event) {
                    event.preventDefault() ? event.preventDefault() : (event.returnValue = false);
                    //add cur remove others class cur
                    am.oneClass($(this),'cur');
                    var lastCurLink = $('.section-link.cur')[0];
                    $(lastCurLink).removeClass('cur');
                     var firstlink = $($(this).next('.menu-sub').find(".section-link")[0]);
                    firstlink.addClass('cur');
                    menuSub = $($(this).next('ul.menu-sub'));
                    if(!menuSub.hasClass('cur')){
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
                divhtml = $('<li><a class="section-link" data-scroll href="#' + am.rgxGet("enChar",div).replace(" ","-") + '"> ' + div + '</a></li>');
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
        url:'/tele/department',
        data: {department:department},
        method: 'get',
        success: function (data) {
            renderPhoneResult(data);
        }
    });
}

function renderPhoneResult(data) {
    var person = {},
        card = $(),
        contactCards = [];
    for(var div in data){
        if(data.hasOwnProperty(div) && div !== null){
            card = $('<div id="'+am.rgxGet("enChar",div).replace(" ","-")+'" class="contact-group">'+'<div class="title">'+div+'</div>'+'</div>');
            for(var i = 0; i< data[div].length ; i++){
                (function (contact) {
                    person.name =  contact['NAME'];
                    person.companyPhone = contact['BUSNPHONE'];
                    person.email = contact['EMAIL'];
                    person.jobtitle =  contact['JOBTITLE'];
                    (function (person) {
                        contactCards = makeContactCard(person);
                        card.append(contactCards);
                    })(person)
                })(data[div][i]);
            }
        }
        $('#contacts-content').append(card);
    }
}

function makeContactCard(contactList) {
    var person = $('<div class="person"></div>'),
        personInfo = $();

    for(var info in contactList){
        if(contactList.hasOwnProperty(info))
        personInfo = $('<div class="peronInfo">'+info+": "+contactList[info]+'</div>');
        person.append(personInfo);
    }
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
            if(didScroll){
                //detect if window is scroll up or down
                curScrollTop = $(this).scrollTop();
                scrollDown = curScrollTop > lastScrollTop;
                lastScrollTop = curScrollTop;
                scrollSetActive(scrollDown);
                didScroll  = false;
            }
        },1000);
    })()
}

function scrollSetActive(scrollDown) {
    var curActiveLink = $(".section-link.cur"),
        curActiveContentId= curActiveLink.attr('href'),
        curContent = $(curActiveContentId);
    //prevent select document
    if(curContent.is('div')){
        var curDistance = curContent.offset().top - $(window).scrollTop();
        var curMenu = $('.menu-sub.cur .section-link'),
            curLength = curMenu.length,
            curIndex = curMenu.index(curActiveLink);
        if(curIndex){
            var lastContent = $(curMenu[curIndex - 1]);
        }
        if(curIndex < curLength-1){
            var nextContent = $(curMenu[curIndex + 1]);
        }
        if(scrollDown){
            if(nextContent){
               var nextDistance = nextContent.offset().top - $(window).scrollTop();
               console.log(nextContent.scrollHeight());
               if(nextDistance < 110){
                   am.oneClass(nextContent,'cur');
               }
            }
        }else {
            if(lastContent){
                var lastDistance = lastContent.offset().top - $(window).scrollTop();
                if(lastDistance < 110){
                    am.oneClass(lastContent,'cur');
                }
            }
        }
    }
}