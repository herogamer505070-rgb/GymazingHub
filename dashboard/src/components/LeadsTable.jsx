"use client";

import { getScoreColor, getStatusBadge, getSourceBadge, formatDate } from "@/lib/utils";
import { Phone, User, ExternalLink } from "lucide-react";

export default function LeadsTable({ leads, compact = false }) {
  const displayLeads = compact ? leads.slice(0, 5) : leads;

  return (
    <div className={`glass-card-static ${compact ? "p-5" : "p-6"} animate-fade-in-up`} style={{ animationDelay: "300ms" }}>
      {compact && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#f1f5f9]">آخر العملاء المحتملين</h3>
            <a
              href="/dashboard/leads"
              className="text-[13px] text-[#818cf8] hover:text-[#a78bfa] flex items-center gap-1 transition-colors"
            >
              عرض الكل
              <ExternalLink size={13} />
            </a>
          </div>
        </>
      )}

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>المصدر</th>
              <th>الاهتمام</th>
              <th>Lead Score</th>
              <th>الحالة</th>
              <th>{compact ? "الوقت" : "التاريخ"}</th>
              {!compact && <th>الهاتف</th>}
            </tr>
          </thead>
          <tbody>
            {displayLeads.map((lead) => {
              const status = getStatusBadge(lead.status);
              const source = getSourceBadge(lead.source);
              const scoreColor = getScoreColor(lead.leadScore);

              return (
                <tr key={lead.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${scoreColor}66, ${scoreColor}33)`,
                          border: `1px solid ${scoreColor}44`,
                        }}
                      >
                        {lead.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[14px]">{lead.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${source.class}`}>{source.label}</span>
                  </td>
                  <td>
                    <span className="text-[13px] text-[#94a3b8] block max-w-[200px] truncate">
                      {lead.interest}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(10)].map((_, i) => (
                          <span
                            key={i}
                            className="score-dot"
                            style={{
                              background:
                                i < lead.leadScore ? scoreColor : "rgba(100,116,139,0.2)",
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: scoreColor }}
                      >
                        {lead.leadScore}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${status.class}`}>{status.label}</span>
                  </td>
                  <td className="text-[13px] text-[#94a3b8] whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </td>
                  {!compact && (
                    <td>
                      {lead.phone ? (
                        <span className="flex items-center gap-1 text-[13px] text-[#22d3ee]">
                          <Phone size={12} />
                          {lead.phone}
                        </span>
                      ) : (
                        <span className="text-[13px] text-[#64748b]">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
