/**
 * Provides functionality for `index.html`.
 * @module public/scripts/index
 */

let results = document.getElementById("results");
let currentData;

/**
 * Adds a `li` representing an event to the list of results.
 * This includes a button that will call viewEvent with the given eventid.
 * @param {string} title - Title to be displayed on the thumbnail.
 * @param {integer} eventid - The id of the event this item is representing.
 * @param {string} imageurl - The URL of the thumbnail image.
 */
function addEventToResults(title, eventid, imageurl) {
  let item = document.createElement("li");

  let img = document.createElement("img");
  if (imageurl) {
    img.src = imageurl;
  }

  let txt = document.createElement("p");
  txt.textContent = title;

  let viewButton = document.createElement("button");
  viewButton.classList.add("button");
  viewButton.textContent = "VIEW";

  viewButton.addEventListener("click", function (e) {
    viewEvent(eventid);
  })

  item.appendChild(img);
  item.appendChild(txt);
  item.appendChild(viewButton);

  results.appendChild(item);

}

/**
 * Sets the opacity and interactivity based on the visible param.
 * @param {boolean} visible - Whether to show/hide the details popup.
 */
function setPopupVisibility(visible) {
  for (let elem of document.querySelectorAll(".popup-details")) {
    if (visible) {
      elem.style.opacity = "1";
      elem.style["pointer-events"] = "auto";
    } else {
      elem.style.opacity = "0";
      elem.style["pointer-events"] = "none";
    }
  }
}

/**
 * Changes the attributes of a specific button given by an id using the parameters.
 * @param {string} id - The id attribute of the HTML element to configure.
 * @param {string} text - The string to set the textContent of the element to.
 * @param {string} oldclass - The class name to be removed.
 * @param {string} newclass - The class name to be added.
 */
function configureButton(id, text, oldclass, newclass) {
  button = document.getElementById(id)
  button.textContent = text;
  if (oldclass !== undefined && newclass !== undefined) {
    if (button.classList.contains(oldclass)) {
      button.classList.remove(oldclass);
    }
    button.classList.add(newclass);
  }
}

/**
 * Sets the class of the join button to `button`, and the text to "JOIN" using configureButton.
 */
function enableJoinButton() {
  configureButton("join", "JOIN", "disabled-button", "button");
}

/**
 * Sets the class of the join button to `disable-button`, and the text to "JOINED" using configureButton.
 */
function disableJoinButton() {
  configureButton("join", "JOINED", "button", "disabled-button");
}

/**
 * If the user is logged in, and the details popup is populated with an event,
 * a request is sent to the server with the google auth token to make the user
 * join the event.
 */
async function joinEvent(e) {
  if (e.target.classList.contains("button") && currentData && currentUser) {
    let response = await fetch("/joinEvent", {
      method: "POST",
      body: JSON.stringify({
        "userID": currentUser.user.userID,
        "eventID": currentData.event.eventID,
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + instanceToken.getAuthResponse().id_token,
      },
    });
    if (response.ok) {
      disableJoinButton();
    } else {
      alert("Failed to join event: " + response.status);
    }
  }
}


/**
 * Will show and populate the event details popup with data returned from the server
 * about the event with the given eventID.
 * @param {integer} eventID - The id of the event to be detailed.
 */
async function viewEvent(eventID) {

  if(currentUser === undefined){
    alert("Not signed in!");
    return;
  }
  let response = await fetch("/getSingleEvent?eventID=" + eventID);

  if (response.ok) {

    let data = (await response.json());
    currentData = data;
    let event = data.event;
    let shoppingList = data.shoppingList;

    document.getElementById("title").textContent = event.eventName + " - " + new Date(event.eventDate).toString();
    document.getElementById("address").textContent = "Address: " + event.eventAddress + ", " + event.eventPostcode;
    document.getElementById("description").textContent = event.eventDescription;
    document.getElementById("dresscode").textContent = event.eventDressCode;
    document.querySelector("#details > img").src = event.eventURLImage;

    let list = document.getElementById("shoppinglist");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    for (let item of shoppingList) {
      let elem = document.createElement("li");
      elem.textContent = item.eventItemName;
      list.appendChild(elem);
    }

    let joinedResponse = await fetch(`/joinedEvent?userID=${currentUser.user.userID}&eventID=${event.eventID}`);
    let joined = await joinedResponse.json();
    if (joined) {
      disableJoinButton();
    } else {
      enableJoinButton();
    }

    setPopupVisibility(true);

  } else {
    alert("Failed to get event from server: " + response.status);
  }

}

/**
 * Removes all the search results 
 */
function clearResults() {
  while (results.firstChild) {
    results.removeChild(results.firstChild);
  };
}

/**
 * Gets the default events from the server and populates the search results.
 */
async function populateResults() {
  let response = await fetch("/displayEvents");
  let events = (await response.json()).eventList;
  for (let event of events) {
    addEventToResults(event.eventName, event.eventID, event.eventURLImage);
  }
}

/**
 * Gets the events with specific name and specific type, based on user choice
 */
async function populateFilteredResults() {
  const searchbox = document.getElementById("search");
  const combo = document.getElementById("type");
  
  let request = "/filterEvent?eventName=" + searchbox.value;
  if (combo.value != -1) {
    request += "&eventType=" + combo.value;
  }
  
  let response = await fetch(request);
  let filteredEvents = (await response.json()).eventList;
  
  clearResults();
  for (let event of filteredEvents) {
    addEventToResults(event.eventName, event.eventID, event.eventURLImage);
  }
}

/**
 * Gets all the types from the server and populates the type combo box.
 */
async function populateTypes() {

  let response = await fetch("/getTypes");

  if (response.ok) {

    let types = await response.json();

    let combo = document.getElementById("type");
    let item = document.createElement("option");
    item.textContent = "Any";
    item.value = -1;
    combo.appendChild(item);
    
    for (let type of types) {
      let item = document.createElement("option");
      item.textContent = type.typeName;
      item.value = type.typeID;
      combo.appendChild(item);
    }

  }

}

document.getElementById("searchbutton").addEventListener("click", populateFilteredResults);
document.getElementById("search").addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    populateFilteredResults();
  }
});
document.getElementById("join").addEventListener("click", joinEvent);
document.getElementById("close").addEventListener("click", function (e) {
  setPopupVisibility(false);
});

populateResults();
populateTypes();

// temporary map
window.addEventListener("load", function() {
  //setPopupVisibility(true);
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 0, lng: 0},
    zoom: 8,
    disableDefaultUI: true
  });
});
