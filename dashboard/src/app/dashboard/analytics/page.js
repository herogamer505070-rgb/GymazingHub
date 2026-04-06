"use client";

import { useStats } from "@/hooks/useStats";
import { useActivityLog, useAnalyticsData } from "@/hooks/useActivityLog";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart3, TrendingUp, Target, Clock, Cpu, Activity } from "lucide-react";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-static p-3 text-[13px]" style={{ minWidth: 130 }}>
      <p className="font-semibold text-[#f1f5f9] mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-[#94a3b8]">{entry.name}:</span>
          <span className="text-[#f1f5f9] font-semibold">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// Response time data (static for now — would need a separate table to track)
const responseTimeData = [
  { hour: "8 ص", time: 0.8 },
  { hour: "10 ص", time: 1.0 },
  { hour: "12 م", time: 1.5 },
  { hour: "2 م", time: 1.2 },
  { hour: "4 م", time: 0.9 },
  { hour: "6 م", time: 1.1 },
  { hour: "8 م", time: 1.8 },
  { hour: "10 م", time: 2.0 },
];

export default function AnalyticsPage() {
  const { weeklyActivity, loading: statsLoading } = useStats(DEMO_BUSINESS_ID);
  const { activityLog, loading: logLoading } = useActivityLog(DEMO_BUSINESS_ID);
  const { sourceBreakdown, modelUsage, monthlyLeads, loading: analyticsLoading } = useAnalyticsData(DEMO_BUSINESS_ID);

  if (statsLoading || logLoading || analyticsLoading) return <LoadingSpinner />;

  const totalResponses = weeklyActivity.reduce((acc, d) => acc + d.replies, 0);
  const totalLeads = weeklyActivity.reduce((acc, d) => acc + d.leads, 0);
  const totalMonthlyLeads = monthlyLeads.reduce((a, w) => a + w.leads, 0) || 1;
  const totalConverted = monthlyLeads.reduce((a, w) => a + w.converted, 0);
  const conversionRate = Math.round((totalConverted / totalMonthlyLeads) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-[#f1f5f9] flex items-center gap-2">
          <BarChart3 size={24} className="text-[#818cf8]" />
          الإحصائيات والتحليلات
        </h1>
        <p className="text-[14px] text-[#64748b] mt-1">تحليل شامل لأداء المدير الذكي</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        <div className="stat-card stat-card-1 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.15)" }}>
              <Activity size={20} className="text-[#818cf8]" />
            </div>
            <div>
              <p className="text-[12px] text-[#94a3b8]">إجمالي الردود (7 أيام)</p>
              <p className="text-2xl font-bold">{totalResponses}</p>
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-2 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
              <Target size={20} className="text-[#34d399]" />
            </div>
            <div>
              <p className="text-[12px] text-[#94a3b8]">إجمالي الـ Leads (7 أيام)</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
          </div>
        </div>
        <div className="stat-card stat-card-3 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(244,114,182,0.15)" }}>
              <TrendingUp size={20} className="text-[#f472b6]" />
            </div>
            <div>
              <p className="text-[12px] text-[#94a3b8]">معدل التحويل (الشهر)</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Leads Trend */}
        <div className="glass-card-static p-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-[15px] font-bold text-[#f1f5f9] mb-1">تطور العملاء المحتملين</h3>
          <p className="text-[12px] text-[#64748b] mb-5">الـ Leads مقابل المحولين (شهرياً)</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyLeads} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="leads" name="عملاء محتملين" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar dataKey="converted" name="تم التحويل" fill="#34d399" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="glass-card-static p-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-[15px] font-bold text-[#f1f5f9] mb-1">مصادر العملاء</h3>
          <p className="text-[12px] text-[#64748b] mb-5">نسبة كل مصدر من إجمالي الـ Leads</p>
          <div className="flex items-center justify-center">
            <div style={{ width: 220, height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={sourceBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sourceBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mr-6 space-y-3">
              {sourceBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <div>
                    <p className="text-[14px] font-medium text-[#f1f5f9]">{item.name}</p>
                    <p className="text-[12px] text-[#64748b]">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Model Usage */}
        <div className="glass-card-static p-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={16} className="text-[#a78bfa]" />
            <h3 className="text-[15px] font-bold text-[#f1f5f9]">استخدام نماذج الـ AI</h3>
          </div>
          <p className="text-[12px] text-[#64748b] mb-5">Gemini مقابل OpenRouter (7 أيام)</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={modelUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="gemini" name="Gemini 2.5 Flash" stroke="#818cf8" fill="rgba(99,102,241,0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="openrouter" name="OpenRouter (Llama)" stroke="#f472b6" fill="rgba(244,114,182,0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time */}
        <div className="glass-card-static p-6 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-[#22d3ee]" />
            <h3 className="text-[15px] font-bold text-[#f1f5f9]">سرعة الرد (بالدقيقة)</h3>
          </div>
          <p className="text-[12px] text-[#64748b] mb-5">متوسط وقت الرد حسب الساعة</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} unit=" د" />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="time" name="وقت الرد" stroke="#22d3ee" strokeWidth={2.5} dot={{ fill: "#22d3ee", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#22d3ee", stroke: "#0a0e1a", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-card-static p-6 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
        <h3 className="text-[15px] font-bold text-[#f1f5f9] mb-4">سجل النشاط</h3>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>الحدث</th>
                <th>المنصة</th>
                <th>المستخدم</th>
                <th>النموذج</th>
                <th>التوكنز</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className={`badge ${
                      log.type === "lead_detected" ? "badge-converted" :
                      log.type === "comment_reply" ? "badge-comment" :
                      "badge-messenger"
                    }`}>
                      {log.type === "comment_reply" ? "رد كومنت" :
                       log.type === "message_reply" ? "رد رسالة" :
                       "Lead جديد"}
                    </span>
                  </td>
                  <td className="text-[13px] text-[#94a3b8]">{log.platform}</td>
                  <td className="text-[14px] font-medium">{log.user}</td>
                  <td>
                    <span className="text-[11px] px-2 py-0.5 rounded" style={{
                      background: log.model?.includes("gemini") ? "rgba(99,102,241,0.1)" : "rgba(244,114,182,0.1)",
                      color: log.model?.includes("gemini") ? "#818cf8" : "#f472b6",
                    }}>
                      {log.model}
                    </span>
                  </td>
                  <td className="text-[13px] text-[#94a3b8]">{log.tokens || "—"}</td>
                  <td className="text-[13px] text-[#64748b]">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
