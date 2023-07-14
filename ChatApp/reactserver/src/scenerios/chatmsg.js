import React from "react";
import "../App.css";
const ChatMsg = (props) => {
  let msg = props.msg;
  console.log(props.msg);
  return (
    <div className="scenario-message" style={{ backgroundColor: msg.color }}>
      {msg.text}
    </div>
  );
};
export default ChatMsg;
