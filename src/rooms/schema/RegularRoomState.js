const {
  Schema,
  MapSchema,
  ArraySchema,
  defineTypes,
} = require("@colyseus/schema");
const { adjectives } = require("./Adjectives");
const Player = require("./Player");

class RegularRoomState extends Schema {
  constructor() {
    super();

    this.adjectives = new ArraySchema(...adjectives);
    this.players = new MapSchema();
  }
}

defineTypes(RegularRoomState, {
  players: { map: Player },
  adjectives: ["string"],
  isGameStarted: "boolean",
  countdown: "number",
  host: "string",
  subject: "string",
  subjectID: "string",
  maxWords: "number",
});

module.exports = {
  RegularRoomState,
};
