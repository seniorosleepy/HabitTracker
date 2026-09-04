import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function LoginPage({ setAuth, setUserId }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const checkUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("All fields must be filled in!");
      return;
    }

    if (password.length < 8) {
      setMessage("The password must be at least 8 characters long");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Server data:", data);
        localStorage.setItem("userId", String(data.id));
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", String(data.username));

        if (data.id) setUserId(data.id);

        setAuth(true);
        navigate("/main", { replace: true });
      } else {
        const text = await response.text();
        setMessage(text);
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={checkUser} className="auth-card">
        <h1 className="auth-title">Welcome back!</h1>
        <div className="auth-field">
          <label className="auth-field__label">Email</label>
          <input
            className="auth-field__input"
            placeholder="Enter your Email-adress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label className="auth-field__label">Password</label>
          <input
            className="auth-field__input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="auth-submit-btn" type="submit">
          Log in account
        </button>
        <Link to="/forgot-password" className="auth-forgot-link">
          Forgot password?
        </Link>
        <hr className="auth-divider"></hr>
        <p className="auth-footer-text">
          Don't have an account yet?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
        {message && <p className="auth-error">{message}</p>}
      </form>
    </div>
  );
}
export default LoginPage;
