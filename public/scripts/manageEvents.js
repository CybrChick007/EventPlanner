/*api gives eventid and name, make butons in list, add eventlisteners,
 onclick calls another api which gets all of the events data which i can
 use to populate inputs (getSingleEvent?)*/
let eventList = document.getElementById("myEvents");

let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", function(e){create_edit_Event(e, "/editEvent");});

let deleteButton = document.getElementById("delbtn");
deleteButton.addEventListener("click", deleteEvent);

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
  document.getElementById("dateBox").value =   selectedEvent.eventDate.replace('Z', ''); //selectedEvent.eventDate;
  console.log( (selectedEvent.eventDate).replace('Z', ''));
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
