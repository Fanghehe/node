var Topic = require('../proxy/topic'),
    Reply = require('../proxy/reply'),
    User = require('../proxy/user'),
    date = require('../common/date');
var eventProxy = require('eventProxy');

/**
 * [showUsersQuestions description]
 * @req  {[Object]}
 * @res  {[Object]}
 * @next  {Function}
 * @return {[Object]}
 */
exports.showUsersQuestions = function(req,res,next){
  var events = ['user','topics'];//注册eventProxy事件
  var ep = eventProxy.create(events,function(user,topics){
      res.render('user',{//渲染user模板
          title:user.username+'的个人主页',
          topics:topics,
          isLogin:!!(req.session.user),
          tabs:[true,false,false],
          user:req.session.user,
          success:req.flash('success')
      });
  });
  ep.fail(next);
  //调用User对象的getUserByName方法：根据用户名查找用户
  User.getUserByName(req.params.username,ep.done(function(user){
      ep.emit('user',user);//触发user事件，并将查询以user返回
      Topic.getTopicsByAuthorId(user._id,ep.done(function(topics){
          topics.forEach(function(topic,i){
              topic.posttime = date.calculateDate(topic.time.date);
          });
          ep.emit('topics',topics);
      }));
  }));
};

exports.showUsersAnswers = function(req,res,next){
    var events = ['user','replies','topics'];
    var ep = eventProxy.create(events,function(user,replies,topics){
        res.render('user',{
            title:user.username+'的个人主页',
            replies:replies,
            topics:topics,
            isLogin:!!(req.session.user),
            tabs:[false,true,false],
            user:req.session.user,
            success:req.flash('success')
        });
    });
    ep.fail(next);
    User.getUserByName(req.params.username,ep.done(function(user){
        ep.emit('user',user);
        Reply.getRepliesByAuthorId(user._id,ep.done(function(replies){
            var topics = [];
            ep.emit('replies',replies);
            ep.after('replies_topics_find',replies.length,function(){
                ep.emit('topics',topics);
            });
            replies.forEach(function(reply,i){
                reply.posttime = date.calculateDate(reply.time_date);
                Topic.getTopicById(reply.topic_id,function(err,topic){
                    if(err){
                        return callback(err);
                    }
                    topic.posttime = date.calculateDate(topic.time.date);
                    topics.push(topic);
                    ep.emit('replies_topics_find');
                });
            })
        }))
    }));
};

exports.showUsersCollections = function(req,res,next){
    var events = ['user','topics'];
    var ep = eventProxy.create(events,function(user,topics){
        res.render('user',{
            title:user.username+'的个人主页',
            topics:topics,
            isLogin:!!(req.session.user),
            tabs:[false,false,true],
            user:req.session.user,
            success:req.flash('success')
        });
    });
    ep.fail(next);
    User.getUserByName(req.params.username,ep.done(function(user){
        var topics = [];
        ep.emit('user',user);
        ep.after('user_star_topics_find',user.star_topics.length,function(){
            ep.emit('topics',topics);
        });
        user.star_topics.forEach(function(topic_id,i){
            Topic.getTopicById(topic_id,function(err,topic){
                if(err){
                    return callback(err);
                }
                topic.posttime = date.calculateDate(topic.time.date);
                topics.unshift(topic);
                ep.emit('user_star_topics_find');
            })
        })
    }))
};

exports.doCollection = function(req,res){
    if(req.param('action') =='add'){
        User.addCollection(req.session.user._id,req.param('topicId'),function(err,user){
            console.log(user);
            if(err){
                return res.json({state:'fail'});
            }
            req.session.user = user;//更新session
            return res.json({state:'success'});
        });
    }else if(req.param('action') =='del'){
        User.delCollection(req.session.user._id,req.param('topicId'),function(err,user){
            if(err){
                return res.json({state:'fail'});
            }
            req.session.user = user;//更新session
            return res.json({state:'success'});
        });
    }
};
