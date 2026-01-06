import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cancerType, setCancerType] = useState("");
  const [stage, setStage] = useState("");
  const [role, setRole] = useState("patient");
  const [language, setLanguage] = useState("en");

  const handleLogin = () => {
    if (!email || !password || !cancerType || !stage) {
      alert("Please fill all fields");
      return;
    }

    onLogin({
      email,
      role,
      cancerType,
      stage,
      language
    });
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header mb-6">
          <div className="logo-icon">🧬</div>
          <h2>Oncology AI</h2>
          <p>Your personalized medical assistant</p>
        </div>

        <div className="form-group">
          <label>I am a</label>
          <div className="role-select-group">
            <div
              className={`role-option ${role === 'patient' ? 'active' : ''}`}
              onClick={() => setRole('patient')}
            >
              Patient
            </div>
            <div
              className={`role-option ${role === 'doctor' ? 'active' : ''}`}
              onClick={() => setRole('doctor')}
            >
              Doctor
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <span className="input-icon">✉️</span>
            <input
              className="styled-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              className="styled-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Medical Details</label>
          <input
            className="styled-input no-icon"
            placeholder="Cancer Type (e.g. Lung)"
            value={cancerType}
            onChange={(e) => setCancerType(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <input
            className="styled-input no-icon"
            placeholder="Stage (e.g. Stage 2)"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Language</label>
          <select
            className="styled-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="de">German</option>
            <option value="pa">Punjabi</option>
            <option value="sv">Swedish</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Login;
