const command = require("@colyseus/command");
const { generateName } = require("../../utils/room_creation");
const Player = require("../schema/Player");

module.exports.OnJoinCommand = class OnJoinCommand extends command.Command {
  execute({ sessionId, username }) {
    // const balances = [200, 200, 300, 500, 500, 1000, 300];
    const player = new Player();
    player.username = username || generateName();
    this.state.players.set(sessionId, player);
    console.log(username, sessionId);

    if (this.state.players.size === this.room.maxClients) {
      console.log("max clients reached", this.room.roomId);
    }
    if (this.state.isGameStarted) {
      this.room.countdownInterval.resume();
    }
  }
};
