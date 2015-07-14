var models = require('../models');
var eventProxy = require('eventProxy');
var Reply = models.Reply,
    User = require('./user');

exports.getRepliesByTopicId = function(id,callback){
    Reply.find({topic_id:id},function(err,docs){
        var ep = new eventProxy();
        ep.after('reply_author_find',docs.length,function(){
            callback(null,docs);
        });
        docs.forEach(function(item,i,arr){
            User.getUserById(item.author_id,function(err,author){
                if(err){
                    return callback(err);
                }
                docs[i].author = author;
                ep.emit('reply_author_find');
            })
        });
    });
};

exports.getRepliesByAuthorId = function(id,callback){
    Reply.find({author_id:id},null,{sort:{time_date:-1}},callback);
};

exports.newReplyAndSave = function(author_id,topic_id,ctx,callback){
    var reply = new Reply();
    reply.author_id = author_id;
    reply.topic_id = topic_id;
    reply.ctx = ctx;
    reply.save(callback);
};

