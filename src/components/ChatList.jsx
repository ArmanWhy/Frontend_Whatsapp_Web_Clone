import React from "react";

function ChatList({ chats, onSelectChat, selectedWaId }) {
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="w-full bg-white h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b shadow-sm bg-green-600 text-white text-xl font-bold">
        WhatsApp
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto flex-1">
        {chats.map((chat, index) => {
          // Use wa_id as key, fallback to index (only if wa_id missing)
          const key = chat.wa_id || chat.id || index;

          return (
            <div
              key={key}
              className={`flex items-center gap-4 p-3 border-b cursor-pointer hover:bg-gray-100 ${
                selectedWaId === chat.wa_id ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectChat(chat)}
            >
              {/* Avatar */}
              <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white font-semibold rounded-full text-lg">
                {getInitials(chat.contactName || chat.name)}
              </div>

              {/* Chat details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800 truncate">{chat.contactName || chat.name || "Unknown"}</h3>
                  <p className="text-xs text-gray-500">
                    {chat.timestamp
                      ? new Date(chat.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate w-[85%]">
                    {chat.latestMessage || "Start chatting..."}
                  </p>

                  {chat.unreadCount > 0 && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;
