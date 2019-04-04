/**
 * Provides functionality for `manage-events.html` and `create-event.html`.
 * @module public/scripts/eventsForm
 */
let addButton = document.getElementById("sladd");
let delButton = document.getElementById("sldel");
addButton.addEventListener("click", addToShopping);
delButton.addEventListener("click", removeFromShopping);
let uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("change", upload);
let resetButton = document.getElementById("delbtn");
resetButton.addEventListener("click", resetPress);

/**
 * Adds the text from the `Add to Shopping List` textbox as an option in the select statement `Shopping List`
 * @param {event} e - The event that triggered this functions execution.
 */
function addToShopping(e){
  let shoppingItem =  document.getElementById("shoppingBox").value;
  if (shoppingItem != "") {
    let list = document.getElementById("shoppingSelect");
    let item = document.createElement("option");
    item.value = shoppingItem;
    item.textContent = shoppingItem;
    list.prepend(item);
    list.selectedIndex = 0;
    document.getElementById("shoppingBox").value = "";
  }
  else {
    alert("Please enter a shopping item");
  }
}

/**
 * removes the currently selected item from the `Shopping List`
 * @param {event} e - The event that triggered this functions execution.
 */
function removeFromShopping(e){
  let sel = document.getElementById("shoppingSelect");
  if (sel.selectedIndex != -1) {
    let opt = sel.options[sel.selectedIndex];
    sel.removeChild(opt);
  }else {
    alert("Please enter a shopping item");
  }
}

/**
 * changes the source of the preview image to the image the user has uploaded,
 * and then converts the image file to X64 and stores it in session storage
 * so it can be used in the save function.
 * @param {event} e - The event that triggered this functions execution.
 */
function upload(e){
  const MYIMAGE = e.target.files[0];
  const MYURL = URL.createObjectURL(MYIMAGE);
  //console.log(MYURL);
  document.getElementById("thumbnail").src=MYURL;
  let file = MYIMAGE;
  let reader = new FileReader();
  reader.onloadend = function() {
    let result = reader.result;
    sessionStorage.setItem('thumb', result);
    //console.log('RESULT', result);
    //console.log('RESULT2', sessionStorage.getItem('thumb'));
  }
  reader.readAsDataURL(file);
}

/**
 * removes all of the shopping list items and the thumbnail image when
 * the `RESET` or `DELETE EVENT` buttons are pressed
 * @param {event} e - The event that triggered this functions execution.
 */
function resetPress(e){
  let shoppingList = document.getElementById("shoppingSelect");
  while (shoppingList.firstChild) {
    shoppingList.removeChild(shoppingList.firstChild);
  }
  document.getElementById("thumbnail").src="images/placeholderThumb.png";
  sessionStorage.removeItem('thumb');
}

/**
 * Gets all the types from the server and populates the type combo box.
 */
async function populateTypes() {

  let response = await fetch("/getTypes");

  if (response.ok) {

    let types = await response.json();

    let combo = document.getElementById("typeSelect");

    for (let type of types) {
      let item = document.createElement("option");
      item.textContent = type.typeName;
      item.value = type.typeID;
      combo.appendChild(item);
    }

  }

}

populateTypes()
