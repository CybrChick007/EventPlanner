# EventPlanner
INSE project designing student aimed Event website/ web app


Own branches were only made for the pre prototyping stage to allow everyone to play around without affecting each other. Now everything should go in master.

Everyone should alert the whole group when a commit is made to avoid any overwrites or errors.

Every commit should add the whole team as contributors to avoid different marks.

## Authors

Github username = up number = Name

lewisc64 = up851097 = Lewis Carpenter

ezelopes = up872640 = Ezequiel Lopes

up861332 = up861332 = Nathan Moore

CybrChick007 = up879064 = Finlay Plant

Matthew Remon = up746698 = Matthew Remon

Lavan Puvan = up817903 = Lavan Puvanendiran

## Setup

open a linux terminal window and run the following commands if required:

sudo apt-get install npm<br>
sudo apt-get install mysql-server<br>
git clone our repository<br>
cd EventPlanner<br>
npm i<br>
npm run setup<br>
npm start

if you have followed these steps then the server should start, now go to localhost:8080 in your browser and you should be able to see our website

If you are having problems with npm run setup then following these steps should solve them. For reference I had problems getting it to work on my own ubuntu virtual box virtual machine, so if you are running something different the solution I propose may or may not work for you.

sudo service mysql start<br>
sudo mysql --user=root -p<br>
grant all privileges on \*.* to 'root'@'localhost';<br>
flush privileges;<br>
USE mysql;<br>
SELECT User, Host, plugin FROM mysql.user;<br>
UPDATE user SET plugin='mysql_native_password' WHERE User='root';<br>
FLUSH PRIVILEGES;<br>
SET PASSWORD FOR root@localhost=PASSWORD('');<br>
exit;<br>
npm run setup

to re-access the mysql database after this use: mysql -u root

## Testing

To run qunit tests first do `npm run testSetup` and then `npm run test-all`. To run selenium tests navigate to `tests/selenium` and run `run.py`, following the instructions of the README.md in that folder.


## API

* /auth
  * GET: Authorises the user

* /displayEvents
  * GET: displays the first 10 upcoming events

* /getSingleEvent
  * GET: gives all of the information on a single event, requires a query of eventID containing the id of the requested event

* /getTypes
  * GET: gives all of the possible types for events

* /getUser
  * GET: gives all of the information about a given user, requires a query of userID containing the requested users google id

* /joinedEvent
  * GET: tells the client if the user has joined up to the given event, requires a query of userID containing the users google id and another query of eventID containing the id of the requested event

* /filterEvent
  * GET: gives all events with the given name or one similar to it and if given will filter it by the given filter, requires a query of eventName containing the name of the event you are searching for, optionally requires eventType containing the type of event the user is looking for

* /getUserEvents
  * GET: get user specific events for the management page, requires a query of hostID containing the hosts google id

<br>

* /createEvent
  * POST: gets a JSON file from the client and creates a new event in the database using the given data

* /editEvent
  * POST: gets a JSON file from the client and updates an event in the database using the given data

* /joinEvent
  * POST: joins the user to an event, requires a query of userID containing the users google id and a query of eventID containing the id of the event for the user to be joined to

* /bringItem
  * POST: gets a JSON file from the client and updates a shopping list item with who is going to bring the item to the event using the given data

<br>

* /deleteEvent
  * DELETE: deletes the given event, requires a query of eventID containing the event id of the event to be deleted

* /unbringItem
  * DELETE: gets a JSON file from the client and updates a shopping list item, removing the person who was previously marked as bringing the item
