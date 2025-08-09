import React from "react";

function MessageBubble({ message, isOwn }) {
  const timestamp = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const bubbleClass = isOwn
    ? "self-end bg-green-200 text-right rounded-tl-lg rounded-bl-lg rounded-tr-lg"
    : "self-start bg-white text-left rounded-tr-lg rounded-br-lg rounded-tl-lg";

  return (
    <div
      className={`max-w-xs md:max-w-md p-2 shadow break-words ${
        isOwn ? "ml-auto" : "mr-auto"
      } ${bubbleClass}`}
    >
      {message.type === "text" && (
        <p className="text-sm text-gray-800 whitespace-pre-wrap">
          {message.message}
        </p>
      )}

      {message.type === "image" && message.url && (
        <img
          src={message.url}
          alt="Sent"
          className="rounded-lg max-w-full h-auto"
          loading="lazy"
        />
      )}

      {message.type === "document" && message.url && (
        <a
          href={message.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-sm"
        >
          {message.filename || "View Document"}
        </a>
      )}

      <div className="flex justify-end text-xs text-gray-500 mt-1">
        <span>{timestamp}</span>
        {isOwn && <span className="ml-1">✔✔</span>}
      </div>
    </div>
  );
}

export default MessageBubble;
