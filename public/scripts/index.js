
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
  
  item.appendChild(img);
  item.appendChild(txt);
  item.appendChild(viewButton);
  
  results.appendChild(item);
  
}

// testing
for (let i = 0; i < 33; i++) {
  addEventToResults("Sample Event", null, "https://via.placeholder.com/300x200");
}
