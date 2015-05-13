var path = require('path');

var config = {
	host:'localhost',
	port:27017,

	db : "mongodb://localhost/node_forum",
	db_name : "node_forum",

	session_secret : "node_form_secret"
};

module.exports = config;