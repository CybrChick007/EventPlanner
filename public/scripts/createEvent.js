let saveButton = document.getElementById("savebtn");
saveButton.addEventListener("click", addEvent);
let resetButton = document.getElementById("delbtn");
resetButton.addEventListener("click", resetPress);
let uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("change", upload);

function addEvent(e){
  e.preventDefault();
}

function resetPress(e){
  let shoppingList = document.getElementById("shoppingSelect");
  while (shoppingList.firstChild) {
    shoppingList.removeChild(shoppingList.firstChild);
  }
  document.getElementById("thumbnail").src="images/placeholderThumb.png";
}

function upload(e){
  console.log(uploadButton.files);
  document.getElementById("thumbnail").src=uploadButton.files;
}
