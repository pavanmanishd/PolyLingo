import { useState,useEffect } from "react";

function Chat(){
    const [chatId, setChatId] = useState('');

    useEffect(() => {
        const chatId = window.location.pathname.split('/')[2];
        setChatId(chatId);
    },[]);

    return(
        <div>
            Chat {chatId}
        </div>
    )
}

export default Chat;