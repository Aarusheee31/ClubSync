import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

function Tasks({ role }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= FETCH ================= */
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setTasks(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          status: d.data().status || "pending", // 🔥 SAFETY FIX
        }))
      );
    } catch (err) {
      console.error("Fetch tasks error:", err);
    }
    setLoading(false);
  };

  /* ================= CREATE ================= */
  const createTask = async () => {
    if (!title.trim()) return;

    await addDoc(collection(db, "tasks"), {
      title,
      assignedTo: uid,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setTitle("");
    fetchTasks();
  };

  /* ================= MARK DONE ================= */
  const markDone = async (id) => {
    await updateDoc(doc(db, "tasks", id), {
      status: "done",
    });
    fetchTasks();
  };

  /* ================= DELETE ONE ================= */
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await deleteDoc(doc(db, "tasks", id));
    fetchTasks();
  };

  /* ================= DELETE ALL DONE ================= */
  const deleteCompletedTasks = async () => {
    if (!window.confirm("Delete ALL completed tasks?")) return;

    const doneTasks = tasks.filter((t) => t.status === "done");
    await Promise.all(
      doneTasks.map((t) => deleteDoc(doc(db, "tasks", t.id)))
    );

    fetchTasks();
  };

  return (
    <div className="tasks-wrapper">
      <style>{`
        .tasks-wrapper { max-width: 900px; margin: 0 auto; }

        .tasks-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .tasks-title {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          display: flex;
          gap: 10px;
        }

        .admin-task-bar {
          display: flex;
          gap: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px;
          border-radius: 14px;
          margin-bottom: 24px;
        }

        .task-input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 15px;
          outline: none;
        }

        .assign-btn {
          background: #7000ff;
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .danger-btn {
          background: #ff3b3b;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
        }

        .task-list { display: grid; gap: 12px; }

        .task-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .task-main { font-weight: 700; color: #fff; }

        .task-meta { font-size: 12px; color: #94a3b8; }

        .status {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          margin-left: 8px;
        }

        .pending {
          background: rgba(255,171,0,0.15);
          color: #ffab00;
        }

        .done {
          background: rgba(0,242,254,0.15);
          color: #00f2fe;
        }

        .action-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      <div className="tasks-header">
        <h3 className="tasks-title">📋 Task Operations</h3>

        {role === "admin" && (
          <button className="danger-btn" onClick={deleteCompletedTasks}>
            🗑 Delete Completed
          </button>
        )}
      </div>

      {role === "admin" && (
        <div className="admin-task-bar">
          <input
            className="task-input"
            placeholder="Describe the objective..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createTask()}
          />
          <button className="assign-btn" onClick={createTask}>
            Deploy
          </button>
        </div>
      )}

      <div className="task-list">
        {loading ? (
          <p style={{ color: "#94a3b8" }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No tasks available.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div>
                <div className="task-main">{task.title}</div>
                <div className="task-meta">
                  {task.createdAt?.seconds
                    ? new Date(task.createdAt.seconds * 1000).toLocaleDateString()
                    : "—"}
                  <span className={`status ${task.status}`}>
                    {(task.status || "pending").toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                {role === "member" && task.status === "pending" && (
                  <button
                    className="action-btn"
                    onClick={() => markDone(task.id)}
                  >
                    Mark Done
                  </button>
                )}

                {role === "admin" && (
                  <button
                    className="action-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    ❌
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
