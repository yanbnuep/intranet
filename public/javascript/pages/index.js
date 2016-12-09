/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {

    $('#telSearch').keyup(function () {
        autoSearch(this.value,this);
    });
});

function autoSearch(msg,checkElemnt) {
    //start with 3 chars
    var str = '',
        elementValue = checkElemnt.value,
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
            success: function (data) {
                //if it is the last ajax request,
                if(checkElemnt.value === elementValue){
                    console.log(data);
                }
            }
        });
    }
}

function teleSearch(name, number) {

}

function autoComplete() {

}

