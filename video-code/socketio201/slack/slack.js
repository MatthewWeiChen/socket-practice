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
  // console.log(nsData);
  //send the nsData back to the client. We need to use socket, NOT io, because we want it to send
  //to just this client.
  socket.emit("nsList", nsData);
});

//loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  //console.log(namespace);
  io.of(namespace.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    //a socket has connected to one of our chatgroup namespaces
    //send that ns group info back
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallBack) => {
      //deal with history... once we have it
      nsSocket.join(roomToJoin);
      const ids = io.of("/wiki").in(roomToJoin).sockets.size;
      console.log(ids);
      numberOfUsersCallBack(ids);
    });
    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg,
        time: Date.now(),
        username: "rbunch",
        avatar: "https://viaplaceholder.com/30",
      };
      console.log(fullMsg);
      //send this message to ALL the sockets that are in the room that THIS socket is in.
      //how can we find out what rooms THIS socket is in?
      //the user will be in the 2nd room in the object list
      //this is because the socket always joins it's own room on connection
      //get the keys
      const roomTitle = Array.from(nsSocket.rooms)[1];
      console.log(roomTitle);
      io.of("/wiki").to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});
