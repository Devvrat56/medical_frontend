import { useState } from "react";
import Login from "./login";
import Chat from "./chat";
import PatientSummary from "./PatientSummary";

function App() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("mobile"); // mobile | desktop
  const [showSummary, setShowSummary] = useState(false);

  return (
    <>
      {!user ? (
        <Login onLogin={setUser} />
      ) : showSummary ? (
        <PatientSummary onBack={() => setShowSummary(false)} />
      ) : (
        <Chat
          user={user}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onViewSummary={() => setShowSummary(true)}
        />
      )}
    </>
  );
}

export default App;
