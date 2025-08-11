import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${backendUrl}/messages/chats`);
      setChats(res.data.chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);

    // Reset unread count when opening chat
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.wa_id === chat.wa_id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-300 overflow-y-auto">
        <ChatList
          chats={chats}
          onSelectChat={handleSelectChat}
          selectedWaId={selectedChat?.wa_id}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-grow flex flex-col">
        {selectedChat ? (
          <ChatWindow
            currentChat={selectedChat}
            setChats={setChats} // ✅ Pass down so ChatWindow can reset unread counts
          />
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-lg">
            Select a chat to view messages
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
