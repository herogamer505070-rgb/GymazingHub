"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useConversations(businessId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);

    // Fetch conversations with nested messages
    const { data, error: err } = await supabase
      .from("conversations")
      .select(`
        id,
        user_name,
        platform,
        lead_score,
        created_at,
        updated_at,
        messages (
          id,
          sender,
          text,
          time,
          ai_model,
          created_at
        )
      `)
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (err) {
      setError(err);
    } else {
      // Map to the shape expected by existing components
      setConversations(
        (data || []).map((c) => ({
          id: c.id,
          userName: c.user_name,
          platform: c.platform,
          leadScore: c.lead_score,
          messages: (c.messages || [])
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((m) => ({
              sender: m.sender,
              text: m.text,
              time: m.time,
              model: m.ai_model,
            })),
        }))
      );
    }
    setLoading(false);
  }, [businessId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations };
}
