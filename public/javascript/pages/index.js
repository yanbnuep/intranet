/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {
    //search action
    $('#telSearch').on('keyup', am.debounce(function(){
        autoSearch(this.value);
    },500)).focusin(function () {
        $(this).parent('form.nav-form').stop().animate({width: 700},200);
        $('#telResult').fadeIn(300);
    }).focusout(function () {
        $(this).parent('form.nav-form').stop().animate({width: 200}, 200);
        $('#telResult').fadeOut(300);
    });

    //main story
    mainStory(addMainStory);

});

function autoSearch(msg) {
    //start with 3 chars
    var str = '',
        num = '';
    if (msg.length > 1) {
        str = am.rgxGet('enChar', msg).toUpperCase();
        num = am.rgxGet('number', msg);
        $.ajax({
            url: '/db/autoSearch',
            method: 'get',
            data: {
                name: str,
                number: num
            },
            success: function (jsonResult) {
                document.getElementById('telResult').innerHTML= parseTeleJson(jsonResult);
            }
        });
    }else if(msg.length === 0){
        $('#telResult').html('');
    }
}

function parseTeleJson(jsonData) {
    var resultArray = JSON.parse(jsonData),
        htmlString = '';

    $.each(resultArray,function (index,ele) {
            var string = '<div class="resultItem">'+
                    '<span class="string bold">'+ele['PREFER']+'</span>'+
                    '<span class="num">'+ele['BUSNPHONE']+'</span>'+
                    '<span class="string sm">'+ele['DIV']+'</span>'+
                    '</div>';
            htmlString += string.replace('null',' ');
        }
    );
    return htmlString;
}

function mainStory(callback){
    $.ajax({
        url: '/db/mainStory',
        method: "POST",
        error: function (err) {
            console.log('Main story ajax error:'+err);
        }
    }).done(function (data) {
        callback(data);
    });
}

function addMainStory(json){
    console.log(json);
}