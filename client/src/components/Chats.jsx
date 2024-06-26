// Chats.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import constants from "../config";
import "../styles/Chats.css"; // Import your Chats styling file

function Chats() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    fetch(`${constants.API_URL}/chats/${user_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch chats");
        }
        return res.json();
      })
      .then((data) => {
        setChats(data);
      })
      .catch((err) => {
        console.error(err);
        // Handle error, show a user-friendly message
      });
  }, []);

  const ChatsList = chats.map((chat) => {
    return (
      <div key={chat.id} className="chat-item" onClick={() => navigate(`/chat/${chat.id}`)}>
        <h3 className="chat-name">Chat Name: {chat.chatName}</h3>
        <p className="user-count">{chat.users.length} users</p>
        <p className="chat-id">Chat ID: {chat.id}</p>
      </div>
    );
  });

  return (
    <div className="chats-container">
      <h1 className="chats-title">Your Chats</h1>
      {ChatsList}
    </div>
  );
}

export default Chats;
