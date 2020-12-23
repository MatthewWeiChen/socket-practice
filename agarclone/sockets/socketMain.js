//where all our main socket stuff will go
//server side
const io = require("../servers").io;

const Orb = require("./classes/Orbs");
let orbs = [];
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5, //as a player gets bigger, the zoom needs to go out
  worldWidth: 500,
  worldHeight: 500,
};

initGame();

io.sockets.on("connect", (socket) => {
  //a player has connected

  //make a playerCongit object
  // let playerConfig = new playerConfig()

  //make a playerData object
  // let playerData = new playerData();

  //make a master player object to hold both
  // let Player = new Player(socket.id, playerConfig, playerData)
  socket.emit("init", {
    orbs,
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
