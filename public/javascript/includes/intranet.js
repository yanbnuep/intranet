/**
 * Created by itdwyy on 11/22/2016.
 *//* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function ($) {
    var am = function AM() {
        this.debounce = debounce;
    };
    //Regex
    function rgxGet(req, str, separator) {
        var sep = (separator != undefined) ? separator : '';
        switch (req) {
            case 'number':
                return String(str).replace(/\D/g, sep);
            case 'upperCase':
                return String(str).replace(/\W|\d|[a-z]/g, sep);
            case 'lowerCase':
                return String(str).replace(/\W|\d|[A-Z]/g, sep);
            case 'enChar':
                return String(str).replace(/\W|\d/g, sep);
            case 'nonEn':
                return String(str).replace(/[a-z A-Z]/g, sep);
            default:
                return null;
        }
    }//debounce
    function debounce(func, delay) {
        var timer;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                func.apply(context, args);
            }, delay)
        }
    }

    //add element according to another elements
    function addAccordEle(selector, accordEle) {
        var addNum = $(selector).length;
        for (var i = 0; i < addNum; i++) {
            $(selector).append(accordEle);
        }
    }

    function copyAll(selector) {
        selector = selector instanceof jQuery ? selector : $(selector);
        var outerHtml = selector[0].outerHTML,
            innerHtml = selector.html();
        return $(outerHtml).append(innerHtml);
    }


    function addSlick(slideEle, settings) {

        var defaultSettings = {
                slideDirection: 'lr',
                animate: 'slide',
                infinity: true,
                addDots: true,
                dotContainer: 'dotContainer',
                dotsClass: 'slide-dot',
                leftbtn: '#slick-left',
                rightbtn: '#slick-right',
                duration: 300,
                internal: true,
                slickNum: 1,
                slickContainer: '#slick-container'
            },
            setting = {},
            slideElements = {},
            container = $(),
            eleWidth = 0,
            eleLenght = 0;

        if (typeof settings == 'object') {
            setting = $.extend(defaultSettings, settings);
        } else {
            setting = defaultSettings;
        }
        var slickContainer = $(setting.slickContainer);
        //if slide infinity add clone slide element
        slideElements = slideEle instanceof $ ? slideEle : $(slideEle);
        container = $(slideElements.parent());
        eleWidth = slideEle.width();

        eleLenght = slideElements.length;

        // slickContainer.width(function () {
        //     return eleWidth;
        // });

        if (eleLenght < 2) return null;
        /*1.add first and last element's copy to dom
         2.change the width of parent element and slide left to the first element
         */
        (function (ele) {
            //
            var firstEle = copyAll($(ele[0])).addClass('clone'),
                lastEle = copyAll($(ele[eleLenght - 1])).addClass('clone'),
                eleWidth = $(ele[0]).width();
            $(ele[0]).before(lastEle);
            $(ele[eleLenght - 1]).after(firstEle);
            container.css('width', function () {
                return eleWidth * (ele.length + setting.slickNum * 2)
            });
            container.css('left', -eleWidth);

        })(slideEle);

        /*1.add slide control buttons
         2.slide event append
         */
        $(setting.leftbtn).click(function (e) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            slick('ltr', 1);
        });
        $(setting.rightbtn).click(function (e) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            slick('rtl', 1);
        });

        //add slide dots and click event
        (function (ele) {
            var eleNum = ele.length,
                slick_dots = $('<div class="slick-dots"></div>');
            if (eleNum === 0) return null;
            for (var i = 0; i < eleNum; i++) {
                (function (w) {
                    var slick_btn = $('<div class="dot"></div>').click(function () {
                        slickTo(w);
                    });
                    slick_dots.append(slick_btn);
                })(i);
            }
            slickContainer.append(slick_dots);
            $($('.slick-dots .dot')[0]).addClass("cur");
        })(slideEle);

        //get the left attribute of parent div
        function getLeft() {
            return rgxGet('nonEn', container.css('left'));
        }

        function slick(direction, num) {
            var left = 0;
            var elementWidth = slideEle.width();
            console.log(elementWidth);
            //stop all animate;
            container.finish();
            slideEle.finish();
            if (direction === 'rtl') {
                container.animate({
                    opacity: 1,
                    left: "-=" + elementWidth * num
                }, setting.duration, function () {
                    left = getLeft();
                    if (left <= -container.width() + eleWidth * setting.slickNum) {
                        container.css('left', function () {
                            return -(elementWidth * num);
                        })
                    }
                    chageCur();
                });

            } else if (direction === 'ltr') {
                container.animate({
                    opacity: 1,
                    left: "+=" + elementWidth * num
                }, setting.duration, function () {
                    left = getLeft();
                    if (left >= 0) {
                        container.css('left', function () {
                            return -(container.width() - elementWidth * setting.slickNum * 2);
                        })
                    }
                    chageCur();
                });
            }
        }

        function slickTo(idx) {
            var curLeft = getLeft(),
                elementWidth = slideEle.width(),
                //default slick add id
                shouldLeft = -(elementWidth * (idx + setting.slickNum));
            container.finish();
            container.animate({left: "+=" + (shouldLeft - curLeft)}, setting.duration, function () {
                chageCur(idx);
            });
        }

        //function add class 'cur' to dot
        function chageCur(idx) {
            var left = 0,
                nxIdx = 0;
            $('.slick-dots .dot.cur').removeClass('cur');
            if (idx !== undefined) {
                $($('.slick-dots .dot')[idx]).addClass('cur');
                return null;
            } else {
                left = Math.abs(getLeft());
                nxIdx = left / eleWidth - setting.slickNum;
                $($('.slick-dots .dot')[nxIdx]).addClass('cur');
            }
        }

        // //add internal timer to slick
        // if (setting.internal) {
        //     setInterval(function () {
        //         slick('rtl', 1);
        //     }, 8000);
        // }


        //window resize
        $(window).on('resize',function (event) {
            var windowWidth = $(this).width();
            var eles = $('.slide-images');
            if(windowWidth < 415 ){
                $('#slick-container').width(windowWidth);
                $('#mainNews').width(windowWidth*eles.length);
                eles.width(windowWidth);
            }
        });

    }

    // only one class in group
    function oneClass(selector, addClassName) {
        var targetString = "." + selector.context.className + "." + addClassName;

        var targets = document.querySelectorAll(targetString);
        $.each(targets, function (name, val) {
            $(val).removeClass(addClassName);
        });

        selector.addClass(addClassName);
    }



    //Tabs
    (function ($) {

        var methods = {
            init: function (options) {
                var defaults = {
                    onShow: null
                };
                options = $.extend(defaults, options);
                return this.each(function () {

                });
            }
        }

    }(jQuery));
    am.prototype = {
        //Regex
        rgxGet: rgxGet,
        addSlick: addSlick,
        oneClass: oneClass
    };

    //Expose AM
    window.am = new am();
}));

