import { useState, useEffect, useRef } from "react";
import axios from "axios";
import socket from "../socket";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ChatWindow({ currentChat, setChats }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch messages when chat changes
  useEffect(() => {
    if (!currentChat) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/chats/${currentChat.wa_id}/messages`
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    socket.emit("join_chat", currentChat.wa_id);

    // Reset unread count when opening chat
    setChats((prevChats) =>
      prevChats.map((c) =>
        c.wa_id === currentChat.wa_id ? { ...c, unreadCount: 0 } : c
      )
    );
  }, [currentChat, setChats]);

  // Handle incoming messages
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.wa_id === currentChat?.wa_id) {
        setMessages((prev) => {
          const exists = prev.some(
            (m) => m.message = newMessage.message &&
              m.timestamp === newMessage.timestamp
          );
          if (exists) return prev;
          return [...prev, newMessage]
        });
      } else {
        // Different chat → increase unread count
        setChats((prevChats) =>
          prevChats.map((c) =>
            c.wa_id === newMessage.wa_id
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
              : c
          )
        );
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [currentChat, setChats]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (text) => {
    if (!currentChat?.wa_id || !text) return;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      wa_id: currentChat.wa_id,
      name: "You",
      message: text,
      timestamp: new Date(),
      status: "sent",
      type: "text",
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await axios.post(`${backendUrl}/messages/send`, {
        wa_id: currentChat.wa_id,
        name: 'You',
        message: text,
      })
      
      setMessages((prev) => 
        prev.map((m) => (m._id === tempMessage._id ? res.data.data : m))  
      )
      
      socket.emit("send_message", res.data.data);

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => 
          chat.wa_id === currentChat.wa_id
            ? {
              ...chat,
              latestMessage: text,
              timestamp: new Date().toISOString(),
              unreadCount: 0,
            }
            : chat
          );
          updatedChats.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          return updatedChats
    });

    } catch (err) {
      console.error("Error sending message", err)
    }



    // Reset unread count for this chat after sending
    
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-200 px-4 py-2 border-b font-semibold">
        {currentChat?.contactName || currentChat?.name || "Select a chat"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id || msg.timestamp}
              message={msg}
              isOwn={msg.name === "You"}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center">No messages yet</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {currentChat && <MessageInput onSend={sendMessage} />}
    </div>
  );
}

export default ChatWindow;
