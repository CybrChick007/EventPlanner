
const navbar = [
  ["HOME", "index.html"],
  ["CREATE EVENT", "create-event.html"],
  ["MANAGE EVENTS", "manage-events.html"],
  ["MESSAGE USER", "messaging.html"],
  ["TIMETABLE", "timetable.html"],
  ["SETTINGS", "settings.html"],
];

const logo_path = "images/logo.png";

function insert_navbar() {
  
  let container = document.createElement("nav");
  let list = document.createElement("ol");
  
  for (let data of navbar) {
    let item = document.createElement("li");
    let lnk = document.createElement("a");
    
    [item.textContent, lnk.href] = data;
    
    lnk.appendChild(item);
    list.appendChild(lnk);
  }
  
  let arrow = document.createElement("li");
  arrow.textContent = "<---";
  arrow.id = "hidenav";
  
  list.appendChild(arrow);
  container.appendChild(list);
  document.body.insertBefore(container, document.body.childNodes[0]);
}

function insert_logo() {
  
  let container = document.createElement("section");
  container.id = "logo";
  
  let img = document.createElement("img");
  img.src = logo_path;
  
  let paragraph = document.createElement("p");
  paragraph.textContent = "EventZ";
  
  container.appendChild(img);
  container.appendChild(paragraph);
  document.body.insertBefore(container, document.body.childNodes[0]);
}

function setup() {
  insert_logo();
  insert_navbar();
}

setup();
