const socket = io("http://localhost:8000"); //the namespace/endpoint
const socket2 = io("http://localhost:8000/admin");

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "this is the client" });
});

socket2.on("welcome", (dataFromServer) => {
  console.log(dataFromServer);
});

socket.on("joined", (msg) => {
  console.log(msg);
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { text: newMessage });
});
