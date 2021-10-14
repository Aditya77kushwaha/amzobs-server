const { listen } = require("@colyseus/arena");
const arenaConfig = require("./arena.config");
listen(arenaConfig);
// const http = require("http");
// const express = require("express");
// const cors = require("cors");
// const colyseus = require("colyseus");
// const { monitor } = require("@colyseus/monitor");
// const basicAuth = require("express-basic-auth");
// const { WebSocketTransport } = require("@colyseus/ws-transport");
// const { RegularRoom } = require("./rooms/RegularRoom");
// const port = Number(process.env.PORT || 2567);
// const app = express();

// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );
// app.use(express.json());
// const basicAuthMiddleware = basicAuth({
//   users: {
//     adminUser: "adminPassword12345",
//   },
//   challenge: true,
// });

// const server = http.createServer(app);
// const gameServer = new colyseus.Server({
//   transport: new WebSocketTransport({
//     server,
//   }),
// });

// // register your room handlers
// gameServer.define("regular", RegularRoom);

// app.use(
//   "/colyseus",
//   basicAuthMiddleware,
//   monitor({
//     columns: [
//       "roomId",
//       "name",
//       "clients",
//       { metadata: "spectators" },
//       "locked",
//       "elapsedTime",
//     ],
//   })
// );

// gameServer.listen(port);
// console.log(`Listening on ws://localhost:${port}`);
