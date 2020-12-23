//where all our main socket stuff will go
//server side
const io = require("../servers").io;

const Orb = require("./classes/Orbs");
let orbs = [];

initGame();

io.sockets.on("connect", (socket) => {
  socket.emit("init", {
    orbs,
  });
});

function initGame() {
  for (let i = 0; i < 500; i++) {
    orbs.push(new Orb());
  }
}

module.exports = io;
