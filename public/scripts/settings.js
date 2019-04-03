function saveSettings(){
  const FIRSTNAME = document.getElementById("fName").value;
  const LASTNAME = document.getElementById("lName").value;
  const AGE = document.getElementById("age").value;
  const CONTACTNUMBER = document.getElementById("contactNumber").value;
  console.log(profile.U3);
  let newSettings = {
    "userID" : profile.U3,
    "FName" : FIRSTNAME,
    "LName" : LASTNAME,
    "Age" : AGE,
    "ContactNumber": CONTACTNUMBER
  };

  fetch("/saveSettings", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + instanceToken.getAuthResponse().id_token,
      },
      body: JSON.stringify(newSettings),
  });
  console.log("completed");
}
