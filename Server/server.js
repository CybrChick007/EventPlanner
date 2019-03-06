'use strict';

const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 8080;

//prototype version
const apiv1 = require('./apiv1')

app.use(cors());
app.use(express.static('public'));
app.use('/', apiv1);

app.listen(PORT, error => {
  if (error) return console.error(error);
  console.log(`Listening to port ${PORT}`);
});
