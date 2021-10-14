const colyseus = require('colyseus');
const command = require('@colyseus/command');
const { RegularRoomState } = require('./schema/RegularRoomState');
const { OnJoinCommand } = require('./commands/onJoinCommand');
const { OnCreateCommand } = require('./commands/onCreateCommand');
const { RemovePlayer } = require('./commands/removePlayers');

module.exports.RegularRoom = class extends colyseus.Room {
  onCreate(options) {
    this.dispatcher = new command.Dispatcher(this);
    this.setState(new RegularRoomState());

    this.dispatcher.dispatch(new OnCreateCommand(), {
      maxClients: options.maxClients,
    });
  }

  onJoin(client, options) {
    if (this.state.players.size === 0) {
      // this guy is the host
      this.state.host = client.sessionId;
    }
    this.dispatcher.dispatch(new OnJoinCommand(), {
      sessionId: client.sessionId,
      username: options.username,
    });
  }

  async onLeave(client, consented) {
    // redisClient.setex(cachedPlayer, 6000, JSON.stringify(client.sessionId));
    this.countdownInterval.pause();
    this.state.players.get(client.sessionId).connected = false;
    if (consented) {
      this.dispatcher.dispatch(new RemovePlayer(), {
        sessionId: client.sessionId,
      });
    } else {
      try {
        await this.allowReconnection(client, 60);
        this.state.players.get(client.sessionId).connected = true;
        if (this.state.players.size === this.maxClients) {
          this.state.isGameStarted = true;
          this.countdownInterval.resume();
        }
      } catch (error) {
        console.log(client.sessionId, 'left!');
        this.dispatcher.dispatch(new RemovePlayer(), {
          sessionId: client.sessionId,
        });
      }
    }
  }

  onDispose() {
    this.dispatcher.stop();
    // save the state to DB
    console.log('room', this.roomId, 'disposing...');
  }
};
