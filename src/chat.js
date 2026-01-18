import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const API_BASE = "https://onco-chatbot.onrender.com/api";

/* ================= LANGUAGES ================= */
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
  { code: "de", name: "Deutsch" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "sv", name: "Svenska" },
];

/* ================= UI TEXT ================= */
const UI_TEXT = {
  en: {
    init: "Hello! I’m your oncology assistant. How can I help you today?",
    title: "Oncology Assistant",
    online: "Online",
    connecting: "Connecting...",
    thinking: "Thinking...",
    placeholder: "Type your message...",
    error: "Something went wrong.",
  },
  hi: {
    init: "नमस्ते! मैं आपका ऑन्कोलॉजी सहायक हूं। मैं आपकी कैसे मदद कर सकता हूँ?",
    title: "ऑन्कोलॉजी सहायक",
    online: "ऑनलाइन",
    connecting: "कनेक्ट कर रहा है...",
    thinking: "सोच रहा हूँ...",
    placeholder: "अपना संदेश लिखें...",
    error: "कुछ गलत हो गया।",
  },
  es: {
    init: "¡Hola! Soy tu asistente de oncología. ¿Cómo puedo ayudarte hoy?",
    title: "Asistente de Oncología",
    online: "En línea",
    connecting: "Conectando...",
    thinking: "Pensando...",
    placeholder: "Escribe tu mensaje...",
    error: "Algo salió mal.",
  },
  fr: {
    init: "Bonjour ! Je suis votre assistant en oncologie. Comment puis-je vous aider ?",
    title: "Assistant d'Oncologie",
    online: "En ligne",
    connecting: "Connexion...",
    thinking: "Réflexion...",
    placeholder: "Tapez votre message...",
    error: "Un problème est survenu.",
  },
  ar: {
    init: "مرحبًا! أنا مساعد الأورام الخاص بك. كيف يمكنني مساعدتك اليوم؟",
    title: "مساعد الأورام",
    online: "متصل",
    connecting: "جارٍ الاتصال...",
    thinking: "يفكر...",
    placeholder: "اكتب رسالتك...",
    error: "حدث خطأ ما.",
  },
  bn: {
    init: "হ্যালো! আমি আপনার অনকোলজি সহকারী। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
    title: "অনকোলজি সহকারী",
    online: "অনলাইন",
    connecting: "সংযোগ করা হচ্ছে...",
    thinking: "চিন্তা করছে...",
    placeholder: "আপনার বার্তা টাইপ করুন...",
    error: "কিছু ভুল হয়েছে।",
  },
  ta: {
    init: "வணக்கம்! நான் உங்கள் புற்றுநோய் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    title: "புற்றுநோய் உதவியாளர்",
    online: "ஆன்லைன்",
    connecting: "இணைக்கிறது...",
    thinking: "சிந்திக்கிறது...",
    placeholder: "உங்கள் செய்தியைத் தட்டச்சு செய்க...",
    error: "ஏதோ தவறு நடந்துள்ளது.",
  },
  de: {
    init: "Hallo! Ich bin Ihr Onkologie-Assistent. Wie kann ich Ihnen heute helfen?",
    title: "Onkologie-Assistent",
    online: "Online",
    connecting: "Verbinden...",
    thinking: "Nachdenken...",
    placeholder: "Geben Sie Ihre Nachricht ein...",
    error: "Etwas ist schief gelaufen.",
  },
  pa: {
    init: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਓਨਕੋਲੋਜੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    title: "ਓਨਕੋਲੋਜੀ ਸਹਾਇਕ",
    online: "ਔਨਲਾਈਨ",
    connecting: "ਕਨੈਕਟ ਕਰ ਰਿਹਾ ਹੈ...",
    thinking: "ਸੋਚ ਰਿਹਾ ਹੈ...",
    placeholder: "ਆਪਣਾ ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ...",
    error: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ।",
  },
  sv: {
    init: "Hej! Jag är din onkologiassistent. Hur kan jag hjälpa dig idag?",
    title: "Onkologiassistent",
    online: "Online",
    connecting: "Ansluter...",
    thinking: "Tänker...",
    placeholder: "Skriv ditt meddelande...",
    error: "Något gick fel.",
  },
};

const getUiText = (lang, key) =>
  (UI_TEXT[lang] || UI_TEXT.en)[key] || UI_TEXT.en[key];

/* ================= TRANSLATION ================= */
const MODEL_ID = "facebook/nllb-200-distilled-600M";

const NLLB_LANG_MAP = {
  en: "eng_Latn",
  hi: "hin_Deva",
  es: "spa_Latn",
  fr: "fra_Latn",
  ar: "arb_Arab",
  bn: "ben_Beng",
  ta: "tam_Taml",
  de: "deu_Latn",
  pa: "pan_Guru",
  sv: "swe_Latn",
};

