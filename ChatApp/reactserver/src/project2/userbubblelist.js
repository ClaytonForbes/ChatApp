import { List } from "@mui/material";
import UserBubble from "./userbubble";
const UserList = (props) => {
  let messages = props.messages.map((e, idx) => {
    return <UserBubble key={idx} message={e} chatName={props.chatName} />;
  });
  return <List>{messages}</List>;
};
export default UserList;
