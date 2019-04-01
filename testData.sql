use EventPlanner;

INSERT INTO user (email, Fname, Lname, Age, ContactNumber) VALUES ("test@myport.ac.uk", "testf", "testl", 18, "0781234567");

INSERT INTO event (eventName, eventAddress, eventPostcode, eventDressCode, eventPublic, eventURLImage, eventType, eventHost, eventDate) VALUES ("test event", "one,two,three", "PO1 2UP", "casual", 1, "", 1, 1, '2019-12-31 00:00:00');

INSERT INTO event (eventName, eventAddress, eventPostcode, eventDressCode, eventPublic, eventURLImage, eventType, eventHost, eventDate) VALUES ("test event", "one,two,three", "PO1 2UP", "casual", 1, "", 2, 1, '2020-12-31 00:00:00');
