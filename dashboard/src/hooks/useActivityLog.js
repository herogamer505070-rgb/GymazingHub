"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useActivityLog(businessId) {
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityLog = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);

    const { data } = await supabase
      .from("activity_log")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(50);

    // Map to the shape expected by analytics page
    setActivityLog(
      (data || []).map((log) => ({
        id: log.id,
        type: log.event_type,
        platform: log.platform,
        user: log.user_name,
        model: log.ai_model,
        tokens: log.tokens_used,
        time: new Date(log.created_at).toLocaleTimeString("ar-EG", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      }))
    );
    setLoading(false);
  }, [businessId]);

  useEffect(() => {
    fetchActivityLog();
  }, [fetchActivityLog]);

  return { activityLog, loading };
}

export function useAnalyticsData(businessId) {
  const [sourceBreakdown, setSourceBreakdown] = useState([]);
  const [modelUsage, setModelUsage] = useState([]);
  const [monthlyLeads, setMonthlyLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);

    // Source breakdown
    const { data: allLeads } = await supabase
      .from("leads")
      .select("source")
      .eq("business_id", businessId);

    const sources = (allLeads || []).reduce((acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    }, {});
    const total = Object.values(sources).reduce((a, b) => a + b, 0) || 1;

    setSourceBreakdown([
      { name: "كومنتات", value: Math.round(((sources.comment || 0) / total) * 100), color: "#818cf8" },
      { name: "ماسنجر", value: Math.round(((sources.messenger || 0) / total) * 100), color: "#22d3ee" },
      { name: "انستجرام", value: Math.round(((sources.instagram || 0) / total) * 100), color: "#f472b6" },
    ]);

    // Model usage — last 7 days
    const now = new Date();
    const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const usage = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);

      const { data: dayLogs } = await supabase
        .from("activity_log")
        .select("ai_model")
        .eq("business_id", businessId)
        .in("event_type", ["comment_reply", "message_reply"])
        .gte("created_at", dayStart.toISOString())
        .lt("created_at", dayEnd.toISOString());

      const gemini = (dayLogs || []).filter((l) => l.ai_model && l.ai_model.includes("gemini")).length;
      const openrouter = (dayLogs || []).filter((l) => l.ai_model && !l.ai_model.includes("gemini")).length;

      usage.push({ day: dayNames[dayStart.getDay()], gemini, openrouter });
    }
    setModelUsage(usage);

    // Monthly leads — last 4 weeks
    const monthly = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (w + 1) * 7);
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - w * 7);

      const { data: weekLeads } = await supabase
        .from("leads")
        .select("id, status")
        .eq("business_id", businessId)
        .gte("created_at", weekStart.toISOString())
        .lt("created_at", weekEnd.toISOString());

      const converted = (weekLeads || []).filter((l) => l.status === "converted").length;
      monthly.push({
        week: `الأسبوع ${4 - w}`,
        leads: (weekLeads || []).length,
        converted,
      });
    }
    setMonthlyLeads(monthly);
    setLoading(false);
  }, [businessId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { sourceBreakdown, modelUsage, monthlyLeads, loading };
}
