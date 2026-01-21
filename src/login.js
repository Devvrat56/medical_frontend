import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cancerType, setCancerType] = useState("");
  const [stage, setStage] = useState("");
  const [role, setRole] = useState("patient");
  const [language, setLanguage] = useState("en");

  const isPatient = role === "patient";

  const handleLogin = () => {
    // Basic validation — always require email + password
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    // Extra validation only for patients
    if (isPatient && (!cancerType || !stage)) {
      alert("Please provide your cancer type and stage");
      return;
    }

    // Prepare data to send
    const loginData = {
      email,
      role,
      language,
    };

    // Add medical info only if patient
    if (isPatient) {
      loginData.cancerType = cancerType;
      loginData.stage = stage;
    }

    onLogin(loginData);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header mb-6">
          <div className="logo-icon">🧬</div>
          <h2>Oncology AI</h2>
          <p>Your personalized medical assistant</p>
        </div>

        {/* Role selection */}
        <div className="form-group">
          <label>I am a</label>
          <div className="role-select-group">
            <div
              className={`role-option ${role === "patient" ? "active" : ""}`}
              onClick={() => {
                setRole("patient");
                // Optional: reset fields when switching to patient
                // setCancerType("");
                // setStage("");
              }}
            >
              Patient
            </div>
            <div
              className={`role-option ${role === "doctor" ? "active" : ""}`}
              onClick={() => setRole("doctor")}
            >
              Doctor
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <span className="input-icon">✉️</span>
            <input
              className="styled-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <span className="input-icon">🔒</span>
            <input
              className="styled-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Medical details — only for patients */}
        {isPatient && (
          <div className="form-group">
            <label>Medical Details</label>
            <input
              className="styled-input no-icon"
              placeholder="Cancer Type (e.g. Lung, Breast, Leukemia)"
              value={cancerType}
              onChange={(e) => setCancerType(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <input
              className="styled-input no-icon"
              placeholder="Stage (e.g. Stage 2, IV, Recurrent)"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            />
          </div>
        )}

        {/* Language */}
        <div className="form-group">
          <label>Preferred Language</label>
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

        {/* Submit button */}
        <button className="login-btn" onClick={handleLogin}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default Login;