'use strict';

const express = require('express');
const cors = require('cors');
const app = express();
const GoogleAuth = require('simple-google-openid');
const apiv1 = require('./apiv1');

const PORT = 8080;
const clientId = '934035794483-hheclnb5qoh28b4n0ktilgm35160ue4u.apps.googleusercontent.com';


app.use(GoogleAuth(clientId));
app.use(cors());
app.use('/', apiv1); //GoogleAuth.guardMiddleware(),
app.use(express.static('public', { extensions: 'html' }));
app.set('views', 'public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// //VIEWS REQUESTS
// app.get('/apiv1/type', function(req, res, next){
//
// });
//
// app.get('/timetable', function(req, res, next) {
// //  res.render('timetable');
// });
//
// app.get('/settings', function(req, res, next) {
// //  res.render('settings');
// });
//
// app.get('/messaging', function(req, res, next) {
// //  res.render('messaging');
// });
//
// app.get('/manage-events', function(req, res, next) {
// //  res.render('manage-events');
// });
//
// app.get('/create-event', function(req, res, next) {
// //  res.render('create-event');
// });
//
//  app.get('/login', function(req, res, next) {
//   res.render('login');
// });

app.listen(PORT, error => {
  if (error) return console.error(error);
  console.log(`Listening to port ${PORT}`);
});
