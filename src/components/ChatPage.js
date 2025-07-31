import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";

const ChatPage = () => {
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setAllMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const sendMessage = () => {
    if (message.trim()) {
      const fullMessage = {
        user: username,
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit("chatMessage", fullMessage);
      setMessage("");
    }
  };

  const handleLogin = () => {
    if (inputName.trim()) {
      setUsername(inputName.trim());
    }
  };

  if (!username) {
    return (
      <div style={styles.loginContainer}>
        <h2>💬 Join the Chat</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>Join</button>
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>Welcome, <span style={styles.user}>{username}</span></div>
      <div style={styles.chatBox}>
        {allMessages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.user === username ? "flex-end" : "flex-start",
              backgroundColor: msg.user === username ? "#DCF8C6" : "#fff",
            }}
          >
            <div style={styles.messageMeta}>
              <strong style={{ color: "#1976d2" }}>{msg.user}</strong>
              <span style={styles.time}>{msg.time}</span>
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={styles.inputBar}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  chatContainer: {
    maxWidth: 700,
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    border: "1px solid #ccc",
    borderRadius: 10,
    background: "#fefefe",
    overflow: "hidden",
  },
  header: {
    padding: 16,
    backgroundColor: "#1976d2",
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  user: {
    color: "#FFEB3B",
  },
  chatBox: {
    flex: 1,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
    background: "#eaeaea",
  },
  message: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  messageMeta: {
    fontSize: 12,
    marginBottom: 5,
    display: "flex",
    justifyContent: "space-between",
  },
  time: {
    color: "#555",
    marginLeft: 10,
  },
  inputBar: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ccc",
    backgroundColor: "#fafafa",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    border: "1px solid #ccc",
    borderRadius: 6,
  },
  button: {
    marginTop: 10,
    padding: "10px 20px",
    fontSize: 16,
    border: "none",
    background: "#1976d2",
    color: "white",
    borderRadius: 6,
    cursor: "pointer",
  },
  sendButton: {
    marginLeft: 10,
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default ChatPage;
