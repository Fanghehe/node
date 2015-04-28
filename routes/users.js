exports.showUsers = function(req,res){
  res.render('my', {
    title: '我的',
    isLogin: !!(req.session.user)
  });
};
