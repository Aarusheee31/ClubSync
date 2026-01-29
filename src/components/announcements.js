import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

function Announcements() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = auth.currentUser?.email === "admin@uni.edu";

  useEffect(() => {
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

  const postAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "announcements"), {
      title,
      message,
      pinned: false,
      createdAt: new Date(),
    });

    setTitle("");
    setMessage("");
  };

  const togglePin = async (id, current) => {
    await updateDoc(doc(db, "announcements", id), {
      pinned: !current,
    });
  };

  return (
    <div className="announcement-wrapper">
      {/* INTERNAL CSS */}
      <style>{`
        .announcement-wrapper {
          color: #e2e8f0;
          max-width: 800px;
          margin: 0 auto;
        }

        .section-title {
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(to right, #00f2fe, #7000ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ADMIN POST FORM */
        .admin-post-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .admin-input, .admin-textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 14px;
          color: white;
          font-family: inherit;
          margin-bottom: 16px;
          outline: none;
          transition: border 0.3s;
        }

        .admin-input:focus, .admin-textarea:focus {
          border-color: #00f2fe;
        }

        .post-btn {
          background: linear-gradient(135deg, #7000ff, #00f2fe);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .post-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(112, 0, 255, 0.4);
        }

        /* ANNOUNCEMENT CARDS */
        .announcement-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .announcement-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          transition: transform 0.3s;
        }

        .announcement-card.pinned {
          border-left: 4px solid #00f2fe;
          background: rgba(0, 242, 254, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }

        .card-msg {
          color: #94a3b8;
          line-height: 1.6;
          font-size: 15px;
        }

        .pin-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pin-btn.active {
          background: #00f2fe;
          color: #000;
        }

        .loader {
          text-align: center;
          color: #94a3b8;
          padding: 50px;
        }
      `}</style>

      <h2 className="section-title">📢 Announcements</h2>

      {loading ? (
        <div className="loader">Accessing secure database...</div>
      ) : (
        <>
          {/* ADMIN POSTING AREA */}
          {isAdmin && (
            <div className="admin-post-card">
              <input
                className="admin-input"
                placeholder="Announcement Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="admin-textarea"
                placeholder="Write your message here..."
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="post-btn" onClick={postAnnouncement}>
                Deploy Announcement
              </button>
            </div>
          )}

          {/* LIST AREA */}
          <div className="announcement-list">
            {announcements.length === 0 && <p className="loader">No announcements records found.</p>}

            {announcements.map((a) => (
              <div
                key={a.id}
                className={`announcement-card ${a.pinned ? "pinned" : ""}`}
              >
                <div className="card-header">
                  <h4 className="card-title">
                    {a.pinned && "📌 "} {a.title}
                  </h4>
                  {isAdmin && (
                    <button 
                      className={`pin-btn ${a.pinned ? "active" : ""}`}
                      onClick={() => togglePin(a.id, a.pinned)}
                    >
                      {a.pinned ? "Pinned" : "Pin Post"}
                    </button>
                  )}
                </div>
                <p className="card-msg">{a.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Announcements;