//telephoneSearch
(function ($, window, document) {
    var setting = {
        mixIpt: 2,
        inWidth: 500,
        outWidth: 200,
        moveSpeed: 150,
        fadeSpeed: 300,
        debounce: 500
    };
    var clickHandler = function (e) {
        // e.preventDefault ? e.preventDefault():(e.returnValue = false);
        autoSearch(this.value)
    };

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
                    document.getElementById('telResult').innerHTML = parseTeleJson(jsonResult);
                }
            });
        } else if (msg.length === 0) {
            $('#telResult').html('');
        }
    }

    function parseTeleJson(jsonData) {
        var resultArray = JSON.parse(jsonData),
            usrName = '',
            htmlString = '';
        $.each(resultArray, function (index, ele) {
                usrName = (ele['PREFER'].length > 1 ? ele['PREFER'] : ele['NAME']);
                var string = '<div class="resultItem">' +
                    '<span class="string bold name">' + usrName + '</span>' +
                    '<span class="num">' + ele['BUSNPHONE'] + '</span>' +
                    '<span class="string sm">' + ele['DIV'] + '</span>' +
                    '</div>';
                var popup = '<div class="popbox">' +
                    '<div class="title">' + ele['NAME'] + '.' + ele['PREFER'] +
                    '<i class="material-icons closebtn">&#xE5CD;</i>' +
                    '</div>' +
                    '<table class="popContent">' +
                    '<tr class="infoRow">' +
                    '<th class="infoTitle">' + 'JobTitle:' + '</th>' + '<td class="info">' + ele['JOBTITLE'] + '</td>' +
                    '</tr><tr>' +
                    '<tr class="infoRow">' +
                    '<th class="infoTitle">' + 'Div:' + '</th>' + '<td class="info">' + ele['DIV'] + '</td>' +
                    '</tr><tr>' +
                    '<th class="infoTitle">' + 'Department:' + '</th>' + '<td class="info">' + ele['DEPT'] + '</td>' +
                    '</tr><tr>' +
                    '<th class="infoTitle">' + 'Telephone:' + '</th>' + '<td class="info">' + ele['BUSNPHONE'] + '</td>' +
                    '</tr><tr>' +
                    '<th class="infoTitle">' + 'Email:' + '</th>' + '<td class="info"><a href="mailto:">' + ele['EMAIL'] + '</a></td>' +
                    '</tr><tr>' +
                    '<th class="infoTitle">' + 'Office:' + '</th>' + '<td class="info">' + ele['OFFICE'] + '</td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>';
                string += popup.replace('null', ' ');
                htmlString += string.replace('null', ' ');
            }
        );
        return htmlString;
    }

    // $('#telSearch').on('keyup', am.debounce(clickHandler, 500)).focusin(function () {
    //     $(this).parent('form.nav-form').stop().animate({width: setting.inWidth}, 150);
    //     $('#telResult').fadeIn(setting.fadeSpeed);
    // }).focusout(function () {
    //     var input = this;
    //     setTimeout(function () {
    //         $(input).parent('form.nav-form').stop().animate({width: setting.outWidth}, 150);
    //         $('#telResult').fadeOut(setting.fadeSpeed);
    //     }, 100);
    // });


    function popup(ele) {
        $('#telecover').addClass('active');
        var clone = $(ele).clone();
        $(document.body).prepend($(clone).addClass('active'));
    }

    $(document).on('click', '.resultItem', function (event) {
        // event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        event.stopPropagation();
        var popbox = $(this).next('.popbox');
        popup(popbox);
    });

    $(document).on('click', '.material-icons.closebtn', function (event) {
        var btn = event.target;
        var cover = $('#telecover');
        var contactform = $(btn).parents('.popbox');
        contactform.remove();
        cover.removeClass('active');
    });

}(jQuery, window, document));


