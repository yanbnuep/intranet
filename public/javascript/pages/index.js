/**
 * Created by itdwyy on 12/6/2016.
 */
$(document).ready(function () {

    $('#telSearch').keyup(function () {
        autoSearch(this.value);
    });
});

function autoSearch(msg){
    //start with 2 chars
    if(msg.length > 1) {
        console.log(am.rgxGet('number',msg));
    }else {
        return null;
    }
}