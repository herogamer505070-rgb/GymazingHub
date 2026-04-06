"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Zap,
  Bell,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "العملاء المحتملين", icon: Users },
  { href: "/dashboard/conversations", label: "المحادثات", icon: MessageSquare },
  { href: "/dashboard/analytics", label: "الإحصائيات", icon: BarChart3 },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 right-4 z-50 lg:hidden p-2 rounded-lg"
        style={{ background: "rgba(17,24,39,0.9)", border: "1px solid rgba(99,102,241,0.2)" }}
        aria-label="القائمة"
      >
        <Menu size={22} className="text-[#818cf8]" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${mobileOpen ? "open" : ""} ${collapsed ? "!w-[80px]" : ""}`}
        style={collapsed ? { width: 80 } : undefined}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-[rgba(99,102,241,0.1)]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
          >
            <Zap size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-[15px] font-bold text-[#f1f5f9]">Gymazing Hub</h1>
              <p className="text-[11px] text-[#64748b]">المدير الذكي</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!collapsed && <span className="text-[14px]">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto p-4 border-t border-[rgba(99,102,241,0.1)]">
          {/* Notification */}
          {!collapsed && (
            <div
              className="mb-3 p-3 rounded-xl text-[13px]"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Bell size={14} className="text-[#34d399]" />
                <span className="text-[#34d399] font-semibold">تنبيهات نشطة</span>
              </div>
              <p className="text-[#94a3b8] text-[12px]">النظام يعمل بكفاءة</p>
            </div>
          )}

          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center gap-2 w-full p-2 rounded-lg text-[13px] text-[#64748b] hover:text-[#94a3b8] hover:bg-[rgba(99,102,241,0.06)] transition-colors"
          >
            <ChevronLeft
              size={16}
              className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
            />
            {!collapsed && <span>طي القائمة</span>}
          </button>

          {/* User */}
          {!collapsed && (
            <div className="flex items-center gap-3 mt-3 p-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white uppercase"
                style={{ background: "linear-gradient(135deg, #6366f1, #f472b6)" }}
              >
                {user?.email?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#f1f5f9] truncate">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-[11px] text-[#64748b] truncate">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="text-[#64748b] hover:text-[#f87171] transition-colors" 
                title="تسجيل الخروج"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
