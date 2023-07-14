import "../App.css";
const Bubble = (props) => {
  return (
    <div
      className="userBubble"
      style={{
        backgroundColor: props.message.color,
        left: `${props.alignBubble}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{props.message.info[0]} says</div>
        <div>
          room:{props.message.info[1]}
          <br />@{props.message.info[2]}
        </div>
      </div>
      <p></p>
      <div style={{ fontWeight: "bold" }}>{props.message.text}</div>
    </div>
  );
};
export default Bubble;
