var Topic = require('../proxy/topic'),
    Reply = require('../proxy/reply'),
    User = require('../proxy/user'),
    markdown = require('markdown').markdown,
    eventProxy = require('eventProxy'),
    date = require('../common/date'),
    formatDate = require('../common/date').formatDate;

exports.showTopic = function(req,res,next){
    var t_id = require('mongodb').ObjectID(req.params.t_id);
    var events = ['topic','author','replies'],
        ep = eventProxy.create(events,function(topic,author,replies){
            res.render('topic',{
                title:'问题详情',
                topic:topic,
                author:author,
                replies:replies,
                isLogin: !!(req.session.user),
                user:req.session.user
            });
        });
    ep.fail(next);
    Topic.getTopicById(t_id,ep.done(function(doc){
        var topic = doc;
        topic.ctx = markdown.toHTML(doc.ctx);
        topic.posttime = date.calculateDate(doc.time.date);
        User.getUserById(doc.author_id,ep.done('author'));
        ep.emit('topic',topic);
    }));
    Reply.getRepliesByTopicId(t_id,ep.done(function(docs){
        docs.forEach(function(item,i,arr){
            item.ctx = markdown.toHTML(item.ctx);
            item.time = date.calculateDate(item.time_date);
        });
        ep.emit('replies',docs);
    }));
};

exports.postTopic = function(req,res){
    var currentUser = req.session.user;
    var date = new Date();
    var time = {
        date:Date.now(),
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + formatDate(date.getMonth() + 1),
        day: date.getFullYear() + "-" + formatDate(date.getMonth() + 1) + "-" + formatDate(date.getDate()),
        minute: date.getFullYear() + "-" + formatDate(date.getMonth() + 1) + "-" + formatDate(date.getDate()) + " " +
        formatDate(date.getHours()) + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    console.log(currentUser.username);
    Topic.newTopicAndSave(currentUser._id,req.body.title,req.body.ctx,time,function(err){
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发布成功!');
        res.redirect('/');//发表成功跳转到主页
    });

};