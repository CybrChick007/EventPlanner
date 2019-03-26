import myEvent from "util.js";

/*api gives eventid and name, make butons in list, add eventlisteners,
 onclick calls another api which gets all of the events data which i can
 use to populate inputs (getSingleEvent?)*/
let eventList = document.getElementById("myEvents");
let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", function(e){myEvent(e, "/editEvent");});
let deleteButton = document.getElementById("delbtn");
deleteButton.addEventListener("click", deleteEvent);
let myEvents = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
}).then(response => response.json());
for (let i = 0; i < myEvents.length; i++) {
  let id = myEvents[i].eventID;
  let name = myEvents[i].eventName;
  let myEvent = document.createElement("button");
  myEvent.id = id;
  myEvent.textContent = name;
  myEvent.type = "button";
  eventList.appendChild(myEvent);
  myEvent.addEventListener("click", getMyEvent);
}

function deleteEvent(e){
  const ID = sessionStorage.getItem('id');
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
}

function getMyEvent(e){
  let myEvent = e.target;
  const URL = "/getSingleEvent?eventID=" + myEvent.id
  let selectedEvent = fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response => response.json());
  let shopping = selectedEvent.shoppingList;
  for (let i = 0; i < shopping.length; i++) {
    let list = document.getElementById("shoppingSelect");
    let item = document.createElement("option");
    item.value = shopping[i];
    item.textContent = shopping[i];
    list.appendChild(item);
  }
  let eventDetails = selectedEvent.event;
  document.getElementById("eventNameBox").value = eventDetails.eventName;
  const ADDRESS = eventDetails.eventAddress.split(',');
  document.getElementById("dateBox").value = new Date(eventDetails.eventDate);
  document.getElementById("address1Box").value = ADDRESS[0];
  document.getElementById("address2Box").value = ADDRESS[1];
  document.getElementById("address3Box").value = ADDRESS[2];
  document.getElementById("postcodeBox").value = eventDetails.eventPostcode;
  let type = document.getElementById("typeSelect");
  let types = type.options;
  const MYTYPE = eventDetails.eventType;
  for (let i = 0; i < types.length; i++) {
    if (types[i].value === MYTYPE) {
      type.selectedIndex = i;
    }
  }
  document.getElementById("dressCodeBox").value = eventDetails.eventDressCode;
  let index = 3;
  if (eventDetails.eventPublic === "Public") {
    index = 0;
  }else {
    index = 1;
  }
  document.getElementById("StatusSelect").selectedIndex = index;
  let thumb = eventDetails.eventURLImage;
  sessionStorage.setItem('thumb', thumb);
  if (thumb == "") {
    thumb = "images/placeholderThumb.png";
  }
  document.getElementById("thumbnail").src = thumb;
  sessionStorage.setItem('id', myEvent.id);
}
