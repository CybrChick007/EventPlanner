
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
  
  let eventID = parseInt(Math.random() * 10000);
  
  viewButton.addEventListener("click", function (e) {
    viewEvent(eventID);
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
  document.getElementById("title").textContent = eventID;
}

document.getElementById("close").addEventListener("click", function (e) {
  setPopupVisibility(false);
})

// testing
for (let i = 0; i < 33; i++) {
  addEventToResults("Sample Event", null, "https://via.placeholder.com/300x200");
}
