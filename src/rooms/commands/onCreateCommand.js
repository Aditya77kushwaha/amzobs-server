/* eslint-disable import/no-unresolved */
const command = require("@colyseus/command");
const { timeStamp } = require("console");
const { colorsArray } = require("../../utils/room_creation");
const { adjectives } = require("../schema/Adjectives");
// const { GameEnd } = require('./GameEnd');

module.exports.OnCreateCommand = class OnCreateCommand extends command.Command {
  execute({ maxClients, countdown }) {
    let adjectivesChosen = this.state.maxWords || 5;
    this.room.maxClients = maxClients;

    this.state.isGameStarted = false;

    this.state.countdown = countdown || 300;

    this.state.maxWords = 5;

    this.chosenAdjectives = new Map();

    this.responses = 0;

    this.room.countdownInterval = this.clock.setInterval(() => {
      this.state.countdown -= 1;
      if (this.state.countdown === 0) {
        console.log("game ended");
        // this.room.dispatcher.dispatch(new GameEnd());
        // emit game end event
      }
    }, 1000);
    this.room.countdownInterval.pause();

    this.room.onMessage("kick", (client, playerId) => {
      if (client.id === this.state.host) {
        const player = this.room.clients.find(
          clientItem => clientItem.sessionId === playerId
        );
        player.leave(4000);
      }
    });
    this.room.onMessage("end", client => {
      if (client.id === this.state.host) {
        console.log("Ending Game...");
      }
    });
    this.room.onMessage("start", (client, data) => {
      if (client.id === this.state.host) {
        // console.log(client.id, this.state.host);
        this.state.isGameStarted = data.value;
      }
    });

    this.room.onMessage("obtain-players", () => {
      let userData = {};
      this.state.players.forEach(
        (value, key) =>
          (userData = { ...userData, [key]: { username: value.username } })
      );
      this.room.broadcast("to-obtain-players", userData);
    });

    this.room.onMessage("obtain-observers", (client, data) => {
      // console.log(data);
      this.room.broadcast("to-obtain-observers", data);
    });

    this.room.onMessage("start-game", (client, data) => {
      for (let word of adjectives) {
        this.chosenAdjectives.set(word, []);
      }
      this.responses = 0;
      this.room.broadcast("to-start-game", data);
    });

    this.room.onMessage("add-adjective", (client, data) => {
      if (
        client.id === this.state.host &&
        this.state.adjectives.indexOf(data.value) == -1
      ) {
        this.state.adjectives.push(data.value);
      }
    });

    this.room.onMessage("remove-adjective", (client, data) => {
      // this.state.adjectives.filter((word, wordIndex) => wordIndex !== data);
      console.log(data, this.state.adjectives[data]);
      this.state.adjectives.splice(data, 1);
    });

    this.room.onMessage("choose-adjective", (client, data) => {
      // if (
      //   this.state.players[client.id].choiceOfAdjectivesOfPlayer.indexOf(
      //     data.value
      //   ) == -1 &&
      //   adjectivesChosen > 0
      // ) {
      this.state.players[client.id].choiceOfAdjectivesOfPlayer.push(data.value);
      // adjectivesChosen -= 1;
      this.chosenAdjectives.get(data.value).push(client.id);
      // console.log(this.chosenAdjectives);
      // console.log(this.state.players[client.id].choiceOfAdjectivesOfPlayer);
      // }
    });
    this.room.onMessage("add-subject", (client, data) => {
      // if (data) {
      //   this.state.subject = data;
      //   console.log("Subject is", this.state.subject);
      // }
      this.state.subject = data.name;
      this.state.subjectID = data.key;
    });

    this.room.onMessage("max-adjectives", (client, data) => {
      this.state.maxWords = data;
      console.log("Maximum words players can choose", this.state.maxWords);
    });

    this.room.onMessage("no-of-players", (client, data) => {
      this.room.broadcast("set-no-of-players", this.room.maxClients);
    });

    this.room.onMessage("display-table", (client, data) => {
      let message = {};
      this.responses++;
      if (this.responses === Number(maxClients)) {
        this.room.broadcast(
          "no-of-responses",
          this.room.maxClients - this.responses
        );
        let value = {
          blind: [],
          hidden: [],
          open: [],
          unknown: [],
        };
        const colorsArray = [
          "#ED0DD9",
          "#BE03FD",
          "#00022E",
          "#02066F",
          "#475F94",
          "#FA4224",
          "#0F9B8E",
          "#343837",
          "#A75E09",
          "#D5174E",
          "#730039",
          "#FF964F",
          "#0E87CC",
        ];
        const sizesArray = [
          "1rem",
          "1.15rem",
          "1.25rem",
          "1.35rem",
          "1.45rem",
          "1.5rem",
          "1.65rem",
          "1.75rem",
          "1.85rem",
          "2rem",
          "2.15rem",
          "2.25rem",
          "2.5rem",
        ];
        for (let word of adjectives) {
          const index = Math.floor(Math.random() * colorsArray.length);
          const color = colorsArray[index];
          const size = sizesArray[index];
          if (this.chosenAdjectives.get(word).length === 0) {
            value.unknown.push({ word, color, size });
          } else {
            if (
              this.chosenAdjectives.get(word).includes(this.state.subjectID)
            ) {
              if (this.chosenAdjectives.get(word).length - 1 === 0) {
                value.hidden.push({ word, color, size });
              } else {
                value.open.push({ word, color, size });
              }
            } else {
              value.blind.push({ word, color, size });
            }
          }
          // console.log(value);
        }
        message = { ...message, value: value };
        setTimeout(() => {
          this.room.broadcast("to-display-table", message);
        }, 3000);
      } else {
        this.room.broadcast(
          "no-of-responses",
          this.room.maxClients - this.responses
        );
      }
    });

    this.room.onMessage("restart-game", (client, data) => {
      this.room.broadcast("to-restart-game", "/players");
    });

    this.room.onMessage("pause", () => {
      this.room.countdownInterval.pause();
    });
    this.room.onMessage("resume", () => {
      this.room.countdownInterval.resume();
    });
  }
};
