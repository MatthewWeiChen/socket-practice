//socketio server

const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");
app.use(express.static(__dirname + "/public"));
const expressServer = app.listen(8000);
const io = socketio(expressServer);

io.on("connection", (socket) => {
  //build an array to send back with the img and endpoint for each namespace
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  console.log(nsData);
  //send the nsData back to the client. We need to use socket, NOT io, because we want it to
  //to just this client.
  socket.emit("nsList", nsData);
});

//loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  //console.log(namespace);
  io.of(namespace.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has join ${namespace.endpoint}`);
  });
});
