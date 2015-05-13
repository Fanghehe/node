var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ReplySchema = new Schema({
    ctx : {type:String},
    topic_id : {type:ObjectId},
    author_id : {type:ObjectId},
    time_date : {type:Date,default:Date.now}
});

mongoose.model('Reply',ReplySchema);
