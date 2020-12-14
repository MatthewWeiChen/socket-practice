const socket = io("http://localhost:8000"); //the namespace/endpoint
const socket2 = io("http://localhost:8000/wiki");
const socket3 = io("http://localhost:8000/mozilla");
const socket4 = io("http://localhost:8000/linux");

socket.on("messageFromServer", (dataFromServer) => {
  // console.log(dataFromServer);
  socket.emit("messageToServer", { data: "this is the client" });
});

//listen for nsList, which is a list of all the namespaces

socket.on("nsList", (nsData) => {
  // console.log("The list of namespaces has arrived!!");
  // console.log(nsData);
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });
  //set up click listener to each namespace

  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(nsEndpoint);
    });
  });
  const nsSocket = io("http://localhost:8000/wiki");
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
      let glpyh;
      if (room.privateRoom) {
        glpyh = "lock";
      } else {
        glpyh = "globe";
      }
      roomList.innerHTML += `<li><span class="glyphicon glyphicon-${glpyh}}"></span>${room.roomTitle}</li>`;
    });
  });
});

socket2.on("welcome", (dataFromServer) => {
  console.log(dataFromServer);
});

socket.on("joined", (msg) => {
  console.log(msg);
});

document.querySelector(".message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { text: newMessage });
});
