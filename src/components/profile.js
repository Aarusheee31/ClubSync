import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Profile({ goBack }) {
  const user = auth.currentUser;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>👤 Profile</h2>

      <p><strong>Email:</strong> {user.email}</p>

      <h3>Your Societies</h3>
      <p>CLUBSYNC</p>
      {/* later: map real societies */}

      <br />

      <button onClick={() => signOut(auth)}>Logout</button>
      <br /><br />
      <button onClick={goBack}>Back</button>
    </div>
  );
}

export default Profile;
