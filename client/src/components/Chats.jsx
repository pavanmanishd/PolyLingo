import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Chats() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    //   const [user_id, setUser_id] = useState(localStorage.getItem("user_id"));
    const user_id = localStorage.getItem("user_id");
    fetch(`http://localhost:3000/chats/${user_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch chats");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setChats(data);
      })
      .catch((err) => {
        console.error(err);
        // Handle error, show a user-friendly message
      });
  }, []);

  const ChatsList = chats.map((chat) => {
    return (
      <div key={chat.id} onClick={()=>{navigate(`/chat/${chat.id}`)}}>
        <h3>Chat Name = {chat.chatName}</h3>
        <p>{chat.users.length} users</p>
        <p>Chat ID: {chat.id}</p>
      </div>
    );
  });

  return (
    <div>
      <h1>Your Chats</h1>
      {ChatsList}
    </div>
  );
}

export default Chats;