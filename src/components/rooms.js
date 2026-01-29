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

function Rooms() {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "rooms"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const createRoom = async () => {
    if (!roomName.trim()) return;

    await addDoc(collection(db, "rooms"), {
      name: roomName,
      createdBy: auth.currentUser.email,
      createdAt: serverTimestamp(),
    });

    setRoomName("");
  };

  return (
    <div className="rooms-container">
      <style>{`
        .rooms-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* TOP ACTION BAR */
        .room-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .input-group {
          display: flex;
          gap: 12px;
          flex: 1;
          max-width: 500px;
        }

        .room-input {
          flex: 1;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 20px;
          border-radius: 12px;
          color: white;
          outline: none;
          transition: 0.3s;
        }

        .room-input:focus {
          border-color: #7000ff;
          box-shadow: 0 0 15px rgba(112, 0, 255, 0.2);
        }

        .create-room-btn {
          background: #fff;
          color: #000;
          border: none;
          padding: 0 24px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .create-room-btn:hover {
          background: #00f2fe;
          transform: translateY(-2px);
        }

        /* ROOM GRID */
        .room-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .room-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }

        .room-card:hover {
          background: rgba(112, 0, 255, 0.1);
          border-color: rgba(112, 0, 255, 0.4);
          transform: translateY(-8px);
        }

        .room-card::before {
          content: "";
          position: absolute;
          top: 0; 
          left: 0;
          width: 4px;
          height: 100%;
          background: #7000ff;
          opacity: 0;
          transition: 0.3s;
        }

        .room-card:hover::before {
          opacity: 1;
        }

        .room-icon {
          font-size: 24px;
          margin-bottom: 16px;
          display: block;
        }

        .room-name {
          font-size: 18px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          display: block;
        }

        .room-author {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .empty-state {
          text-align: center;
          padding: 60px;
          color: #475569;
          grid-column: 1 / -1;
        }

        .loader {
          text-align: center;
          color: #00f2fe;
          padding: 40px;
        }
      `}</style>

      <div className="room-controls">
        <h3 style={{ color: "white", margin: 0 }}>Hub Management</h3>
        <div className="input-group">
          <input
            className="room-input"
            placeholder="New hub identifier..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createRoom()}
          />
          <button className="create-room-btn" onClick={createRoom}>
            Initialize Hub
          </button>
        </div>
      </div>

      <div className="room-grid">
        {loading ? (
          <p className="loader">Accessing server clusters...</p>
        ) : rooms.length === 0 ? (
          <div className="empty-state">
            <span style={{ fontSize: "40px", display: "block", marginBottom: "10px" }}>🛰️</span>
            No active hubs detected.
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="room-card"
              onClick={() => alert(`Establishing connection to ${room.name}...`)}
            >
              <span className="room-icon">🏢</span>
              <span className="room-name">{room.name}</span>
              <span className="room-author">
                Owner: {room.createdBy.split('@')[0]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Rooms;