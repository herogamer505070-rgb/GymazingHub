"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  User, 
  Lock, 
  ArrowLeft, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Trophy,
  Activity
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Success - Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message === 'Invalid login credentials' 
        ? 'بيانات الدخول غير صحيحة. تأكد من الإيميل والباسورد.' 
        : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    // For demo, we might use a specific public account
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'demo@gymazing.com',
        password: 'demo_password_123',
      });
      if (authError) throw authError;
      router.push('/dashboard');
    } catch (err) {
      setError('عذراً، نظام العرض (Demo) غير متاح حالياً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-inter flex items-center justify-center relative overflow-hidden p-6" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl flex items-center justify-center mb-4 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20 scale-110">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">GYMAZING</h1>
          <p className="text-slate-400 font-medium">أذكى نظام لإدارة صفحات الجيم والأكاديميات</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] border border-white/10 p-10 shadow-2xl ring-1 ring-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
          
          <form onSubmit={handleLogin} className="space-y-6 relative">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-medium flex items-center gap-3 animate-shake">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 mr-2 flex items-center gap-2">
                <User className="w-4 h-4" /> البريد الإلكتروني
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-lg"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mr-2">
                <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> كلمة المرور
                </label>
                <button type="button" className="text-xs text-indigo-400 font-bold hover:underline">نسيت كلمة المرور؟</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 text-lg"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl uppercase tracking-wider"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  جاري الدخول...
                </div>
              ) : "دخول المدير"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
            <button
              onClick={handleDemoAccess}
              className="group flex items-center gap-3 text-slate-400 hover:text-white font-bold transition-all text-sm px-6 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <Trophy className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              أو استكشف النظام بنسخة العرض (Demo)
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-10 text-slate-600 text-sm font-medium">
          © {new Date().getFullYear()} Gymazing HuB. جميع الحقوق محفوظة
        </p>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
