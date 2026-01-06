import { useEffect, useRef, useState } from "react";

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
    error: "কিছু ভুল হয়েছে。",
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

/* ================= TRANSLATION (ROBUST w/ FALLBACK) ================= */
const HF_API_KEY = process.env.REACT_APP_HF_API_KEY; // Use environment variable
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

// FALLBACK PROVIDER (MyMemory)
async function translateWithMyMemory(text, targetLang, sourceLang) {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await res.json();
    return data.responseData.translatedText || null;
  } catch (e) {
    console.warn("MyMemory fallback failed:", e);
    return null;
  }
}

async function translateText(text, targetLang, sourceLang = "en") {
  if (!text || targetLang === sourceLang) return text;

  const srcCode = NLLB_LANG_MAP[sourceLang] || "eng_Latn";
  const tgtCode = NLLB_LANG_MAP[targetLang] || "eng_Latn";

  // 1. Try Hugging Face (High Quality)
  for (let i = 0; i < 2; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

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
            parameters: {
              src_lang: srcCode,
              tgt_lang: tgtCode,
            },
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (res.status === 503) {
        if (i === 0) {
          await new Promise(r => setTimeout(r, 1500));
          continue; // Retry once
        }
        break; // Fallback
      }

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.translation_text) return data[0].translation_text;
        if (data[0]?.generated_text) return data[0].generated_text;
      }
    } catch (err) { }
  }

  // 2. Fallback to MyMemory if HF fails
  const fallback = await translateWithMyMemory(text, targetLang, sourceLang);
  return fallback || text;
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

  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  const ui = (key) => getUiText(displayLanguage, key);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= WAKE UP SERVER ================= */
  useEffect(() => {
    fetch(`${API_BASE}/health`).catch(() => { });
  }, []);

  /* ================= SPEECH ================= */
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window))
      return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();

    // Valid browser language codes
    const SR_LANG_MAP = {
      en: "en-US",
      hi: "hi-IN",
      es: "es-ES",
      fr: "fr-FR",
      ar: "ar-SA",
      bn: "bn-IN",
      ta: "ta-IN",
      de: "de-DE",
      pa: "pa-IN",
      sv: "sv-SE"
    };

    recognition.lang = SR_LANG_MAP[displayLanguage] || "en-US";

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
  }, [displayLanguage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  /* ================= INIT CHAT ================= */
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
      } catch (e) { }

      setMessages([
        { sender: "bot", text: ui('init'), originalText: UI_TEXT.en.init },
      ]);

      setInitLoading(false);
    };

    initChat();
  }, [displayLanguage, user]);

  /* ================= LANGUAGE SWITCH ================= */
  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setDisplayLanguage(newLang);
    localStorage.setItem("chat_language", newLang);

    // UI updates immediately via state, but we need to update history
    if (messages.length > 0) {

      const promises = messages.map(async (msg) => {
        if (msg.sender === "bot" && msg.originalText) {
          // Fast Path: Init Messages
          if (msg.originalText === UI_TEXT.en.init) {
            return { ...msg, text: getUiText(newLang, 'init') };
          }
          // Switch back to English
          if (newLang === 'en') {
            return { ...msg, text: msg.originalText };
          }
          // Translate dynamic Content
          try {
            const translated = await translateText(msg.originalText, newLang, "en");
            return { ...msg, text: translated };
          } catch (e) {
            return msg;
          }
        }
        return msg;
      });

      const updatedMessages = await Promise.all(promises);
      setMessages(updatedMessages);
    }
  };

  /* ================= DRAFT TRANSLATION ================= */
  const handleDraftTranslation = async () => {
    if (!input.trim() || displayLanguage === 'en') return;

    const original = input;
    setInput("Translating...");

    try {
      // Translate from English (assumed) to Target Language
      const translated = await translateText(original, displayLanguage, "en");
      setInput(translated); // Update input field with translated text
    } catch (e) {
      setInput(original); // Revert on fail
    }
  };

  /* ================= FILE HANDLING ================= */
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;

    const userText = input.trim();
    const file = selectedFile;

    setInput("");
    clearFile();
    setLoading(true);

    // Optimistic: Show User text
    setMessages((prev) => [...prev, { sender: "user", text: userText, originalText: userText }]);

    try {
      // 1. Prepare English Payload
      let englishPayload = userText;
      if (displayLanguage !== 'en') {
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

      if (!res.ok) throw new Error("Server Error");

      const data = await res.json();
      const rawReply = data.reply || data.response || "Thinking...";

      // 2. Translate Bot Reply
      let finalDisplay = rawReply;
      if (displayLanguage !== 'en') {
        // Attempt translate (will use MyMemory if NLLB fails)
        finalDisplay = await translateText(rawReply, displayLanguage, "en");
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: finalDisplay, originalText: rawReply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: ui("error") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="app-container">
      <div className={`chat-window ${viewMode}`}>
        {/* HEADER */}
        <div className="chat-header">
          <div className="header-info">
            <div className="bot-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v12m6-6H6" /></svg>
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
              <button
                onClick={onViewSummary}
                title="View Patient Summary"
                style={{
                  marginRight: '10px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>📋</span> Summary
              </button>
            )}
            <select
              className="lang-select"
              value={displayLanguage}
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="messages-container">
          {messages.map((m, i) => (
            <div key={i} className={`message-group ${m.sender}`}>
              <div className={`msg-avatar ${m.sender}`}>
                {m.sender === 'user' ? 'U' : 'AI'}
              </div>
              <div className="msg-bubble">
                <div className="bot-content">{m.text}</div>
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

        {/* INPUT */}
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
            <input type="file" hidden ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt" />
            <button className="action-btn" onClick={() => fileInputRef.current.click()} title="Upload File">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
            </button>

            <button className={`action-btn ${isRecording ? 'active-mic' : ''}`} onClick={toggleRecording} title="Voice Input">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
            </button>

            {/* TRANSLATE INPUT BUTTON (Visible only if not English & has text) */}
            {displayLanguage !== 'en' && input.trim() && (
              <button className="action-btn" onClick={handleDraftTranslation} title={`Translate to ${SUPPORTED_LANGUAGES.find(l => l.code === displayLanguage)?.name}`}>
                {/* Translate Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8l6 6" /><path d="M4 14h6" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
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

            <button className="send-btn" onClick={sendMessage} disabled={loading || (!input.trim() && !selectedFile)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
