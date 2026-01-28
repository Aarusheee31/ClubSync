import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
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

  const isAdmin = auth.currentUser.email === "admin@uni.edu";

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
    <div style={{ marginTop: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>📢 Announcements</h2>

      {/* LOADING STATE */}
      {loading && <p>Loading announcements...</p>}

      {!loading && (
        <>
          {/* ADMIN CREATE */}
          {isAdmin && (
            <>
              <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <br /><br />

              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <br /><br />

              <button onClick={postAnnouncement}>
                Post Announcement
              </button>

              <hr />
            </>
          )}

          {/* ANNOUNCEMENTS LIST */}
          {announcements.length === 0 && (
            <p>No announcements yet</p>
          )}

          {announcements.map((a) => (
            <div
              key={a.id}
              style={{
                marginBottom: "20px",
                padding: "12px",
                border: "1px solid #ccc",
                backgroundColor: a.pinned ? "#488bf7ff" : "white",
              }}
            >
              <h4>
                {a.pinned && "📌 "} {a.title}
              </h4>
              <p>{a.message}</p>

              {isAdmin && (
                <button onClick={() => togglePin(a.id, a.pinned)}>
                  {a.pinned ? "Unpin" : "Pin"}
                </button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Announcements;
