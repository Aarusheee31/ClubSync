import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Profile() {
  const user = auth.currentUser;

  return (
    <div className="profile-wrapper">
      <style>{`
        .profile-wrapper {
          max-width: 800px;
          animation: fadeIn 0.4s ease-out;
        }

        .profile-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #58a6ff, #10b981);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: white;
          font-weight: 800;
        }

        .profile-details h2 {
          margin: 0;
          font-size: 1.5rem;
          color: white;
        }

        .profile-details p {
          color: #8b949e;
          margin: 5px 0 0;
        }

        .section-box {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .section-box h3 {
          font-size: 0.9rem;
          color: #58a6ff;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0;
        }

        .badge-list {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .badge {
          background: rgba(88, 166, 255, 0.1);
          color: #58a6ff;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(88, 166, 255, 0.2);
        }

        .danger-zone {
          margin-top: 3rem;
          border-top: 1px solid #30363d;
          padding-top: 2rem;
        }

        .logout-action-btn {
          background: transparent;
          color: #f85149;
          border: 1px solid #f85149;
          padding: 8px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .logout-action-btn:hover {
          background: #f85149;
          color: white;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <div className="profile-details">
          <h2>Account Terminal</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="section-box">
        <h3>Affiliated Societies</h3>
        <div className="badge-list">
          <span className="badge">CLUBSYNC</span>
          <span className="badge">SYSTEM ADMIN</span>
        </div>
      </div>

      <div className="section-box">
        <h3>System Permissions</h3>
        <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>
          Authorized for: Hub Access, Room Creation, Task Submission.
        </p>
      </div>

      <div className="danger-zone">
        <button className="logout-action-btn" onClick={() => signOut(auth)}>
          Terminate Session
        </button>
      </div>
    </div>
  );
}

export default Profile;