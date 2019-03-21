/*api gives eventid and name, make butons in list, add eventlisteners,
 onclick calls another api which gets all of the events data which i can
 use to populate inputs (getSingleEvent?)*/
let eventList = document.getElementById("myEvents");
let myEvents = fetch(url, {
        method: "GET",
        /*headers: {
            "Content-Type": "application/json",
        },*/
      }).then(response => response.json());
for (let i = 0; i < myEvents.length; i++) {
  let id = myEvents[i].eventID;
  let name = myEvents[i].eventName;
  let myEvent = document.createElement("button");
  myEvent.id = id;
  myEvent.textContent = name;
  eventList.appendChild(myEvent);
}
