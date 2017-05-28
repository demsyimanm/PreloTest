var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
	username:{
		type: String,
		required:true
	},
	password:{
		type: String,
		required: true
	}
});

var Users = module.exports = mongoose.model('Users', usersSchema);

//get Users
module.exports.getUsers = function(callback, limit){
	Users.find(callback).limit(limit);
};

module.exports.getUserById = function(id, callback){
	Users.findById(id,callback);
};

module.exports.getUserByUsername = function(username, callback){
	Users.find({"username":  username},callback);
};

module.exports.addUser = function(user,callback){
	Users.create(user, callback);
};

module.exports.updateUser = function(id, user ,options ,callback){
	var query = {
		_id : id
	};
	var update = {
		username: user.username,
		password: user.password,
	}

	Users.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteUser = function(id ,callback){
	var query = {
		_id : id
	};
	Users.remove(query, callback);
};