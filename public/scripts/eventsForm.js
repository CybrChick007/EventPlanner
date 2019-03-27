let addButton = document.getElementById("sladd");
let delButton = document.getElementById("sldel");
addButton.addEventListener("click", addToShopping);
delButton.addEventListener("click", removeFromShopping);
let uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("change", upload);
let resetButton = document.getElementById("delbtn");
resetButton.addEventListener("click", resetPress);

function addToShopping(e){
  let shoppingItem =  document.getElementById("shoppingBox").value;
  if (shoppingItem != "") {
    let list = document.getElementById("shoppingSelect");
    let item = document.createElement("option");
    item.value = shoppingItem;
    item.textContent = shoppingItem;
    list.appendChild(item);
    document.getElementById("shoppingBox").value = "";
  }
  else {
    alert("Please enter a shopping item");
  }
}

function removeFromShopping(e){
  let sel = document.getElementById("shoppingSelect");
  if (sel.selectedIndex != -1) {
    let opt = sel.options[sel.selectedIndex];
    sel.removeChild(opt);
  }else {
    alert("Please enter a shopping item");
  }
}

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

function resetPress(e){
  let shoppingList = document.getElementById("shoppingSelect");
  while (shoppingList.firstChild) {
    shoppingList.removeChild(shoppingList.firstChild);
  }
  document.getElementById("thumbnail").src="images/placeholderThumb.png";
  sessionStorage.removeItem('thumb');
}
