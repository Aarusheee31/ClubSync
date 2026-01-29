import { useState } from "react";
import Announcements from "./announcements";
import Attendance from "./attendance";
import Tasks from "./task";
import Rooms from "./rooms";

function SocietyDashboard({ role, goBack }) {
  const [tab, setTab] = useState("announcements");

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>Society Dashboard</h2>

      <button onClick={goBack}>← Back</button>

      <hr />

      <button onClick={() => setTab("announcements")}>Announcements</button>
      <button onClick={() => setTab("attendance")}>Attendance</button>
      <button onClick={() => setTab("tasks")}>Tasks</button>
      <button onClick={() => setTab("rooms")}>Rooms</button>

      <hr />

      {tab === "announcements" && <Announcements />}
      {tab === "attendance" && <Attendance role={role} />}
      {tab === "tasks" && <Tasks role={role} />}
      {tab === "rooms" && <Rooms />}
    </div>
  );
}

export default SocietyDashboard;
