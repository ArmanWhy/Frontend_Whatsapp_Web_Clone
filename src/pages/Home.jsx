import { useState, useEffect } from "react";
import axios from "axios";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

function Home() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chats");

      let chatsArray = [];
      if (Array.isArray(res.data)) {
        chatsArray = res.data;
      } else if (Array.isArray(res.data.chats)) {
        chatsArray = res.data.chats;
      }

      // Ensure every chat has wa_id and contactName for consistency
      const preparedChats = chatsArray.map((chat) => ({
        ...chat,
        contactName: chat.contactName || chat.name || "Unknown",
        wa_id: chat.wa_id || chat.id || null,
      }));

      // Sort chats by updatedAt descending
      const sortedChats = preparedChats.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      setChats(sortedChats);

      if (!selectedChat && sortedChats.length > 0) {
        setSelectedChat(sortedChats[0]);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      setChats([]);
    }

    await fetchChats();
    const updatedChat = chats.find(c => c.wa_id === selectedChat.wa_id);
    if(!updatedChat){
      setSelectedChat(updatedChat);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r bg-white">
        <ChatList
          chats={chats}
          onSelectChat={setSelectedChat}
          selectedWaId={selectedChat?.wa_id}
        />
      </div>

      {/* Right Panel */}
      <div className="w-2/3 bg-gray-50">
        {selectedChat ? (
          <ChatWindow currentChat={selectedChat} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat to view messages
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
