'use strict';

const express = require("express");
const app = express();

//prototype version
const apiv1 = require('./apiv1')

app.use(express.static("public"));
app.use(apiv1);

app.listen(8080);
