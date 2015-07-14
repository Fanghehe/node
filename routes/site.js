var Topic = require('../proxy/topic');
var Admin = require('../proxy/admin');

exports.index = function (req,res) {
    Admin.getNoticeByLatest(function(err,notices){
        var notes = [];
        notes.length = notices.length;
        notices.forEach(function(notice,index,arr){
            notes[index] = (notice.ctx.replace(/ /g,'&nbsp;')).replace(/\r/g,'</br>');
        });
        Topic.getTopicByOrder(function(err,docs){
            docs.forEach(function(doc,index,arr){
            });
            console.log(req.session.user);
            res.render('index', {
                title: '首页',
                groupName:'近期问题',
                topics: docs,
                notice:notes,
                isLogin: !!(req.session.user),
                user:req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

};