$(function(){
    var toast = $('#toast-item');
    if(!!toast.text()){
        toast.fadeIn(500);
        setTimeout(function(){
            toast.fadeOut(500);
        },2000)
    }
});