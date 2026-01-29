import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React from "react";
import "./Components/global.css";

// Components
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Attendance from "./Components/Attendance";
import Announcements from "./Components/Announcements";
import UserDashboard from "./Components/UserDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import SocietyDashboard from "./Components/SocietyDashboard";
import Chat from "./Components/Chat";
import Rooms from "./Components/Rooms";
import Tasks from "./Components/Task";
import Profile from "./Components/Profile";

function App() {
<<<<<<< Updated upstream
  const [user, loadingAuth] = useAuthState(auth); 
  const [role, setRole] = useState("member");
  const [loadingRole, setLoadingRole] = useState(true);
  const [screen, setScreen] = useState("dashboard"); // Set default screen
=======
  
  const [inSociety, setInSociety] = useState(false);
  const [user] = useAuthState(auth); 
>>>>>>> Stashed changes
  const [tab, setTab] = useState("announcements");
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoadingRole(false);
      return;
    }

<<<<<<< Updated upstream
    const fetchRole = async () => {
      setLoadingRole(true);
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
      setLoadingRole(false);
    };
=======
  fetchRole();
}, [user]);

if (screen === "user") {
  return (
    <UserDashboard
      goToSociety={() => setScreen("society")}
    />
  );
}
>>>>>>> Stashed changes

    fetchRole();
  }, [user]);

  // 1. Loading State Check
  if (loadingAuth || loadingRole) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading ClubSync...</div>;
  }

  // 2. Auth Check: If not logged in, show Login or Signup
  if (!user) {
    return screen === "signup" ? 
      <Signup goToLogin={() => setScreen("login")} /> : 
      <Login goToSignup={() => setScreen("signup")} />;
  }

  // 3. Admin View
  if (role === "admin") {
    return <AdminDashboard />;
  }

  // 4. Main Navigation Logic
  // This ensures your MODERN dashboard is the first thing users see
  if (screen === "dashboard") {
    return <UserDashboard goToSociety={() => setScreen("society")} />;
  }

  if (screen === "profile") {
    return <Profile goBack={() => setScreen("dashboard")} />;
  }

  // 5. Society Inner View (Tabs)
  if (screen === "society") {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h1>Society Dashboard</h1>
        <button onClick={() => setScreen("dashboard")}>← Back to Societies</button>
        <button onClick={() => setScreen("profile")} style={{ marginLeft: "10px" }}>Profile</button>
        <button onClick={() => signOut(auth)} style={{ marginLeft: "10px" }}>Logout</button>

        <hr />
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setTab("chat")}>Chat</button>
          <button onClick={() => setTab("rooms")}>Rooms</button>
          <button onClick={() => setTab("attendance")}>Attendance</button>
          <button onClick={() => setTab("tasks")}>Tasks</button>
          <button onClick={() => setTab("announcements")}>Announcements</button>
        </div>
        <hr />

        {tab === "attendance" && <Attendance />}
        {tab === "announcements" && <Announcements />}
        {tab === "chat" && <Chat />}
        
        {tab === "rooms" && !activeRoom && (
          <Rooms openRoom={(room) => setActiveRoom(room)} />
        )}

        {activeRoom && (
          <div>
            <h3>📢 Room: {activeRoom}</h3>
            <button onClick={() => setActiveRoom(null)}>Back to Rooms</button>
          </div>
        )}

        {tab === "tasks" && <Tasks />}
      </div>
    );
  }
}

export default App;