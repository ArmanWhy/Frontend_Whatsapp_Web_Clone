import React from "react";
import ChatPage from "./components/ChatPage";

console.log("Backend URL from env:", process.env.REACT_APP_BACKEND_URL);


function App() {
  return <ChatPage />;
}

export default App;
