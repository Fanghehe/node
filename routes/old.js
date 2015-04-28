var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    markdown = require('markdown').markdown;


module.exports = function (app) {
    //首页
    app.get(/(^\/$|^\/index$)/, function (req, res) {
        Post.get(null, function (err, posts) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '首页',
                posts: posts,
                isLogin: !!(req.session.user),
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });

    });

    //注册
    app.get('/login', checkNotLogin);
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: '注册',
            isLogin: !!(req.session.user),
            error: req.flash('error')
        });
    });
    app.get('/login', checkNotLogin);
    app.post('/reg', function (req, res) {
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

    });
    app.get('/reg_success', function (req, res) {
        res.render('reg_success', {
            title: '注册成功',
            isLogin: !!(req.session.user)
        });
    });

    //登录
    app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login', {
            title: '登录',
            isLogin: !!(req.session.user),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', function (req, res) {
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
    });

    //创建问题
    app.post('/post', checkLogin);
    app.post('/post', function (req, res) {
        var currentUser = req.session.user,
            post = new Post(currentUser.username, req.body.title, req.body.ctx);
        post.save(function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/');//发表成功跳转到主页
        });
    });

    //登出
    app.get('/logout', checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        res.redirect('/');//登出成功后跳转到主页
    });

    //问题详情
    app.get('/question/:t_id', function (req, res) {
        Post.get({'_id':require('mongodb').ObjectID(req.params.t_id)}, function (err, post) {
            if (err) {
            }
            post.ctx = markdown.toHTML(post.ctx);
            res.render('question', {
                title: '问题',
                post: post[0],
                time:  calculateDate(post[0].time.date),
                isLogin: !!(req.session.user)
            });
        });

    });

    //我的
    app.get('/my', checkLogin);
    app.get('/my', function (req, res) {
        res.render('my', {
            title: '我的',
            isLogin: !!(req.session.user)
        });
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.redirect('back');
        }
        next();
    }

    //计算合适的时间
    function calculateDate(oldDate) {
        var timeInterval = (new Date()).getTime() - oldDate.getTime();
        var years = timeInterval / (365 * 24 * 3600 * 1000),
            months = timeInterval / (30 * 24 * 3600 * 1000),
            days = timeInterval / (24 * 3600 * 1000),
            hours = timeInterval / (3600 * 1000),
            minutes = timeInterval / (60 * 1000),
            seconds = timeInterval / (1000);
        if (Math.floor(years)) {
            return Math.round(years) + '年';
        } else if (Math.floor(months)){
            return Math.round(months) + '月';
        }else if (Math.floor(days)){
            return Math.round(days) + '日';
        }else if (Math.floor(hours)){
            return Math.round(hours) + '小时';
        }else if (Math.floor(minutes)){
            return Math.round(minutes) + '分';
        }else if (Math.floor(seconds)){
            return Math.round(seconds) + '秒';
        }
    }
};
