import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io('http://localhost:3000');

function Chat() {
    const user_id = localStorage.getItem('user_id');

    const [chatId, setChatId] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const chatId = window.location.pathname.split('/')[2];
        setChatId(chatId);

        // get previous messages
        fetch(`http://localhost:3000/chat/${chatId}/messages`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch messages');
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setMessages(data);
            })
            .catch((err) => {
                console.error(err);
                // Handle error, show a user-friendly message
            });


        socket.emit('join', { chatId });

        // Listen for incoming messages from the server
        socket.on('message', (newMessage) => {
            console.log('new message', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            // Clean up the socket event listener when component unmounts
            socket.off('message');
        };
    }, [chatId]);

    const handleSend = () => {
        const data = {
            chatId: chatId,
            message: message,
            user_id: user_id,
        }
        socket.emit('message', data);
        setMessage('');
    }

    return (
        <div>
            <h2>Chat Room: {chatId}</h2>
            
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender.name || 'Anonymous'}:</strong> {msg.text}
                    </div>
                ))}
            </div>

            <div>
                <input type="text" placeholder="Message" autoComplete="off" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    )
}

export default Chat;
