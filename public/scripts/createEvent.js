import myEvent from "util.js";

let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", function(){myEvent(e, "/createEvent");});
/*let formSubmit = document.getElementById("formGrid");
formSubmit.addEventListener("onsubmit", addEvent);*/
