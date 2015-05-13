var sign = require('./sign'),
    site = require('./site'),
    topic = require('./topic'),
    reply = require('./reply'),
    users = require('./user');




module.exports = function (app) {

    //首页
    app.get(/(^\/$|^\/index$)/, site.index);

    //注册
    app.get('/reg', sign.checkNotLogin);
    app.get('/reg', sign.showReg);
    app.post('/reg',sign.checkUserIsExist);
    app.post('/reg',sign.checkEmailIsExist);
    app.post('/reg', sign.reg);
    app.get('/reg_success', sign.regSuccess);

    //登录
    app.get('/login', sign.checkNotLogin);
    app.get('/login', sign.showLogin);
    app.post('/login', sign.login);

    //创建问题
    app.post('/post', sign.checkLogin);
    app.post('/post', topic.postTopic);

    //回复问题
    app.post('/:t_id/reply', reply.postReply);

    //登出
    app.get('/logout', sign.checkLogin);
    app.get('/logout', sign.logout);

    //问题详情
    app.get('/topic/:t_id', topic.showTopic);

    //我的
    app.get('/user/', sign.checkLogin);
    app.get('/user/', users.showUsers);


};
