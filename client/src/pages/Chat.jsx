import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import constants from "../config";

const socket = io(constants.SOCKET_URL);

function Chat() {
  const user_id = localStorage.getItem("user_id");
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setLanguage(localStorage.getItem("language") || "en");
  }, []);

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const chatId = window.location.pathname.split("/")[2];
    setChatId(chatId);
    fetchPreviousMessages(chatId);
    socket.emit("join", { chatId });

    // Listen for incoming messages
    socket.on("message", async (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);

      // Only translate if translation is not available
      if (!data.translatedText) {
        const result = await translateMessage(data.text);
        data.translatedText = result;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = data;
          return newMessages;
        });
      }
    });

    // Clean up the socket event listener when component unmounts
    return () => {
      socket.off("message");
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const refetch = async () => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const result = await translateMessage(messages[i].text);
        messages[i].translatedText = result;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[i] = messages[i];
          return newMessages;
        });
      }
    };
    refetch();
  }, [language]);

  const fetchPreviousMessages = async (chatId) => {
    try {
      const response = await fetch(
        `${constants.API_URL}/chat/${chatId}/messages`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
      for (let i = data.length - 1; i >= 0; i--) {
        // Only translate if translation is not available
        if (!data[i].translatedText) {
          const result = await translateMessage(data[i].text);
          data[i].translatedText = result;
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            newMessages[i] = data[i];
            return newMessages;
          });
        } else {
          // If translation is already available, just set the state
          setMessages((prevMessages) => [...prevMessages, data[i]]);
        }
      }

      // setLoading(false);
      scrollToBottom();
    } catch (error) {
      console.error(error);
      // Handle error, show a user-friendly message
    }
  };

  const translateMessage = async (text) => {
    try {
      const translationResponse = await fetch(
        `${constants.TRANSLATE_API_URL}/translate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            dest_lang: language, // Replace with the desired destination language
          }),
        }
      );

      if (!translationResponse.ok) {
        throw new Error(
          `Translation failed! Status: ${translationResponse.status}`
        );
      }

      const result = await translationResponse.json();
      return result;
    } catch (error) {
      console.error("Error sending translation request:", error);
    }
  };

  const handleSend = () => {
    const data = {
      chatId: chatId,
      message: message,
      user_id: user_id,
    };
    socket.emit("message", data);
    setMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const messagesList = messages.map((msg, index) => (
    <div key={index}>
      <strong>{msg.sender.name || "Anonymous"}:</strong> {msg.text}
      {msg.translatedText && <p>Translated message: {msg.translatedText}</p>}
    </div>
  ));

  return (
    <div>
      <h2>Chat Room: {chatId}</h2>

      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          marginBottom: "10px",
        }}
      >
        {/* {loading && <p>Loading messages...</p>} */}
        {messagesList}
        <div ref={messagesEndRef} />
      </div>

      <div>
        <input
          type="text"
          placeholder="Message"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
        {/* Drop down to select the desired laguage */}
        <select
          name="language"
          id="language"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            localStorage.setItem("language", e.target.value);
          }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          <option value="bn">Bengali</option>
          <option value="gu">Gujarati</option>
        </select>
      </div>
    </div>
  );
}

export default Chat;
