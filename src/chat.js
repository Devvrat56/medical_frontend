import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { extractTextFromPdf } from "./utilis/pdfParser";
import { translateText } from "./utilis/translate"; // Assuming this is your updated translate function
import botAvatar from "./bot.jpg";
import userAvatar from "./user.jpg";

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
    init: "Hello! I'm your oncology assistant. How can I help you today?",
    doctor_welcome: "Hello Doctor, I'm your oncology assistant.\nHow can I assist with a patient case or any question today?",
    title: "Oncology Assistant",
    online: "Online",
    connecting: "Connecting...",
    thinking: "Thinking...",
    placeholder: "Type your message...",
    error: "Something went wrong.",
    history: "History",
    newChat: "New Chat",
    conversation: "Conversation",
    summary: "Summary",
  },
  hi: {
    init: "नमस्ते! मैं आपका ऑन्कोलॉजी सहायक हूं। मैं आपकी कैसे मदद कर सकता हूँ?",
    doctor_welcome: "नमस्ते डॉक्टर, मैं आपका ऑन्कोलॉजी सहायक हूँ।\nकिस मरीज़ के बारे में चर्चा करनी है या कोई सवाल है?",
    title: "ऑन्कोलॉजी सहायक",
    online: "ऑनलाइन",
    connecting: "कनेक्ट कर रहा है...",
    thinking: "सोच रहा हूँ...",
    placeholder: "अपना संदेश लिखें...",
    error: "कुछ गलत हो गया।",
    history: "इतिहास",
    newChat: "नई चैट",
    conversation: "बातचीत",
    summary: "सारांश",
  },
  es: {
    init: "¡Hola! Soy tu asistente de oncología. ¿Cómo puedo ayudarte hoy?",
    doctor_welcome: "¡Hola Doctor, soy tu asistente de oncología.\n¿Cómo puedo ayudarte con un caso de paciente o cualquier pregunta?",
    title: "Asistente de Oncología",
    online: "En línea",
    connecting: "Conectando...",
    thinking: "Pensando...",
    placeholder: "Escribe tu mensaje...",
    error: "Algo salió mal.",
    history: "Historial",
    newChat: "Nueva Chat",
    conversation: "Conversación",
    summary: "Resumen",
  },
  fr: {
    init: "Bonjour ! Je suis votre assistant en oncologie. Comment puis-je vous aider ?",
    doctor_welcome: "Bonjour Docteur, je suis votre assistant en oncologie.\nComment puis-je vous aider avec un cas de patient ou une question ?",
    title: "Assistant d'Oncologie",
    online: "En ligne",
    connecting: "Connexion...",
    thinking: "Réflexion...",
    placeholder: "Tapez votre message...",
    error: "Un problème est survenu.",
    history: "Historique",
    newChat: "Nouvelle Chat",
    conversation: "Conversation",
    summary: "Résumé",
  },
  ar: {
    init: "مرحبًا! أنا مساعد الأورام الخاص بك. كيف يمكنني مساعدتك اليوم؟",
    doctor_welcome: "مرحبًا دكتور, أنا مساعد الأورام الخاص بك.\nكيف يمكنني مساعدتك في حالة مريض أو سؤال ما؟",
    title: "مساعد الأورام",
    online: "متصل",
    connecting: "جارٍ الاتصال...",
    thinking: "يفكر...",
    placeholder: "اكتب رسالتك...",
    error: "حدث خطأ ما.",
    history: "التاريخ",
    newChat: "محادثة جديدة",
    conversation: "محادثة",
    summary: "ملخص",
  },
  bn: {
    init: "হ্যালো! আমি আপনার অনকোলজি সহকারী। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
    doctor_welcome: "হ্যালো ডাক্তার, আমি আপনার অনকোলজি সহকারী।\nকোন রোগীর কেসে সাহায্য করব বা কোনো প্রশ্ন আছে?",
    title: "অনকোলজি সহকারী",
    online: "অনলাইন",
    connecting: "সংযোগ করা হচ্ছে...",
    thinking: "চিন্তা করছে...",
    placeholder: "আপনার বার্তা টাইপ করুন...",
    error: "কিছু ভুল হয়েছে।",
    history: "ইতিহাস",
    newChat: "নতুন চ্যাট",
    conversation: "কথপোকথন",
    summary: "সারাংশ",
  },
  ta: {
    init: "வணக்கம்! நான் உங்கள் புற்றுநோய் உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
    doctor_welcome: "வணக்கம் டாக்டர், நான் உங்கள் புற்றுநோய் உதவியாளர்.\nஎந்த நோயாளியின் வழக்கில் உதவ வேண்டும் அல்லது ஏதேனும் கேள்வி உள்ளதா?",
    title: "புற்றுநோய் உதவியாளர்",
    online: "ஆன்லைன்",
    connecting: "இணைக்கிறது...",
    thinking: "சிந்திக்கிறது...",
    placeholder: "உங்கள் செய்தியைத் தட்டச்சு செய்க...",
    error: "ஏதோ தவறு நடந்துள்ளது。",
    history: "வரலாறு",
    newChat: "புதிய அரட்டை",
    conversation: "உரையாடல்",
    summary: "சுருக்கம்",
  },
  de: {
    init: "Hallo! Ich bin Ihr Onkologie-Assistent. Wie kann ich Ihnen heute helfen?",
    doctor_welcome: "Hallo Doktor, ich bin Ihr Onkologie-Assistent.\nWie kann ich bei einem Patientenfall oder einer Frage helfen?",
    title: "Onkologie-Assistent",
    online: "Online",
    connecting: "Verbinden...",
    thinking: "Nachdenken...",
    placeholder: "Geben Sie Ihre Nachricht ein...",
    error: "Etwas ist schief gelaufen.",
    history: "Verlauf",
    newChat: "Neuer Chat",
    conversation: "Gespräch",
    summary: "Zusammenfassung",
  },
  pa: {
    init: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਓਨਕੋਲੋਜੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    doctor_welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਡਾਕਟਰ, ਮੈਂ ਤੁਹਾਡਾ ਓਨਕੋਲੋਜੀ ਸਹਾਇਕ ਹਾਂ।\nਕਿਸ ਮਰੀਜ਼ ਦੇ ਕੇਸ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ ਜਾਂ ਕੋਈ ਸਵਾਲ ਹੈ?",
    title: "ਓਨਕੋਲੋਜੀ ਸਹਾਇਕ",
    online: "ਔਨਲਾਈਨ",
    connecting: "ਕਨੈਕਟ ਕਰ ਰਿਹਾ ਹੈ...",
    thinking: "ਸੋਚ ਰਿਹਾ ਹੈ...",
    placeholder: "ਆਪਣਾ ਸੁਨੇਹਾ ਟਾਈਪ ਕਰੋ...",
    error: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ।",
    history: "ਇਤਿਹਾਸ",
    newChat: "ਨਵੀਂ ਗੱਲਬਾਤ",
    conversation: "ਗੱਲਬਾਤ",
    summary: "ਸਾਰ",
  },
  sv: {
    init: "Hej! Jag är din onkologiassistent. Hur kan jag hjälpa dig idag?",
    doctor_welcome: "Hej Doktor, jag är din onkologiassistent.\nHur kan jag hjälpa till med ett patientfall eller någon fråga?",
    title: "Onkologiassistent",
    online: "Online",
    connecting: "Ansluter...",
    thinking: "Tänker...",
    placeholder: "Skriv ditt meddelande...",
    error: "Något gick fel.",
    history: "Historik",
    newChat: "Ny Chatt",
    conversation: "Konversation",
    summary: "Sammanfattning",
  },
};

