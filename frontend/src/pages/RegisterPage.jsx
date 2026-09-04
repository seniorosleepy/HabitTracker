import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function RegisterPage({ setAuth, setUserId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setMessage("All fields must be filled in!");
      return;
    }

    if (password.length < 8) {
      setMessage("The password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Server data:", data);
        localStorage.setItem("userId", String(data.id));
        localStorage.setItem("token", String(data.token));
        localStorage.setItem("username", String(data.username));
        setUserId(data.id);
        setAuth(true);
        navigate("/main", { replace: true });
      } else {
        const text = await response.text();
        setMessage("Error: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={createUser}>
        <h1 className="auth-title">Sign up</h1>
        <div className="auth-field">
          <label className="auth-field__label">Email</label>
          <input
            type="email"
            className="auth-field__input"
            placeholder="Enter your Email-adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label className="auth-field__label">Username</label>
          <input
            type="text"
            className="auth-field__input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label className="auth-field__label">Password</label>
          <input
            type="password"
            className="auth-field__input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button className="auth-submit-btn" type="submit">
          Create an account
        </button>
        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>
        {message && <p className="auth-error">{message}</p>}
      </form>
    </div>
  );
}

export default RegisterPage;
