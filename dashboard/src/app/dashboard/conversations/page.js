"use client";

import { useState, useEffect } from "react";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/context/AuthContext";
import ConversationView from "@/components/ConversationView";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getSourceBadge, getScoreColor } from "@/lib/utils";
import { MessageSquare, Bot, User } from "lucide-react";

export default function ConversationsPage() {
  const { businessId } = useAuth();
  const { conversations, loading } = useConversations(businessId);
  const [selected, setSelected] = useState(null);

  // Auto-select first conversation when data loads
  useEffect(() => {
    if (conversations.length > 0 && !selected) {
      setSelected(conversations[0]);
    }
  }, [conversations, selected]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-[#f1f5f9] flex items-center gap-2">
          <MessageSquare size={24} className="text-[#818cf8]" />
          المحادثات
        </h1>
        <p className="text-[14px] text-[#64748b] mt-1">
          كل المحادثات مع العملاء على فيسبوك وماسنجر وانستجرام
        </p>
      </div>

      {/* Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 animate-fade-in-up" style={{ height: "calc(100vh - 200px)" }}>
        {/* Conversation List */}
        <div className="lg:col-span-4 glass-card-static overflow-y-auto">
          <div className="p-4 border-b" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
            <input
              type="text"
              placeholder="ابحث في المحادثات..."
              className="input-field text-[14px]"
            />
          </div>

          <div className="p-2">
            {conversations.map((conv) => {
              const source = getSourceBadge(conv.platform);
              const scoreColor = getScoreColor(conv.leadScore);
              const isActive = selected?.id === conv.id;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv)}
                  className={`w-full text-right p-3 rounded-xl mb-1 transition-all ${
                    isActive
                      ? "border"
                      : "hover:bg-[rgba(99,102,241,0.05)]"
                  }`}
                  style={{
                    background: isActive ? "rgba(99,102,241,0.08)" : "transparent",
                    borderColor: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${scoreColor}88, ${scoreColor}44)`,
                      }}
                    >
                      {conv.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-[14px] text-[#f1f5f9]">
                          {conv.userName}
                        </span>
                        <span className="text-[11px] text-[#64748b]">{lastMsg?.time}</span>
                      </div>
                      <p className="text-[12px] text-[#94a3b8] truncate mb-1">
                        {lastMsg?.text?.slice(0, 50)}...
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge ${source.class}`}
                          style={{ fontSize: "0.65rem", padding: "1px 5px" }}
                        >
                          {source.label}
                        </span>
                        <span className="text-[10px] font-bold" style={{ color: scoreColor }}>
                          {conv.leadScore}/10
                        </span>
                        <span className="text-[10px] text-[#64748b]">
                          {conv.messages.length} رسائل
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat View */}
        <div className="lg:col-span-8 glass-card-static flex flex-col overflow-hidden">
          {/* Chat Header */}
          {selected && (
            <div
              className="p-4 flex items-center justify-between border-b"
              style={{ borderColor: "rgba(99,102,241,0.1)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${getScoreColor(selected.leadScore)}88, ${getScoreColor(selected.leadScore)}44)`,
                  }}
                >
                  {selected.userName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-[#f1f5f9]">{selected.userName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`badge ${getSourceBadge(selected.platform).class}`} style={{ fontSize: "0.7rem" }}>
                      {getSourceBadge(selected.platform).label}
                    </span>
                    <span className="text-[12px] font-bold" style={{ color: getScoreColor(selected.leadScore) }}>
                      Score: {selected.leadScore}/10
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#64748b]">
                <Bot size={14} className="text-[#34d399]" />
                <span>AI يرد تلقائياً</span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <ConversationView conversation={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}
