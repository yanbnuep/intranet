/**
 * Created by itdwyy on 11/22/2016.
 */
(function () {
    var am = function () {

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
    }
    function autoSearch(){

    }
    am.prototype = {
        //Regex
        rgxGet: rgxGet

    };
    //Expose AMS
    window.am = new am();
})();