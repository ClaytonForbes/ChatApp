import { useReducer, useEffect, useState } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import { Button, TextField, Typography } from "@mui/material";
import theme from "../theme";
import "../App.css";
import TopBar from "./topbar";
import Rooms from "./rooms";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import UserBubbleList from "./userbubblelist";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import logo from "../maskable_icon_x48.png";
const Scenario1Test = () => {
  const initialState = {
    messages: [],
    status: "",
    showjoinfields: true,
    alreadyexists: false,
    chatName: "",
    roomName: "",
    users: [],
    typingMsg: "",
    isTyping: false,
    message: "",
    rooms: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const serverConnect = () => {
    //connect to server
    const socket = io.connect("localhost:5000", {
      forceNew: true,
      transports: ["websocket"],
      autoConnect: true,
      reconnection: false,
      timeout: 5000,
    });
    //const socket = io.connect();
    socket.on("nameexists", onExists);
    socket.on("welcome", addMessage);
    socket.on("someonejoined", addMessage);
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    socket.on("connectApp", currectRooms);
    socket.on("updateUsers", currectUsers);
    socket.emit("connection", { from: state.chatName });
    setState({ socket: socket });
  };

  const currectRooms = (dataFromServer) => {
    setState({
      rooms: dataFromServer.rooms,
    });
  };

  const currectUsers = (dataFromServer) => {
    setState({
      users: dataFromServer.users,
    });
  };

  const onNewMessage = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ typingMsg: "" });
  };

  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer.text });
  };
  // generic handler for all other messages:
  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push(dataFromServer);
    setState({
      messages: messages,
      showjoinfields: false,
      alreadyexists: false,
    });
  };

  // handler for join button click
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
  };
  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ chatName: e.target.value, status: "" });
  };
  // handler for room TextField entry
  const onRoomChange = (e) => {
    setState({ roomName: e.target.value });
  };

  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.chatName) {
      setState({
        typingMsg: dataFromServer.text,
      });
    }
  };

  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState({ isTyping: true }); // flag first byte only
    }
  };

  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.chatName, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false, message: "" });
    }
  };

  //dialog code
  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  //setroom

  const chooseRoom = (e, value) => {
    setState({ roomName: value });
  };

  return (
    <ThemeProvider theme={theme}>
      <TopBar viewDialog={handleOpenDialog} show={state.showjoinfields} />
      <Dialog open={open} onClose={handleCloseDialog} style={{ margin: 20 }}>
        <DialogTitle style={{ textAlign: "center" }}>
          <Typography color="primary" style={{ textAlign: "center" }}>
            Who's On ?
          </Typography>
        </DialogTitle>
        <DialogContent>
          {state.users.map((e, index) => {
            return (
              <div
                style={{ display: "flex", alignItems: "center" }}
                key={index}
              >
                <AccountBoxIcon sx={{ color: `${e.color}` }} />
                <p style={{ margin: "5px" }}>
                  {e.name} is in room {e.room}
                </p>
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
      <p></p>

      {state.showjoinfields && (
        <div style={{ padding: "3vw", margin: "3vw" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src={logo} alt="Logo" />
          </div>

          <Typography
            color="primary"
            style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}
          >
            Sign in
          </Typography>
          <p></p>
          <TextField
            onChange={onNameChange}
            placeholder="Enter unique name"
            autoFocus={true}
            required
            value={state.chatName}
            error={state.status !== ""}
            helperText={state.status}
          />
          <p></p>
          <Rooms rooms={state.rooms} setroom={chooseRoom} />
          <TextField
            onChange={onRoomChange}
            placeholder="Enter room name"
            required
            value={state.roomName}
          />
          <p></p>
          <Button
            variant="contained"
            data-testid="submit"
            color="primary"
            style={{ marginLeft: "3%" }}
            onClick={() => handleJoin()}
            disabled={state.chatName === "" || state.roomName === ""}
          >
            Join
          </Button>
        </div>
      )}

      {!state.showjoinfields && (
        <div
          style={{ marginTop: "3vh", marginLeft: "2vw", fontWeight: "bold" }}
        >
          Current Messages
        </div>
      )}
      {!state.showjoinfields && (
        <div className="usersList">
          <UserBubbleList
            messages={state.messages}
            chatName={state.chatName}
            room={state.roomName}
          />
        </div>
      )}
      {!state.showjoinfields && (
        <TextField
          onChange={onMessageChange}
          placeholder="type something here"
          autoFocus={true}
          value={state.message}
          onKeyPress={(e) => (e.key === "Enter" ? handleSendMessage() : null)}
        />
      )}
      <div
        style={{ height: "16px", display: "flex", justifyContent: "flex-end" }}
      >
        <Typography color="primary">{state.typingMsg}</Typography>
      </div>
    </ThemeProvider>
  );
};
export default Scenario1Test;
