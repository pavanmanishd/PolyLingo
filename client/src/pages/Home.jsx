import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chats from "../components/Chats";
import constants from "../config";
import "../styles/Home.css";
function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatId, setChatId] = useState("");
  const [chatName, setChatName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleCreate = () => {
    if (chatName === "") {
      alert("Please enter chat name");
      return;
    }
    fetch(`${constants.API_URL}/chat/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
        chat_name: chatName,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create chat");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        navigate(`/chat/${data.chat_id}`);
      })
      .catch((err) => {
        console.error(err);
        // Handle error, show a user-friendly message
      });
  };

  const handleJoin = () => {
    if (chatId === "") {
      alert("Please enter chat id");
      return;
    }
    fetch(`${constants.API_URL}/chat/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: localStorage.getItem("user_id"),
        chat_id: chatId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to join chat");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        navigate(`/chat/${data.chat_id}`);
      })
      .catch((err) => {
        console.error(err);
        // Handle error, show a user-friendly message
      });
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <h1 className="logo">PolyLingo</h1>
        {isLoggedIn && (
          <button
            className="logout-button"
            onClick={() => {
              localStorage.setItem("id", "");
              localStorage.setItem("isLoggedIn", false);
              setIsLoggedIn(false);
            }}
          >
            Logout
          </button>
        )}
      </div>
      <hr />
      {isLoggedIn ? (
        <div className="welcome-container">
          <h2 className="welcome-message">Welcome User!</h2>

          <div className="join-chat-container">
            <input
              type="text"
              className="input-field"
              placeholder="Enter chat id"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
            <button className="join-button" onClick={handleJoin}>
              Join Chat
            </button>
          </div>
          <br />
          <div className="create-chat-container">
            <input
              type="text"
              className="input-field"
              placeholder="Enter chat Name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
            <button className="create-button" onClick={handleCreate}>
              Create Chat
            </button>
          </div>
          <Chats />
        </div>
      ) : (
        <div className="login-register-container">
          <h2 className="login-register-message">
            Login or Register to continue
          </h2>
          <a className="login-link" href="/login">
            Login
          </a>
          <a className="register-link" href="/register">
            Register
          </a>
        </div>
      )}
    </div>
  );
}

export default Home;
