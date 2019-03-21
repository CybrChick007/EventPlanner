let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", addEvent);
/*let formSubmit = document.getElementById("formGrid");
formSubmit.addEventListener("onsubmit", addEvent);*/
let resetButton = document.getElementById("delbtn");
resetButton.addEventListener("click", resetPress);

function addEvent(e){
  const NAME = document.getElementById("eventNameBox").value;
  const DATE = document.getElementById("dateBox").value;
  const ADDONE = document.getElementById("address1Box").value;
  const ADDTHREE = document.getElementById("address3Box").value;
  const POST = document.getElementById("postcodeBox").value;
  console.log(DATE);
  if (NAME != "" && DATE != "" && ADDONE != "" && ADDTHREE != "" && POST != "") {
    const ADDTWO = document.getElementById("address2Box").value;
    const TYPE = document.getElementById("typeSelect").value;
    let shoppingList = document.getElementById("shoppingSelect");
    let items = shoppingList.children;
    for (let i = 0; i < items.length; i++) {
      items[i] = items[i].value;
    }
    const DRESS = document.getElementById("dressCodeBox").value;
    const STATUS = document.getElementById("StatusSelect").value;
    const THUMB = sessionStorage.getItem('thumb');
    console.log(THUMB);
    //URL.createObjectURL(THUMB) cannot be sent this way as the url it creates is very tempoary and
    //local to the machine it is on so the server wouldn't be able to access it
    let myEvent = {"eventName" : NAME,
    //"eventDate" : DATE,
    "eventAddress" : ADDONE + "," + ADDTWO + "," + ADDTHREE,
    "eventPostcode" : POST,
    "eventPublic" : STATUS,
    "eventURLImage" : THUMB,
    "eventDressCode" : DRESS,
    "eventType" : TYPE,
    "shopList" : items};
    //missing eventHost userID and something to send the date to
    //console.log(myEvent);
    //console.log(JSON.stringify(myEvent));
    fetch("/createEvent", {
        method: "POST",
        //credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(myEvent), // body data type must match "Content-Type" header
    })
    //.then(response => response.json()); // parses JSON response into native Javascript objects
    sessionStorage.removeItem('thumb');
  }
  //e.preventDefault();
}

function resetPress(e){
  let shoppingList = document.getElementById("shoppingSelect");
  while (shoppingList.firstChild) {
    shoppingList.removeChild(shoppingList.firstChild);
  }
  document.getElementById("thumbnail").src="images/placeholderThumb.png";
  sessionStorage.removeItem('thumb');
}
