import { useState, useMemo, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "./AdminDashboard.css";
import Announcements from "./announcements";
import Attendance from "./attendance";
import Tasks from "./task";
import Rooms from "./rooms";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("announcements");
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const q = query(collection(db, "attendance"), where("date", "==", today));
    const unsubscribe = onSnapshot(q, (snap) => setAttendanceCount(snap.size));
    return () => unsubscribe();
  }, []);

  const TABS = useMemo(() => [
    { id: "announcements", label: "Announcements", component: <Announcements /> },
    { id: "attendance", label: "Attendance", component: <Attendance count={attendanceCount} /> },
    { id: "tasks", label: "Tasks Management", component: <Tasks role="admin" /> },
    { id: "rooms", label: "Rooms & Assets", component: <Rooms /> },
  ], [attendanceCount]);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(new Date());

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-left">
          <h2 className="greeting">Terminal</h2>
          <div style={{color: 'var(--text-dim)', fontSize: '14px', marginTop: '5px'}}>
            {formattedDate} • <span style={{color: '#10b981'}}>System Live</span>
          </div>
        </div>
        <button className="logout-btn" onClick={() => signOut(auth)}>
          <span>Logout</span>
        </button>
      </header>

      {/* Real-time Count Header */}
      <div className="attendance-stats-header">
        <div className="stat-mini-card fade-in">
          <span className="label">Live Attendance</span>
          <span className="value">{attendanceCount}</span>
        </div>
        <div className="stat-mini-card fade-in" style={{animationDelay: '0.1s'}}>
          <span className="label">Session Status</span>
          <span className="value" style={{color: 'var(--accent-secondary)'}}>Active</span>
        </div>
      </div>

      <nav className="tab-navigation">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="admin-content-card">
        {TABS.map((tab) => (
          activeTab === tab.id && <div key={tab.id} className="fade-in">{tab.component}</div>
        ))}
      </main>
    </div>
  );
}

export default AdminDashboard;