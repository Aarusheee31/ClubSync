import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";

function Login({ goToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("member");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (loginType === "admin" && email !== "admin@uni.edu") {
      alert("Unauthorized: You do not have Admin credentials.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Club<span>Sync</span> Login</h2>

        <div className="input-group">
          <label>Account Type</label>
          <div className="custom-select-wrapper">
            <select 
              className="login-select"
              value={loginType} 
              onChange={(e) => setLoginType(e.target.value)}
            >
              <option value="member">Student / Member</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <input
            className="login-input"
            placeholder="student@uni.edu"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Security Key</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          Authorize & Login
        </button>

        <p className="signup-text">
          New to the hub?{" "}
          <span className="signup-link" onClick={goToSignup}>Initialize Signup</span>
        </p>
      </div>
    </div>
  );
}

export default Login;