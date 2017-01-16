/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {
    //search action
    $('#telSearch').on('keyup', am.debounce(function () {
        autoSearch(this.value);
    }, 500)).focusin(function () {
        $(this).parent('form.nav-form').stop().animate({width: 700}, 150);
        $('#telResult').fadeIn(300);
    }).focusout(function () {
        $(this).parent('form.nav-form').stop().animate({width: 200}, 150);
        $('#telResult').fadeOut(300);
    });

    //main story add slick function
    addMainStory($('#mainNews'));

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
                console.log(jsonResult);
                document.getElementById('telResult').innerHTML = parseTeleJson(jsonResult);
            }
        });
    } else if (msg.length === 0) {
        $('#telResult').html('');
    }
}

function parseTeleJson(jsonData) {
    var resultArray = JSON.parse(jsonData),
        htmlString = '';

    $.each(resultArray, function (index, ele) {
            var string = '<div class="resultItem">' +
                '<span class="string bold">' + ele['PREFER'] + '</span>' +
                '<span class="num">' + ele['BUSNPHONE'] + '</span>' +
                '<span class="string sm">' + ele['DIV'] + '</span>' +
                '</div>';
            htmlString += string.replace('null', ' ');
        }
    );
    return htmlString;
}

function addMainStory(selector) {
    $.getJSON('javascript/dbJSON/ajax.json', function (data) {
        var html = getMainStory(data),
            eleLength = 0;
        try {
            selector.append(html);
            if (selector.is('#mainNews')) {
                am.addSlick($("#mainNews .slide-images"));
            }
        }
        catch (e) {
            console.log('error append element to mainstory:' + e);
        }
    })
}

function getMainStory(json) {
    var jsonStr = {
            attrName: 'mainStory',
            image: "imgUrl",
            title: "title",
            subTitle: "subTitle",
            href: "href",
            order: "index"
        },
        htmlStr = '',
        newsHtml = [];
    mainStory = json[jsonStr.attrName];

    for (var i = 0; i < mainStory.length; i++) {
        var story = mainStory[i],
            image = '<div class="img" style="background-image: url(' +
                story[jsonStr.image] + ')">\</div>',
            title = '<p class="title"> ' +
                story[jsonStr.title] +'<span class="sub">'+story[jsonStr.subTitle]+'</span>'+ '</p>';
        htmlStr = '<a href="' + story[jsonStr.href] + '" class="slide-images">' + image + title + '</a>';
        newsHtml.push(htmlStr);
    }

    return newsHtml.join('\n');
}

function addDots(selector) {

}