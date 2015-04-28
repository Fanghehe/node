var Post = require('../models/post');

exports.post = function(req,res){
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
};