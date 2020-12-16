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
    // console.log(`${nsSocket.id} has join ${namespace.endpoint}`);
    //a socket has connected to one of our chatgroup namespaces
    //send that ns group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfUsersCallBack) => {
      //deal with history... once we have it
      const roomToLeave = Array.from(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersInRoom(namespace, roomToLeave);

      nsSocket.join(roomToJoin);
      const numberOfSockets = io.of(namespace.endpoint).in(roomToJoin).sockets
        .size;
      numberOfUsersCallBack(numberOfSockets);

      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      nsSocket.emit("historyCatchUp", nsRoom.history);
      updateUsersInRoom(namespace, roomToJoin, numberOfSockets);
    });

    nsSocket.on("newMessageToServer", (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "rbunch",
        avatar: "https://viaplaceholder.com/30",
      };
      // console.log(fullMsg);
      //send this message to ALL the sockets that are in the room that THIS socket is in.
      //how can we find out what rooms THIS socket is in?
      //the user will be in the 2nd room in the object list
      //this is because the socket always joins it's own room on connection
      //get the keys
      const roomTitle = Array.from(nsSocket.rooms)[1];

      //we need to find the Room object for this room
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      // console.log(
      //   "The room object that we made that matches this NS room is..."
      // );
      // console.log(nsRoom);
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint).to(roomTitle).emit("messageToClients", fullMsg);
    });
  });
});

function updateUsersInRoom(namespace, roomToJoin, numberOfSockets) {
  //send back the number of users in this room to ALL sockets connected to this room
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .emit("updateMembers", numberOfSockets);
}
