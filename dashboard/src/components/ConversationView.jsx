"use client";

import { Bot, User } from "lucide-react";

export default function ConversationView({ conversation }) {
  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-[#64748b] text-[15px]">
        اختر محادثة لعرضها
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              {msg.sender === "ai" && (
                <div className="w-7 h-7 rounded-full bg-[rgba(52,211,153,0.15)] flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-[#34d399]" />
                </div>
              )}

              <div>
                <div
                  className={
                    msg.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                  }
                >
                  <p className="text-[14px] leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 mt-1 px-1 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-[11px] text-[#64748b]">{msg.time}</span>
                  {msg.model && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(99,102,241,0.1)",
                        color: "#818cf8",
                      }}
                    >
                      {msg.model}
                    </span>
                  )}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-full bg-[rgba(99,102,241,0.15)] flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={14} className="text-[#818cf8]" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
