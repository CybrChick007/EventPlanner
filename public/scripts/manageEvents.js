/**
 * Provides functionality for `manage-events.html`.
 * @module public/scripts/manageEvents
 */

let eventList = document.getElementById("myEvents");

let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", edit);

let deleteButton = document.getElementById("delbtn");
deleteButton.addEventListener("click", deleteEvent);

/**
 * verifies that an event to edit has been selected before calling create_edit_Event from util.js
 * @param {event} e - The event that triggered this functions execution.
 */
function edit(e){
  if (sessionStorage.getItem('id') != null) {
    create_edit_Event(e, "/editEvent");
  }else {
    alert("Please select an event to edit first!");
  }
}

/**
 * populates a list with all of the events the user is hosting 2 seconds after the page has loaded
 */
async function populateList(){
  const URL = "/getUserEvents?hostID=" + currentUser.user.userID;
  let response = await fetch(URL);
  let myEvents = (await response.json()).eventList;

  for (let i = 0; i < myEvents.length; i++) {
    let id = myEvents[i].eventID;
    let name = myEvents[i].eventName;
    let myEvent = document.createElement("li");
    myEvent.id = id;
    myEvent.textContent = name;
    myEvent.style.color = "#834187";
    myEvent.style.cursor = "pointer";
    eventList.appendChild(myEvent);
    myEvent.addEventListener("click", getMyEvent);
  }
}

/**
 * deletes the currently selected event
 * @param {event} e - The event that triggered this functions execution.
 */
function deleteEvent(e){
  const ID = sessionStorage.getItem('id');
  if (ID != null) {
    fetch("/deleteEvent?eventID=" + ID, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + instanceToken.getAuthResponse().id_token,
    },})
    sessionStorage.removeItem('id');
    let buttonList = document.getElementById("myEvents");
    buttonChildren = buttonList.children;
    for (let i = 0; i < buttonChildren.length; i++) {
      if (buttonChildren[i].id === ID) {
        buttonList.removeChild(buttonChildren[i]);
      }
    }
  }else {
    alert("Please select an event to delete first!");
  }
}

/**
 * gets all of the details of the selected event and then displays them to the user
 * @param {event} e - The event that triggered this functions execution.
 */
async function getMyEvent(e){
  let myEvent = e.target;

  const URL = "/getSingleEvent?eventID=" + myEvent.id;
  let responseEvent = await fetch(URL);

  let selectedEventData = (await responseEvent.json());
  console.log(selectedEventData);

  let selectedEvent = selectedEventData.event;

  let selectedShoppingList = selectedEventData.shoppingList;

  const list = document.getElementById("shoppingSelect");
  document.getElementById("shoppingSelect").options.length = 0;  //empty dropdown menu before inserting new data

  for (let i = 0; i < selectedShoppingList.length; i++) {
    let item = document.createElement("option");
    item.value = i;
    item.textContent = selectedShoppingList[i].eventItemName;
    list.appendChild(item);
  }

  document.getElementById("eventNameBox").value = selectedEvent.eventName;
  const ADDRESS = selectedEvent.eventAddress.split(',');

  const eventDay = selectedEvent.eventDate.split('T')[0];
  let eventTime = selectedEvent.eventDate.split('T')[1];
  eventTime = eventTime.replace('Z', '');
  document.getElementById("dateBox").value = eventDay;
  document.getElementById("timeBox").value = eventTime;

  document.getElementById("address1Box").value = ADDRESS[0];
  document.getElementById("address2Box").value = ADDRESS[1];
  document.getElementById("address3Box").value = ADDRESS[2];
  document.getElementById("postcodeBox").value = selectedEvent.eventPostcode;
  let type = document.getElementById("typeSelect");

  const MYTYPE = selectedEvent.eventType;
  type.selectedIndex = MYTYPE;

  document.getElementById("dressCodeBox").value = selectedEvent.eventDressCode;

  if (selectedEvent.eventPublic === "Public") {
    document.getElementById("StatusSelect").selectedIndex = 0;
  }else {
    document.getElementById("StatusSelect").selectedIndex = 1;
  }

  let thumb = selectedEvent.eventURLImage;
  sessionStorage.setItem('thumb', thumb);
  if (thumb == "") {
    thumb = "images/placeholderThumb.png";
  }
  document.getElementById("thumbnail").src = thumb;
  sessionStorage.setItem('id', myEvent.id);
}

setTimeout(populateList, 2000);
//populateList();
