let addButton = document.getElementById("sladd");
let delButton = document.getElementById("sldel");
addButton.addEventListener("click", addToShopping);
delButton.addEventListener("click", removeFromShopping);
let uploadButton = document.getElementById("uploadButton");
uploadButton.addEventListener("change", upload);

function addToShopping(e){
  let shopping = document.getElementById("shoppingBox");
  let shoppingItem = shopping.value;
  if (shoppingItem != "") {
    let list = document.getElementById("shoppingSelect");
    let item = document.createElement("option");
    item.value = shoppingItem;
    item.textContent = shoppingItem;
    list.appendChild(item);
  }else {
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
  console.log(MYURL);
  document.getElementById("thumbnail").src=MYURL;
  var file = MYIMAGE;
  var reader = new FileReader();
  reader.onloadend = function() {
    console.log('RESULT', reader.result)
  }
  reader.readAsDataURL(file);
  console.log("hi");
}
