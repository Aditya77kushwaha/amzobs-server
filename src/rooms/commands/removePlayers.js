const command = require('@colyseus/command');

module.exports.RemovePlayer = class RemovePlayer extends command.Command {
  execute({ sessionId }) {
    
    this.state.players.delete(sessionId);
    
    if (this.state.players.size === 1) {
      // only one player
      this.state.isGameStarted = false;
    }
  }
};
