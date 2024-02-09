// Register.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constants from "../config";
import "../styles/Register.css"; // Import your Register styling file

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${constants.API_URL}/register`, {
        name: name,
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
    <div className="register-container">
      <div className="register-sub-cont">
        <h1 className="register-title">Register</h1>
        <form className="register-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button
            type="submit"
            className="register-button"
            onClick={handleSubmit}
          >
            Register
          </button>
        </form>
        <p>
          <a className="login-link" href="/login">
            Already have an account? Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
