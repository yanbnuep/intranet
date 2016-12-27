/**
 * Created by itdwyy on 11/22/2016.
 *//* global window, document, define, jQuery, setInterval, clearInterval */
(function(factory) {
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
        var sep = (separator != undefined)? separator : '';
        switch (req) {
            case 'number':
                return String(str).replace(/\D/g,sep);
            case 'upperCase':
                return String(str).replace(/\W|\d|[a-z]/g,sep);
            case 'lowerCase':
                return String(str).replace(/\W|\d|[A-Z]/g,sep);
            case 'enChar':
                return String(str).replace(/\W|\d/g,sep);
            default:
                return null;
        }
    }//debounce
    function debounce(func, delay) {
        var timer;
        return function(){
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                func.apply(context, args);
            },delay)
        }
    }
    //add element according to another elements
    function addAccordEle(selector,accordEle) {
        var addNum = $(selector).length;
        for(var i = 0;i<addNum;i++){
            $(selector).append(accordEle);
        }
    }
    am.prototype = {
        //Regex
        rgxGet: rgxGet

    };
    //Expose AM
    window.am = new am();
}));