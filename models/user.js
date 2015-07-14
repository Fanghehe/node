var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	username : {type:String},
	password : {type:String},
	email : {type:String},
	star_topics : [{type:ObjectId}],
	isAdmin:{type:Boolean,default:false},
	isRoot:{type:Boolean,default:false},
	status:{type:Boolean,default:false}
});

mongoose.model('User',UserSchema);