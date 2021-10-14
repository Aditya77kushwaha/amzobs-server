const Arena = require("@colyseus/arena").default;
const { monitor } = require("@colyseus/monitor");
const basicAuth = require("express-basic-auth");
const cors = require("cors");

const { RegularRoom } = require("./rooms/RegularRoom");

module.exports = Arena({
  getId: () => "Your Colyseus App",

  initializeGameServer: (gameServer) => {
    gameServer.define("regular", RegularRoom);
  },

  initializeExpress: (app) => {
    app.use(
      cors({
        origin: "*",
        credentials: true,
      })
    );
    app.use(express.json());
    app.get("/", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });

    const basicAuthMiddleware = basicAuth({
      users: {
        adminUser: "adminPassword12345",
      },
      challenge: true,
    });
    app.use(
      "/colyseus",
      basicAuthMiddleware,
      monitor({
        columns: [
          "roomId",
          "name",
          "clients",
          { metadata: "spectators" }, // display 'spectators' from metadata
          "locked",
          "elapsedTime",
        ],
      })
    );
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
