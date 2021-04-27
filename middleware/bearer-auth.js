'use strict';

//2:02
const users = require('./users.js')
//============================TODO adjust route


module.exports = (req, res, next) => {
  if(!req.headers.authorization) { next('invalid login')}

  let token = req.headers.authorization.split(' ')[1];
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

}

//req.headers.authorization on sign in, grab the username and password, check against the database, then if it's correct then give us back the user info? 2:06:30 snagit