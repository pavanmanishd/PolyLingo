// Chat.jsx
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import constants from "../config";
import "../styles/Chat.css"; // Import your Chat styling file
import ChatsPreview from "../components/ChatsPreview";

const socket = io(constants.SOCKET_URL);

function Chat() {
  const user_id = localStorage.getItem("user_id");
  const [details, setDetails] = useState({});
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
    fetchDetails(chatId);
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

    // Clean up the socket event listener when the component unmounts
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

  const fetchDetails = async (chatId) => {
    try {
      const response = await fetch(
        `${constants.API_URL}/chat/${chatId}/details`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch chat details");
      }

      const data = await response.json();
      document.title = data.chatName;

      setDetails(data);
    } catch (error) {
      console.error(error);
      // Handle error, show a user-friendly message
    }
  };

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

      scrollToBottom();
    } catch (error) {
      console.error(error);
      // Handle error, show a user-friendly message
    }
  };

  // add a event listener for keyboad enter key
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") {
        handleSend();
      }
    };
    window.addEventListener("keydown", handleEnter);
    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [message]);

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
            dest_lang: localStorage.getItem("language") || "en",
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
      console.error("Error sending the translation request:", error);
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
    <div
      key={index}
      className={msg.senderId === user_id ? "own-message" : "other-message"}
    >
      <p className="original-message">
        <strong>{msg.sender.name || "Anonymous"}:</strong> {msg.text}
      </p>
      {msg.translatedText ? (
        <p className="translated-message">Translated: {msg.translatedText}</p>
      ) : (
        <div className="load-cont">
          Translating...<div className="loading"></div>
          </div>
      )}
    </div>
  ));

  return (
    <div className="chat-container">
      <div className="chat-sub-cont-1">
        <ChatsPreview />
      </div>
      <div className="chat-sub-cont-2">
        <div className="chat-details-cont">
          <p className="chat-title">
            {details && `Chat Name: ${details.chatName}`}
          </p>
          <p className="chat-members-count">
            {details.users && details.users.length} members
          </p>
          <p className="chat-id">Chat Id: {chatId}</p>
        </div>
        {/* <hr /> */}
        <div className="messages-container">
          {messagesList}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            placeholder="Message"
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSend} className="send-button">
            Send
          </button>
          {/* Drop-down to select the desired language */}
          <select
            name="language"
            id="language"
            value={language}
            onChange={(e) => {
              const selectedLanguage = e.target.value;
              localStorage.setItem("language", selectedLanguage);
              setLanguage(selectedLanguage);
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
    </div>
  );
}

export default Chat;
