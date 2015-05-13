var models = require('../models');
var User = models.User;

/**
 * [getUserByLoginName 根据登录名查找用户]
 * @param  {[type]}   loginName [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
exports.getUserByLoginName = function(loginName,callback){
    User.findOne({'username':loginName},callback);
};
/**
 * [newUserAndSave 创建新用户]
 * @param  {[type]} username [description]
 * @param  {[type]} password [description]
 * @param  {[type]} email    [description]
 * @return {[type]}          [description]
 */
exports.newUserAndSave = function(username,password,email,callback){
	var user = new User();
	user.username = username;
	user.password = password;
	user.email = email;
	user.save(callback);
};
exports.getUserByName = function(name,callback){
	User.findOne({'username':name},callback);
};

exports.getUserByEmail = function(email,callback){
	User.findOne({'email':email},callback);
};

exports.getUserById = function(id,callback){
	User.findOne({'_id':id},callback);
};
