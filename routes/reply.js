var Reply = require('../proxy/reply'),
    markdown = require('markdown').markdown,
    formatDate = require('../common/date').calculateDate;

exports.showReplies = function(id,callback){
    Reply.getRepliesByTopicId(id,callback);
};

exports.postReply = function(req,res){
    var author_id = req.session.user._id,
        topic_id = req.params.t_id,
        ctx = req.body.ctx;
    Reply.newReplyAndSave(author_id,topic_id,ctx,function(err){
        if(err){
            req.flash('error',err);
            return res.redirect('/topic/'+topic_id);
        }
        req.flash('success','发布成功');
        res.redirect('/topic/'+topic_id);
    });
};