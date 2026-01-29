import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import "./UserDashboard.css"; 

import Profile from "./profile";
import Rooms from "./rooms";
import Task from "./task";
import Attendance from "./attendance";
import Announcements from "./announcements";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [societies, setSocieties] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setSocieties(snap.data().societies || []);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      }
    };

    fetchUser();
  }, [uid]);

  const joinSociety = async () => {
    if (!joinCode.trim()) return alert("Enter a society code");

    try {
      setJoining(true);

      const ref = doc(db, "users", uid);

      const newSociety = {
        name: joinCode.toUpperCase(),
        code: joinCode.toUpperCase(),
      };

      await updateDoc(ref, {
        societies: arrayUnion(newSociety),
      });

      setSocieties((prev) => [...prev, newSociety]);
      setJoinCode("");
    } catch (err) {
      alert("Failed to join society");
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case "profile": return <Profile />;
      case "rooms": return <Rooms />;
      case "tasks": return <Task role="member" />;
      case "attendance": return <Attendance role="member" />;
      case "announcements": return <Announcements />;

      case "overview":
      default:
        return (
          <div className="overview-wrapper animate-in">
            <div className="overview-main">

              {/* HEADER */}
              <div className="glass-header">
                <h2 className="welcome-text">
                  Systems Active: Welcome,{" "}
                  <span className="user-highlight">
                    {auth.currentUser?.email?.split("@")[0]}
                  </span>
                </h2>
                <div className="pulse-indicator">
                  <span className="dot"></span> Live System
                </div>
              </div>

              {/* STATS */}
              <div className="stats-mini-grid">
                <div className="mini-card">
                  <span className="card-icon">🏛️</span>
                  <div className="card-info">
                    <h3>{societies.length}</h3>
                    <p>Active Clubs</p>
                  </div>
                </div>
                <div className="mini-card">
                  <span className="card-icon">⚡</span>
                  <div className="card-info">
                    <h3>12</h3>
                    <p>Open Tasks</p>
                  </div>
                </div>
              </div>

             
              <div className="quick-actions">
                <h3>Quick Commands</h3>
                <div className="action-btns">
                  <button onClick={() => setActiveTab("rooms")}>🚀 Book Room</button>
                  <button onClick={() => setActiveTab("tasks")}>📝 View Tasks</button>
                  <button className="glow-btn" onClick={() => setActiveTab("attendance")}>
                    📍 Check-in
                  </button>
                </div>
              </div>

              
              <div className="recent-activity">
                <h3>Joined Societies</h3>

                {societies.length === 0 ? (
                  <div className="empty-state-fun">
                    <div className="ghost-icon">👻</div>
                    <p>It's quiet here... Join a society to begin!</p>

                   
                    <div className="join-society-box">
  <input
    type="text"
    placeholder="Enter society code"
    value={joinCode}
    onChange={(e) => setJoinCode(e.target.value)}
  />
  <button onClick={joinSociety} disabled={joining}>
    {joining ? "Joining..." : "✨ Join Society"}
  </button>
</div>

                  </div>
                ) : (
                  <div className="soc-scroll">
                    {societies.map((s, i) => (
                      <div key={i} className="soc-item">
                        <img
                          src={`https://ui-avatars.com/api/?name=${s.name}`}
                          alt=""
                        />
                        <span>{s.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTIVITY LOG */}
            <aside className="activity-log">
              <h3>Recent Updates</h3>
              <div className="log-item">
                <span className="log-dot"></span>
                <p><strong>Attendance</strong> Check-in is now live.</p>
                <small>Just now</small>
              </div>
              <div className="log-item">
                <span className="log-dot"></span>
                <p><strong>System</strong> All modules active.</p>
                <small>Online</small>
              </div>
            </aside>
          </div>
        );
    }
  };

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="logo">ClubSync</div>
        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>🏠 Overview</div>
          <div className={`nav-item ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>👤 Profile</div>
          <div className={`nav-item ${activeTab === "tasks" ? "active" : ""}`} onClick={() => setActiveTab("tasks")}>📋 Tasks</div>
          <div className={`nav-item ${activeTab === "rooms" ? "active" : ""}`} onClick={() => setActiveTab("rooms")}>🏢 Rooms</div>
          <div className={`nav-item ${activeTab === "attendance" ? "active" : ""}`} onClick={() => setActiveTab("attendance")}>📍 Attendance</div>
        </nav>

        <div className="logout-section" onClick={() => auth.signOut()}>
          🚪 Sign Out
        </div>
      </aside>

      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default UserDashboard;
