import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
import Bubble from "./bubble";
import Triangle from "./triangle";
const UserBubble = (props) => {
  const userRef = useRef(null);
  useEffect(() => {
    userRef.current.scrollIntoView(true);
  }, []);
  let bubbleAlign = "-3vw";
  let triangleAlign = "";
  if (props.message.info[0] === props.chatName) {
    bubbleAlign = "35vw";
    triangleAlign = "80vw";
  }
  return (
    <div>
      <ListItem
        ref={userRef}
        style={{ textAlign: "left", marginBottom: "2vh" }}
      >
        <Bubble
          message={props.message}
          chatName={props.chatName}
          alignBubble={bubbleAlign}
        />
        <Triangle color={props.message.color} alignTriangle={triangleAlign} />
      </ListItem>
      <p></p>
    </div>
  );
};
export default UserBubble;
