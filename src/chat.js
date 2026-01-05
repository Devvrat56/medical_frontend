import { useEffect, useRef, useState } from "react";

const API_BASE = "https://onco-chatbot.onrender.com/api";

function Chat({ user, viewMode, setViewMode }) {
  /* =========================
     STATE
  ========================= */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* =========================
     INIT SESSION
  ========================= */
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_type: user.role,
            cancer_type: user.cancerType,
            cancer_stage: user.stage,
            language: user.language,
            doctor_id: user.role === "doctor" ? "dev_doc24" : undefined
          })
        });

        if (!res.ok) throw new Error("Init failed");

        const data = await res.json();
        setSessionId(data.session_id);
        setReady(true);
      } catch {
        setMessages([
          { sender: "bot", text: "❌ Unable to connect to assistant." }
        ]);
      }
    };

    initSession();
  }, [user]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = async () => {
    if (!ready || loading || !input.trim()) return;

    const text = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          is_voice: false
        })
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILE UPLOAD (UI READY)
  ========================= */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `📄 Uploaded: ${file.name}` }
    ]);
  };

  /* =========================
     FORMAT BOT TEXT
  ========================= */
  const renderBotText = (text) => {
    return text.split("\n").map((line, idx) => {
      if (line.trim().startsWith("*")) {
        return <li key={idx}>{line.replace("*", "").trim()}</li>;
      }
      return <p key={idx}>{line}</p>;
    });
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className={`chat-container ${viewMode}`}>
      {/* HEADER */}
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

      {/* CHAT */}
      <div className="chat-box">
        {!ready && <div className="bot-msg">Connecting…</div>}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? "user-msg" : "bot-msg"}
          >
            {msg.sender === "bot" ? (
              <ul className="bot-content">{renderBotText(msg.text)}</ul>
            ) : (
              msg.text
            )}
          </div>
        ))}

        {loading && <div className="bot-msg">Typing…</div>}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="input-area">
        <button
          className="icon-btn"
          onClick={() => fileInputRef.current.click()}
        >
          ＋
        </button>

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />

        <input
          placeholder="Ask anything..."
          value={input}
          disabled={!ready || loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          className="send-btn"
          disabled={!ready || loading}
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chat;
