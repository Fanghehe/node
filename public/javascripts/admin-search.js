$(function(){
    var Select = BUI.Select;
    var content = '',
        render = '',
        name = '',
        url = '';
    if($('#admin-username-wrap').length){
        content = '<input type="text" class="form-control" id="username" name="admin-username" placeholder="用户名">';
        render = '#admin-search-wrap';
        name = 'admin-username';
        url = '/admin/doSuggest';
    }else if($('#admin-topic-wrap').length){
        content = '<input type="text" class="form-control" id="topic" name="admin-topic" placeholder="问题标题">';
        render = '#admin-search-wrap';
        name = 'admin-topic';
        url = '/admin/doTopicSuggest';
    }
    var suggest = new Select.Suggest({
        render:render,
        content:content,
        forceFit:false,
        name:name,
        dataType:'json',
        url:url
        //data:['1222224','234445','122','111112222241222224111111111111111111111111']
    });
    suggest.render();
    $('#admin-username-wrap').on('click','.btn',function(e){
        permissionController($(this).attr('data-action'),function(data){
           alert(data.result);
        });
    });
    $('#admin-topic-wrap').on('click','.btn',function(e){
        topicController($(this).attr('data-action'),function(data){
            alert(data.result);
        });
    });
    function topicController(action,callback){
        $.ajax({
            url:'/admin/updateTopic',
            type:'get',
            data:{
                action:action,
                topic:$('#topic').val()
            },
            success:function(data){
                callback(data);
            },
            error:function(err){
                alert('出错了！');
            }
        });
    }
    function permissionController(action,callback){
        $.ajax({
            url:'/admin/updatePermission',
            type:'get',
            data:{
                action:action,
                username:$('#username').val()
            },
            success:function(data){
                callback(data);
            },
            error:function(err){
                alert('出错了！');
            }
        });
    }
});