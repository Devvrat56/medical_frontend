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
    <div className="login-container">
      <h2>💉 Oncology Assistant</h2>
      <p className="subtitle">Login to continue</p>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        placeholder="Cancer type (e.g. Lung)"
        value={cancerType}
        onChange={(e) => setCancerType(e.target.value)}
      />

      <input
        placeholder="Cancer stage (e.g. Stage 2)"
        value={stage}
        onChange={(e) => setStage(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="de">German</option>
        <option value="pa">Punjabi</option>
        <option value="sv">Swedish</option>
      </select>

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
