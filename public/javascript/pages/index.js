/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {
    addMainStory($('#mainNews'));
});



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

