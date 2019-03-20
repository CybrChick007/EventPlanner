
let results = document.getElementById("results");
let currentData;

function addEventToResults(title, eventid, imageurl) {
  let item = document.createElement("li");
  
  let img = document.createElement("img");
  img.src = imageurl;
  
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

async function joinEvent() {
  if (currentData) {
    let response = await fetch("/joinEvent", {
      method: "POST",
      body: JSON.stringify({
        "userID": null, // complete when login functionality is in this page
        "eventID": currentData.event.eventID,
      }),
      headers: {
      "Content-Type": "application/json"
      },
    });
    if (!response.ok) {
      alert("Failed to join event: " + response.status);
    }
  }
}

async function viewEvent(eventID) {
  
  let response = await fetch("/getSingleEvent?eventID=" + eventID);
  
  if (response.ok) {
    
    let data = (await response.json());
    currentData = data;
    let event = data.event;
    let shoppingList = data.shoppingList;
    
    document.getElementById("title").textContent = event.eventName + " - " + new Date(event.eventDate).toString();
    document.getElementById("address").textContent = "Address: " + event.eventAddress + ", " + event.eventPostcode;
    document.getElementById("description").textContent = event.eventDescription;
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
    
    setPopupVisibility(true);
    
  } else {
    alert("Failed to get event from server: " + response.status);
  }
  
}

async function populateResults() {
  let response = await fetch("/displayEvents");
  let events = (await response.json()).eventList;
  for (let event of events) {
    addEventToResults(event.eventName, event.eventID, event.eventURLImage);
  }
}

async function populateTypes() {
  
  let response = await fetch("/getTypes");
  
  if (response.ok) {
    
    let types = await response.json();
    
    let combo = document.getElementById("type");
    for (let type of types) {
      let item = document.createElement("option");
      item.textContent = type.typeName;
      combo.appendChild(item);
    }
    
  }
  
}

document.getElementById("join").addEventListener("click", joinEvent);
document.getElementById("close").addEventListener("click", function (e) {
  setPopupVisibility(false);
})

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