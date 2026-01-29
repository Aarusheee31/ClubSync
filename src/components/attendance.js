import { useState } from "react";
import "./Attendance.css"; 

function Attendance({ role }) {
  const [hasMarked, setHasMarked] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-GB'); 

  return (
    <div className="attendance-container">
      <div className="attendance-card">
        <div className="card-header">
          <div className="icon-circle">📍</div>
          <div>
            <h3>Daily Check-in</h3>
            <p className="date-text">Session: {currentDate}</p>
          </div>
        </div>

        <div className="card-body">
          {hasMarked ? (
            <div className="status-confirmed">
              <span className="check-icon">✓</span>
              <p>Attendance logged for today</p>
            </div>
          ) : (
            <>
              <p className="instruction">Ready to start? Mark your presence for the current club session.</p>
              <button className="mark-present-btn" onClick={() => setHasMarked(true)}>
                Mark Me Present
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;