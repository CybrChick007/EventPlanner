# EventPlanner
INSE project designing student aimed Event website/ web app


Own branches were only made for the pre prototyping stage to allow everyone to play around without affecting each other. Now everything should go in master.

Everyone should alert the whole group when a commit is made to avoid any overwrites or errors.

Every commit should add the whole team as contributors to avoid different marks.

#Setup
open linux terminal window and run the following commands if required
sudo apt-get install npm
sudo apt-get install mysql-server
git clone our repository
cd EventPlanner
npm i
npm run setup
npm start
if you have followed these steps then the server should start

#API
*/auth
  *GET: Authorises the user
*/displayEvents
  *GET: displays the first 10 upcoming events
*/getSingleEvent
  *GET: gives all of the information on a single event, requires a query of eventID containing the id of the requested event
*/getTypes
  *GET: gives all of the possible types for events
*/joinedEvent
  *GET: tells the client if the user has joined up to the given event, requires a query of userID containing the users google id and another query of eventID containing the id of the requested event
*/filterEvent
  *GET: gives all events with the given name or one similar to it and if given will filter it by the given filter, requires a query of eventName containing the name of the event you are searching for, optionally requires eventType containing the type of event the user is looking for
*/getUserEvents
  *GET: get user specific events for the management page, requires a query of hostID containing containing the hosts google id

*/createEvent
  *POST: gets a JSON file from the client and creates a new event in the database using the given data
*/editEvent
  *POST: gets a JSON file from the client and updates an event in the database using the given data
*/joinEvent
  *POST: joins the user to an event, requires a query of userID containing the users google id and a query of eventID containing the id of the event for the user to be joined to

*/deleteEvent
  *DELETE: deletes the given event, requires a query of eventID containing the event id of the event to be deleted
