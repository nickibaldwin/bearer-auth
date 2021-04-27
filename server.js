'use strict';

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const { response } = require('express');

const basicAuth = require('./basic-auth.js');
const bearerAuth = require('./bearer-auth.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3333;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors);

//2:08 
app.post('/signup', (req, res)) => {
  const user = new user(req.body);
  user.save()
    .then(user => {
      res.send('you are signed up!'); //not a real world scenario, see below
      // res.redirect('/dashboard.html') -> more real world response, splash page or something. save for later use
    })
}

// app.post('/signup', (req, res) => {

// });
//2:14
app.post('/signin', basicAuth, (req, res) => {
  //TODO: make basicAuth middleware and build the signin capability (from yesterday)
  res.status(200).send('signed in!');
});

//2:15
app.get('/protected-route', bearerAuth, (req,res) => {
  //TOD: create the bearerAuth middleware and build a protected route (today's section)
  res.status(200).send('you are signed in with a token');
});

//2:16 use swagger
app.get('/anyone-can-access', (req, res) => {
  res.json({ msg: 'anyone can see this' });
});


mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true})
.then(() => {
  app.listen(PORT, () => {
    console.log(`server up: ${PORT}`)
  });
})
.catch(e=> console.error(e.message));