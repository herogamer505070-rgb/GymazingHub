"use client";

import { Bot, User, ExternalLink } from "lucide-react";
import { getScoreColor, getSourceBadge } from "@/lib/utils";

export default function ConversationPreview({ conversations, compact = false }) {
  const display = compact ? conversations.slice(0, 3) : conversations;

  return (
    <div className="glass-card-static p-5 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
      {compact && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-[#f1f5f9]">آخر المحادثات</h3>
          <a
            href="/dashboard/conversations"
            className="text-[13px] text-[#818cf8] hover:text-[#a78bfa] flex items-center gap-1 transition-colors"
          >
            عرض الكل
            <ExternalLink size={13} />
          </a>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {display.map((conv) => {
          const source = getSourceBadge(conv.platform);
          const scoreColor = getScoreColor(conv.leadScore);
          const lastUserMsg = conv.messages.filter((m) => m.sender === "user").pop();
          const lastAiMsg = conv.messages.filter((m) => m.sender === "ai").pop();

          return (
            <div
              key={conv.id}
              className="p-4 rounded-xl border transition-colors cursor-pointer"
              style={{
                background: "rgba(17,24,39,0.5)",
                borderColor: "rgba(99,102,241,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                e.currentTarget.style.background = "rgba(30,41,59,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.08)";
                e.currentTarget.style.background = "rgba(17,24,39,0.5)";
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${scoreColor}88, ${scoreColor}44)` }}
                  >
                    {conv.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#f1f5f9]">{conv.userName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge ${source.class}`} style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                        {source.label}
                      </span>
                      <span className="text-[11px] font-bold" style={{ color: scoreColor }}>
                        Score: {conv.leadScore}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-[#64748b]">
                  {lastUserMsg?.time}
                </span>
              </div>

              {/* Last exchange */}
              <div className="space-y-2">
                {lastUserMsg && (
                  <div className="flex items-start gap-2">
                    <User size={14} className="text-[#818cf8] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] text-[#94a3b8] line-clamp-1">
                      {lastUserMsg.text}
                    </p>
                  </div>
                )}
                {lastAiMsg && (
                  <div className="flex items-start gap-2">
                    <Bot size={14} className="text-[#34d399] mt-0.5 flex-shrink-0" />
                    <p className="text-[13px] text-[#94a3b8] line-clamp-2">
                      {lastAiMsg.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
