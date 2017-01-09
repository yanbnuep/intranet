/**
 * Created by itdwyy on 12/13/2016.
 */
$(document).ready(function () {
    getConstructor(addDepartment);
});

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
        divhtml = $();
    for (var department in constructor) {
        departmenthtml = $('<li><a href="/" class="sidebar-link">' + department + '</a></li>');
        if (constructor.hasOwnProperty(department)) {
            (function (department) {
                departmenthtml.children('a').click(function (event) {
                    event.preventDefault() ? event.preventDefault() : (event.returnValue = false);
                    //get html by department
                    searchByDepartment(department);
                });
            })(department)
        }
        if (constructor.hasOwnProperty(department) && constructor[department].length > 0) {
            var subMenu = $('<ul class="menu-root"></ul>');
            for (var i = 0; i < constructor[department].length; i++) {
                var div = constructor[department][i];
                divhtml = $('<li><a class="section-link" data-scroll href="#' + div + '"> ' + div + '</a></li>');
                subMenu.append(divhtml);
            }
            departmenthtml.append(subMenu);
        }


        $('#headQuarter.menu-root').append(departmenthtml);
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
        div = [];
    for(var i = 0; i< data.length;i++){
        person = data[i];
        console.log(person);
    }
}