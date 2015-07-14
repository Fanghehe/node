var models = require('../models'),
    Notice = models.Notice,
    Topic = models.Topic;

exports.newNoticeAndSave = function(author_id,author_name,ctx,callback){
    var notice = new Notice();
    notice.author_id = author_id;
    notice.author_name = author_name;
    notice.ctx = ctx;
    notice.save(callback);
};

exports.getNoticeByLatest = function(callback){
    Notice.find({},null,{sort:{date:-1}},callback);
};

exports.getTopicByNameAndSetWeight = function(title,weight,callback){
    Topic.update({title:title},{$set:{weight:weight}},callback);
};