"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { calcChange } from "@/lib/utils";

const cards = [
  {
    label: "عملاء محتملين اليوم",
    key: "leadsToday",
    prevKey: "leadsYesterday",
    icon: "🎯",
    cardClass: "stat-card-1",
  },
  {
    label: "إجمالي الردود اليوم",
    key: "repliesToday",
    prevKey: "repliesYesterday",
    icon: "💬",
    cardClass: "stat-card-2",
  },
  {
    label: "متوسط Lead Score",
    key: "avgLeadScore",
    prevKey: "avgLeadScoreYesterday",
    icon: "⭐",
    cardClass: "stat-card-3",
  },
  {
    label: "متوسط وقت الرد",
    key: "avgResponseTime",
    prevKey: "avgResponseTimeYesterday",
    icon: "⚡",
    cardClass: "stat-card-4",
    isText: true,
  },
];

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
      {cards.map((card, idx) => {
        const value = stats[card.key];
        const prev = stats[card.prevKey];
        const change = card.isText ? null : calcChange(value, prev);

        return (
          <div
            key={idx}
            className={`stat-card ${card.cardClass} animate-fade-in-up`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[13px] text-[#94a3b8] mb-1">{card.label}</p>
                <p className="text-3xl font-bold animate-count-up">{value}</p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>

            {change && (
              <div className="flex items-center gap-1.5">
                {change.positive ? (
                  <TrendingUp size={14} className="text-[#34d399]" />
                ) : (
                  <TrendingDown size={14} className="text-[#f87171]" />
                )}
                <span
                  className={`text-[13px] font-semibold ${
                    change.positive ? "text-[#34d399]" : "text-[#f87171]"
                  }`}
                >
                  {change.value}%
                </span>
                <span className="text-[12px] text-[#64748b]">من أمبارح</span>
              </div>
            )}

            {card.isText && (
              <p className="text-[13px] text-[#94a3b8]">
                أمبارح: {prev}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
