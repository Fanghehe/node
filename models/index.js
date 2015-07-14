var mongoose = require('mongoose');
var config = require('../config');

mongoose.connect(config.db,function (err) {
  if (err) {
    console.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

require('./user');
require('./topic');
require('./reply');
require('./notice');

exports.User = mongoose.model('User');
exports.Topic = mongoose.model('Topic');
exports.Reply = mongoose.model('Reply');
exports.Notice = mongoose.model('Notice');