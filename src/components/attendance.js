import { useEffect, useState } from "react";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function Attendance() {
  const [active, setActive] = useState(false);
  const [present, setPresent] = useState(false);

  const attendanceRef = doc(db, "attendance", "current");

  useEffect(() => {
    const checkAttendance = async () => {
      const snap = await getDoc(attendanceRef);
      if (snap.exists()) {
        setActive(snap.data().active);
      }
    };
    checkAttendance();
  }, []);

  const startAttendance = async () => {
    await setDoc(attendanceRef, {
      active: true,
      startedAt: new Date(),
      presentCount: 0,
    });
    setActive(true);
    setPresent(false);
  };

  const markPresent = async () => {
    if (present) return;
    const snap = await getDoc(attendanceRef);
    if (snap.exists()) {
      await updateDoc(attendanceRef, {
        presentCount: snap.data().presentCount + 1,
      });
      setPresent(true);
    }
  };

  const endAttendance = async () => {
    await updateDoc(attendanceRef, {
      active: false,
      endedAt: new Date(),
    });
    setActive(false);
  };

  return (
    <div>
      <h2>Attendance</h2>

      {!active && (
        <button onClick={startAttendance}>Start Attendance</button>
      )}

      {active && !present && (
        <button onClick={markPresent}>Mark Present</button>
      )}

      {active && (
        <button onClick={endAttendance}>End Attendance</button>
      )}

      {present && <p>✅ You are marked present</p>}
    </div>
  );
}

export default Attendance;
