import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

function Attendance() {
  const [marked, setMarked] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const societyId = "clubsync"; // later make dynamic

  useEffect(() => {
    const checkAttendance = async () => {
      if (!user) return;

      const q = query(
        collection(db, "attendance"),
        where("userId", "==", user.uid),
        where("date", "==", today),
        where("societyId", "==", societyId)
      );

      const snap = await getDocs(q);
      if (!snap.empty) setMarked(true);
      setLoading(false);
    };

    checkAttendance();
  }, [user, today]);

  const markAttendance = async () => {
    if (marked) return;

    await addDoc(collection(db, "attendance"), {
      userId: user.uid,
      userEmail: user.email,
      societyId,
      date: today,
      timestamp: serverTimestamp(),
    });

    setMarked(true);
  };

  return (
    <div className="attendance-card">
      <h2>📍 Daily Check-in</h2>
      <p>Session: {today}</p>

      <button
        onClick={markAttendance}
        disabled={marked}
        className={marked ? "btn-disabled" : "btn-active"}
      >
        {marked ? "✔ Present Marked" : "Mark Me Present"}
      </button>
    </div>
  );
}

export default Attendance;
