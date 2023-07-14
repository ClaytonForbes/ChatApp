require("dotenv").config();
const socketIO = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const port = process.env.PORT || 5000;
let server = http.createServer(app);
let io = socketIO(server);
const socketHandlers = require("./socketHandlers");

app.use(express.static("public"));
app.get("/*", (request, response) => {
  // needed for refresh
  response.sendFile(path.join(__dirname, "public/index.html"));
});

io.on("connection", (socket) => {
  console.log("new connection established");
  // client has joined
  socket.on("join", (client) => {
    socketHandlers.handleJoin(socket, client);
    socketHandlers.handleGetRoomsAndUsers(io);
  });

  socket.on("disconnect", () => {
    socketHandlers.handleDisconnect(socket);
    socketHandlers.handleGetRoomsAndUsers(io);
  });

  socket.on("typing", () => {
    socketHandlers.handleTyping(socket);
  });

  socket.on("message", (clientData) => {
    socketHandlers.handleMessage(socket, clientData, io);
  });

  socket.on("connection", (clientData) => {
    socketHandlers.handleStart(socket, clientData, io);
  });
});

app.use((req, res, next) => {
  const error = new Error("No such route found");
  error.status = 404;
  next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});
server.listen(port, () => console.log(`starting on port ${port}`));
