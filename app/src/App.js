import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io.connect("http://localhost:8080");

function App() {
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);

  const login = () => {
    socket.emit("login", username, (response) => {
      console.log(response.status)
    });
    setShowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="loginContainer">
          <h3>Enter Username</h3>
          <input
            type="text"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            onKeyDown={(event) => {
              event.key === "Enter" && login();
            }}
          />
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} />
      )}
    </div>
  );
};

export default App;