const express = require('express');
const mysql = require('mysql2/promise'); //to install
const bodyParser = require('body-parser'); //to install

const GoogleAuth = require('simple-google-openid');

const config = require('./config');
const util = require('./util');

const router = express.Router();

const sqlPromise = mysql.createConnection(config.mysql);

//get request
router.get('/auth/:email', authorizeUser);

//post request
router.post('/createEvent', GoogleAuth.guardMiddleware(), createEvent);

async function authorizeUser(req, res, next) {
  try{
    const sql = await sqlPromise;
    const query = `SELECT id, name FROM user WHERE email = '${req.params.email}'`;
    const [rows] = await sql.execute(query);
    const user = rows.map(row => {
        return {
          id: row.id,
          name: row.name
        };
      });

    //REGISTER
    if (rows.length == 0) res.send({ message: 'Not registered' });
    else res.send({ user });
  }catch (e) {
    next(e);
  }
}


async function createEvent(req, res){
  //if (!util.checkBodyIsValid(req, res)) return;
  try {
    const userid = req.params.userID;
    const evName = req.params.evName;
    const evLocation = req.params.evLocation;
    const evType = req.params.evType;
    const shopList = req.params.shopList; ////TODO: be converted in list
    const dressCode = req.params.dressCode;

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
}
}
