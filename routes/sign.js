var validator = require('validator'),
    crypto = require('crypto'),
    User = require('../proxy/user');

exports.showReg = function(req,res){
    res.render('reg', {
        title: '注册',
        isLogin: !!(req.session.user),
        error: req.flash('error')
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
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.newUserAndSave(username,password,email,function(err,user){
        if(err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        req.session.user = user;//用户信息存入session
        req.flash('success', '注册成功');
        res.redirect('/index');//注册成功后返回主页
    });
};
exports.showLogin = function(req,res){
    res.render('login', {
        title: '登录',
        isLogin: !!(req.session.user),
        error: req.flash('error').toString()
    });
};
exports.login = function(req,res){
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.getUserByLoginName(req.body.username,function(err,user){
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
        //用户名密码都匹配后，用户信息存入session
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/');
    });
};
exports.regSuccess = function (req, res) {
    res.render('reg_success', {
        title: '注册成功',
        isLogin: !!(req.session.user)
    });
};
exports.logout = function (req, res) {
    req.session.user = null;
    res.redirect('/');//登出成功后跳转到主页
}

exports.checkLogin = function(req,res,next){
    if (!req.session.user) {
        res.redirect('/login');
    }
    next();
};
exports.checkNotLogin = function(req,res,next){
    if (req.session.user) {
        res.redirect('back');
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