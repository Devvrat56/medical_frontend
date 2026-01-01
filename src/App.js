import { useState } from "react";
import Login from "./login";
import Chat from "./chat";

function App() {
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("mobile"); // mobile | desktop

  return (
    <>
      {user ? (
        <Chat
          user={user}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      ) : (
        <Login onLogin={setUser} />
      )}
    </>
  );
}

export default App;
