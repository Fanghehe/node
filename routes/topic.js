var Post = require('../models/post'),
    markdown = require('markdown').markdown,
    date = require('../common/date');

exports.showTopic = function(req,res){
    Post.get({'_id':require('mongodb').ObjectID(req.params.t_id)}, function (err, post) {
        if (err) {
        }
        post[0].ctx = markdown.toHTML(post[0].ctx);
        res.render('question', {
            title: '问题',
            post: post[0],
            time:  date.calculateDate(post[0].time.date),
            isLogin: !!(req.session.user)
        });
    });
};
