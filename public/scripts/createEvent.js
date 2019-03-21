let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", addEvent);
/*let formSubmit = document.getElementById("formGrid");
formSubmit.addEventListener("onsubmit", addEvent);*/
let resetButton = document.getElementById("delbtn");
resetButton.addEventListener("click", resetPress);

function addEvent(e){
  console.log("Hello");
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
    const THUMB = document.getElementById("uploadButton").files[0];
    /*let dataURL = "";
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        let canvas = document.createElement('CANVAS');
        let c = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
        c.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL("base64Img");
        canvas = null;
    };
    img.src = URL.createObjectURL(THUMB);*/
    console.log(THUMB);
    let reader = new FileReader();
    reader.onloadend = function() {
      console.log(reader.error);
    }
    reader.onabort = function() {
      console.log("abort", reader.error);
    }
    try {
      console.log(reader.readyState);
      reader.readAsDataURL(THUMB);
      console.log(reader.readyState);
      console.log(reader.result);
      reader.onloadend = function() {
        console.log(reader.readyState);
        const RESULT = reader.result;
        console.log('RESULT', RESULT);
        //URL.createObjectURL(THUMB) cannot be sent this way as the url it creates is very tempoary and
        //local to the machine it is on so the server wouldn't be able to access it
        let myEvent = {"eventName" : NAME,
        "eventAddress" : ADDONE + "," + ADDTWO + "," + ADDTHREE,
        "eventPostcode" : POST,
        "eventPublic" : STATUS,
        "eventURLImage" : RESULT,
        "eventDressCode" : DRESS,
        "eventType" : TYPE,
        "shopList" : items};
        //missing eventHost userID and something to send the date to
        //reader.addEventListener("load", function () {console.log(reader.result);});
        console.log(RESULT);
        console.log(myEvent);
        console.log(JSON.stringify(myEvent));
        console.log(atob(myEvent.eventURLImage));
      }
      /*while (reader.readyState!=2) {
        console.log(reader.readyState);
      }*/
      console.log("hello");
    } catch (e) {
      console.log(reader.error);
    } finally {

    }

  }
  //e.preventDefault();
}

function resetPress(e){
  let shoppingList = document.getElementById("shoppingSelect");
  while (shoppingList.firstChild) {
    shoppingList.removeChild(shoppingList.firstChild);
  }
  document.getElementById("thumbnail").src="images/placeholderThumb.png";
}
