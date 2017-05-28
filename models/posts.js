var mongoose = require('mongoose');

var postsSchema = mongoose.Schema({
	judul:{
		type: String,
		required:true
	},
	konten:{
		type: String,
		required: true
	},
	users_id:{
		type: String,
		required: true
	},
	parent:{
		type: String,
		required: false
	},
	repost_parent:{
		type: String,
		required: false
	}
});

var Posts = module.exports = mongoose.model('Posts', postsSchema);

module.exports.getPosts = function(callback, limit){
	Posts.find(callback).limit(limit);
};

module.exports.getPostById = function(id, callback){
	Posts.findById(id,callback);
};

module.exports.getPostByUserId = function(user_id, callback){
	Posts.find({"users_id":  user_id},callback);
};

module.exports.addPost = function(post,callback){
	Posts.create(post, callback);
};

module.exports.repostPost = function(post,callback){
	Posts.create(post, callback);
};
