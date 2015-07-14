$(function(){
    $('#reg_form').on('submit',function(e){
        if(checkNull($('#inputName'),'用户名')&&checkNull($('#inputPsw'),'密码')&&checkNull($('#inputPswr'),'确认密码')&&checkNull($('#inputEmail'),'电子邮箱')&&checkEmail()&&checkPsw()){
        }else{
            return false;
        }
    });
    $('#inputName').on('blur',function(e){
        checkNull($('#inputName'),'用户名');
    });
    $('#inputPsw').on('blur',function(e){
        checkNull($('#inputPsw'),'密码');
    });
    $('#inputPswr').on('blur',function(e){
        checkNull($('#inputPswr'),'确认密码');
        checkPsw();
    });
    $('#inputEmail').on('blur',function(e){
        checkNull($('#inputEmail'),'电子邮箱');
        checkEmail();
    });
    function checkEmail(){
        if(!isEmail($('#inputEmail').val())){
            $('#inputEmail').parents('.form-group').addClass('has-error');
            $('span.has-error').text('邮箱格式不正确');
            return false;
        }else{
            $('#inputEmail').parents('.form-group').removeClass('has-error');
            $('span.has-error').text('');
            return true;
        }
    }
    function checkPsw(){
        if(!isSame($('#inputPsw').val(),$('#inputPswr').val())){
            $('#inputPswr').parents('.form-group').addClass('has-error');
            $('span.has-error').text('俩次输入的密码不相同');
            return false;
        }else{
            $('#inputPswr').parents('.form-group').removeClass('has-error');
            $('span.has-error').text('');
            return true;
        }
    }
    function checkNull(elem,key){
        if(!elem.val()){
            $('span.has-error').text(key+'不能为空!');
            elem.parents('.form-group').addClass('has-error');
            return false
        }
        $('span.has-error').text('');
        elem.parents('.form-group').removeClass('has-error');
        return true;
    }
});


