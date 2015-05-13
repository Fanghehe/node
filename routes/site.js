var Topic = require('../proxy/topic');

exports.index = function (req,res) {
    Topic.getTopicByOrder(function(err,docs){
        docs.forEach(function(doc,index,arr){
        });
        console.log(req.session.user);
        res.render('index', {
            title: '首页',
            topics: docs,
            isLogin: !!(req.session.user),
            user:req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
};