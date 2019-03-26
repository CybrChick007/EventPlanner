function myEvent(e, url){
  if(currentUser === undefined){
    alert("Not signed in!");
    return;
  }
  alert("hey");
  const NAME = document.getElementById("eventNameBox").value;
  const DATE = document.getElementById("dateBox").value;
  const ADDONE = document.getElementById("address1Box").value;
  const ADDTHREE = document.getElementById("address3Box").value;
  const POST = document.getElementById("postcodeBox").value;
  if (NAME != "" && DATE != "" && ADDONE != "" && ADDTHREE != "" && POST != "") {
    const ADDTWO = document.getElementById("address2Box").value;
    let type = document.getElementById("typeSelect");
    type = document.getElementById("typeSelect").options[type.selectedIndex].value;
    //type = document.getElementById("StatusSelect").options[type.selectedIndex].value;
    let shoppingList = document.getElementById("shoppingSelect");
    let items = [];
    for (let i = 0; i < shoppingList.length; i++) {
      //console.log(shoppingList[i].innerText);
      items[i] = shoppingList[i].innerText;
    }
    const DRESS = document.getElementById("dressCodeBox").value;
    let status = document.getElementById("StatusSelect");
    status = document.getElementById("StatusSelect").options[status.selectedIndex].value;
    const THUMB = sessionStorage.getItem('thumb');
    console.log(THUMB);
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
    "eventDate": DATE
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
  }
  console.log(myEvent);//for debugging
  e.preventDefault();
  document.getElementById("formGrid").reset();
}

export myEvent;
