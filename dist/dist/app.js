"use strict";

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv/config');
var cors = require('cors');
var cookieParser = require('cookie-parser');

//Middlewares
app.use(cors({
  credentials: true,
  origin: process.env.REACT_APP_CORS_LINK
}));
app.use(express.json());
app.use(cookieParser());

//Import Routes
var tasksRoute = require('./routes/tasks');
var followingRoute = require('./routes/following');
var authRoute = require('./routes/auth');
app.use('/api/user', authRoute);
app.use('/tasks', tasksRoute);
app.use('/following', followingRoute);

//ROUTES
app.get('/', function (req, res) {
  res.send('hello');
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true
}, function () {
  return console.log('connected to DB!');
});

//How do we start listening to the server
app.listen(process.env.PORT || 3000);
module.exports = app;