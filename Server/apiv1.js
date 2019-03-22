const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const GoogleAuth = require('simple-google-openid');
const cors = require('cors');

const { Router } = require('express');
const router = new Router();

const config = require('./config');
const sqlPromise = mysql.createConnection(config.mysql);

// router.use((req,res,next) => {
//   console.log("headers", req.headers);
//   next();
// });

//middleware
router.use(bodyParser.json());
router.use(cors());

//get request
router.get('/auth/:email', authorizeUser);
router.get('/displayEvents', displayEvent);
router.get('/getSingleEvent', getSingleEvent);
router.get('/getTypes', getTypes);
router.get('/joinedEvent', joinedEvent);
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

//functions

async function authorizeUser(req, res, next) {
  try{
    const email = req.params.email;

    const sql = await sqlPromise;
    const query = `SELECT userID, email FROM user WHERE email = '${email}'`;
    const [rows] = await sql.execute(query);
    //console.log(email);

    if (rows.length == 0){
      const name   = email.substring(0, email.lastIndexOf("@"));
      const domain = email.substring(email.lastIndexOf("@") +1);
      if(domain != 'myport.ac.uk')
        res.send({ message: 'Not authorized' }); //NOT AUTHORIZED
      else { //REGISTER
        console.log("registering");
        const query = `INSERT INTO user VALUES (NULL, '${email}', NULL, NULL, 21, NULL)`;
        const [rows] = await sql.execute(query);
        //res.send({ message: 'Registration successful!' });
      }
    } else {
      const user = rows[0];
      res.send({ user }); //LOG IN
    }
  }catch (e) {
    next(e);
  }
}

async function createEvent(req, res){
  try {
    console.log(req.body);
        const sql = await sqlPromise;
        const query = `INSERT INTO event VALUES(
         eventID = NULL,
         eventName = '${req.body.eventName}',
         eventAddress = '${req.body.eventAddress}',
         eventPostcode = '${req.body.eventPostcode}',
         eventDressCode = '${req.body.eventDressCode}',
         eventPublic = '${req.body.eventPublic}',
         eventURLImage = '${req.body.eventURLImage}',
         eventType = '${req.body.eventType}',
         eventDate = '${req.body.eventDate}')`;

        return sql.execute(query);



    //INSERT INTO shoppingListItem TABLE! USING THE EVENTID JUST CREATED
    const shopList = req.body.shopList; ////TODO: be converted in list

  }catch (e) {
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

async function joinedEvent(req, res){
  const sql = await sqlPromise;
  const query = `SELECT * FROM guestEvent WHERE guestUserID = ${req.query.userID} AND guestEventID = ${req.query.eventID}`;
  const rows = await sql.execute(query);
  console.log(rows);
  res.json(rows[0].length > 0);
}

async function joinEvent(req, res){
  const sql = await sqlPromise;
  const query = `INSERT INTO guestEvent VALUES('${req.body.userID}', '${req.body.eventID}')`;
  try {
    await sql.execute(query);
  } catch (e) {
    if (e.errno === 1062) {
      res.sendStatus(403);
    } else {
      res.sendStatus(500);
    }
    return;
  }
  res.sendStatus(200);
}

async function deleteEvent(req, res){
  const sql = await sqlPromise;
  const drop = `DELETE FROM event WHERE eventID = ${req.query.eventID}`;

  return sql.execute(drop);
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
    const query2 = `SELECT * FROM shoppinglistitem WHERE eventID = ${event.eventID}`;
    const shoppingList = (await sql.execute(query2))[0];
    res.send({event, shoppingList});
  }catch (e) {
    console.error(e);
    next(e);
  }
}

module.exports = router;
