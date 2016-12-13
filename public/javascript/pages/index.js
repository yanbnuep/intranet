/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {
    //search action
    $('#telSearch').on('keyup', am.debounce(function(){
        autoSearch(this.value);
    },500)).focusin(function () {
        $(this).parent('form.nav-form').stop().animate({margin:0,width: 350},300);
        $('#telResult').fadeIn(300);
    }).focusout(function () {
        $(this).parent('form.nav-form').stop().animate({marginLeft : 150,width: 200}, 300);
        $('#telResult').fadeOut(300);
    });
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
                var htmlString = parseTeleJson(jsonResult);
                document.getElementById('telResult').innerHTML= htmlString;
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

