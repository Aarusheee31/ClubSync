import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
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

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Added ordering so new tasks appear at the top
      const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    setLoading(false);
  };

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

  const markDone = async (id) => {
    await updateDoc(doc(db, "tasks", id), {
      status: "done",
    });
    fetchTasks();
  };

  return (
    <div className="tasks-wrapper">
      <style>{`
        .tasks-wrapper {
          max-width: 900px;
          margin: 0 auto;
        }

        .tasks-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .tasks-title {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* ADMIN CREATION BAR */
        .admin-task-bar {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px;
          border-radius: 16px;
          display: flex;
          gap: 10px;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
        }

        .task-input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 12px 18px;
          color: white;
          font-size: 15px;
          outline: none;
        }

        .assign-btn {
          background: #7000ff;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .assign-btn:hover {
          background: #00f2fe;
          color: #000;
          box-shadow: 0 0 20px rgba(0, 242, 254, 0.4);
        }

        /* TASK LIST */
        .task-list {
          display: grid;
          gap: 12px;
        }

        .task-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: transform 0.2s, background 0.2s;
        }

        .task-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(5px);
        }

        .task-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .task-main {
          font-weight: 700;
          color: #fff;
          font-size: 16px;
        }

        .task-meta {
          font-size: 12px;
          color: #64748b;
        }

        /* STATUS TAGS */
        .status-tag {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-pending {
          background: rgba(255, 171, 0, 0.1);
          color: #ffab00;
          border: 1px solid rgba(255, 171, 0, 0.2);
        }

        .status-done {
          background: rgba(0, 242, 254, 0.1);
          color: #00f2fe;
          border: 1px solid rgba(0, 242, 254, 0.2);
        }

        .done-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .done-btn:hover {
          background: #00f2fe;
          color: #000;
          border-color: #00f2fe;
        }

        .loading-text {
          text-align: center;
          color: #64748b;
          margin-top: 40px;
        }
      `}</style>

      <div className="tasks-header">
        <h3 className="tasks-title">
          <span>📋</span> Task Operations
        </h3>
        <span className="status-tag status-pending">
          {tasks.filter(t => t.status === "pending").length} Active
        </span>
      </div>

      {role === "admin" && (
        <div className="admin-task-bar">
          <input
            className="task-input"
            placeholder="Describe the objective..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createTask()}
          />
          <button className="assign-btn" onClick={createTask}>
            Deploy Task
          </button>
        </div>
      )}

      {/* 🔵 TASK LIST */}
      <div className="task-list">
        {loading ? (
          <p className="loading-text">Synchronizing tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="loading-text">No tasks currently deployed.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-info">
                <span className="task-main">{task.title}</span>
                <span className="task-meta">
                  {task.createdAt ? new Date(task.createdAt.seconds * 1000).toLocaleDateString() : 'Scheduling...'}
                  {' • '}
                  <span className={`status-tag ${task.status === "done" ? "status-done" : "status-pending"}`}>
                    {task.status}
                  </span>
                </span>
              </div>

              <div className="task-actions">
                
                {role === "member" && task.status === "pending" && (
                  <button className="done-btn" onClick={() => markDone(task.id)}>
                    Mark Complete
                  </button>
                )}
                
                
                {role === "admin" && task.status === "done" && (
                  <span style={{ color: "#00f2fe", fontSize: "18px" }}>L</span>
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