
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
  arrow.textContent = "<";
  arrow.id = "hidenav";

  list.appendChild(arrow);
  container.appendChild(list);
  document.body.insertBefore(container, document.body.childNodes[0]);

  let showbutton = document.createElement("button");
  showbutton.id = "shownav";
  showbutton.textContent = ">";
  showbutton.classList.add("button");
  document.body.appendChild(showbutton);

  document.getElementById("hidenav").addEventListener("click", function () {
    setNavbarVisibility(false);
  });

  document.getElementById("shownav").addEventListener("click", function () {
    setNavbarVisibility(true);
  });

}

function insert_logo() {

  let container = document.createElement("section");
  container.id = "logo";

  let img = document.createElement("img");
  img.src = logo_path;
  img.alt = "EventZ logo";

  let paragraph = document.createElement("p");
  paragraph.textContent = "EventZ";

  container.appendChild(img);
  container.appendChild(paragraph);
  document.body.insertBefore(container, document.body.childNodes[0]);
}

function setNavbarVisibility(visible) {
  let nav = document.querySelector("nav");
  let showbutton = document.getElementById("shownav");
  if (visible) {
    nav.style.display = null;
    document.body.style["padding-left"] = null;
    showbutton.style.display = "none";
  } else {
    nav.style.display = "none";
    document.body.style["padding-left"] = "0";
    showbutton.style.display = "initial";
  }
}



function onSignIn(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}

function signOut()
{
  var auth2 = gapi.auth2.getauthinstance();
  auth2.signOut().then(funtion(){

    alert("You have been logged out");
    
  }
}

function setup() {
  insert_logo();
  insert_navbar();
}

setup();
