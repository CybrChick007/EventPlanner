const fetch = require('node-fetch');
const path = require('path');
const serverFile = path.join(__dirname, 'Server/server.js');


QUnit.config.reorder = false;

QUnit.assert.passed = function (message) {
  this.pushResult({ result: true, actual: 'N/A', expected: 'N/A', message });
};

QUnit.assert.failed = function (message) {
  this.pushResult({ result: false, actual: 'N/A', expected: 'N/A', message });
};

QUnit.done(({ failed }) => {
  process.exit(failed ? -1 : 0);
});

if (process.env.SINGLE) {
  QUnit.testDone((details) => {
    if (details.failed > 0) {
      QUnit.config.queue.length = 0;
    }
  });
}

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

/*
 * Does the server actually work?
 * The most basic HTTP server that serves any content
 * from the route / should pass this test.
 */
asyncTest(
  `Start server`,
  async (assert) => {
    require(serverFile);

    assert.deepEqual(
      await getResponseStatus(assert, 'GET', '/'),
      200,
      'the server should serve something successfully'
    );
  }
);

/**
 * testing that the server serves pages
 */
asyncTest(
  `Server serves pages`,
  async (assert) => {
    require(serverFile);

    assert.deepEqual(
      await getResponseStatus(assert, 'GET', '/index.html'),
      200,
      'the server should serve something successfully'
    );
  }
);

/*
POST and DELETE requests are protected by the guardMiddleware, so it is not possible
to test the actual functionality (it would take too long). We can test that the response
status is '401' meaning that the access is forbidden.
The example below tests the joinEvent function (adding to a dB table a pair of values).
Every POST and DELETE request would return the same Status 401.
*/
asyncTest(
  `Join Event`,
  async (assert) => {
    require(serverFile);

    let response = {
      method: "POST",
      body: JSON.stringify({
        "userID": 1,
        "eventID": 1,
      })
    };

    assert.deepEqual(
      await getResponseStatus(assert, 'POST', '/joinEvent', response),
      401,
      'the server should serve something successfully'
    );
  }
);

/*
("/joinEvent", {
  method: "POST",
  body: JSON.stringify({
    "userID": currentUser.user.userID,
    "eventID": currentData.event.eventID,
  })
*/

/**
 * Server should return the types stored in the database
 * when /getTypes is sent a GET request.
 */
asyncTest(
  "Get types from server.",
  async (assert) => {
    require(serverFile);

    const types = await getResponseJson(assert, "GET", "/getTypes");

    assert.ok(Array.isArray(types), "Returned JSON object must be an array.");
    assert.ok(types.length > 0, "Must be object with length > 0");
    for (let type of types) {
      assert.ok(
        type.hasOwnProperty("typeID") && type.hasOwnProperty("typeName"),
        "Each element must be an object with attributes 'typeID' and 'typeName'"
      )
      assert.ok(
        type.typeID != null && type.typeName != null,
        "All properties of each element cannot be null."
      )
    }
  }
);

/**
 * Bring item.
 */
asyncTest(
  "Bring item",
  async (assert) => {
    require(serverFile);

    let options = {
      method: "POST",
      body: JSON.stringify({
        "userBringerID": 1,
        "eventID": 1,
        "eventItemName": "Item",
      })
    };
    let status = await getResponseStatus(assert, options.method, "/bringItem", options);
    assert.equal(status, 401, "Not logged in, api path should be forbidden (401).");
  }
);

/**
 * Unbring item.
 */
asyncTest(
  "Unbring item",
  async (assert) => {
    require(serverFile);

    let options = {
      method: "DELETE",
      body: JSON.stringify({
        "userBringerID": 1,
        "eventID": 1,
        "eventItemName": "Item",
      })
    };
    let status = await getResponseStatus(assert, options.method, "/unbringItem", options);
    assert.equal(status, 401, "Not logged in, api path should be forbidden (401).");
  }
);

/**
 *get single event
 */
asyncTest(
 "Get single event",
 async (assert) => {
   require(serverFile);
   let options = {method: "GET"};
   let myEvent = await getResponseJson(assert, "GET", "/getSingleEvent?eventID=1", options);
   assert.equal(myEvent.event.eventName, "test event", "The data gotten back should equal the test data");
 }
);

