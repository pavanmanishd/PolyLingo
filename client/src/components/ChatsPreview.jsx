// ChatsPreview.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import constants from "../config";
import "../styles/ChatsPreview.css"; // Import your Chats styling file

function ChatsPreview() {
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

  const ChatsList = chats.map((chat) => (
    <div
      key={chat.id}
      className="chat-item-preview"
      onClick={() => navigate(`/chat/${chat.id}`)}
    >
      <p className="chat-name-preview">{chat.chatName}</p>
    </div>
  ));

  return (
    <div className="chats-container-preview">
        <div className="chat-title-cont" onClick={()=>{window.location.href = "/";}} >
      <p className="chats-title-preview">PolyLingo</p>
        </div>
      {ChatsList}
    </div>
  );
}

export default ChatsPreview;
