/*let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", addEvent);*/
let formSubmit = document.getElementById("formGrid");
formSubmit.addEventListener("onsubmit", addEvent);
let resetButton = document.getElementById("delbtn");
resetButton.addEventListener("click", resetPress);

function addEvent(e){
  const NAME = document.getElementById("eventNameBox").value;
  const DATE = document.getElementById("dateBox").value;
  const ADDONE = document.getElementById("address1Box").value;
  const ADDTWO = document.getElementById("address2Box").value;
  const ADDTHREE = document.getElementById("address3Box").value;
  const POST = document.getElementById("postcodeBox").value;
  const TYPE = document.getElementById("typeSelect").value;
  let shoppingList = document.getElementById("shoppingSelect");
  let items = shoppingList.children;
  for (let i = 0; i < items.length; i++) {
    items[i] = items[i].value;
  }
  const DRESS = document.getElementById("dressCodeBox").value;
  const STATUS = document.getElementById("StatusSelect").value;
  const THUMB = document.getElementById("uploadButton").files[0];//URL.createObjectURL(THUMB)
  let myEvent = {"eventName" : NAME,
                "eventAddress" : ADDONE + ", " + ADDTWO + ", " + ADDTHREE,
                "eventPostcode" : POST,
                "eventPublic" : STATUS,
                "eventURLImage" : THUMB,
                "eventDressCode" : DRESS,
                "eventType" : TYPE,
                "shopList" : items;}//missing eventHost userID and something to send the date to
  console.log("hi");
  e.preventDefault();
}

function resetPress(e){
  let shoppingList = document.getElementById("shoppingSelect");
  while (shoppingList.firstChild) {
    shoppingList.removeChild(shoppingList.firstChild);
  }
  document.getElementById("thumbnail").src="images/placeholderThumb.png";
}