/**
 *filter events
 */
 asyncTest(
  "Filter events",
  async (assert) => {
    require(serverFile);
    let options = {method: "GET"};
    let events = await getResponseJson(assert, "GET", "/filterEvent?eventName=test", options);
    assert.equal(events.eventList[0].eventType, 1, "The first part of data gotten back should be the first item entered from the test data");
    let events2 = await getResponseJson(assert, "GET", "/filterEvent?eventName=test&eventType=2", options);
    assert.equal(events2.eventList[0].eventType, 2, "The data gotten back should be the second item entered from the test data");
  }
 );

/**
 * Tests Authorise User
 */
 asyncTest(
  "Authorise User",
  async (assert) => {
    require(serverFile);
    let options = {method: "GET"};
    let user = await getResponseJson(assert, "GET", "/auth?email=test@port.ac.uk", options);
    assert.ok(user.message != 'Not authorized', "The given email address should be authorised");
    user = await getResponseJson(assert, "GET", "/auth?email=test2@myport.ac.uk", options);
    assert.ok(user.message != 'Not authorized', "The given email address should be authorised");
    user = await getResponseJson(assert, "GET", "/auth?email=test3@gmail.com", options);
    assert.equal(user.message, 'Not authorized', "The given email address should not be authorised");
  }
 );

 /**
  * Gets all events from server
  */
 asyncTest(
  "Get all events from server.",
  async (assert) => {
    require(serverFile);

    const events = await getResponseJson(assert, "GET", "/displayEvents");
    assert.ok(Array.isArray(events.eventList), "Returned JSON object must be an array.");
    for (let singleEvent of events.eventList) {
      assert.ok(
        singleEvent.hasOwnProperty("eventID") && singleEvent.hasOwnProperty("eventName"),
        "Each element must be an object with attributes 'eventID' and 'eventName'"
      )
      assert.ok(
        singleEvent.eventID != null && singleEvent.eventName != null,
        "All properties of each element cannot be null."
      )
    }

  }
);

/**
 * Server should return the messages stored in memory for the involved users
 * given by p1 and p2 query params.
 * This is stored in memory, so we can only test for empty array.
 */
asyncTest(
  "Get messages.",
  async (assert) => {
    require(serverFile);

    const messages = await getResponseJson(assert, "GET", "/messages?p1=1&p2=1");

    assert.ok(Array.isArray(messages), "Returned JSON object must be an array.");
  }
);

/**
 * Server should return the threads stored in memory for the involved user
 * given by the userID query param.
 * This is stored in memory, so we can only test for empty array.
 */
asyncTest(
  "Get threads.",
  async (assert) => {
    require(serverFile);

    const threads = await getResponseJson(assert, "GET", "/messagethreads?userID=1");

    assert.ok(Array.isArray(threads), "Returned JSON object must be an array.");
  }
);

/**
 * Post message involving p1 and p2, with the sender userID.
 */
asyncTest(
  "Post message.",
  async (assert) => {
    require(serverFile);

    let options = {
      method: "POST",
      body: JSON.stringify({
        "p1": 1,
        "p2": 1,
        "userID": 1,
      })
    };
    let status = await getResponseStatus(assert, options.method, "/messages", options);
    assert.equal(status, 401, "Not logged in, api path should be forbidden (401).");
  }
);

function asyncTest(testName, testFunction) {
  QUnit.test(
    testName,
    async (assert) => {
      const done = assert.async();

      try {
        await testFunction(assert);
      } catch (e) {
        assert.failed(e.message);
      }

      done();
    }
  );
}

function fetchPath (method, path, options) {
  const opts = Object.assign({}, { method, timeout: 5 * 1000 }, options);
  return fetch(`http://localhost:8080${path}`, opts);
}

async function getResponseStatus (assert, method, path, options) {
  try {
    const response = await fetchPath(method, path, options);
    return response.status;
  } catch (e) {
    assert.failed(`error in ${path}: ${e}`);
  }
  throw new Error('aborting some tests due to the errors above');
}

async function getResponseJson(assert, method, path, options) {
  try {
    const response = await fetchPath(method, path, options);
    assert.equal(response.status, 200, "Response must be status 200.");
    return await response.json();
  } catch (e) {
    assert.failed(`error in ${path}: ${e}`);
  }
  throw new Error('aborting some tests due to the errors above');
}
