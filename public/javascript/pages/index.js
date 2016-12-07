/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {

    $('#telSearch').keyup(function () {
        autoSearch(this.value);
    });
});

function autoSearch(msg){
    //start with 3 chars
    var str = '',
        num = '';
    if(msg.length > 1) {
        str = am.rgxGet('enChar',msg);
        num = am.rgxGet('number',msg);
        $.ajax({
            url: '/db/autoSearch',
            method: 'get',
            data: {name:str,number:num},
            success: function(data){
                
            }

        });
    }
}

function teleSearch(name,number) {

}

function autoComplete() {

}

