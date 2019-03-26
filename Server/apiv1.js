const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const GoogleAuth = require('simple-google-openid');
const cors = require('cors');

const { Router } = require('express');
const router = new Router();

const config = require('./config');
const sqlPromise = mysql.createConnection(config.mysql);

//middleware
router.use(bodyParser.json());
router.use(cors());

//get requests
router.get('/auth', authorizeUser);
router.get('/displayEvents', displayEvent);
router.get('/getSingleEvent', getSingleEvent);
router.get('/getTypes', getTypes);
router.get('/joinedEvent', joinedEvent);
router.get('/filterEvent', filterEvent);

//post requests
router.post('/createEvent', GoogleAuth.guardMiddleware(), createEvent);
router.post('/editEvent', GoogleAuth.guardMiddleware(), editEvent);
router.post('/joinEvent', GoogleAuth.guardMiddleware(), joinEvent);
router.delete('/deleteEvent', GoogleAuth.guardMiddleware(), deleteEvent);

//functions

/**
 * authorizeUser is a GET function and receives the email in form of a query.
 * Makes a query whether this exists in the database. If it does not exist, it checks the domain of the email.
 * If this is within the University Of Portsmouth domain, then do the registration,
 * otherwise send a message saying that the user is not authorized.
 * If the email is already in the database, then simply log the user in.
 * If the connection with the DB or the query is not completed, an error 500 is returned.
*/
async function authorizeUser(req, res, next) {
  try{
    const email = req.query.email;

    const sql = await sqlPromise;
    const query = `SELECT userID, email FROM user WHERE email = '${email}'`;
    const [rows] = await sql.execute(query);

    if (rows.length == 0){
      const name   = email.substring(0, email.lastIndexOf("@"));
      const domain = email.substring(email.lastIndexOf("@") +1);
      if(domain != 'myport.ac.uk' && domain != 'port.ac.uk')
        res.send({ message: 'Not authorized' }); //NOT AUTHORIZED
      else { //REGISTER
        console.log("registering...");
        const query = `INSERT INTO user VALUES (NULL, '${email}', NULL, NULL, 21, NULL)`;
        const [rows] = await sql.execute(query);
        //res.send({ message: 'Registration successful!' });
      }
    } else {
      const user = rows[0];
      res.send({ user }); //LOG IN
    }
  }catch (e) {
    res.sendStatus(500);
    return;
  }
}


/**
 * createEvent is called as a POST function so it receives data through the req.body
 * It creates a Random ID for the new event and injects all the information together withi
 * the ID into the DB 'event' Table. Furthermore, it loops through the shopping list
 * items and add them into the 'shoppinglistitem' Table.
 * If the connection with the DB or the query is not completed, an error 500 is returned.
*/
async function createEvent(req, res){
  try {
    const RND = Math.random() * (999999 - 100000) + 100000; //need to check whether this random number already exists in the db
        const sql = await sqlPromise;
        const query = `INSERT INTO event VALUES(
          ${RND},
         '${req.body.eventName}',
         '${req.body.eventAddress}',
         '${req.body.eventPostcode}',
         '${req.body.eventDressCode}',
         '${req.body.eventPublic}',
         '${req.body.eventURLImage}',
          ${req.body.eventType},
          ${req.body.eventHostID},
         '${req.body.eventDate}')`;
    sql.execute(query);

    const shopList = req.body.shopList; ////TODO: be converted in list
    shopList.forEach(function (item) {
      const query = `INSERT INTO shoppinglistitem VALUES('${item}', ${RND}, NULL)`;
      sql.execute(query);
    });

  }catch (e) {
    res.sendStatus(500);
    return;
}
}

