
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

function viewEvent(eventID) {
  setPopupVisibility(true);
  document.getElementById("title").textContent = "ID OF EVENT TO DISPLAY: " + eventID;
}

async function populateResults() {
  let response = await fetch("/displayEvents");
  let events = (await response.json()).eventList;
  for (let event of events) {
    addEventToResults(event.eventName, event.eventID, event.eventURLImage);
  }
}

document.getElementById("close").addEventListener("click", function (e) {
  setPopupVisibility(false);
})

populateResults();
