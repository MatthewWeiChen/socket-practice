// this is where all the data is stored about a given player
class Player {
  constructor(socketid, playerConfig, playerData) {
    this.socketId = socketid;
    this.playerConfig = playerConfig;
    this.playerData = playerData;
  }
}

module.exports = Player;
