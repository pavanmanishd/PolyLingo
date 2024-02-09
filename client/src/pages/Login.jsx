// Login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constants from "../config";
import "../styles/Login.css"; // Import your Login styling file

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${constants.API_URL}/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("isLoggedIn", true);
        navigate("/");
      })
      .catch((err) => {
        localStorage.setItem("isLoggedIn", false);
        localStorage.setItem("user_id", "");
        console.error(err);
      });
  };

  return (
    <div className="login-container">
      <div className="login-sub-cont">
        <h1 className="login-title">Login</h1>
        <form className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button" onClick={handleSubmit}>
            Login
          </button>
          <p>
            <a className="signup-link" href="/register">
              Don&#39;t have an account? Register up here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
