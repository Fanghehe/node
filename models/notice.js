var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var NoticeSchema = new Schema({
    author_id : {type:ObjectId},
    author_name : {type:String},
    ctx : {type:String},
    date : {type:Date,default:Date.now}
});

mongoose.model('Notice',NoticeSchema);