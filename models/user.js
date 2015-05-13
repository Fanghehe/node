var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username : {type:String},
	password : {type:String},
	email : {type:String}
});

mongoose.model('User',UserSchema);