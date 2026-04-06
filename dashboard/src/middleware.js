import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(req) {
  let supabaseResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://txjelclkegfbrzqlcrml.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4amVsY2xrZWdmYnJ6cWxjcm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU1ODQsImV4cCI6MjA5MDk4MTU4NH0.w9i_9l_T-iSYO7GMi7Wp0IDr5NXPC5szcY0T8vMb9K0",
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = req.nextUrl.clone();
  const isDashboard = url.pathname.startsWith("/dashboard");
  const isLogin = url.pathname.startsWith("/login");

  if (isDashboard && !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
