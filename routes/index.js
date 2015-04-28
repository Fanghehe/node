var sign = require('./sign'),
    site = require('./site'),
    post = require('./post'),
    topic = require('./topic'),
    users = require('./users');




module.exports = function (app) {

    //首页
    app.get(/(^\/$|^\/index$)/, site.index);

    //注册
    app.get('/reg', sign.checkNotLogin);
    app.get('/reg', sign.showReg);
    app.post('/reg', sign.reg);
    app.get('/reg_success', function (req, res) {
        res.render('reg_success', {
            title: '注册成功',
            isLogin: !!(req.session.user)
        });
    });

    //登录
    app.get('/login', sign.checkNotLogin);
    app.get('/login', sign.showLogin);
    app.post('/login', sign.login);

    //创建问题
    app.post('/post', sign.checkLogin);
    app.post('/post', post.post);

    //登出
    app.get('/logout', sign.checkLogin);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        res.redirect('/');//登出成功后跳转到主页
    });

    //问题详情
    app.get('/question/:t_id', topic.showTopic);

    //我的
    app.get('/my', sign.checkLogin);
    app.get('/my', users.showUsers);


};
