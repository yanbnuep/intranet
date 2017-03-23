/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {
    addImages($('#slick-controler'), 'javascript/dbJSON/test.json', getMainStory, function () {
        // var imgs = $('#mainNews').find('.slide-images');
        $('#slick-controler').slideImages();
    });
    addImages($('#lastnews-list'), 'javascript/dbJSON/lastnews.json', parseLastnews, null);

    $('ul.tabs').tabs('select_tab', 'defaultAPIs');
});

function addImages(selector, location, addHtmlFunction, callback) {
    try {
        $.getJSON(location, function (data) {
            if ($.isFunction(addHtmlFunction))
                var html = addHtmlFunction(data);
            try {
                if (typeof html === 'string') {
                    selector.append(html);
                } else if ($.isArray(html)) {
                    $.each(html, function (index, val) {
                        selector.append(val);
                    })
                }

                if ($.isFunction(callback)) {
                    callback();
                }
            }
            catch (e) {
                console.log('error append element to mainstory:' + e);
            }
        })
    } catch (e) {
        console.log('error getjson:' + e);
    }
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
        newsHtml = '';
    mainStory = json[jsonStr.attrName];
    for (var i = 0; i < mainStory.length; i++) {
        var story = mainStory[i],
            // image = '<div class="img" style="background-image: url(' +
            //     story[jsonStr.image] + ')">\</div>',
            title = '<p class="title"> ' +
                story[jsonStr.title] + '<span class="sub">' + story[jsonStr.subTitle] + '</span>' + '</p>';
        htmlStr = '<a class="slide-images"  href="'+story['href']+'" style="background-image: url('+ story[jsonStr.image]+')">'+title+'</a>';
        // newsHtml.push(htmlStr);
        newsHtml += htmlStr;
    }

    // return newsHtml.join('\n');
    return newsHtml;
}

function parseLastnews(json) {
    var lastNews = json['lastNews'];
    var newsHtml = [];
    $.each(lastNews, function (index, val) {
        var card = $('<a class="card-h"></a>');
        var title = val['title'],
            sub = val['subTitle'],
            href = val['href'],
            imgSrc = val['imgURL'];
        var txt = $('<div class="txt">' +
            '<div class="title">' + title + '</div>' +
            '<div class="sub">' + sub + '</div>' +
            '</div>');
        var img = $('<div class="img">' + '<img src="' + imgSrc + '"></div>');
        card.append(txt);
        card.append(img);
        newsHtml.push(card);
    });
    return newsHtml;
}
