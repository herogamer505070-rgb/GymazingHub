"use client";

import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main
          className="flex-1 mr-0 lg:mr-[280px] min-h-screen"
          style={{ background: "var(--color-bg-primary)" }}
        >
          <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
