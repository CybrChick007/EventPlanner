function create_edit_Event(e, url){
  // if(currentUser === undefined){
  //   alert("Not signed in!");
  //   return;
  // }

  const NAME = document.getElementById("eventNameBox").value;
  const DATE = document.getElementById("dateBox").value;
  const ADDONE = document.getElementById("address1Box").value;
  const ADDTHREE = document.getElementById("address3Box").value;
  const POST = document.getElementById("postcodeBox").value;
  let SHOPPINGLIST = document.getElementById("shoppingSelect");
  if (NAME != "" && DATE != "" && ADDONE != "" && ADDTHREE != "" && POST != "") {
    const ADDTWO = document.getElementById("address2Box").value;
    let type = document.getElementById("typeSelect");
    type = document.getElementById("typeSelect").options[type.selectedIndex].value;
    //type = document.getElementById("StatusSelect").options[type.selectedIndex].value;
    let items = [];
    for (let i = 0; i < SHOPPINGLIST.length; i++) {
      //console.log(SHOPPINGLIST[i].innerText);
      items[i] = SHOPPINGLIST[i].innerText;
    }
    const DRESS = document.getElementById("dressCodeBox").value;
    let status = document.getElementById("StatusSelect");
    status = document.getElementById("StatusSelect").options[status.selectedIndex].value;
    const THUMB = sessionStorage.getItem('thumb');
    const ID = sessionStorage.getItem('id');
    //console.log(THUMB);
    //URL.createObjectURL(THUMB) cannot be sent this way as the url it creates is very tempoary and
    //local to the machine it is on so the server wouldn't be able to access it
    let myEvent = {"eventName" : NAME,
    //"eventDate" : DATE,
    "eventAddress" : ADDONE + "," + ADDTWO + "," + ADDTHREE,
    "eventPostcode" : POST,
    "eventPublic" : status,
    "eventURLImage" : THUMB,
    "eventDressCode" : DRESS,
    "eventType" : type,
    "shopList" : items,
    "eventHostID" :  currentUser.user.userID,
    "eventDate": DATE,
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
  }
  //console.log(myEvent);//for debugging
  e.preventDefault();
  document.getElementById("formGrid").reset();
  while (SHOPPINGLIST.firstChild) {
    SHOPPINGLIST.removeChild(SHOPPINGLIST.firstChild);
  }
}

//export create_edit_Event;
