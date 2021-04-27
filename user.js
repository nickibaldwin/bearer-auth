'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //encodes the users secret?


//TODO 2:07/8 for a new variable to add****************

const APP_SECRET = 'coolsecret'; //APP_SECRET is hardcoded, should live in environment variable

const users = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true}
}, { toJSON: { virtuals: true}}); //don't read too deep into. you need to add virtuals if you are applying virtual fields


//this creates a virtual field on the usersSchema -> this just means another property in addition to username and password. in this care 'token'. 
//this token property never persists in the DB. Only available when I'm accessing data in the app. Makes it readable for us. New token is created everytime I or a user sign into the app.
users.virtual('token').get(function() { 
  let tokenObj = {
    username: this.username
  }

  return jwt.sign(tokenOnj, APP_SECRET) //this makes a new token, which includes our userName
});

//mongoose hook -> a hook is meant to "hook" into a function, and have it happen at some point in the function process. IE before save, after save
users.pre('save', async function(){ //first argument is a mongoose CRUD method. "Before a user saves, go hash their password"
  this.password = await bcrypt.hash(this.password, 5); //give it some salt (level of complexity), we chose 5
});

//basic auth - 1:38 in snagit
users.statics.authenticateBasic = async function(username, password) {
  const user = this.findOne( { username });
  const valid = await bcrypt.compare(password, user.password) //user.password pulls encoded PW from database

  if(valid) return user; //1:42 snagit
  throw new Error('invalid user');
};

//bearer auth
users.statics.authenticateToken = async function(token) { //bearer. authenticateToken is middleware
  const parsedToken = jwt.verify(token, APP_SECRET);
  const user = this.findOne({ username: parsedToken.username });
  if(user) return user;
  throw new Error('user not found');
};

//snag is 1:49
module.exports = mongoose.model('users', users)