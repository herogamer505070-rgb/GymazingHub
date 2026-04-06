"use client";

import { useState } from "react";
import { useLeads } from "@/hooks/useLeads";
import { useAuth } from "@/context/AuthContext";
import { getScoreColor, getStatusBadge, getSourceBadge, formatDate } from "@/lib/utils";
import LeadScoreGauge from "@/components/LeadScoreGauge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Users, Search, Filter, Phone, MessageSquare, Download } from "lucide-react";

const statusFilters = [
  { key: "all", label: "الكل" },
  { key: "new", label: "جديد" },
  { key: "contacted", label: "تم التواصل" },
  { key: "converted", label: "تم التحويل" },
  { key: "lost", label: "مفقود" },
];

export default function LeadsPage() {
  const { businessId } = useAuth();
  const { leads: allLeads, loading } = useLeads(businessId);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  if (loading) return <LoadingSpinner />;

  const filtered = allLeads
    .filter((l) => filter === "all" || l.status === filter)
    .filter(
      (l) =>
        !search ||
        l.name.includes(search) ||
        l.interest.includes(search) ||
        (l.phone && l.phone.includes(search))
    );

  const counts = {
    all: allLeads.length,
    new: allLeads.filter((l) => l.status === "new").length,
    contacted: allLeads.filter((l) => l.status === "contacted").length,
    converted: allLeads.filter((l) => l.status === "converted").length,
    lost: allLeads.filter((l) => l.status === "lost").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] flex items-center gap-2">
            <Users size={24} className="text-[#818cf8]" />
            العملاء المحتملين
          </h1>
          <p className="text-[14px] text-[#64748b] mt-1">
            إجمالي {allLeads.length} عميل محتمل
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-[14px]">
          <Download size={16} />
          تصدير
        </button>
      </div>

      {/* Filters & Search */}
      <div className="glass-card-static p-4 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Status filters */}
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map((sf) => (
              <button
                key={sf.key}
                onClick={() => setFilter(sf.key)}
                className={`tab-btn ${filter === sf.key ? "active" : ""}`}
              >
                {sf.label}
                <span className="mr-1 text-[11px] opacity-60">({counts[sf.key]})</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الاهتمام أو الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pr-9"
            />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-card-static p-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>المصدر</th>
                <th>الاهتمام</th>
                <th>Lead Score</th>
                <th>الحالة</th>
                <th>الهاتف</th>
                <th>التاريخ</th>
                <th>ملخص المحادثة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const status = getStatusBadge(lead.status);
                const source = getSourceBadge(lead.source);

                return (
                  <tr key={lead.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <LeadScoreGauge score={lead.leadScore} size={40} />
                        <span className="font-semibold text-[14px]">{lead.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${source.class}`}>{source.label}</span>
                    </td>
                    <td>
                      <span className="text-[13px] text-[#94a3b8] block max-w-[220px]">
                        {lead.interest}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-[18px] font-bold"
                        style={{ color: getScoreColor(lead.leadScore) }}
                      >
                        {lead.leadScore}/10
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${status.class}`}>{status.label}</span>
                    </td>
                    <td>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1 text-[13px] text-[#22d3ee] hover:text-[#67e8f9] transition-colors"
                        >
                          <Phone size={12} />
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-[13px] text-[#64748b]">غير متاح</span>
                      )}
                    </td>
                    <td className="text-[13px] text-[#94a3b8] whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td>
                      <span className="text-[12px] text-[#64748b] block max-w-[200px] truncate">
                        {lead.conversationLog}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Filter size={40} className="text-[#64748b] mx-auto mb-3 opacity-40" />
            <p className="text-[#64748b] text-[15px]">مفيش نتائج تطابق البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
