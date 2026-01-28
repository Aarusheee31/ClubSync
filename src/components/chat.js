import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function Chat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "messages"), {
      text,
      sender: auth.currentUser.email,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h3> Society Chat</h3>

      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: "8px" }}>
            <strong>{m.sender}</strong>
            <p style={{ margin: 0 }}>{m.text}</p>
          </div>
        ))}
      </div>

      <input
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: "75%" }}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
