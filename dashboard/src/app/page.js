"use client";

import Link from "next/link";
import {
  Zap,
  MessageSquare,
  Users,
  Bell,
  BarChart3,
  ArrowLeft,
  Check,
  Bot,
  Clock,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "رد تلقائي ذكي",
    desc: "يرد على الكومنتات والرسائل بالعربي المصري كأنه موظف بشري حقيقي",
    color: "#818cf8",
  },
  {
    icon: Users,
    title: "اكتشاف العملاء",
    desc: "يكتشف أي حد مهتم ويقيّمه من 1 لـ 10 تلقائياً",
    color: "#34d399",
  },
  {
    icon: Bell,
    title: "إشعارات واتساب فورية",
    desc: "بيبعتلك كل Lead جديد على واتساب فوراً عشان ما تضيعش عميل",
    color: "#fbbf24",
  },
  {
    icon: BarChart3,
    title: "داشبورد وتحليلات",
    desc: "لوحة تحكم شاملة بإحصائيات ورسوم بيانية لكل حاجة بتحصل",
    color: "#f472b6",
  },
  {
    icon: Clock,
    title: "شغال 24/7",
    desc: "مفيش إجازات ولا مواعيد عمل — بيرد في أي وقت",
    color: "#22d3ee",
  },
  {
    icon: Shield,
    title: "آمن ومشفر",
    desc: "كل البيانات مشفرة وكل عميل يشوف بياناته بس",
    color: "#a78bfa",
  },
];

const plans = [
  {
    name: "Starter",
    price: "500",
    features: [
      "صفحة فيسبوك واحدة",
      "500 رد/شهر",
      "إشعارات واتساب",
      "داشبورد أساسي",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "1,000",
    features: [
      "صفحة فيسبوك واحدة",
      "ردود غير محدودة",
      "ملخص يومي",
      "داشبورد كامل",
      "تحليلات متقدمة",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: "2,000",
    features: [
      "حتى 3 صفحات",
      "ردود غير محدودة",
      "أولوية في الرد",
      "تقارير أسبوعية",
      "دعم فني مخصص",
    ],
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen hero-gradient">
      {/* Nav */}
      <nav className="flex items-center justify-between max-w-6xl mx-auto px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)" }}
          >
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold">AI Page Manager</h1>
            <p className="text-[11px] text-[#64748b]">مدير الصفحة الذكي</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="btn-primary text-[14px] flex items-center gap-2"
        >
          دخول لوحة التحكم
          <ArrowLeft size={16} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <div
          className="inline-block mb-6 px-4 py-1.5 rounded-full text-[13px] animate-fade-in"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.2)",
            color: "#818cf8",
          }}
        >
          <Bot size={14} className="inline ml-1" />
          مدعوم بـ Gemini 2.5 Flash
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in-up">
          مدير صفحة فيسبوك{" "}
          <span className="text-gradient">ذكي</span>
          <br />
          بيشتغل 24/7
        </h1>

        <p className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          بيرد على الكومنتات والرسائل بالمصري، بيكتشف العملاء المحتملين،
          وبيبعتلك إشعار على واتساب فوراً. كأنك عيّنت موظف بربع التمن.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <Link href="/dashboard" className="btn-primary text-[16px] px-8 py-3">
            جرّب مجاناً
            <ArrowLeft size={18} className="inline mr-2" />
          </Link>
          <button className="btn-secondary text-[16px] px-8 py-3">
            شوف الديمو
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          {[
            { value: "24/7", label: "شغال" },
            { value: "< 2 دقيقة", label: "متوسط الرد" },
            { value: "95%", label: "دقة الردود" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-bold text-gradient">{s.value}</p>
              <p className="text-[13px] text-[#64748b] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">ليه AI Page Manager؟</h2>
        <p className="text-center text-[#94a3b8] mb-12">كل اللي محتاجه عشان صفحتك تشتغل لوحدها</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="glass-card p-6 animate-fade-in-up"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feat.color}15`, border: `1px solid ${feat.color}22` }}
                >
                  <Icon size={24} style={{ color: feat.color }} />
                </div>
                <h3 className="text-[16px] font-bold mb-2">{feat.title}</h3>
                <p className="text-[14px] text-[#94a3b8] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">خطط الأسعار</h2>
        <p className="text-center text-[#94a3b8] mb-12">أرخص من مرتب موظف بكتير</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`glass-card p-6 animate-fade-in-up ${
                plan.popular ? "ring-2 ring-[#6366f1] relative" : ""
              }`}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 right-4 px-3 py-1 rounded-full text-[12px] font-bold"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                    color: "white",
                  }}
                >
                  الأكتر شعبية ⭐
                </span>
              )}
              <h3 className="text-[18px] font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gradient">{plan.price}</span>
                <span className="text-[14px] text-[#64748b] mr-1">ج.م/شهر</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-[14px] text-[#94a3b8]">
                    <Check size={16} className="text-[#34d399] flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-xl font-semibold text-[14px] transition-all ${
                  plan.popular
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                اشترك الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "rgba(99,102,241,0.1)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#818cf8]" />
            <span className="text-[14px] text-[#64748b]">AI Page Manager © 2026</span>
          </div>
          <p className="text-[13px] text-[#64748b]">
            صنع بـ ❤️ في مصر
          </p>
        </div>
      </footer>
    </div>
  );
}
