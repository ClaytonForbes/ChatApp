const user = require("./user");
const adminColor = "#495057";
const moment = require("moment");

const handleJoin = (socket, client) => {
  socket.name = client.chatName;
  socket.room = client.roomName;

  if (!user.add(socket.name, socket.room)) {
    socket.emit("nameexists", {
      text: `name already taken, try a different name`,
      color: "",
    });
    return;
  }
  socket.color = user.color(socket.name, socket.room);
  socket.join(client.roomName);
  socket.emit("welcome", {
    text: `Welcome ${client.chatName}`,
    color: adminColor,
    info: ["Admin", socket.room, moment().format("h:mm:ss a")],
  });
  socket.to(client.roomName).emit("someonejoined", {
    text: `${client.chatName} has joined the ${client.roomName} room!`,
    color: adminColor,
    info: ["Admin", socket.room, moment().format("h:mm:ss a")],
  });
};

const handleDisconnect = (socket) => {
  user.remove(socket.name, socket.room);
  socket.to(socket.room).emit("someoneleft", {
    text: `${socket.name} has left room ${socket.room}`,
    color: adminColor,
    info: ["Admin", socket.room, moment().format("h:mm:ss a")],
  });
};

const handleTyping = (socket) => {
  socket.to(socket.room).emit("someoneistyping", {
    from: `${socket.name}`,
    text: `...${socket.name} is typing`,
  });
};

const handleMessage = (socket, client, io) => {
  io.in(socket.room).emit("newmessage", {
    text: `${client.text}`,
    color: socket.color,
    info: [socket.name, socket.room, moment().format("h:mm:ss a")],
  });
};

const handleStart = (socket, client, io) => {
  let rooms = user.allUsers();
  let rooms2 = rooms.map((e) => {
    return e.room;
  });
  let uniqueRooms = [...new Set(rooms2)];
  socket.emit("connectApp", {
    rooms: uniqueRooms,
  });
};

const handleGetRoomsAndUsers = (io) => {
  io.emit("updateUsers", { users: user.allUsers() });
};

module.exports = {
  handleJoin,
  handleDisconnect,
  handleTyping,
  handleMessage,
  handleStart,
  handleGetRoomsAndUsers,
};
