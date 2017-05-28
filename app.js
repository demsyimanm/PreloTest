var express  = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var config = require('./config');

app.use(bodyParser.json());
app.use(cookieParser());

var url = '/api/v1';

Users = require('./models/users');
Posts = require('./models/posts');

mongoose.connect(config.database);
app.set('superSecret', config.secret);
var db = mongoose.connection;

var apiRoutes = express.Router(); 
apiRoutes.use(function(req, res, next) {
  	var token = req.body.token || req.query.token || req.headers['x-access-token'];
  	if (token) {
	    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        req.decoded = decoded;    
	        next();
	      }
	    });

	} else {
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
  	}
});

app.use('/api',apiRoutes);

app.get('/', function(req, res){
	res.send('cobaan');
})

app.post('/authenticate', function(req, res){
	Users.getUserByUsername( req.body.username, function(err, user) {
    	if (err) throw err;
    	if (user.length == 0) {
      		res.json({ success: false, message: 'Authentication failed. User not found.' });
    	} else {
    		user = user[0];
	      	if (user.password != req.body.password) {
	        	res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	      	} else {
		        var token = jwt.sign(user, app.get('superSecret'), {
		          expiresIn : 60*60*24
		        });
		        res.json({
			          success: true,
			          message: 'Enjoy your token!',
			          token: token
		        });
	      	}   
    	}
  	});
});

//USERS
app.get('/users', function(req, res){
	Users.getUsers(function(err, users){
		if(err){
			throw err;
		}
		res.json(users);
	});
})

app.get(url+'/users/:_id', function(req, res){
	Users.getUserById(req.params._id,function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
})

app.post('/users', function(req, res){
	var user = req.body;
	Users.addUser(user,function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
})

app.put(url+'/users/:_id', function(req, res){
	var id = req.params._id;
	var user = req.body;
	Users.updateUser(id,user,{},function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
})

app.delete(url+'/users/:_id', function(req, res){
	var id = req.params._id;
	Users.deleteUser(id,function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
})

app.get(url+'/users/username/:username', function(req, res){
	Users.getUserByUsername(req.params.username,function(err, user){
		if(err){
			throw err;
		}
		res.json(user);
	});
})

//POSTS
app.get(url+'/posts', function(req, res){
	Posts.getPosts(function(err, posts){
		if(err){
			throw err;
		}
		res.json(posts);
	});
})

app.get(url+'/posts/:_id', function(req, res){
	Posts.getPostById(req.params._id,function(err, post){
		if(err){
			throw err;
		}
		res.json(post);
	});
})

app.get('/users/:user_id/posts', function(req, res){
	Posts.getPostByUserId(req.params.user_id,function(err, posts){
		if(err){
			throw err;
		}
		res.json(posts);
	});
})

app.post(url+'/posts', function(req, res){
	var post = req.body;
	Posts.addPost(post,function(err, post){
		if(err){
			throw err;
		}
		res.json(post);
	});
})

app.post(url+'/posts/:_id/repost', function(req, res){
	var post = req.body;
	Posts.repostPost(post,function(err, post){
		if(err){
			throw err;
		}
		res.json(post);
	});
})


app.get(url+'/logout', function(req, res){
	console.log("Cookies :  ", req.cookies);
	res.clearCookie();
    res.send('Cookie deleted');
})


var server = app.listen(3000, function () {
var host = server.address().address;
var port = server.address().port;
console.log('Example app listening at http://%s:%s', host, port);
});