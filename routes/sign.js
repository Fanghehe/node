var validator = require('validator'),
    crypto = require('crypto'),
    User = require('../models/user');

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
    var newUser = new User({
        username: username,
        password: password,
        email: email
    });
    //检查用户名是否已经存在
    User.get(newUser.username, function (err, user) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (user) {
            req.flash('error', '用户已经存在');
            return res.redirect('/reg');
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');//注册失败返回主册页
            }
            req.session.user = user;//用户信息存入session
            req.flash('success', '注册成功');
            res.redirect('/reg_success');//注册成功后返回主页
        })
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
    //检查用户是否存在
    User.get(req.body.username, function (err, user) {
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
exports.checkLogin = function(req,res,next){
    if (!req.session.user) {
        res.redirect('/login');
    }
    next();
};
exports.checkNotLogin = function(req,res,next){
    if (req.session.user) {
        req.redirect('back');
    }
    next();
};