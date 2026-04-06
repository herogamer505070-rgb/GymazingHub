"use client";

import StatsCards from "@/components/StatsCards";
import ActivityChart from "@/components/ActivityChart";
import LeadsTable from "@/components/LeadsTable";
import ConversationPreview from "@/components/ConversationPreview";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useStats } from "@/hooks/useStats";
import { useLeads } from "@/hooks/useLeads";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/context/AuthContext";
import { Activity, Zap } from "lucide-react";

export default function DashboardPage() {
  const { businessId, user } = useAuth();
  
  const { stats, weeklyActivity, loading: statsLoading } = useStats(businessId);
  const { leads, loading: leadsLoading } = useLeads(businessId);
  const { conversations, loading: convsLoading } = useConversations(businessId);

  if (statsLoading || leadsLoading || convsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] flex items-center gap-2">
            <Zap size={24} className="text-[#818cf8]" />
            لوحة التحكم
          </h1>
          <p className="text-[14px] text-[#64748b] mt-1">مرحباً {user?.email?.split('@')[0] || 'بك'}، هنا ملخص أداء صفحتك اليوم</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <Activity size={14} className="text-[#34d399]" />
          <span className="text-[13px] text-[#34d399] font-medium">النظام شغال</span>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <StatsCards stats={stats} />}

      {/* Chart + Conversations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ActivityChart data={weeklyActivity} />
        </div>
        <div>
          <ConversationPreview conversations={conversations} compact />
        </div>
      </div>

      {/* Latest Leads */}
      <LeadsTable leads={leads} compact />
    </div>
  );
}
