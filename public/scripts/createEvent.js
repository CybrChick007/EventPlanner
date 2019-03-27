//import create_edit_Event from "./util.js";

let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", function(e){create_edit_Event(e, "/createEvent");});
/*let formSubmit = document.getElementById("formGrid");
formSubmit.addEventListener("onsubmit", addEvent);*/

//addEvent has been moved to util.js and renamed to myEvent
