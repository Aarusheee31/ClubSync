import { useState } from "react";

function Rooms({ openRoom }) {
  const rooms = ["General", "Core Team", "Event Planning"];

  return (
    <div>
      <h3>Rooms</h3>

      {rooms.map((room) => (
        <div
          key={room}
          onClick={() => openRoom(room)}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px auto",
            width: "300px",
            cursor: "pointer",
          }}
        >
          <strong>{room}</strong>
          <p style={{ margin: 0 }}>Click to enter</p>
        </div>
      ))}
    </div>
  );
}

export default Rooms;
