const socket = io("http://localhost:8000"); //the namespace/endpoint
const socket2 = io("http://localhost:8000/admin");

socket.on("connect", () => {
  console.log(socket.id);
});

socket2.on("connect", () => {
  console.log(socket2.id);
});

socket.on("messageFromServer", (dataFromServer) => {
  console.log(dataFromServer);
  socket.emit("messageToServer", { data: "this is the client" });
});

socket2.on("welcome", (msg) => {
  console.log(msg);
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  socket.emit("newMessageToServer", { text: newMessage });
});

socket.on("messageToClients", (msg) => {
  console.log(msg);
  document.querySelector("#messages").innerHTML += `<li>${msg.text}</li>`;
});
