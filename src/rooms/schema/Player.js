const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const { ArraySchema } = schema;
const {adjectivesCount} = require('./Adjectives');

class Player extends Schema {
  constructor() {
    super();
    this.choiceOfAdjectivesOfPlayer = new ArraySchema();
    this.choice_of_adj_otherplayers = new ArraySchema((new Array(adjectivesCount - 1).fill(0)));
  }
}
schema.defineTypes(Player, {
  username: "string",
  choiceOfAdjectivesOfPlayer: ["boolean"],
  choiceOfAdjectivesOfOtherPlayers: ["number"],
});

module.exports = Player;
