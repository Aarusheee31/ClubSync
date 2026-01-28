import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

function UserDashboard({ goToSociety }) {
  const [societies, setSocieties] = useState([]);
  const [code, setCode] = useState("");

  const uid = auth.currentUser.uid;

  useEffect(() => {
    const fetchUser = async () => {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSocieties(snap.data().societies || []);
      } else {
        await setDoc(ref, {
          email: auth.currentUser.email,
          societies: [],
        });
      }
    };

    fetchUser();
  }, [uid]);

  const joinSociety = async () => {
    if (code !== "CLUB123") {
      alert("Invalid society code");
      return;
    }

    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      societies: arrayUnion("clubsync"),
    });

    setSocieties((prev) => [...prev, "clubsync"]);
    setCode("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>User Dashboard</h2>

      <h3>Your Societies</h3>

      {societies.length === 0 && <p>No societies joined yet</p>}

      {societies.map((soc) => (
        <div
          key={soc}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "10px auto",
            width: "300px",
            cursor: "pointer",
          }}
          onClick={() => {
  console.log("CARD CLICKED");
  goToSociety();
}}
        >
          <h4>{soc.toUpperCase()}</h4>
          <p>Click to open</p>
        </div>
      ))}

      <hr />

      <h3>Join a Society</h3>

      <input
        placeholder="Enter Society Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br /><br />

      <button onClick={joinSociety}>Join Society</button>
    </div>
  );
}

export default UserDashboard;
