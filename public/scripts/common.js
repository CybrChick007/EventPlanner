/**
 * Contains functions that will be used accross multiple webpages.
 * @module public/scripts/common
 */

const navbar = [
  ["HOME", "index.html"],
  ["CREATE EVENT", "create-event.html"],
  ["MANAGE EVENTS", "manage-events.html"],
  ["MESSAGE USER", "messaging.html"],
  ["TIMETABLE", "timetable.html"],
  ["SETTINGS", "settings.html"],
];

const logo_path = "images/logo.png";

const googleClientId = "934035794483-hheclnb5qoh28b4n0ktilgm35160ue4u"

/**
 * Inserts elements into body to create the navbar.
 */
function insertNavbar() {

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

/**
 * Inserts elements into body to create the header, consisting of the logo and google login button.
 */
function insertHeader() {

  let header = document.createElement("header");

  let logoSection = document.createElement("section");
  logoSection.id = "logo";

  let img = document.createElement("img");
  img.src = logo_path;
  img.alt = "EventZ logo";

  let paragraph = document.createElement("p");
  paragraph.textContent = "EventZ";

  logoSection.appendChild(img);
  logoSection.appendChild(paragraph);

  header.appendChild(logoSection);

  let loggedinSection = document.createElement("section");
  loggedinSection.id = "loggedin";

  let profileImg = document.createElement("img");
  profileImg.src = "images/logo.png";

  let button = document.createElement("div");
  button.classList.add("g-signin2");
  button.setAttribute("data-onsuccess", "onSignIn");

  loggedinSection.appendChild(button);
  loggedinSection.appendChild(profileImg);

  header.appendChild(loggedinSection);

  document.body.insertBefore(header, document.body.childNodes[0]);
}

/**
 * Shows/hides the navbar based on the visible boolean parameter.
 * @param {boolean} visible - Whether the navbar should be visible or not.
 */
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

//FUNCTION FETCHING TO THE SERVER
let currentUser;

/**
 * As specified by the google login button, the google platform api
 * will call this function when the user logs in.
 * @param {object} googleUser - User information provided by the google platform api.
 */
async function onSignIn(googleUser) {
  //console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  profile = googleUser.getBasicProfile();
  console.log(profile.U3);

  const response = await fetch('http://localhost:8080/auth/' + profile.U3);
  const data = await response.json();
  //console.log(data);
  if(data.message == 'Not authorized'){
    alert('Not authorized');
    signOut();
  } else {
    currentUser = {
      "user": data.user,
      "token": idToken,
      "profile": profile,
    };
    document.querySelector("#loggedin > img").src = profile.Paa;
  }
}

/**
 * Will sign the user out of the website.
 */
function signOut()
{
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    alert("You have been logged out");
  });
}
//display only for google button
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

/**
 * Sets up the common structure and functionality of the page.
 */
function setup() {
  insertHeader();
  insertNavbar();

  let meta = document.createElement("meta");
  meta.name = "google-signin-client_id";
  meta.content = googleClientId + ".apps.googleusercontent.com";
  document.head.appendChild(meta);

}

setup();
