create database if not exists EventPlanner;

use EventPlanner;

create table user(
  userID int auto_increment,
  email varchar (50) not null unique,
  Fname varchar (15) 
  Lname varchar (15)
  PRIMARY KEY (userID)
);

create table typeEvent(
  typeID int auto_increment,
  typeName varchar(25) not null,
  PRIMARY KEY(typeID)
);

create table event(
  eventID int auto_increment,
  eventName varchar(25) not null,
  eventAddress varchar(255) not null,
  eventPostcode varchar(8) not null,
  eventDressCode varchar(30) not null,
  eventPublic boolean not null,
  eventURLImage varchar(20),
  eventType int not null,
  eventHost int not null,
  eventDate datetime not null,
  PRIMARY KEY (eventID),
  FOREIGN KEY (eventType) REFERENCES typeEvent(typeID),
  FOREIGN KEY (eventHost) REFERENCES user(userID)
);

create table guestEvent(
  guestUserID int not null,
  guestEventID int not null,
  PRIMARY KEY (guestUserID, guestEventID),
  FOREIGN KEY (guestUserID) REFERENCES user(userID),
  FOREIGN KEY (guestEventID) REFERENCES event(eventID)
);

create table shoppingListItem(
  eventItemName varchar(15) not null,
  eventID int not null,
  userBringerID int,
  PRIMARY KEY (eventItemName, eventID),
  FOREIGN KEY (eventID) REFERENCES event(eventID),
  FOREIGN KEY (userBringerID) REFERENCES user(userID)
);

INSERT INTO typeEvent VALUES (1, "Club");
INSERT INTO typeEvent VALUES (2, "House Party");
