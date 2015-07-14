var User = require('../proxy/user');
var Topic = require('../proxy/topic');
var Admin = require('../proxy/admin');
exports.index = function(req,res){
    console.log(req.param('c'));
    if(!req.param('c')){
        return res.redirect('/admin?c=user');
    }
    var viewConfig = 0;
    switch (req.param('c').toString()){
        case 'topic':
            viewConfig = 1;
            break;
        case 'notice':
            viewConfig = 2;
            break;
        default :
            viewConfig = 0;
    }
    res.render('admin',{
        view:viewConfig
    });
};

exports.doSuggest = function(req,res){
    console.log(req.param('admin-username'));
    User.getUsersByRegex(req.param('admin-username'),function(err,docs){
        var arr = [];
        arr.length = docs.length;
        docs.forEach(function(doc,i){
            arr[i] = doc.username;
        });
        res.json(arr);
    })
};
exports.doTopicSuggest = function(req,res){
    Topic.getTopicsByMixed(req.param('admin-topic'),function(err,docs){
        var arr = [];
        arr.length = docs.length;
        docs.forEach(function(doc,i){
            arr[i] = doc.title;
        });
        res.json(arr);
    });
};
exports.doPostNotice = function(req,res){
    console.log(req.body);
    Admin.newNoticeAndSave(req.session.user._id,req.session.user.username,req.body['admin-notice'],function(err){
        if (err) {
            req.flash('error', err);
            return res.redirect('/admin/notice');
        }
        res.redirect('/');
    });
};
exports.doTopicUpdate = function(req,res){
    var action = req.param('action'),
        topic = req.param('topic');
    if(action == 'doTop'){
        Admin.getTopicByNameAndSetWeight(topic,1,function(err,doc){
            if(err){
                return res.json({'result':'服务器出错'});
            }
            if(!doc){
                return res.json({'result':topic+'问题不存在'});
            }
            return res.json({'result':topic+'置顶成功！'});
        });
    }else if(action =='cancelTop'){
        Admin.getTopicByNameAndSetWeight(topic,0,function(err,doc){
            if(err){
                return res.json({'result':'服务器出错'});
            }
            if(!doc){
                return res.json({'result':topic+'问题不存在'});
            }
            return res.json({'result':topic+'取消置顶成功！'});
        });
    }else if(action =='delTopic'){
        Topic.removeTopicByName(topic,function(err,doc){
            if(err){
                return res.json({'result':'服务器出错'});
            }
            if(!doc){
                return res.json({'result':topic+'问题不存在'});
            }
            return res.json({'result':topic+'删除成功！'});
        });
    }
};
exports.doPermissionUpdate = function(req,res){
    var action = req.param('action'),
        name = req.param('username');
    console.log(action+' '+name);
    if(action == "upgrade"){
        User.upgradePermission(name,function(err,user){
            if(err){
                return res.json({'result':'服务器出错'});
            }
            if(!user){
                return res.json({'result':name+'用户不存在'});
            }
            return res.json({'result':name+'的回复权限升级成功！'});
        });
    }else if(action == "demote"){
        User.demotePermission(name,function(err,user){
            if(err){
                return res.json({'result':'服务器出错'});
            }
            if(!user){
                return res.json({'result':name+'用户不存在'});
            }
            return res.json({'result':name+'的回复权限降级成功！'});
        });
    }
};