//where all our main socket stuff will go
//server side
const io = require("../servers").io;

//===========CLASSES==============
const Player = require("./classes/Player");
const PlayerData = require("./classes/PlayerData");
const PlayerConfig = require("./classes/PlayerConfig");
const Orb = require("./classes/Orbs");
let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5, //as a player gets bigger, the zoom needs to go out
  worldWidth: 500,
  worldHeight: 500,
};

initGame();

//issue a message to EVERY connected socket 30 fps
setInterval(() => {
  io.to("game").emit("tock", {
    players,
  });
}, 33);

io.sockets.on("connect", (socket) => {
  //a player has connected
  socket.on("init", (data) => {
    //add the player to the game namespace
    socket.join("game");
    //make a playerCongit object
    let playerConfig = new PlayerConfig(settings);

    //make a playerData object
    let playerData = new PlayerData(data.playerName, settings);

    //make a master player object to hold both
    let player = new Player(socket.id, playerConfig, playerData);

    socket.emit("initReturn", {
      orbs,
    });
    players.push(playerData);
  });
});

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
