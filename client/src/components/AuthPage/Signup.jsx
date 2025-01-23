import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        username,
        email,
        password,
      });
      console.log("Signup successful:", response.data);
      setError("");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="signup-inner-container" onSubmit={handleSignup}>
        <div className="login-heading">
          SIGN UP TO COMPILE HUB
          <div></div>
          <span className="login-input-element-description">
            Signup to compile hub using the email
          </span>
        </div>
        <div className="login-input-outer-container">
          <div className="login-input-element-container">
            <div>username</div>
            <input
              type="text"
              placeholder="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login-input-element-container">
            <div>email</div>
            <input
              type="email"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-input-element-container">
            <div>password</div>
            <input
              type="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="login-input-button-container">
          <button type="submit">SIGN UP</button>
        </div>
      </form>
    </div>
  );
}
