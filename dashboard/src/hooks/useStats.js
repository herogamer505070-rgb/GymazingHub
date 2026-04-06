"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useStats(businessId) {
  const [stats, setStats] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();

    // Leads today
    const { data: leadsToday } = await supabase
      .from("leads")
      .select("id, lead_score")
      .eq("business_id", businessId)
      .gte("created_at", todayStart);

    // Leads yesterday
    const { data: leadsYesterday } = await supabase
      .from("leads")
      .select("id, lead_score")
      .eq("business_id", businessId)
      .gte("created_at", yesterdayStart)
      .lt("created_at", todayStart);

    // Replies today (activity_log where event_type contains 'reply')
    const { data: repliesToday } = await supabase
      .from("activity_log")
      .select("id")
      .eq("business_id", businessId)
      .in("event_type", ["comment_reply", "message_reply"])
      .gte("created_at", todayStart);

    // Replies yesterday
    const { data: repliesYesterday } = await supabase
      .from("activity_log")
      .select("id")
      .eq("business_id", businessId)
      .in("event_type", ["comment_reply", "message_reply"])
      .gte("created_at", yesterdayStart)
      .lt("created_at", todayStart);

    // All leads for avg score
    const { data: allLeads } = await supabase
      .from("leads")
      .select("lead_score")
      .eq("business_id", businessId);

    const todayScores = (leadsToday || []).map((l) => l.lead_score).filter(Boolean);
    const yesterdayScores = (leadsYesterday || []).map((l) => l.lead_score).filter(Boolean);
    const avgToday = todayScores.length > 0 ? (todayScores.reduce((a, b) => a + b, 0) / todayScores.length).toFixed(1) : 0;
    const avgYesterday = yesterdayScores.length > 0 ? (yesterdayScores.reduce((a, b) => a + b, 0) / yesterdayScores.length).toFixed(1) : 0;

    setStats({
      leadsToday: (leadsToday || []).length,
      leadsYesterday: (leadsYesterday || []).length,
      repliesToday: (repliesToday || []).length,
      repliesYesterday: (repliesYesterday || []).length,
      avgLeadScore: parseFloat(avgToday) || 0,
      avgLeadScoreYesterday: parseFloat(avgYesterday) || 0,
      avgResponseTime: "0 دقيقة",
      avgResponseTimeYesterday: "0 دقيقة",
    });

    // Weekly activity — last 7 days
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const weekly = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);

      const { data: dayReplies } = await supabase
        .from("activity_log")
        .select("id")
        .eq("business_id", businessId)
        .in("event_type", ["comment_reply", "message_reply"])
        .gte("created_at", dayStart.toISOString())
        .lt("created_at", dayEnd.toISOString());

      const { data: dayLeads } = await supabase
        .from("leads")
        .select("id")
        .eq("business_id", businessId)
        .gte("created_at", dayStart.toISOString())
        .lt("created_at", dayEnd.toISOString());

      weekly.push({
        day: dayNames[dayStart.getDay()],
        replies: (dayReplies || []).length,
        leads: (dayLeads || []).length,
      });
    }
    setWeeklyActivity(weekly);
    setLoading(false);
  }, [businessId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, weeklyActivity, loading };
}
