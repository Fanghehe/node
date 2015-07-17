var path = require('path');

var config = {
	host:'localhost',
	port:27017,

	SITE_ROOT_URL:'localhost:3000',

	db : "mongodb://localhost/node_forum",
	db_name : "node_forum",

	session_secret : "node_form_secret",

	upload : {
		path:path.join(__dirname,'/public/uploads/'),
		url:'/public/uploads/'
	},

	mailOpts : {
		host:'smtp.163.com',
		port:25,
		auth:{
			user:'shang4000@163.com',
			pass:''
		}

	}
};

module.exports = config;
