var Topic = require('../proxy/topic'),
    Reply = require('../proxy/reply'),
    User = require('../proxy/user'),
    Admin = require('../proxy/admin'),
    markdown = require('markdown').markdown,
    eventProxy = require('eventProxy'),
    date = require('../common/date'),
    formatDate = date.formatDate;

exports.showTopic = function(req,res,next){
    var t_id = require('mongodb').ObjectID(req.params.t_id);
    var events = ['topic','author','replies'],
        ep = eventProxy.create(events,function(topic,author,replies){
            console.log(req.session.user.star_topics[2]);
            console.log(topic._id.toString());
            console.log(req.session.user.star_topics.indexOf(topic._id.toString()));
            res.render('topic',{
                title:'问题详情',
                topic:topic,
                author:author,
                replies:replies,
                isLogin: !!(req.session.user),
                user:req.session.user,
                isStared:(!!req.session.user)?req.session.user.star_topics.indexOf(topic._id.toString()):-1,
                success:req.flash('success')
            });
        });
    ep.fail(next);
    Topic.getTopicById(t_id,ep.done(function(doc){
        var topic = doc;
        //topic.ctx = markdown.toHTML(doc.ctx);
        topic.ctx = doc.ctx;
        topic.posttime = date.calculateDate(doc.time.date);
        ep.emit('topic',topic);
        User.getUserById(doc.author_id,ep.done('author'));
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
    Topic.newTopicAndSave(currentUser._id,req.body.title,req.body.ctx,time,function(err){
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发布成功!');
        res.redirect('/');//发表成功跳转到主页
    });
};

exports.uploadImg = function(req,res){
    res.json({
        'success':true,
        'msg':'图片上传成功',
        'file_path':'/uploads/'+req.files.upload_file.name
    });
};

exports.doSuggest = function(req,res){
    Topic.getTopicsByMixed(req.param('input-search'),function(err,docs){
        var arr = [];
        arr.length = docs.length;
        docs.forEach(function(doc,i){
           arr[i] = doc.title;
        });
        console.log(docs);
        res.json(arr);
    });
};

exports.doSearch = function(req,res){
    Admin.getNoticeByLatest(function(err,notices) {
        var notes = [];
        notes.length = notices.length;
        notices.forEach(function (notice, index, arr) {
            notes[index] = (notice.ctx.replace(/ /g, '&nbsp;')).replace(/\r/g, '</br>');
        });
        Topic.getTopicsByMixed(req.param('input-search'), function (err, docs) {
            res.render('index', {
                title: req.param('input-search') + ' 的搜索结果',
                groupName: req.param('input-search') + ' 的搜索结果',
                topics: docs,
                isLogin: !!(req.session.user),
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                notice:notes
            });
        });
    });
};