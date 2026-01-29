import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";

function Announcements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 SIMPLE ADMIN CHECK (you can improve later)
  const isAdmin = auth.currentUser?.email === "admin@uni.edu";

  useEffect(() => {
    // ❗ IMPORTANT: only order by pinned (safe for old docs)
    const q = query(
      collection(db, "announcements"),
      orderBy("pinned", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setAnnouncements(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🟢 CREATE / UPDATE
  const submitAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Fill title & message");
      return;
    }

    if (editingId) {
      await updateDoc(doc(db, "announcements", editingId), {
        title,
        message,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "announcements"), {
        title,
        message,
        pinned: false,
        createdAt: serverTimestamp(),
      });
    }

    setTitle("");
    setMessage("");
  };

  // 📌 PIN
  const togglePin = async (id, current) => {
    await updateDoc(doc(db, "announcements", id), {
      pinned: !current,
    });
  };

  // ✏️ EDIT
  const startEdit = (a) => {
    setEditingId(a.id);
    setTitle(a.title);
    setMessage(a.message);
  };

  // 🗑 DELETE
  const removeAnnouncement = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      await deleteDoc(doc(db, "announcements", id));
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", color: "#e5e7eb" }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>
        📢 Announcements
      </h2>

      {/* 🔐 ADMIN PANEL */}
      {isAdmin && (
        <div style={cardStyle}>
          <input
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Announcement message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            style={inputStyle}
          />

          <button onClick={submitAnnouncement} style={buttonStyle}>
            {editingId ? "Update Announcement" : "Deploy Announcement"}
          </button>
        </div>
      )}

      {/* 📃 LIST */}
      {loading ? (
        <p>Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <div
            key={a.id}
            style={{
              ...cardStyle,
              borderLeft: a.pinned ? "4px solid #22d3ee" : "4px solid transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 18 }}>
                {a.pinned && "📌 "} {a.title}
              </h3>

              {isAdmin && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => togglePin(a.id, a.pinned)}
                    style={miniBtn}
                  >
                    {a.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button onClick={() => startEdit(a)} style={miniBtn}>
                    Edit
                  </button>
                  <button
                    onClick={() => removeAnnouncement(a.id)}
                    style={{ ...miniBtn, background: "#7f1d1d" }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <p style={{ color: "#9ca3af" }}>{a.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

/* 💅 STYLES */
const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 14,
  padding: 20,
  marginBottom: 16,
};

const inputStyle = {
  width: "100%",
  marginBottom: 12,
  padding: 12,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.4)",
  color: "white",
};

const buttonStyle = {
  background: "linear-gradient(135deg,#6366f1,#22d3ee)",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  color: "black",
  fontWeight: 700,
  cursor: "pointer",
};

const miniBtn = {
  background: "rgba(255,255,255,0.1)",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  color: "white",
  cursor: "pointer",
};

export default Announcements;
