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
            //stop all animate;
            container.finish();
            slideEle.finish();
            if (direction === 'rtl') {
                container.animate({
                    opacity: 1,
                    left: "-=" + eleWidth * num
                }, setting.duration, function () {
                    left = getLeft();
                    if (left <= -container.width() + eleWidth * setting.slickNum) {
                        container.css('left', function () {
                            return -(eleWidth * num);
                        })
                    }
                    chageCur();
                });

            } else if (direction === 'ltr') {
                container.animate({
                    opacity: 1,
                    left: "+=" + eleWidth * num
                }, setting.duration, function () {
                    left = getLeft();
                    if (left >= 0) {
                        container.css('left', function () {
                            return -(container.width() - eleWidth * setting.slickNum * 2);
                        })
                    }
                    chageCur();
                });
            }
        }

        function slickTo(idx) {
            var curLeft = getLeft(),
                //default slick add id
                shouldLeft = -(eleWidth * (idx + setting.slickNum));
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

        //add internal timer to slick
        if (setting.internal) {
            setInterval(function () {
                slick('rtl', 1);
            }, 8000);
        }

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