//for window scroll
(function ($) {
    $.fn.extend({
        debounce: function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };


        },
        scrollDistance: function (handler, wait) {
            var previous = 0;
            $(this).on('scroll', $(this).debounce(function () {
                var cur = $(this).scrollTop();
                var distance = cur - previous;
                if ($.isFunction(handler)) {
                    handler(distance);
                }
                previous = cur;
            }, wait))
        }
    })
}(jQuery));

//navbar

(function ($) {

    var dispearNavbar = $('#secondNav');
    var firstNav = $('#firstNav');

    function navStateChange(distance) {
        if(distance > 100) {
            dispearNavbar.slideUp(400,function () {
                firstNav.addClass('z-depth-2 IEborder');
            });
        }else if(distance < 0) {
            if(firstNav.hasClass('z-depth-2')){
                firstNav.removeClass('z-depth-2');
            }
            if(dispearNavbar.css('display')=== 'none'){
               dispearNavbar.slideDown(400);
            }
        }
    }
    $(document).ready(function () {
        $(window).scrollDistance(navStateChange, 100);
    });
}(jQuery));

//for tabs
(function ($) {
    var methods = {
        init: function (options) {
            var defaults = {
                onshow: null
            };
            options = $.extend(defaults, options);

            return this.each(function () {
                var $this = $(this),
                    window_width = $(window).width();

                var $active, $content, $links = $this.find('li.tab a'),
                    $tabs_width = $this.width(),
                    $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length,
                    $index = 0;
                //animate div height change
                var curHeight, nextHeight;

                // Finds right attribute for indicator based on active tab.
                // el: jQuery Object
                var calcRightPos = function (el) {
                    return $tabs_width - el.position().left - el.outerWidth() - $this.scrollLeft();
                };
                // Finds left attribute for indicator based on active tab.
                // el: jQuery Object
                var calcLeftPos = function (el) {
                    return el.position().left + $this.scrollLeft();
                };
                // If the location.hash matches one of the links, use that as the active tab.
                $active = $($links.filter('[href="' + location.hash + '"]'));
                // If no match is found, use the first link or any with class 'active' as the initial active tab.
                if ($active.length === 0) {
                    $active = $(this).find('li.tab a.active').first();
                }
                if ($active.length === 0) {
                    $active = $(this).find('li.tab a').first();
                }

                $active.addClass('active');
                $index = $links.index($active);
                if ($index < 0) {
                    $index = 0;
                }
                if ($active[0] !== undefined) {
                    $content = $($active[0].hash);
                }
                // append indicator then set indicator width to tab width
                $this.append('<div class="indicator"></div>');
                var $indicator = $this.find('.indicator');
                if ($this.is(":visible")) {
                    // $indicator.css({"right": $tabs_width - (($index + 1) * $tab_width)});
                    // $indicator.css({"left": $index * $tab_width});
                    setTimeout(function () {
                        $indicator.css({"right": calcRightPos($active)});
                        $indicator.css({"left": calcLeftPos($active)});
                    }, 0);
                }
                $(window).resize(function () {
                    $tabs_width = $this.width();
                    $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length;
                    if ($index < 0) {
                        $index = 0;
                    }
                    if ($tab_width !== 0 && $tabs_width !== 0) {
                        $indicator.css({"right": calcRightPos($active)});
                        $indicator.css({"left": calcLeftPos($active)});
                    }
                });

                // Bind the click event handler
                $this.on('click', 'a', function (e) {
                    if ($(this).parent().hasClass('disabled')) {
                        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                        return null;
                    }
                    $tabs_width = $this.width();
                    $tab_width = Math.max($tabs_width, $this[0].scrollWidth) / $links.length;

                    //Make the old tab inactive.
                    //remember the height of cur content
                    $active.removeClass('active');
                    if ($content !== undefined) {
                        curHeight = $content.outerHeight();
                        $content.hide();
                    }
                    // Update the variables with the new link and content
                    //animate the height change
                    $active = $(this);
                    $content = $(escapeHash(this.hash));
                    $links = $this.find('li.tab a');
                    var activeRect = $active.position();
                    // Make the tab active.
                    $active.addClass('active');
                    var $prev_index = $index;
                    $index = $links.index($(this));
                    if ($index < 0) {
                        $index = 0;
                    }
                    // Change url to current tab
                    // window.location.hash = $active.attr('href');

                    if ($content !== undefined) {
                        var contentHeight = $content.outerHeight();
                        if (curHeight && curHeight != contentHeight) {
                            nextHeight = contentHeight;
                            // $content.height(curHeight).velocity({"height":nextHeight},{ duration: 600, queue: false, easing: 'easeOutQuad'});
                            $content.height(curHeight).animate({"height": nextHeight}, {duration: 300, queue: false});
                            $content.show();
                        } else {
                            $content.show();
                        }

                        if (typeof(options.onShow) === "function") {
                            options.onShow.call(this, $content);
                        }
                    }

                    // Update indicator

                    if (($index - $prev_index) >= 0) {
                        $indicator.velocity({"right": calcRightPos($active)}, {
                            duration: 300,
                            queue: false,
                            easing: 'easeOutQuad'
                        });
                        $indicator.velocity({"left": calcLeftPos($active)}, {
                            duration: 300,
                            queue: false,
                            easing: 'easeOutQuad',
                            delay: 90
                        });

                    } else {
                        $indicator.velocity({"left": calcLeftPos($active)}, {
                            duration: 300,
                            queue: false,
                            easing: 'easeOutQuad'
                        });
                        $indicator.velocity({"right": calcRightPos($active)}, {
                            duration: 300,
                            queue: false,
                            easing: 'easeOutQuad',
                            delay: 90
                        });

                    }
                    // console.log('right: '+calcRightPos($active) + ' left: '+calcLeftPos($active));
                    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
                });
            });
        },
        select_tab: function (id) {
            this.find('a[href="#' + id + '"]').trigger('click');
        }

    };
    $.fn.tabs = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.tabs');
        }
    };
    $(document).ready(function () {
        $('ul.tabs').tabs();
    });
    function escapeHash(hash) {
        return hash.replace(/(:|\.|\[|\]|,|=)/g, "\\$1");
    }
}(jQuery));


