$('#btn-collect').on('click', function (e) {
    $.ajax({
        url:'/doCollection',
        type:'get',
        data:{
            action:$(this).attr('data-action'),
            topicId:$(this).attr('data-id')
        },
        success:function(data){
            console.log(data);
            if(data.state == 'fail'){
                alert('出错了！');
                return false;
            }else if(data.state == 'success'){
                if($('#btn-collect').attr('data-action')=="add"){
                    $('#btn-collect').removeClass('btn-success').addClass('btn-danger').attr({'data-action':"del"}).html('取消收藏');
                }else{
                    $('#btn-collect').removeClass('btn-danger').addClass('btn-success').attr({'data-action':"add"}).html('加入收藏');
                }
            }
        },
        error:function(err){
            alert('出错了！');
        }
    });
});