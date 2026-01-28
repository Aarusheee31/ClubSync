import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { auth } from "./firebase";
import Login from "./components/login";
import { signOut } from "firebase/auth";
import Attendance from "./components/attendance";
import Announcements from "./components/announcements";
import Signup from "./components/signup";
import UserDashboard from "./components/userdashboard";
import React from "react";
import Chat from "./components/chat";
import Rooms from "./components/rooms";
import Tasks from "./components/task";
import Profile from "./components/profile";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect } from "react";
import AdminDashboard from "./components/admindashboard";

function App() {
  const [inSociety, setInSociety] = useState(false);
  const [user] = useAuthState(auth);
  const [screen, setScreen] = useState("dashboard"); 
  const [tab, setTab] = useState("announcements");
  const [activeRoom, setActiveRoom] = useState(null);
  const [role, setRole] = useState(null);
 const [loadingRole, setLoadingRole] = useState(true);
 const [loginType, setLoginType] = useState(null);


useEffect(() => {
  if (!user) return;

  const fetchRole = async () => {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setRole(snap.data().role);
    }
    setLoadingRole(false);
  };

  fetchRole();
}, [user]);

if (role !== loginType) {
  return (
    <AccessDenied
      goBack={() => {
        setLoginType(null);
        setScreen("login"); // or dashboard
      }}
    />
  );
}


if (role === "admin") {
  return <AdminDashboard />;
}

if (role === "member") {
  return <UserDashboard />;
}

  


  if (!user) {
  return <Login setLoginType={setLoginType} />;
}

  if(!inSociety){
    return <UserDashboard goToSociety={() => setInSociety(true)} />
  }
if (screen === "profile") 
   {
    return <Profile goBack={() => setScreen("dashboard")} />;
  }

  return (
  <div style={{ textAlign: "center", marginTop: "40px" }}>
    <h1> Society Dashboard</h1>

    <button onClick={() => setInSociety(false)}> Back</button>
    <br /><br />
    <button onClick={() => signOut(auth)}>Logout</button>

    <hr />
   <button onClick={() => setScreen("profile")}>Profile</button>

   
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setTab("chat")}>Chat</button>
      <button onClick={() => setTab("rooms")}>Rooms</button>
      <button onClick={() => setTab("attendance")}>Attendance</button>
      <button onClick={() => setTab("tasks")}>Tasks</button>
      <button onClick={() => setTab("announcements")}>Announcements</button>
    </div>

    <hr />

    
    {tab === "attendance" && <Attendance />}
    <div style={{ display: tab === "announcements" ? "block" : "none" }}>
  <Announcements />
</div>

    {tab === "chat" && <Chat />}
    {tab === "rooms" && !activeRoom && (
  <Rooms openRoom={(room) => setActiveRoom(room)} />
)}

{activeRoom && (
  <div>
    <h3>📢 Room: {activeRoom}</h3>
    <button onClick={() => setActiveRoom(null)}>Back to Rooms</button>
    <p>Room chat / discussion here</p>
  </div>
)}

    {tab === "tasks" && <Tasks />}
  </div>
);


}
export default App;
