let users = [];
const matColours = require("./colors.json");

const add = (chatName, chatRoom) => {
  let user = users.find((e) => e.name === chatName && e.room === chatRoom);
  if (user === undefined) {
    let chosenColor = null;
    let colorControl = true;
    while (colorControl) {
      chosenColor = Math.floor(Math.random() * matColours.colours.length) + 1;
      if (
        users.find((e) => {
          matColours.colours[e.color] === matColours.colours[chosenColor];
        }) === undefined
      ) {
        colorControl = false;
      }
    }
    users.push({
      name: chatName,
      room: chatRoom,
      color: matColours.colours[chosenColor],
    });
    return true;
  }
  return false;
};

const remove = (name, room) => {
  users = users.filter((e) => e.name !== name && e.room !== room);
};

const color = (chatName, chatRoom) => {
  let user = users.find((e) => e.name === chatName && e.room === chatRoom);
  return user.color;
};

const allUsers = () => {
  return users;
};

module.exports = { add, remove, color, allUsers };
