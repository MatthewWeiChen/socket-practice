const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(8000);

const io = socketio(expressServer);

io.on("connection", (socket) => {
  socket.emit("messageFromServer", { data: "Welcome to the socketio sever" });

  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });

  socket.on("newMessageToServer", (msg) => {
    //console.log(msg);
    io.emit("messageToClients", { text: msg.text });
  });

  //The server can still communicate across namespaces
  //but on the client, the socket needs to be in that namespace
  //in order to get the events

  io.of("/admin").emit(
    "welcome",
    "Welcome to the admin channel, from the main channel!"
  );
});

io.of("/admin").on("connection", (socket) => {
  console.log("someone connected to the admin namespace");
  io.of("/admin").emit("welcome", "welcome to the admin channel!");
});
