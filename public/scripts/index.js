
let results = document.getElementById("results");

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

async function viewEvent(eventID) {
  
  let response = await fetch("/getSingleEvent?eventID=" + eventID);
  
  if (response.ok) {
    
    setPopupVisibility(true);
    
    let data = (await response.json()).event;
    
    document.getElementById("title").textContent = data.eventName + " - " + new Date(data.eventDate).toString();
    document.getElementById("address").textContent = "Address: " + data.eventAddress;
    document.getElementById("description").textContent = data.eventDescription;
    document.querySelector("#details > img").src = data.eventURLImage;
    
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

async function populateTags() {
  
  let response = await fetch("/getTags"); // change
  
  if (response.ok) {
    
    let tags = await response.json();
    
    let combo = document.getElementById("tag");
    for (let tag of tags) {
      let item = document.createElement("option");
      item.textContent = tag;
      combo.appendChild(item);
    }
    
  }
  
}

document.getElementById("close").addEventListener("click", function (e) {
  setPopupVisibility(false);
})

populateResults();
populateTags();

// temporary map
window.addEventListener("load", function() {
  //setPopupVisibility(true);
  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 0, lng: 0},
    zoom: 8,
    disableDefaultUI: true
  });
});