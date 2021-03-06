/**
 * Created by itdwyy on 3/9/2017.
 */
$(document).ready(function () {
    var searchResult = JSON.parse($('#hidden').html());
    parseResult(searchResult);
    tableRePaint();
});

function parseResult(json) {
    var Div = {};
    var location = {};
    if (json.length > 0) {

        var table = $('<table id="resultTable" class="contact-table"><tbody id="resultBody"></tbody></table>');
        $('#searchResult').append(table);
        var tbody = $('#resultBody');
        for (var i = 0; i < json.length; i++) {
            var contact = json[i];
            var person = {
                name: contact['NAME'],
                department: contact['DEPT'],
                div: contact['DIV'],
                tele: contact['BUSNPHONE'],
                prefer: contact['PREFER'],
                office: contact['OFFICE'],
                jobtitle: contact['JOBTITLE'],
                email: contact['EMAIL']
            };
            var selection = person.department;
            if (!Div.hasOwnProperty(selection)) {
                Div[selection] = [];
                addSearchHelper(selection);
            }
            var personHtml = parseContactInfo(person);
            tbody.append(personHtml);
        }
    }


    $('.chip').on('click',function (event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        if(!$(this).hasClass('selected')){
            selectDiv($(this));
            $('.chip.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    })
}

function addSearchHelper(name) {
    $('#searchHelper').append('<li class="chipLi">' + '<a class="chip" href="#' + am.rgxGet('enChar', name) + '"' + '>' + name + '</a>' + '</li>')
}

function parseContactInfo(person) {
    return $('<tr class="person visible '+ am.rgxGet('enChar', person.department)+'">'+
    '<td class="td-name">'+
    '<span class="name">'+person.name+'.'+person.prefer+'</span>'+
    '<span class="jobTitle">'+person.jobtitle+'</span>'+
    '</td>'+
    '<td class="td-tele">'+'<span class="tele">'+person.tele+'</span>'+'</td>'+
    '<td class="td-email">'+
    '<span class="email">'+'<a href="mailto:'+person.email+'">'+person.email+'</a></span>'+
    '<span class="td-office">'+person.office+'</span>'+
    '</td></tr>');
}

function selectDiv(selector) {
    var inSpeed = 100,
        outSpeed = 100;

    if(!selector.hasClass('selected') && selector.attr('href')){
        var selectedClassName ='.'+am.rgxGet('enChar',selector.attr('href'));
        var selectRow = $(selectedClassName);

        if(selectedClassName == '.all'){
            var hiddenElement =  $('.person').not('.visible');
            hiddenElement.addClass('visible');
            tableRePaint();
            hiddenElement.fadeIn(inSpeed);
        }

        if(selectRow.length>0){
            var fadeElement =  $('.person').not(selectRow);
            fadeElement.removeClass('visible').hide();
            selectRow.addClass('visible');
            tableRePaint();
            selectRow.fadeIn(inSpeed);
        }
    }
}

function tableRePaint() {
    var oddBkColor = '#f2f2f2',
        evenBKColor= 'transparent';

    var visible = $('.visible');
    for(var i = 0;i< visible.length;i++){
        var color = ((i+1)%2? oddBkColor:evenBKColor);
        $(visible[i]).css('background-color',color);
    }
}

