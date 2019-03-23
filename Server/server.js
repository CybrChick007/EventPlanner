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
app.use('/', apiv1);
app.use(express.static('public', { extensions: 'html' }));
app.set('views', 'public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.listen(PORT, error => {
  if (error) return console.error(error);
  console.log(`Listening to port ${PORT}`);
});
