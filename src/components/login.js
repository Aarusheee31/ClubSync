import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import Signup from "./signup";

function Login({ setLoginType }) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>ClubSync Login</h1>

      <button onClick={() => setLoginType("member")}>
        Login as Member
      </button>

      <br /><br />

      <button onClick={() => setLoginType("admin")}>
        Login as Admin
      </button>
    </div>
  );
}

export default Login;