/**
 * editEvent is called as a POST function so it receives data through the req.body
 * It update the DB 'event' Table so that all the old information are replaced
 * with the new ones.
 * If the connection with the DB or the query is not completed, an error 500 is returned.
*/
async function editEvent(req, res){
  try{
      const sql = await sqlPromise;
      const query = `UPDATE event SET eventName = '${req.body.eventName}',
                     eventAddress = '${req.body.eventAddress}',
                     eventPostcode = '${req.body.eventPostcode}',
                     eventDressCode = '${req.body.eventDressCode}',
                     eventPublic = '${req.body.eventPublic}',
                     eventURLImage = '${req.body.eventURLImage}',
                     eventType = '${req.body.eventType}',
                     eventDate = '${req.body.eventDate}'
                     where eventID = '${req.body.eventID}'`;
                     //eventHostID does not change

      //NEED TO UPDATE THE SHOPPING LIST (CONSIDERING REMOVED ITEMS)
      return sql.execute(query);
  }
  catch (e) {
    res.sendStatus(500);
    return;
  }

}


/**
 * joinedEvent is called as a GET function and receives data in form of a query.
 * userID is the current user logged in while eventID is the selected event when
 * the viewEvent function is triggered. If the current user already joined this event,
 * the 'joinEvent' button would be disabled
 * If the connection with the DB or the query is not completed, an error 500 is returned.
*/
async function joinedEvent(req, res){
  try{
    const sql = await sqlPromise;
    const query = `SELECT * FROM guestEvent WHERE guestUserID = ${req.query.userID} AND guestEventID = ${req.query.eventID}`;
    const rows = await sql.execute(query);
    res.json(rows[0].length > 0);
  }
  catch(e){
    res.sendStatus(500);
    return;
  }
}

/**
 * joinEvent is called as a POST function so it receives data through the req.body
 * userID is the current user logged in while eventID is the selected event when
 * the viewEvent function is triggered. If the user has not joined the event yet,
 * it would be added in the list of guests.
 * If the connection with the DB or the query is not completed, an error 500 is returned.
*/
async function joinEvent(req, res){
  try {
    const sql = await sqlPromise;
    const query = `INSERT INTO guestEvent VALUES('${req.body.userID}', '${req.body.eventID}')`;
    await sql.execute(query);
  } catch (e) {
    if (e.errno === 1062) res.sendStatus(403);
    else res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
}

/**
 * deleteEvent is a DELETE function and it receives data through the req.query.
 *
*/
async function deleteEvent(req, res){
  try{
    const sql = await sqlPromise;
    const drop = `DELETE FROM event WHERE eventID = ${req.query.eventID}`;
    await sql.execute(drop);
    const drop2 = `DELETE FROM shoppingListItem WHERE eventID = ${req.query.eventID}`;
    await sql.execute(drop2);
  }catch(e){
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
}

async function filterEvent(req, res){
  try{
    const sql = await sqlPromise;
    let query;
    if (req.query.eventType) {
      query = `SELECT * FROM event WHERE eventName LIKE '%${req.query.eventName}%' AND eventType = ${req.query.eventType} GROUP BY eventID ORDER BY eventDate ASC LIMIT 33`;
    } else {
      query = `SELECT * FROM event WHERE eventName LIKE '%${req.query.eventName}%' GROUP BY eventID ORDER BY eventDate ASC LIMIT 33`;
    }
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
      res.send({eventList});
    }
    catch (e) {
      res.sendStatus(500);
      return;
    }
}

//displaying the first 10 upcoming event
async function displayEvent(req, res, next){
  try{
    const sql = await sqlPromise;
    const query = `SELECT * FROM event ORDER BY eventDate ASC LIMIT 10`;
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

    res.send({eventList});
    }
    catch (e) {
      res.sendStatus(500);
      return;
    }
}

async function getTypes(req, res, next){
  try{
    const sql = await sqlPromise;
    const query = `SELECT * FROM typeEvent`;
    const types = (await sql.execute(query))[0];
    res.send(types);
  }catch (e) {
    res.sendStatus(500);
    return;
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
    res.sendStatus(500);
    return;
  }
}


//get user specific events for the management page
async function getUserEvents(req, res, next){

}

module.exports = router;
