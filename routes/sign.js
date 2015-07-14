var validator = require('validator'),
    crypto = require('crypto'),
    User = require('../proxy/user'),
    utils = require('utility'),
    mail = require('../common/mail');

exports.showReg = function(req,res){
    res.render('reg', {
        title: '注册',
        isLogin: !!(req.session.user),
        error: req.flash('error'),
        success:req.flash('success')
    });
};
exports.reg = function (req,res) {
    var username = req.body.username,
        password = req.body.password,
        password_re = req.body['password-repeat'],
        email = req.body.email;

    if (password != password_re) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/reg');//返回注册页
    }
    User.getUserByName(username,function(err,user){
        //用户已经存在
        if(!!user){
            req.flash('error','用户名已存在！');
            return res.redirect('/reg');
        }
    });
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.newUserAndSave(username,password,email,function(err,user){
        if(err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        console.log(user);
        mail.sendActiveMail(email,utils.md5(username+email),username);
        res.render('notification',{
            title: '邮箱验证',
            info:'我们已给您的注册邮箱'+email+'发送了一封邮件，请点击里面的链接来激活您的帐号。',
            isLogin: !!(req.session.user),
            success:req.flash('success')
        });
    });
};
exports.activeAccount = function(req,res){
    var key = req.query.key,
        username = req.query.name;
    console.log(key);
    User.getUserByName(username,function(err,user){
        if(!user || utils.md5(user.username+user.email) != key){
            return res.render('notification',{
                title: '邮箱验证',
                info:'信息有误，激活失败',
                isLogin: !!(req.session.user),
                success:req.flash('success')
            })
        }
        if(user.status){
            return res.render('notification',{
                title: '邮箱验证',
                info:'该账号已经激活',
                isLogin: !!(req.session.user),
                success:req.flash('success')
            });
        }
        user.status = true;
        user.save();
        req.session.user = user;//用户信息存入session
        req.flash('success','注册成功！');
        res.redirect('/');//注册成功后返回主页
    });
};

exports.showLogin = function(req,res){
    res.render('login', {
        title: '登录',
        isLogin: !!(req.session.user),
        error: req.flash('error').toString(),
        success:req.flash('success')

    });
};
exports.showRootLogin = function(req,res){
    res.render('admin-login', {
        title: '系统管理后台登录',
        error: req.flash('error').toString(),
        success:req.flash('success').toString()
    });
};
exports.showModifyPsw = function(req,res){
    res.render('modifyPsw',{
        title:'修改密码',
        isLogin: !!(req.session.user),
        user:req.session.user,
        error: req.flash('error').toString(),
        success:req.flash('success').toString()
    });
};
exports.showForget = function(req,res){
    res.render('forget',{
        title:'重置密码',
        isLogin: !!(req.session.user),
        user:req.session.user,
        error: req.flash('error').toString(),
        success:req.flash('success').toString()
    });
};
exports.resetPsw = function(req,res){
    User.getUserByName((req.body.username),function(err,user){
        //检查用户是否存在
        if (!user) {
            req.flash('error', '用户不存在！');
            return res.redirect('/forget');
        }
        if(req.body.email != user.email){
            req.flash('error', '邮箱不正确！');
            return res.redirect('/forget');
        }
        var pswStr = Math.floor(Math.random()*(Math.pow(16,7))).toString(16);
        var newPsw = crypto.createHash('md5').update(pswStr).digest('hex');
        console.log(pswStr);
        user.password = newPsw;
        user.save();
        mail.sendResetMail(user.email,pswStr,user.username);
        res.render('notification',{
            title: '邮箱验证',
            info:'您的密码已经被重置，我们已给您的注册邮箱'+user.email+'发送了一封邮件，请查收。',
            isLogin: !!(req.session.user),
            success:req.flash('success')
        });

    });
};
exports.modifyPsw = function(req,res){
    var md51 = crypto.createHash('md5'),
        md52 = crypto.createHash('md5'),
        passwordOld = md51.update(req.body.passwordOld).digest('hex'),
        passwordNew = md52.update(req.body.passwordNew).digest('hex');
    User.getUserByName(req.body.username,function(err,user){
        //检查用户是否存在
        if (!user) {
            req.flash('error', '用户不存在！');
            return res.redirect('/modifyPsw');
        }
        //检查密码是否一致
        if (user.password != passwordOld) {
            req.flash('error', '原密码错误');
            return res.redirect('/modifyPsw');
        }
        if(req.body.passwordNew != req.body.passwordNewR){
            req.flash('error', '两次密码不一致');
            return res.redirect('/modifyPsw');
        }
        user.password = passwordNew;
        user.save();
        req.session.user = user;
        req.flash('success', '密码修改成功');
        res.redirect('/');
    });

};
exports.login = function(req,res){
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.getUserByLoginName(req.body.username,function(err,user){
        console.log(user);
        //检查用户是否存在
        if (!user) {
            req.flash('error', '用户不存在！');
            return res.redirect('/login');
        }
        //检查密码是否一致
        if (user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/login');
        }
        //检查用户是否被激活
        if(!user.status){
            req.flash('error', '该用户未激活');
            return res.redirect('/login');
        }
        //用户名密码都匹配后，用户信息存入session
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/');
    });
};
exports.rootLogin = function(req,res){
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.getUserByLoginName(req.body.username,function(err,user){
        if (!user) {
            req.flash('error', '用户不存在！');
            return res.redirect('/admin/login');
        }
        if (!user.isRoot){
            req.flash('error', '不是root用户！');
            return res.redirect('/admin/login');
        }
        if (user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/admin/login');
        }
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/admin?c=user');
    });
};

exports.rootLogout = function(req,res){
    req.session.user = null;
    res.redirect('/admin/login');
};
exports.logout = function (req, res) {
    req.session.user = null;
    res.redirect('/');//登出成功后跳转到主页
};

exports.checkLogin = function(req,res,next){
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};
exports.checkNotLogin = function(req,res,next){
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};
exports.checkUserIsExist = function(req,res,next){
    User.getUserByName(req.body.username,function(err,docs){
        console.log(docs);
        if(docs){
            req.flash('error', '该用户名已存在！');
            return res.redirect('/reg');
        }
        next();
    });
};
exports.checkEmailIsExist = function(req,res,next){
    User.getUserByEmail(req.body.username,function(err,docs){
        if(docs){
            req.flash('error', '该邮箱已注册！');
            return res.redirect('/reg');
        }
        next();
    });
};

exports.checkRootLogin = function(req,res,next){
    if(!req.session.user){
        return res.redirect('/admin/login');
    }else if (!req.session.user.isRoot) {
        req.session.user = null;
        return res.redirect('/admin/login');
    }
    next();
};
exports.checkRootNotLogin = function(req,res,next){
    if(req.session.user&&req.session.user.isRoot){
        return res.redirect('/admin/');
    }
    next();
};