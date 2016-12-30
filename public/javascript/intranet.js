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
                duration: 250,
                internal: true
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

            container.css('width', function (ele) {
                return $(this).width() + eleWidth * 2;
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
        function slick(direction, num) {
            //get container's position
            var getLeft = function () {
                return rgxGet('number', container.css('left'))
            };
            var left = 0;
            //stop all animate;
            container.finish();
            slideEle.finish();
            if (direction === 'rtl') {
                container.animate({
                    opacity: 1,
                    left: "-=" + eleWidth * num
                }, setting.duration, function () {
                    left = -getLeft();
                    console.log(left - eleWidth * num);
                    if (left - eleWidth * num <= -container.width()) {
                        console.log(container.width());
                        container.css('left', function () {
                            return -(eleWidth * num);
                        })
                    }
                });

            } else if (direction === 'ltr') {
                container.animate({
                    opacity: 1,
                    left: "+=" + eleWidth * num
                }, setting.duration, function () {
                    left = -getLeft();
                    if ((left + eleWidth * num) >= 0) {
                        container.css('left', function () {
                            return (eleWidth * num + 1) - container.width();
                        })
                    }
                });
            }
        }
        //add internal timer to slick
        if(setting.internal){
            setInterval(function () {
                slick('rtl',1);
            },7000);
        }

    }

    am.prototype = {
        //Regex
        rgxGet: rgxGet,
        addSlick: addSlick
    };

    //Expose AM
    window.am = new am();
}));