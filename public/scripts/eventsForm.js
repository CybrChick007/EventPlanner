let addButton = document.getElementById("sladd");
let delButton = document.getElementById("sldel");
addButton.addEventListener("click", addToShopping);
delButton.addEventListener("click", removeFromShopping);

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
