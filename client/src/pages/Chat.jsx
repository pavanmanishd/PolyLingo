import { useState,useEffect } from "react";
import io from "socket.io-client";

const socket = io('http://localhost:3000');

function Chat(){
    const user_id = localStorage.getItem('user_id');

    const [chatId, setChatId] = useState('');
    const [message, setMessage] = useState('');
    useEffect(() => {
        const chatId = window.location.pathname.split('/')[2];
        setChatId(chatId);
        socket.emit('join', { chatId });
    },[]);

    const handleSend = () => {
        const data = {
            chatId: chatId,
            message: message,
            user_id: user_id,
        }
        socket.emit('message', data);
        setMessage('');
    }

    return(
        <div>
            Chat {chatId}
            <br />
            
            <br />
            <input type="text" placeholder="Message" autoComplete="off" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    )
}

export default Chat;