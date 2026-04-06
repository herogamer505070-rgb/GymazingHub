"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useLeads(businessId) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    const { data, error: err } = await supabase
      .from("leads")
      .select("*")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (err) {
      setError(err);
    } else {
      // Map snake_case to camelCase to match existing component props
      setLeads(
        (data || []).map((l) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          source: l.source,
          interest: l.interest,
          leadScore: l.lead_score,
          status: l.status,
          createdAt: l.created_at,
          conversationLog: l.conversation_log,
          notifiedWhatsapp: l.notified_whatsapp,
        }))
      );
    }
    setLoading(false);
  }, [businessId]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return { leads, loading, error, refetch: fetchLeads };
}
