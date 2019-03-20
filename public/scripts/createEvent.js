/*let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", addEvent);*/
let formSubmit = document.getElementById("formGrid");
formSubmit.addEventListener("onsubmit", addEvent);
let resetButton = document.getElementById("delbtn");
resetButton.addEventListener("click", resetPress);

function addEvent(e){
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
