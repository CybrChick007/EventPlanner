async function loadUserSettings(){
  if (!currentUser) {
    setTimeout(loadUserSettings, 50);
    return;
  }
  let response = await fetch("/getUserByEmail?email=" + profile.U3);
  let userDetails = await response.json();
  fillTextBox(userDetails.FName,"fName");
  fillTextBox(userDetails.LName,"lName");
  fillTextBox(userDetails.Age,"age");
  fillTextBox(userDetails.ContactNumber,"contactNumber");
}

function fillTextBox(value, elementID){
  if(value != undefined){
      document.getElementById(elementID).value = value;
  }
}

async function saveSettings(){
  const FIRSTNAME = document.getElementById("fName").value;
  const LASTNAME = document.getElementById("lName").value;
  const AGE = document.getElementById("age").value;
  const CONTACTNUMBER = document.getElementById("contactNumber").value;
  let newSettings = {
    "email" : profile.U3,
    "FName" : FIRSTNAME,
    "LName" : LASTNAME,
    "Age" : AGE,
    "ContactNumber": CONTACTNUMBER
  };

  await fetch("/saveSettings", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + instanceToken.getAuthResponse().id_token,
      },
      body: JSON.stringify(newSettings),
  });
  alert("Updated!");
  document.getElementById("settingscontainer").reset();
}

let saveSettingsButton = document.getElementById("saveSettings");
saveSettingsButton.addEventListener("click", saveSettings);

window.addEventListener("load", loadUserSettings);
