/**
 * Provides functionality for `create-event.html` by adding an event listener to the save button which calls create_edit_Event from util.js.
 * @module public/scripts/createEvent
 */

let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", function(e){create_edit_Event(e, "/createEvent");});
