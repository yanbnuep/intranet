/**
 * Created by itdwyy on 11/22/2016.
 */
(function () {
    var am = function () {

    };
    //Regex
    function rgxGet(req, str) {

        var reqReg = {
            number: /\d+/g,
            upperCase: /\W+/g,
            lowerCase: /\w+/g
        };
        if(reqReg[req]){
            return String(str).match(reqReg[req]);
        }
    }

    am.prototype = {
        //Regex
        rgxGet: rgxGet

    };
    //Expose AMS
    window.am = new am();
})();