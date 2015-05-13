var models = require('../models');
var Topic = models.Topic;


exports.getTopicByOrder = function(callback){
	Topic.find({},null,{sort:{"time.date":-1}},callback);
};

/**
 * [getTopicById 根据ID查找问题]
 * @return {[type]} [description]
 */
exports.getTopicById = function(id,callback){
	Topic.findOneAndUpdate({_id:id},{$inc:{"visit_count":1}},callback);
};

exports.getTopicsByAuthorId = function(id,callback){
	Topic.find({author_id:id},null,{sort:{"time.date":-1}},callback);
};

/**
 * [newTopicAndSave 创建新问题]
 * @param  {[type]} author [description]
 * @param  {[type]} title  [description]
 * @param  {[type]} ctx    [description]
 * @return {[type]}        [description]
 */
exports.newTopicAndSave = function(author_id,title,ctx,time,callback){
	var topic = new Topic();
	topic.author_id = author_id;
	topic.title = title;
	topic.ctx = ctx;
	topic.time = time;
	topic.save(callback)
};
