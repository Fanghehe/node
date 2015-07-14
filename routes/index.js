var sign = require('./sign'),
    site = require('./site'),
    topic = require('./topic'),
    reply = require('./reply'),
    users = require('./user'),
    admin = require('./admin');

module.exports = function (app) {

    //首页
    app.get(/(^\/$|^\/index$)/, site.index);

    //注册
    app.get('/reg',sign.checkNotLogin,sign.showReg);
    app.post('/reg',[sign.checkUserIsExist,sign.checkEmailIsExist],sign.reg);
    app.get('/active_account',sign.activeAccount);

    //登录
    app.get('/login',sign.checkNotLogin,sign.showLogin);
    app.post('/login',sign.checkNotLogin,sign.login);
    //重置密码
    app.get('/modifyPsw',sign.showModifyPsw);
    app.post('/modifyPsw',sign.modifyPsw);
    //忘记密码
    app.get('/forget',sign.showForget);
    app.post('/resetPsw',sign.resetPsw);

    //创建问题
    app.post('/post',sign.checkLogin,topic.postTopic);
    app.post('/img_upload',topic.uploadImg);//上传图片

    //回复问题
    app.post('/:t_id/reply', reply.postReply);

    //登出
    app.get('/logout',sign.checkLogin,sign.logout);

    //问题详情
    app.get('/topic/:t_id', topic.showTopic);

    //我的
    app.get('/user/:username/questions', users.showUsersQuestions);
    app.get('/user/:username/answers', users.showUsersAnswers);
    app.get('/user/:username/collections', users.showUsersCollections);

    //收藏
    app.get('/doCollection',sign.checkLogin,users.doCollection);

    //搜索
    app.post('/doSuggest',topic.doSuggest);
    app.get('/doSearch',topic.doSearch);

    //后台管理
    app.get('/admin',sign.checkRootLogin,admin.index);
    app.get('/admin/topic',sign.checkRootLogin,admin.index);
    app.get('/admin/notice',sign.checkRootLogin,admin.index);
    app.get('/admin/login',sign.checkRootNotLogin,sign.showRootLogin);
    app.post('/admin/login',sign.checkRootNotLogin,sign.rootLogin);
    app.get('/admin/logout',sign.checkRootLogin,sign.rootLogout);
    app.post('/admin/doSuggest',sign.checkRootLogin,admin.doSuggest);
    app.get('/admin/updatePermission',sign.checkRootLogin,admin.doPermissionUpdate);
    app.post('/admin/doTopicSuggest',sign.checkRootLogin,admin.doTopicSuggest);
    app.get('/admin/updateTopic',sign.checkRootLogin,admin.doTopicUpdate);
    app.post('/admin/postNotice',sign.checkRootLogin,admin.doPostNotice);
};