// Generated by CoffeeScript 1.6.1
(function() {

    (function($, window, document) {
        var Plugin, defaults, pluginName;
        pluginName = "slidesjs";
        defaults = {
            width: 940,
            height: 528,
            start: 1,
            navigation: {
                active: true,
                effect: "slide"
            },
            pagination: {
                active: true,
                effect: "slide"
            },
            play: {
                active: false,
                effect: "slide",
                interval: 5000,
                auto: false,
                swap: true,
                pauseOnHover: false,
                restartDelay: 2500
            },
            effect: {
                slide: {
                    speed: 500
                },
                fade: {
                    speed: 300,
                    crossfade: true
                }
            },
            activClass: 'cur',
            callback: {
                loaded: function() {},
                start: function() {},
                complete: function() {}
            }
        };
        Plugin = (function() {

            function Plugin(element, options) {
                this.element = element;
                this.options = $.extend(true, {}, defaults, options);
                this._defaults = defaults;
                this._name = pluginName;
                this.init();
            }

            return Plugin;

        })();
        Plugin.prototype.init = function() {
            var $element, nextButton, pagination, playButton, prevButton, stopButton,
                _this = this;
            $element = $(this.element);
            this.data = $.data(this);
            $.data(this, "animating", false);
            $.data(this, "total", $element.children().not(".slidesjs-navigation", $element).length);
            $.data(this, "current", this.options.start - 1);
            $.data(this, "vendorPrefix", this._getVendorPrefix());
            if (typeof TouchEvent !== "undefined") {
                $.data(this, "touch", true);
                this.options.effect.slide.speed = this.options.effect.slide.speed / 2;
            }
            $element.css({
                overflow: "hidden"
            });
            $element.slidesContainer = $element.children().not(".slidesjs-navigation", $element).wrapAll("<div class='slidesjs-container'>", $element).parent().css({
                overflow: "hidden",
                position: "relative"
            });
            $(".slidesjs-container", $element).wrapInner("<div class='slidesjs-control'>", $element).children();
            $(".slidesjs-control", $element).css({
                position: "relative",
                left: 0
            });
            $(".slidesjs-control", $element).children().addClass("slidesjs-slide").css({
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 0,
                display: "none",
                webkitBackfaceVisibility: "hidden"
            });
            $.each($(".slidesjs-control", $element).children(), function(i) {
                var $slide;
                $slide = $(this);
                return $slide.attr("slidesjs-index", i);
            });
            if (this.data.touch) {
                $(".slidesjs-control", $element).on("touchstart", function(e) {
                    return _this._touchstart(e);
                });
                $(".slidesjs-control", $element).on("touchmove", function(e) {
                    return _this._touchmove(e);
                });
                $(".slidesjs-control", $element).on("touchend", function(e) {
                    return _this._touchend(e);
                });
            }
            $element.fadeIn(0);
            this.update();
            if (this.data.touch) {
                this._setuptouch();
            }
            $(".slidesjs-control", $element).children(":eq(" + this.data.current + ")").eq(0).fadeIn(0, function() {
                return $(this).css({
                    zIndex: 10
                });
            });
            if (this.options.navigation.active) {
                prevButton = $("<a>", {
                    "class": "slide-btn big center-v left zindexthetop slidesjs-navigation",
                    href: "#",
                    title: "Previous",
                    text: "Previous"
                }).appendTo($element);
                nextButton = $("<a>", {
                    "class": "slide-btn big center-v right zindexthetop slidesjs-navigation",
                    href: "#",
                    title: "Next",
                    text: "Next"
                }).appendTo($element);
            }
            $(".slide-btn.big.right", $element).click(function(e) {
                e.preventDefault();
                _this.stop(true);
                return _this.next(_this.options.navigation.effect);
            });
            $(".slide-btn.big.left", $element).click(function(e) {
                e.preventDefault();
                _this.stop(true);
                return _this.previous(_this.options.navigation.effect);
            });
            if (this.options.play.active) {
                playButton = $("<a>", {
                    "class": "slidesjs-play slidesjs-navigation",
                    href: "#",
                    title: "Play",
                    text: "Play"
                }).appendTo($element);
                stopButton = $("<a>", {
                    "class": "slidesjs-stop slidesjs-navigation",
                    href: "#",
                    title: "Stop",
                    text: "Stop"
                }).appendTo($element);
                playButton.click(function(e) {
                    e.preventDefault();
                    return _this.play(true);
                });
                stopButton.click(function(e) {
                    e.preventDefault();
                    return _this.stop(true);
                });
                if (this.options.play.swap) {
                    stopButton.css({
                        display: "none"
                    });
                }
            }
            if (this.options.pagination.active) {
                pagination = $("<ul>", {
                    "class": "slide-dots zindexMost"
                }).appendTo($element);
                $.each(new Array(this.data.total), function(i) {
                    var paginationItem, paginationLink;
                    paginationItem = $("<li>", {
                        "class": "dot"
                    }).appendTo(pagination);
                    paginationLink = $("<a>", {
                        href: "#",
                        "data-slidesjs-item": i,
                        html: i + 1
                    }).appendTo(paginationItem);
                    return paginationLink.click(function(e) {
                        e.preventDefault();
                        _this.stop(true);
                        return _this.goto(($(e.currentTarget).attr("data-slidesjs-item") * 1) + 1);
                    });
                });
            }
            $(window).bind("resize", function() {
                return _this.update();
            });
            this._setActive();
            if (this.options.play.auto) {
                this.play();
            }
            return this.options.callback.loaded(this.options.start);
        };
        Plugin.prototype._setActive = function(number) {
            var $element, current;
            $element = $(this.element);
            this.data = $.data(this);
            current = number > -1 ? number : this.data.current;
            $(".active", $element).removeClass("active");
            return $(".slide-dots li:eq(" + current + ") a", $element).addClass("active");
        };
        Plugin.prototype.update = function() {
            var $element, height, width;
            $element = $(this.element);
            this.data = $.data(this);
            $(".slidesjs-control", $element).children(":not(:eq(" + this.data.current + "))").css({
                display: "none",
                left: 0,
                zIndex: 0
            });
            width = $element.width();
            height = (this.options.height / this.options.width) * width;
            this.options.width = width;
            this.options.height = height;
            return $(".slidesjs-control, .slidesjs-container", $element).css({
                width: width,
                height: height
            });
        };
        Plugin.prototype.next = function(effect) {
            var $element;
            $element = $(this.element);
            this.data = $.data(this);
            $.data(this, "direction", "next");
            if (effect === void 0) {
                effect = this.options.navigation.effect;
            }
            if (effect === "fade") {
                return this._fade();
            } else {
                return this._slide();
            }
        };
        Plugin.prototype.previous = function(effect) {
            var $element;
            $element = $(this.element);
            this.data = $.data(this);
            $.data(this, "direction", "previous");
            if (effect === void 0) {
                effect = this.options.navigation.effect;
            }
            if (effect === "fade") {
                return this._fade();
            } else {
                return this._slide();
            }
        };
        Plugin.prototype.goto = function(number) {
            var $element, effect;
            $element = $(this.element);
            this.data = $.data(this);
            if (effect === void 0) {
                effect = this.options.pagination.effect;
            }
            if (number > this.data.total) {
                number = this.data.total;
            } else if (number < 1) {
                number = 1;
            }
            if (typeof number === "number") {
                if (effect === "fade") {
                    return this._fade(number);
                } else {
                    return this._slide(number);
                }
            } else if (typeof number === "string") {
                if (number === "first") {
                    if (effect === "fade") {
                        return this._fade(0);
                    } else {
                        return this._slide(0);
                    }
                } else if (number === "last") {
                    if (effect === "fade") {
                        return this._fade(this.data.total);
                    } else {
                        return this._slide(this.data.total);
                    }
                }
            }
        };
        Plugin.prototype._setuptouch = function() {
            var $element, next, previous, slidesControl;
            $element = $(this.element);
            this.data = $.data(this);
            slidesControl = $(".slidesjs-control", $element);
            next = this.data.current + 1;
            previous = this.data.current - 1;
            if (previous < 0) {
                previous = this.data.total - 1;
            }
            if (next > this.data.total - 1) {
                next = 0;
            }
            slidesControl.children(":eq(" + next + ")").css({
                display: "block",
                left: this.options.width
            });
            return slidesControl.children(":eq(" + previous + ")").css({
                display: "block",
                left: -this.options.width
            });
        };
        Plugin.prototype._touchstart = function(e) {
            var $element, touches;
            $element = $(this.element);
            this.data = $.data(this);
            touches = e.originalEvent.touches[0];
            this._setuptouch();
            $.data(this, "touchtimer", Number(new Date()));
            $.data(this, "touchstartx", touches.pageX);
            $.data(this, "touchstarty", touches.pageY);
            return e.stopPropagation();
        };
        Plugin.prototype._touchend = function(e) {
            var $element, duration, prefix, slidesControl, timing, touches, transform,
                _this = this;
            $element = $(this.element);
            this.data = $.data(this);
            touches = e.originalEvent.touches[0];
            slidesControl = $(".slidesjs-control", $element);
            if (slidesControl.position().left > this.options.width * 0.5 || slidesControl.position().left > this.options.width * 0.1 && (Number(new Date()) - this.data.touchtimer < 250)) {
                $.data(this, "direction", "previous");
                this._slide();
            } else if (slidesControl.position().left < -(this.options.width * 0.5) || slidesControl.position().left < -(this.options.width * 0.1) && (Number(new Date()) - this.data.touchtimer < 250)) {
                $.data(this, "direction", "next");
                this._slide();
            } else {
                prefix = this.data.vendorPrefix;
                transform = prefix + "Transform";
                duration = prefix + "TransitionDuration";
                timing = prefix + "TransitionTimingFunction";
                slidesControl[0].style[transform] = "translateX(0px)";
                slidesControl[0].style[duration] = this.options.effect.slide.speed * 0.85 + "ms";
            }
            slidesControl.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
                prefix = _this.data.vendorPrefix;
                transform = prefix + "Transform";
                duration = prefix + "TransitionDuration";
                timing = prefix + "TransitionTimingFunction";
                slidesControl[0].style[transform] = "";
                slidesControl[0].style[duration] = "";
                return slidesControl[0].style[timing] = "";
            });
            return e.stopPropagation();
        };
        Plugin.prototype._touchmove = function(e) {
            var $element, prefix, slidesControl, touches, transform;
            $element = $(this.element);
            this.data = $.data(this);
            touches = e.originalEvent.touches[0];
            prefix = this.data.vendorPrefix;
            slidesControl = $(".slidesjs-control", $element);
            transform = prefix + "Transform";
            $.data(this, "scrolling", Math.abs(touches.pageX - this.data.touchstartx) < Math.abs(touches.pageY - this.data.touchstarty));
            if (!this.data.animating && !this.data.scrolling) {
                e.preventDefault();
                this._setuptouch();
                slidesControl[0].style[transform] = "translateX(" + (touches.pageX - this.data.touchstartx) + "px)";
            }
            return e.stopPropagation();
        };
        Plugin.prototype.play = function(next) {
            var $element, currentSlide, slidesContainer,
                _this = this;
            $element = $(this.element);
            this.data = $.data(this);
            if (!this.data.playInterval) {
                if (next) {
                    currentSlide = this.data.current;
                    this.data.direction = "next";
                    if (this.options.play.effect === "fade") {
                        this._fade();
                    } else {
                        this._slide();
                    }
                }
                $.data(this, "playInterval", setInterval((function() {
                    currentSlide = _this.data.current;
                    _this.data.direction = "next";
                    if (_this.options.play.effect === "fade") {
                        return _this._fade();
                    } else {
                        return _this._slide();
                    }
                }), this.options.play.interval));
                slidesContainer = $(".slidesjs-container", $element);
                if (this.options.play.pauseOnHover) {
                    slidesContainer.unbind();
                    slidesContainer.bind("mouseenter", function() {
                        return _this.stop();
                    });
                    slidesContainer.bind("mouseleave", function() {
                        if (_this.options.play.restartDelay) {
                            return $.data(_this, "restartDelay", setTimeout((function() {
                                return _this.play(true);
                            }), _this.options.play.restartDelay));
                        } else {
                            return _this.play();
                        }
                    });
                }
                $.data(this, "playing", true);
                $(".slidesjs-play", $element).addClass("slidesjs-playing");
                if (this.options.play.swap) {
                    $(".slidesjs-play", $element).hide();
                    return $(".slidesjs-stop", $element).show();
                }
            }
        };
        Plugin.prototype.stop = function(clicked) {
            var $element;
            $element = $(this.element);
            this.data = $.data(this);
            clearInterval(this.data.playInterval);
            if (this.options.play.pauseOnHover && clicked) {
                $(".slidesjs-container", $element).unbind();
            }
            $.data(this, "playInterval", null);
            $.data(this, "playing", false);
            $(".slidesjs-play", $element).removeClass("slidesjs-playing");
            if (this.options.play.swap) {
                $(".slidesjs-stop", $element).hide();
                return $(".slidesjs-play", $element).show();
            }
        };
        Plugin.prototype._slide = function(number) {
            var $element, currentSlide, direction, duration, next, prefix, slidesControl, timing, transform, value,
                _this = this;
            $element = $(this.element);
            this.data = $.data(this);
            if (!this.data.animating && number !== this.data.current + 1) {
                $.data(this, "animating", true);
                currentSlide = this.data.current;
                if (number > -1) {
                    number = number - 1;
                    value = number > currentSlide ? 1 : -1;
                    direction = number > currentSlide ? -this.options.width : this.options.width;
                    next = number;
                } else {
                    value = this.data.direction === "next" ? 1 : -1;
                    direction = this.data.direction === "next" ? -this.options.width : this.options.width;
                    next = currentSlide + value;
                }
                if (next === -1) {
                    next = this.data.total - 1;
                }
                if (next === this.data.total) {
                    next = 0;
                }
                this._setActive(next);
                slidesControl = $(".slidesjs-control", $element);
                if (number > -1) {
                    slidesControl.children(":not(:eq(" + currentSlide + "))").css({
                        display: "none",
                        left: 0,
                        zIndex: 0
                    });
                }
                slidesControl.children(":eq(" + next + ")").css({
                    display: "block",
                    left: value * this.options.width,
                    zIndex: 10
                });
                this.options.callback.start(currentSlide + 1);
                if (this.data.vendorPrefix) {
                    prefix = this.data.vendorPrefix;
                    transform = prefix + "Transform";
                    duration = prefix + "TransitionDuration";
                    timing = prefix + "TransitionTimingFunction";
                    slidesControl[0].style[transform] = "translateX(" + direction + "px)";
                    slidesControl[0].style[duration] = this.options.effect.slide.speed + "ms";
                    return slidesControl.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function() {
                        slidesControl[0].style[transform] = "";
                        slidesControl[0].style[duration] = "";
                        slidesControl.children(":eq(" + next + ")").css({
                            left: 0
                        });
                        slidesControl.children(":eq(" + currentSlide + ")").css({
                            display: "none",
                            left: 0,
                            zIndex: 0
                        });
                        $.data(_this, "current", next);
                        $.data(_this, "animating", false);
                        slidesControl.unbind("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd");
                        slidesControl.children(":not(:eq(" + next + "))").css({
                            display: "none",
                            left: 0,
                            zIndex: 0
                        });
                        if (_this.data.touch) {
                            _this._setuptouch();
                        }
                        return _this.options.callback.complete(next + 1);
                    });
                } else {
                    return slidesControl.stop().animate({
                        left: direction
                    }, this.options.effect.slide.speed, (function() {
                        slidesControl.css({
                            left: 0
                        });
                        slidesControl.children(":eq(" + next + ")").css({
                            left: 0
                        });
                        return slidesControl.children(":eq(" + currentSlide + ")").css({
                            display: "none",
                            left: 0,
                            zIndex: 0
                        }, $.data(_this, "current", next), $.data(_this, "animating", false), _this.options.callback.complete(next + 1));
                    }));
                }
            }
        };
        Plugin.prototype._fade = function(number) {
            var $element, currentSlide, next, slidesControl, value,
                _this = this;
            $element = $(this.element);
            this.data = $.data(this);
            if (!this.data.animating && number !== this.data.current + 1) {
                $.data(this, "animating", true);
                currentSlide = this.data.current;
                if (number) {
                    number = number - 1;
                    value = number > currentSlide ? 1 : -1;
                    next = number;
                } else {
                    value = this.data.direction === "next" ? 1 : -1;
                    next = currentSlide + value;
                }
                if (next === -1) {
                    next = this.data.total - 1;
                }
                if (next === this.data.total) {
                    next = 0;
                }
                this._setActive(next);
                slidesControl = $(".slidesjs-control", $element);
                slidesControl.children(":eq(" + next + ")").css({
                    display: "none",
                    left: 0,
                    zIndex: 10
                });
                this.options.callback.start(currentSlide + 1);
                if (this.options.effect.fade.crossfade) {
                    slidesControl.children(":eq(" + this.data.current + ")").stop().fadeOut(this.options.effect.fade.speed);
                    return slidesControl.children(":eq(" + next + ")").stop().fadeIn(this.options.effect.fade.speed, (function() {
                        slidesControl.children(":eq(" + next + ")").css({
                            zIndex: 0
                        });
                        $.data(_this, "animating", false);
                        $.data(_this, "current", next);
                        return _this.options.callback.complete(next + 1);
                    }));
                } else {
                    return slidesControl.children(":eq(" + currentSlide + ")").stop().fadeOut(this.options.effect.fade.speed, (function() {
                        slidesControl.children(":eq(" + next + ")").stop().fadeIn(_this.options.effect.fade.speed, (function() {
                            return slidesControl.children(":eq(" + next + ")").css({
                                zIndex: 10
                            });
                        }));
                        $.data(_this, "animating", false);
                        $.data(_this, "current", next);
                        return _this.options.callback.complete(next + 1);
                    }));
                }
            }
        };
        Plugin.prototype._getVendorPrefix = function() {
            var body, i, style, transition, vendor;
            body = document.body || document.documentElement;
            style = body.style;
            transition = "transition";
            vendor = ["Moz", "Webkit", "Khtml", "O", "ms"];
            transition = transition.charAt(0).toUpperCase() + transition.substr(1);
            i = 0;
            while (i < vendor.length) {
                if (typeof style[vendor[i] + transition] === "string") {
                    return vendor[i];
                }
                i++;
            }
            return false;
        };
        return $.fn[pluginName] = function(options) {
            return this.each(function() {
                if (!$.data(this, "plugin_" + pluginName)) {
                    return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
                }
            });
        };
    })(jQuery, window, document);

}).call(this);
