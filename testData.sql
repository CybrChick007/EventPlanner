use EventPlanner;

INSERT INTO user (email, Fname, Lname, Age, ContactNumber) VALUES ("test@port.ac.uk", "testf", "testl", 30, "0787654321");

INSERT INTO user (email, Fname, Lname, Age, ContactNumber) VALUES ("test2@myport.ac.uk", "test2f", "test2l", 18, "0781234567");

INSERT INTO event (eventName, eventAddress, eventPostcode, eventDressCode, eventPublic, eventURLImage, eventType, eventHost, eventDate) VALUES ("test event", "one,two,three", "PO1 2UP", "casual", 1, "", 1, 2, '1980-12-31 00:00:00');

INSERT INTO event (eventName, eventAddress, eventPostcode, eventDressCode, eventPublic, eventURLImage, eventType, eventHost, eventDate) VALUES ("test event", "one,two,three", "PO1 2UP", "casual", 1, "", 2, 2, '1981-12-31 00:00:00');
