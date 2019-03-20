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
router.get('/displayEvents', displayEvent);
router.get('/getSingleEvent', getSingleEvent);
router.get('/getTypes', getTypes);
router.get('/filterEvent', filterEvent);

//post request
//localhost:8080/createEvent + body [see below in the function]
router.post('/createEvent', GoogleAuth.guardMiddleware(), createEvent);

//localhost:8080/editEvent + body [same body as createEvent]
router.post('/editEvent', GoogleAuth.guardMiddleware(), editEvent);

//localhost:8080/joinEvent + body [userID, eventID]
router.post('/joinEvent', GoogleAuth.guardMiddleware(), joinEvent);

//localhost:8080/deleteEvent + body [eventID]
router.post('/deleteEvent', GoogleAuth.guardMiddleware(), deleteEvent);
// add display event

async function authorizeUser(req, res, next) {
  try{
    const email = req.params.email;

    const sql = await sqlPromise;
    const query = `SELECT userID, email FROM user WHERE email = '${email}'`;
    const [rows] = await sql.execute(query);
    console.log(email);
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

//finlay
async function createEvent(req, res){
  try {
    //const userid = req.body.userID; --> auto_increment
    // const eventName = req.body.eventName;
    // const eventAddress = req.body.eventAddress;
    // const eventPostcode = req.body.eventPostcode;
    // const eventPublic = req.body.eventPublic; //Boolean
    // const eventURLImage = req.body.eventURLImage;
    // const eventDressCode = req.body.eventDressCode;
    // const eventType = req.body.eventType; //Foreign key --> int
    // const eventHost = req.body.eventHost; //Foreign key --> int

    //INSERT INTO shoppingListItem TABLE! USING THE EVENTID JUST CREATED
    //const shopList = req.body.shopList; ////TODO: be converted in list

    const userid = 99;
    const eventName = "Eskimo";
    const eventAddress = "Astoria";
    const eventPostcode = "PO1 1AA";
    const eventPublic = true;
    const eventURLImage = "";
    const eventDressCode = "Any";
    const eventType = 1;
    const eventHost = 1;

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
}
}

//user specific events

async function editEvent(req, res){
  try{
    //eventHostID does not change
      const sql = await sqlPromise;
      const query = `UPDATE event SET eventName = '${req.body.eventName}', eventAddress = '${req.body.eventAddress}', eventPostcode = '${req.body.eventPostcode}', eventDressCode = '${req.body.eventDressCode}', eventPublic = '${req.body.eventPublic}', eventURLImage = '${req.body.eventURLImage}', eventType = '${req.body.eventType}', eventDate = '${req.body.eventDate}' where eventID = '${req.body.eventID}'`;

      return sql.execute(query);

  }
  catch (e) {next(e); }

}

async function joinEvent(req, res){

}

async function deleteEvent(req, res){

}

//LAVAN
//event name, type, date
async function filterEvent(req, res){
  
}

//Eze
//displaying the first 10 upcoming event
async function displayEvent(req, res, next){
  try{
    const sql = await sqlPromise;
    const query = `SELECT * FROM event LIMIT 10`;
    const [rows] = await sql.execute(query);

    const eventList = rows.map(row => {
        return {
          eventID: row.eventID,
          eventName: row.eventName,
          eventAddress: row.eventAddress,
          eventPostcode: row.eventPostcode,
          eventDressCode: row.eventDressCode,
          eventPublic: row.eventPublic, //IF FALSE, DISPLAY ONLY IF USER IS INVITED
          eventURLImage: row.eventURLImage,
          eventType: row.eventType,
          eventHost: row.eventHost,
          eventDate: row.eventDate
        };
      });

      const query2 = `SELECT * FROM shoppingListItem`;
      const [rows2] = await sql.execute(query);

      const allItemShoppingList = rows2.map(row => {
          return {
            eventItemName: row.eventItemName,
            eventID: row.eventID,
            userBringerID: row.userBringerID
          };
        });

      res.send({eventList, allItemShoppingList});
    }catch (e) {
      next(e);
    }
}

async function getTypes(req, res, next){
  try{
    const sql = await sqlPromise;
    const query = `SELECT * FROM typeEvent`;
    const types = (await sql.execute(query))[0];
    res.send(types);
  }catch (e) {
    console.error(e);
    next(e);
  }
}

async function getSingleEvent(req, res, next){
  try{
    const sql = await sqlPromise;
    const query = `SELECT * FROM event WHERE eventID = ${req.query.eventID}`;
    const event = (await sql.execute(query))[0][0];
    const query2 = `SELECT eventItemName FROM shoppinglistitem WHERE eventID = ${event.eventID}`;
    const shoppingList = (await sql.execute(query2))[0];
    res.send({event, shoppingList});
  }catch (e) {
    console.error(e);
    next(e);
  }
}

module.exports = router;