const getUiText = (lang, key) => (UI_TEXT[lang] || UI_TEXT.en)[key] || UI_TEXT.en[key];



/* ================= CHAT COMPONENT ================= */
function Chat({ user, onViewSummary }) {
  const [displayLanguage, setDisplayLanguage] = useState(
    user.language || localStorage.getItem("chat_language") || "en"
  );
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  // Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const ui = (key) => getUiText(displayLanguage, key);

  const initRef = useRef(false);

  // Force language from user on mount
  useEffect(() => {
    setDisplayLanguage(user.language);
    localStorage.setItem("chat_language", user.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        setSessionId(null);
        initRef.current = false;
        setInitLoading(true);
        return;
      }
    }
    createNewSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              : ui("newChat"),
            timestamp: Date.now(),
          }
          : s
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, sessionId, activeSessionId, displayLanguage]);

  const createNewSession = () => {
    const newId = Date.now().toString();
    setSessions(prev => [{
      id: newId,
      timestamp: Date.now(),
      messages: [],
      backendSessionId: null,
      preview: ui("newChat")
    }, ...prev]);
    setActiveSessionId(newId);
    setMessages([]);
    setSessionId(null);
    initRef.current = false;
    setInitLoading(true);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const loadSession = (session) => {
    if (session.id === activeSessionId) return;
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setSessionId(null);
    initRef.current = false;
    setInitLoading(true);
    if (window.innerWidth < 768) setSidebarOpen(false);
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

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Wake up server
  useEffect(() => {
    fetch(`${API_BASE}/health`).catch(() => { });
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
    if (initRef.current) return;

    const initChat = async () => {
      initRef.current = true;
      setInitLoading(true);

      try {
        const payload = {
          user_type: "patient", // Force "patient" type because backend does not support "doctor" yet
          cancer_type: user.cancerType || "General", // Default for doctors
          cancer_stage: user.stage || "N/A", // Default for doctors
          language: "en", // ALWAYS ENGLISH FOR BACKEND
        };

        const res = await fetch(`${API_BASE}/chat/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Init failed: ${res.status}`);
        }

        const data = await res.json();
        if (!data.session_id) {
          throw new Error("Missing session_id");
        }

        setSessionId(data.session_id);

        const welcomeKey = user.role === "doctor" ? "doctor_welcome" : "init";
        const welcomeText = getUiText(displayLanguage, welcomeKey);

        setMessages([
          {
            sender: "bot",
            text: welcomeText,
            originalText: welcomeText,
            type: "init",
          },
        ]);
      } catch (err) {
        console.error("Chat init error:", err);

        setSessionId(null);
        initRef.current = false;

        setMessages([
          {
            sender: "bot",
            text:
              displayLanguage === "en"
                ? "Session could not be started. Please refresh."
                : "सत्र शुरू नहीं हो सका। कृपया पेज रिफ्रेश करें।",
          },
        ]);
      } finally {
        setInitLoading(false);
      }
    };

    initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.role, user.cancerType, user.stage]);

  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setDisplayLanguage(newLang);
    localStorage.setItem("chat_language", newLang);

    if (!messages.length) return;

    const updated = await Promise.all(
      messages.map(async (msg) => {
        if (msg.sender !== "bot" || !msg.originalText) return msg;

        if (msg.type === "init") {
          const key = user.role === "doctor" ? "doctor_welcome" : "init";
          return { ...msg, text: getUiText(newLang, key) };
        }

        if (newLang === "en") {
          return { ...msg, text: msg.originalText };
        }

        try {
          const translated = await translateText(msg.originalText, newLang, "en");
          return { ...msg, text: translated };
        } catch {
          return { ...msg, text: msg.originalText + " (Translation failed)" };
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
      setInput(original + " (Translation failed)");
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

    if (!sessionId) {
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: ui("connecting"),
        },
      ]);
      return;
    }

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

      if (file && file.type === "application/pdf") {
        try {
          const pdfText = await extractTextFromPdf(file);
          if (pdfText) {
            englishPayload += `\n\n[Context from attached PDF file]:\n${pdfText}`;
          }
        } catch (e) {
          console.error("Failed to parse PDF on frontend:", e);
        }
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
      <div className="chat-window">

        <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span>🕒</span> {ui("history")} ({user.role})
            </div>
            <button className="new-chat-btn" onClick={createNewSession}>
              <span>+</span> {ui("newChat")}
            </button>
          </div>
          <div className="session-list">
            {sessions.map(s => (
              <div
                key={s.id}
                className={`session-item ${s.id === activeSessionId ? 'active' : ''}`}
                onClick={() => loadSession(s)}
              >
                <div className="session-item-title">
                  {s.messages.length > 0 ? ui("conversation") : ui("newChat")}
                </div>
                <div className="session-preview">{s.preview}</div>
                <div className="session-date">{formatDate(s.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <div className="header-info">
              <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              <div className="bot-avatar">
                <img src={botAvatar} alt="Bot" />
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
                <button onClick={onViewSummary} className="summary-btn" title="View Patient Summary">
                  <span>📋</span> {ui("summary")}
                </button>
              )}
              <select className="lang-select" value={displayLanguage} onChange={handleLanguageChange}>
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="messages-container" onClick={() => setSidebarOpen(false)}>
            {messages.map((m, i) => (
              <div key={i} className={`message-group ${m.sender}`}>
                <div className={`msg-avatar ${m.sender}`}>
                  <img src={m.sender === 'user' ? userAvatar : botAvatar} alt={m.sender} />
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
                <div className="msg-avatar bot">
                  <img src={botAvatar} alt="Bot" />
                </div>
                <div className="msg-bubble typing">
                  <div className="typing-content">
                    <span className="typing-dot">.</span>
                    <span className="typing-dot">.</span>
                    <span className="typing-dot">.</span>
                    <span className="typing-text">
                      {ui('thinking')}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

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