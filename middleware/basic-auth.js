'use strict';

//1:56 snagit
const base64 = require('base-64'); //we need this to decode req.headers.authorization
const users = require('./users.js')
//============================TODO adjust route


module.exports = (req, res, next) => {
  if(!req.headers.authorization) { next('not authorized')}

  let basic = req.headers.authorization.split(' ').pop();
  //above is encoded username and password
  let [user, pass] = base64.decode(basic).split(':');//1:59

  //lets use our authenticateBasic method on the user model to check username and password
//2:00 
  users.authenticateBasic(user, pass)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(e => next('invalid login'))

  next();
}