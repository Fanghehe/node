var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TopicSchema = new Schema({
    author_id : {type:ObjectId},
    title : {type:String},
    ctx : {type:String},
    visit_count : {type:Number,default:0},
    time : {
        date:{type:Date,default:Date.now},
        year: {type:String},
        month: {type:String},
        day: {type:String},
        minute: {type:String}
    }
});

mongoose.model('Topic',TopicSchema);