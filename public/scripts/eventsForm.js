let addButton = document.getElementById("sladd");
addButton.addEventListener("click", addToShopping);

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
