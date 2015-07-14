var mailer = require('nodemailer'),
    utils = require('utility'),
    config = require('../config');

var transporter = mailer.createTransport(config.mailOpts);

exports.sendActiveMail = function(receiver,token,name){
    opts = {
        from:config.mailOpts.auth.user,
        to:receiver,
        subject:'问答平台账号激活',
        html:'<p>您好：' + name + '</p>' +
        '<p>我们收到您在Huster问答平台上得的注册信息，请点击下面的链接来激活帐户：</p>' +
        '<a href="http://' + config.SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>'
    };
    transporter.sendMail(opts,function(err,info){
        if(err){
            console.log(err);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};

exports.sendResetMail = function(receiver,newpsw,name){
    opts = {
        from:config.mailOpts.auth.user,
        to:receiver,
        subject:'问答平台密码重置',
        html:'<p>您好：' + name + '</p>' +
        '<p>您在Huster问答平台上重置了密码，新的密码是:'+newpsw +' 请您尽快替换成新密码</p>' +
        '<a href="http://' + config.SITE_ROOT_URL + '/modifyPsw">修改密码</a>'
    };
    transporter.sendMail(opts,function(err,info){
        if(err){
            console.log(err);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};