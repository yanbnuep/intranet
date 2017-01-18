/**
 * Created by itdwyy on 12/13/2016.
 */
$(document).ready(function () {
    getConstructor(addDepartment);
    smoothScrollInit();
});

function smoothScrollInit() {
    var options = {offset:100,easing: 'easeOutCubic',callback:function (anchor, toggle) {
        console.log(anchor);
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
                divhtml = $('<li><a class="section-link" data-scroll href="#' + div + '"> ' + div + '</a></li>');
                subMenu.append(divhtml);
            }
            departmenthtml.append(subMenu);
        }

        $('#headQuarter').append(departmenthtml);
    }

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
            card = $('<div id="'+div+'" class="contact-group">'+'<div class="title">'+div+'</div>'+'</div>');
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