var editor = new Simditor({
    textarea:$('#message-text'),
    upload:{
        url:'/img_upload',
        params: null,
        fileKey: 'upload_file',
        connectionCount:3,
        leaveConfirm:'正在上传文件，如果离开上传会自动取消',
        pasteImage:true,
        defaultImage:'/images/default.jpg'
    },
    livemd:true
});
$('.simditor-toolbar').css('width','auto');



