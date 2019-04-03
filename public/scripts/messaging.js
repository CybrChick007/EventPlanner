
const RATE = 500;
let otherUser = null;

async function getOtherUser(participants) {
  let temp = participants.slice();
  temp.splice(temp.indexOf(currentUser.user.userID), 1);
  let response = await fetch("getUser?userID=" + temp[0]);
  return await response.json();
}

async function updateThreads() {
  let list = document.getElementById("threads");
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  let response = await fetch("/messagethreads?userID=" + currentUser.user.userID);
  let threads = await response.json();
  
  for (let thread of threads) {
    let item = document.createElement("li");
    let otherUser = await getOtherUser(thread.participants);
    item.textContent = otherUser.email;
    list.appendChild(item);
    
    item.addEventListener("click", function () {
      showThread(thread.participants);
    });
    
  }
  
}

async function showThread(participants) {

  document.getElementById("messagescontainer").style.display = "inherit";
  
  otherUser = await getOtherUser(participants);
  
  let response = await fetch("/messages?p1=" + participants[0] + "&p2=" + participants[1]);
  let messages = await response.json();
  
  let list = document.getElementById("messages");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  
  for (let message of messages) {
    let item = document.createElement("li");
    item.textContent = message.message;
    if (message.userID == otherUser.userID) {
      item.classList.add("other");
    }
    list.appendChild(item);
  }
  
  list.scrollTop = list.scrollHeight;
  
}

async function sendMessage() {
  
  let box = document.getElementById("message");
  let message = box.value;
  
  let response = await fetch("/messages", {
    method: "POST",
    body: JSON.stringify({
      "userID": currentUser.user.userID,
      "p1": currentUser.user.userID,
      "p2": otherUser.userID,
      "message": message,
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + instanceToken.getAuthResponse().id_token,
    },
  });
  
  if (response.ok) {
    box.value = "";
    showThread([currentUser.user.userID, otherUser.userID]);
  }
}

async function createThread() {
  
  let box = document.getElementById("email");
  let email = box.value;
  
  let response = await fetch("/getUserByEmail?email=" + email);
  let user = await response.json();
  
  response = await fetch("/messages", {
    method: "POST",
    body: JSON.stringify({
      "userID": null,
      "p1": currentUser.user.userID,
      "p2": user.userID,
      "message": null,
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + instanceToken.getAuthResponse().id_token,
    },
  });
  
  if (response.ok) {
    box.value = "";
    showThread([currentUser.user.userID, user.userID]);
  }
  
}

async function update() {
  
  if (otherUser) {
    
    let response = await fetch("/messages?p1=" + currentUser.user.userID + "&p2=" + otherUser.userID);
    let messages = await response.json();
    
    let list = document.getElementById("messages");
    if (messages.length != list.childNodes.length) {
      showThread([currentUser.user.userID, otherUser.userID]);
    };
  }
  
  let response = await fetch("/messagethreads?userID=" + currentUser.user.userID);
  let threads = await response.json();
  let list = document.getElementById("threads");
  if (threads.length != list.childNodes.length) {
    updateThreads();
  }
}

function setupMessaging() {
  if (!currentUser) {
    setTimeout(setupMessaging, 50);
    return;
  }
  setInterval(update, RATE);
  document.getElementById("send").addEventListener("click", function () {
    sendMessage();
  });
  document.getElementById("message").addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      sendMessage();
    }
  });
  document.getElementById("create").addEventListener("click", function () {
    createThread();
  });
  document.getElementById("email").addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      createThread();
    }
  });
  
}

document.getElementById("messagescontainer").style.display = "none";
setupMessaging();

/*
  */