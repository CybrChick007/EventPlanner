create database if not exists eventPlanner;

use eventPlanner;

create table user(
  userID int auto_increment,
  email varchar (255) not null unique,
  PRIMARY KEY (userID)
);

create table typeEvent(
  typeID int auto_increment,
  typeName varchar(255) not null,
  PRIMARY KEY(typeID)
);

create table event(
  eventID int auto_increment,
  eventName varchar(255) not null,
  eventAddress varchar(255) not null,
  eventPostcode varchar(8) not null,
  eventDressCode varchar(255) not null,
  eventPublic boolean not null,
  eventURLImage varchar(255),
  eventType int not null,
  eventHost int not null,
  PRIMARY KEY (eventID),
  FOREIGN KEY (eventType) REFERENCES typeEvent (typeID),
  FOREIGN KEY (eventHost) REFERENCES user (userID)
);

create table guestEvent(
  guestUserID int not null,
  guestEventID int not null,
  PRIMARY KEY (guestUserID, guestEventID),
  FOREIGN KEY (guestUserID) REFERENCES user (userID),
  FOREIGN KEY (guestEventID) REFERENCES event (eventID)
);

create table shoppingListItem(
  eventItemName varchar(255) not null,
  eventID int not null,
  userBringerID int,
  PRIMARY KEY (eventItemName, eventID),
  FOREIGN KEY (eventID) REFERENCES event (eventID),
  FOREIGN KEY (userBringerID) REFERENCES user (userID)
);
