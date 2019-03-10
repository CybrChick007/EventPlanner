const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser'); //to install
const GoogleAuth = require('simple-google-openid');

const { Router } = require('express');
const router = new Router();

const config = require('./config');
//const util = require('./util');

const sqlPromise = mysql.createConnection(config.mysql);

//get request

//localhost:8080/auth + param
router.get('/auth/:email', authorizeUser);

//post request
//localhost:8080/createEvent + params [see below in the function]
router.post('/createEvent/:', GoogleAuth.guardMiddleware(), createEvent);

//localhost:8080/editEvent + params [same params as createEvent]
router.post('/editEvent/:', GoogleAuth.guardMiddleware(), editEvent);

//localhost:8080/joinEvent + params [userID, eventID]
router.post('/joinEvent/:', GoogleAuth.guardMiddleware(), joinEvent);

//localhost:8080/deleteEvent + params [eventID]
router.post('/deleteEvent', GoogleAuth.guardMiddleware(), deleteEvent);


async function authorizeUser(req, res, next) {
  try{
    const email = req.params.email;

    const sql = await sqlPromise;
    const query = `SELECT userID, email FROM user WHERE email = '${email}'`;
    const [rows] = await sql.execute(query);

    const user = rows.map(row => {
        return {
          userID: row.userID,
          email: row.email
        };
      });

    if (rows.length == 0){
      const name   = email.substring(0, email.lastIndexOf("@"));
      const domain = email.substring(email.lastIndexOf("@") +1);
      if(domain != 'myport.ac.uk')
        res.send({ message: 'Not authorized' }); //NOT AUTHORIZED
      else { //REGISTER
        const query = `INSERT INTO user VALUES (NULL, '${email}')`;
        const [rows] = await sql.execute(query);
      }
    }
    else res.send({ user }); //LOG IN
  }catch (e) {
    next(e);
  }
}


async function createEvent(req, res){
  try {
    //const userid = req.params.userID; --> auto_increment
    const eventName = req.params.eventName;
    const eventAddress = req.params.eventAddress;
    const eventPostcode = req.params.eventPostcode;
    const eventPublic = req.params.eventPublic; //Boolean
    const eventURLImage = req.params.eventURLImage;
    const eventDressCode = req.params.eventDressCode;
    const eventType = req.params.eventType; //Foreign key --> int
    const eventHost = req.params.eventHost; //Foreign key --> int

    //INSERT INTO shoppingListItem TABLE! USING THE EVENTID JUST CREATED
    const shopList = req.params.shopList; ////TODO: be converted in list
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
}
}

async function editEvent(req, res){

}

async function joinEvent(req, res){

}

async function deleteEvent(req, res){

}


module.exports = router;
