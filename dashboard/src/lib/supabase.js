import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://txjelclkegfbrzqlcrml.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4amVsY2xrZWdmYnJ6cWxjcm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU1ODQsImV4cCI6MjA5MDk4MTU4NH0.w9i_9l_T-iSYO7GMi7Wp0IDr5NXPC5szcY0T8vMb9K0";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetches the first business_id linked to the current authenticated user's profile.
 */
export const getCurrentBusinessId = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;

  // We look for the business where user_id matches the authenticated user ID
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("user_id", session.user.id)
    .single();

  return business?.id || null;
};
