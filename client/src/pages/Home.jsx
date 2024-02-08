import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [chatId, setChatId] = useState('');
    const [chatName, setChatName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (loggedIn === 'true') {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleCreate = () => {
        if (chatName === '') {
            alert('Please enter chat name');
            return;
        }
        fetch('http://localhost:3000/chat/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id'),
                chat_name: chatName,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to create chat');
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
    }

    const handleJoin = () => {
        if (chatId === '') {
            alert('Please enter chat id');
            return;
        }
        fetch('http://localhost:3000/chat/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id'),
                chat_id: chatId,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to join chat');
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
    }

    return (
        <div>
            <h1>Home</h1>
            {
                isLoggedIn ? 
                <div>
                    <h2>Welcome User</h2>
                    <button onClick={() => {
                        localStorage.setItem('id', '');
                        localStorage.setItem('isLoggedIn', false);
                        setIsLoggedIn(false);
                    }}>Logout</button>
                    <input type="text" placeholder="Enter chat id" 
                    value={chatId} onChange={(e) => setChatId(e.target.value)} />
                    <button onClick={handleJoin}>Join Chat</button>
                    <br />
                    <input type="text" placeholder="Enter chat Name" value={chatName} onChange={(e) => setChatName(e.target.value)} />
                    <button onClick={handleCreate} >Create Chat</button>
                    <button onClick={() => {navigate('/chats')}}>Your Chats</button>
                </div>
                :
                <div>
                    <h2>Login or Register to continue</h2>
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                </div>
            }
        </div>
    )
}

export default Home;