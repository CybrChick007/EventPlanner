'use strict';

const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 8080;

//prototype version
const apiv1 = require('./apiv1')

app.use(cors());
app.use('/', apiv1);
app.use(express.static('public'));
app.set('views', 'public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(GoogleAuth('672312620946-li717m3kudkacjetd6h5tckumvl22qbk.apps.googleusercontent.com'));

//VIEWS REQUESTS
app.get('/apiv1/type', function(req, res, next){

});

app.get('/timetable', function(req, res, next) {
//  res.render('timetable');
});

app.get('/settings', function(req, res, next) {
//  res.render('settings');
});

app.get('/messaging', function(req, res, next) {
//  res.render('messaging');
});

app.get('/manage-events', function(req, res, next) {
//  res.render('manage-events');
});

app.get('/create-event', function(req, res, next) {
//  res.render('create-event');
});

app.get('/login', function(req, res, next) {
//  res.render('login');
});

app.listen(PORT, error => {
  if (error) return console.error(error);
  console.log(`Listening to port ${PORT}`);
});