async function translateWithMyMemory(text, targetLang, sourceLang) {
  const translateChunk = async (chunk) => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await res.json();
      const translation = data.responseData.translatedText;

      if (translation?.includes("QUERY LENGTH LIMIT EXCEEDED") || 
          translation?.includes("MYMEMORY WARNING")) {
        return null;
      }
      return translation;
    } catch (e) {
      console.warn("MyMemory failed:", e);
      return null;
    }
  };

  if (text.length <= 500) {
    return await translateChunk(text) || text;
  }

  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [text];
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > 500) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current.trim());

  const translated = await Promise.all(
    chunks.map(chunk => translateChunk(chunk).then(t => t || chunk))
  );

  return translated.join(" ");
}

async function translateText(text, targetLang, sourceLang = "en") {
  if (!text || targetLang === sourceLang) return text;

  const HF_API_KEY = process.env.REACT_APP_HF_API_KEY;

  if (!HF_API_KEY) {
    console.warn("Hugging Face API key is missing. Using fallback translation.");
    return await translateWithMyMemory(text, targetLang, sourceLang) || text;
  }

  const srcCode = NLLB_LANG_MAP[sourceLang] || "eng_Latn";
  const tgtCode = NLLB_LANG_MAP[targetLang] || "eng_Latn";

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(
        `https://api-inference.huggingface.co/models/${MODEL_ID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: text,
            parameters: { src_lang: srcCode, tgt_lang: tgtCode },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (res.status === 503 && attempt === 0) {
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }

      if (res.ok) {
        const data = await res.json();
        return data[0]?.translation_text || data[0]?.generated_text || text;
      }
    } catch (err) {
      console.warn("HF translation attempt failed:", err);
    }
  }

  // Final fallback
  return await translateWithMyMemory(text, targetLang, sourceLang) || text;
}

/* ================= CHAT COMPONENT ================= */
function Chat({ user, viewMode, onViewSummary }) {
  const [displayLanguage, setDisplayLanguage] = useState(
    localStorage.getItem("chat_language") || user.language || "en"
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Load chat history
  useEffect(() => {
    const key = `chat_history_${user.role}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      setSessions(parsed);
      if (parsed.length > 0) {
        const last = parsed[0];
        setActiveSessionId(last.id);
        setMessages(last.messages || []);
        setSessionId(last.backendSessionId || null);
        setInitLoading(false);
        return;
      }
    }
    createNewSession();
  }, [user.role]);

  // Save history
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(`chat_history_${user.role}`, JSON.stringify(sessions));
    }
  }, [sessions, user.role]);

  // Sync active session
  useEffect(() => {
    if (!activeSessionId) return;
    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              messages,
              backendSessionId: sessionId,
              preview: messages.length > 0
                ? messages[messages.length - 1].text.substring(0, 60) + "..."
                : "New Chat",
              timestamp: Date.now(),
            }
          : s
      )
    );
  }, [messages, sessionId, activeSessionId]);

  const createNewSession = () => {
    const newId = Date.now().toString();
    setSessions(prev => [{
      id: newId,
      timestamp: Date.now(),
      messages: [],
      backendSessionId: null,
      preview: "New Chat"
    }, ...prev]);
    setActiveSessionId(newId);
    setMessages([]);
    setSessionId(null);
    setInitLoading(true);
  };

  const loadSession = (session) => {
    if (session.id === activeSessionId) return;
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setSessionId(session.backendSessionId || null);
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const ui = (key) => getUiText(displayLanguage, key);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Wake up server
  useEffect(() => {
    fetch(`${API_BASE}/health`).catch(() => {});
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();

    const langMap = {
      en: "en-US", hi: "hi-IN", es: "es-ES", fr: "fr-FR", ar: "ar-SA",
      bn: "bn-IN", ta: "ta-IN", de: "de-DE", pa: "pa-IN", sv: "sv-SE"
    };

    recognition.lang = langMap[displayLanguage] || "en-US";

    recognition.onresult = (e) => {
      setInput(prev => prev + " " + e.results[0][0].transcript);
      setIsRecording(false);
    };

    recognition.onerror = recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
  }, [displayLanguage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    isRecording ? recognitionRef.current.stop() : recognitionRef.current.start();
    setIsRecording(!isRecording);
  };

  // Initialize chat session
  useEffect(() => {
    if (sessionId) return;

    const initChat = async () => {
      setInitLoading(true);
      try {
        const res = await fetch(`${API_BASE}/chat/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_type: user.role,
            cancer_type: user.cancerType,
            cancer_stage: user.stage,
            language: "en",
          }),
        });
        const data = await res.json();
        setSessionId(data.session_id);
      } catch (e) {
        console.error("Chat init failed:", e);
      }

      setMessages([{
        sender: "bot",
        text: UI_TEXT.en.init,
        originalText: UI_TEXT.en.init
      }]);

      setInitLoading(false);
    };

    initChat();
  }, [user.role, user.cancerType, user.stage, sessionId]);

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setDisplayLanguage(newLang);
    localStorage.setItem("chat_language", newLang);

    if (!messages.length) return;

    const updated = await Promise.all(
      messages.map(async (msg) => {
        if (msg.sender !== "bot" || !msg.originalText) return msg;

        if (msg.originalText === UI_TEXT.en.init) {
          return { ...msg, text: getUiText(newLang, "init") };
        }
        if (newLang === "en") {
          return { ...msg, text: msg.originalText };
        }

        try {
          const translated = await translateText(msg.originalText, newLang, "en");
          return { ...msg, text: translated };
        } catch {
          return msg;
        }
      })
    );

    setMessages(updated);
  };

  const handleDraftTranslation = async () => {
    if (!input?.trim() || displayLanguage === "en") return;

    const original = input;
    setInput("Translating...");

    try {
      const translated = await translateText(original, displayLanguage, "en");
      setInput(translated);
    } catch {
      setInput(original);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if ((!input?.trim() && !selectedFile) || loading) return;

    const userText = input.trim();
    const file = selectedFile;

    setInput("");
    clearFile();
    setLoading(true);

    setMessages(prev => [...prev, {
      sender: "user",
      text: userText,
      originalText: userText
    }]);

    try {
      let englishPayload = userText;
      if (displayLanguage !== "en") {
        englishPayload = await translateText(userText, "en", displayLanguage);
      }

      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("message", englishPayload);
      formData.append("language", displayLanguage);
      formData.append("is_voice", "false");
      if (file) formData.append("file", file);

      const res = await fetch(`${API_BASE}/chat/message`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      const rawReply = data.reply || data.response || "Thinking...";

      let finalDisplay = rawReply;
      if (displayLanguage !== "en") {
        finalDisplay = await translateText(rawReply, displayLanguage, "en");
      }

      setMessages(prev => [...prev, {
        sender: "bot",
        text: finalDisplay,
        originalText: rawReply
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: "bot",
        text: ui("error")
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className={`chat-window ${viewMode}`}>

        {/* Sidebar - Chat History */}
        <div className={`chat-sidebar ${viewMode === 'mobile' ? '' : 'desktop'}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span>🕒</span> History ({user.role})
            </div>
            <button className="new-chat-btn" onClick={createNewSession}>
              <span>+</span> New Chat
            </button>
          </div>
          <div className="session-list">
            {sessions.map(s => (
              <div
                key={s.id}
                className={`session-item ${s.id === activeSessionId ? 'active' : ''}`}
                onClick={() => loadSession(s)}
              >
                <div style={{ fontWeight: 600 }}>
                  {s.messages.length > 0 ? "Conversation" : "New Chat"}
                </div>
                <div className="session-preview">{s.preview}</div>
                <div className="session-date">{formatDate(s.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 6v12m6-6H6" />
                </svg>
              </div>
              <div className="header-text">
                <h3>{ui('title')}</h3>
                <div className="status-badge">
                  <span className={`status-dot ${initLoading ? 'warning' : ''}`}></span>
                  {initLoading ? ui('connecting') : ui('online')}
                </div>
              </div>
            </div>

            <div className="header-controls">
              {user.role === 'doctor' && (
                <button onClick={onViewSummary} title="View Patient Summary" style={{
                  marginRight: '10px', padding: '6px 12px', borderRadius: '8px',
                  border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer',
                  fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                  <span>📋</span> Summary
                </button>
              )}
              <select className="lang-select" value={displayLanguage} onChange={handleLanguageChange}>
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.map((m, i) => (
              <div key={i} className={`message-group ${m.sender}`}>
                <div className={`msg-avatar ${m.sender}`}>
                  {m.sender === 'user' ? 'U' : 'AI'}
                </div>
                <div className="msg-bubble">
                  <div className="bot-content">
                    {m.sender === 'bot' ? (
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="message-group bot">
                <div className="msg-avatar bot">AI</div>
                <div className="msg-bubble typing">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>.</span><span>.</span><span>.</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                      {ui('thinking')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="input-region">
            {selectedFile && (
              <div className="file-preview-bar">
                <div className="file-chip">
                  <span>📄 {selectedFile.name}</span>
                  <button className="remove-file" onClick={clearFile}>✕</button>
                </div>
              </div>
            )}

            <div className="input-comp">
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt"
              />

              <button className="action-btn" onClick={() => fileInputRef.current?.click()} title="Upload File">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              <button
                className={`action-btn ${isRecording ? 'active-mic' : ''}`}
                onClick={toggleRecording}
                title="Voice Input"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {displayLanguage !== 'en' && input?.trim() && (
                <button
                  className="action-btn"
                  onClick={handleDraftTranslation}
                  title={`Translate to ${SUPPORTED_LANGUAGES.find(l => l.code === displayLanguage)?.name}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 8l6 6" />
                    <path d="M4 14h6" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="M22 22l-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                </button>
              )}

              <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={isRecording ? (displayLanguage === 'en' ? "Listening..." : "...") : ui('placeholder')}
                disabled={loading}
              />

              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={loading || (!input?.trim() && !selectedFile)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;