import { useState } from "react";

function Chat({ user, viewMode, setViewMode }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };

    const botMsg = {
      sender: "bot",
      text: `(${user.language.toUpperCase()}) I will help with ${user.cancerType} cancer (Stage ${user.stage}).`
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className={`chat-container ${viewMode}`}>
      {/* Header */}
      <div className="chat-header">
        <h3>Oncology Assistant</h3>
        <button
          className="toggle-btn"
          onClick={() =>
            setViewMode(viewMode === "mobile" ? "desktop" : "mobile")
          }
        >
          {viewMode === "mobile" ? "🖥️" : "📱"}
        </button>
      </div>

      {/* Chat Area */}
      <div className="chat-box">
        {messages.length === 0 && (
          <div className="chat-placeholder">
            <strong>Hi there!</strong>
            How can I assist you today?
            <span>Language: {user.language.toUpperCase()}</span>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? "user-msg" : "bot-msg"}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="input-area">
        <button className="icon-btn">＋</button>

        <input
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="icon-btn">🎤</button>
        <button className="send-btn" onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default Chat;
