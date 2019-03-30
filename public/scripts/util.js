/**
 * Provides functionality for `createEvent.js` and `manageEvents.js`.
 * @module public/scripts/util
 */

 /**
  * Sends a JSON file to the specified url containing the entered form data.
  * @param {event} e - The event that triggered this functions execution.
  * @param {string} url - The URL to send the JSON to.
  */
function create_edit_Event(e, url){

  const NAME = document.getElementById("eventNameBox").value;
  const DATE = document.getElementById("dateBox").value;
  const ADDONE = document.getElementById("address1Box").value;
  const ADDTHREE = document.getElementById("address3Box").value;
  const POST = document.getElementById("postcodeBox").value;
  const TIME = document.getElementById("timeBox").value;
  let SHOPPINGLIST = document.getElementById("shoppingSelect");
  if (NAME != "" && DATE != "" && ADDONE != "" && ADDTHREE != "" && POST != "" && TIME != "") {
    const ADDTWO = document.getElementById("address2Box").value;
    const DATETIME = DATE + TIME;
    console.log(DATETIME);
    const TYPE = document.getElementById("typeSelect").value;
    let items = [];
    for (let i = 0; i < SHOPPINGLIST.length; i++) {
      items[i] = SHOPPINGLIST[i].innerText;
    }
    const DRESS = document.getElementById("dressCodeBox").value;
    const STATUS = document.getElementById("StatusSelect").selectedIndex;
    const THUMB = sessionStorage.getItem('thumb');
    const ID = sessionStorage.getItem('id');
    //URL.createObjectURL(THUMB) cannot be sent this way as the url it creates is very tempoary and
    //local to the machine it is on so the server wouldn't be able to access it
    let myEvent = {"eventName" : NAME,
    "eventAddress" : ADDONE + "," + ADDTWO + "," + ADDTHREE,
    "eventPostcode" : POST,
    "eventPublic" : STATUS,
    "eventURLImage" : THUMB,
    "eventDressCode" : DRESS,
    "eventType" : TYPE,
    "shopList" : items,
    "eventHostID" :  currentUser.user.userID,
    "eventDate": DATETIME,
    "eventID" : ID
    };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + instanceToken.getAuthResponse().id_token,
        },
        body: JSON.stringify(myEvent),
    })
    sessionStorage.removeItem('thumb');
    sessionStorage.removeItem('id');
  }else {
    alert("The Event Name, Date of Event, Time of Event, Address and Postcode fields are required!");
  }
  e.preventDefault();
  document.getElementById("formGrid").reset();
  while (SHOPPINGLIST.firstChild) {
    SHOPPINGLIST.removeChild(SHOPPINGLIST.firstChild);
  }
}
