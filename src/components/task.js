import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const userEmail = auth.currentUser.email;
  const isAdmin = userEmail === "admin@uni.edu";

  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(data);
    });

    return () => unsub();
  }, []);

  const addTask = async () => {
    if (!title || !assignedTo) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "tasks"), {
      title,
      assignedTo,
      status: "pending",
      createdBy: userEmail,
      createdAt: serverTimestamp(),
    });

    setTitle("");
    setAssignedTo("");
  };

  const markDone = async (id) => {
    await updateDoc(doc(db, "tasks", id), {
      status: "done",
    });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Tasks</h2>

      {/* ADMIN CREATE TASK */}
      {isAdmin && (
        <>
          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br /><br />
          <input
            placeholder="Assign to (email)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
          <br /><br />
          <button onClick={addTask}>Assign Task</button>
          <hr />
        </>
      )}

      {/* TASK LIST */}
      {tasks
        .filter(
          (task) =>
            isAdmin || task.assignedTo === userEmail
        )
        .map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              background:
                task.status === "done" ? "#d4edda" : "white",
            }}
          >
            <h4>{task.title}</h4>
            <p>Assigned to: {task.assignedTo}</p>
            <p>Status: {task.status}</p>

            {!isAdmin && task.status === "pending" && (
              <button onClick={() => markDone(task.id)}>
                Mark as Done
              </button>
            )}
          </div>
        ))}
    </div>
  );
}

export default Tasks;
