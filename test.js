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

/*
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
