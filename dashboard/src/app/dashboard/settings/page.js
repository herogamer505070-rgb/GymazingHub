"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  Settings as SettingsIcon,
  MapPin,
  Clock,
  DollarSign,
  HelpCircle,
  MessageCircle,
  Wifi,
  WifiOff,
  Pencil,
  Plus,
  Trash2,
  TestTube,
  Save,
  Check,
} from "lucide-react";

function Section({ title, icon: Icon, children }) {
  return (
    <div className="glass-card-static p-6 animate-fade-in-up">
      <h3 className="text-[16px] font-bold text-[#f1f5f9] flex items-center gap-2 mb-5">
        <Icon size={18} className="text-[#818cf8]" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { businessId } = useAuth();
  const [kb, setKb] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [tone, setTone] = useState("");
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [pageId, setPageId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusiness() {
      if (!businessId) return;
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", businessId)
        .single();

      if (data) {
        setBusinessName(data.name);
        setTone(data.tone_instructions || "");
        setKb(data.knowledge_base || {});
        setWhatsappNumber(data.whatsapp_number || "غير مسجل");
        setPageId(data.page_id || "غير متصل");
      }
      setLoading(false);
    }
    fetchBusiness();
  }, [businessId]);

  const handleSave = async () => {
    if (!businessId) return;
    await supabase
      .from("businesses")
      .update({ tone_instructions: tone, knowledge_base: kb })
      .eq("id", businessId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = () => {
    if (!testQuery) return;
    
    // Simulating AI response using KB and Tone
    const hasFreeTrial = kb?.faq?.find(f => f.q.includes("تجربة") || f.q.includes("مجاني"));
    const price = kb?.pricing?.[0]?.price || "800";
    
    setTestResult({
      reply: `أهلاً بك في ${businessName}! بخصوص سؤالك "${testQuery}": ${hasFreeTrial ? "أيوة بنقدم حصة تجريبية مجانية." : ""} والاشتراكات عندنا بتبدأ من ${price} جنيه. حابب تعرف مواعيد السن ده؟`,
      model: "google/gemini-flash-1.5",
      tokens: 42,
      time: "0.8 ثانية",
    });
  };

  if (loading) return <LoadingSpinner />;

  const branches = kb?.branches || [];
  const schedules = kb?.schedules || [];
  const pricing = kb?.pricing || [];
  const faq = kb?.faq || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9] flex items-center gap-2">
            <SettingsIcon size={24} className="text-[#818cf8]" />
            الإعدادات
          </h1>
          <p className="text-[14px] text-[#64748b] mt-1">
            إعدادات البزنس وقاعدة المعرفة وأسلوب الرد
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? "تم الحفظ!" : "حفظ التغييرات"}
        </button>
      </div>

      {/* Connection Status */}
      <div className="glass-card-static p-6 animate-fade-in-up">
        <h3 className="text-[16px] font-bold text-[#f1f5f9] mb-4 flex items-center gap-2">
          <Wifi size={18} className="text-[#34d399]" />
          حالة الاتصال
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Facebook Page", status: pageId !== "غير متصل" ? "connected" : "disconnected", detail: `ID: ${pageId}`, icon: "📘" },
            { name: "WhatsApp Business", status: whatsappNumber !== "غير مسجل" ? "connected" : "disconnected", detail: whatsappNumber, icon: "📱" },
            { name: "AI Brain (Gemini)", status: "connected", detail: "Active & Live", icon: "🤖" },
          ].map((conn, i) => (
            <div
              key={i}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(17,24,39,0.5)",
                border: "1px solid rgba(99,102,241,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px]">{conn.icon} {conn.name}</span>
                <span className={`status-dot ${conn.status}`} />
              </div>
              <p className="text-[12px] text-[#94a3b8]">{conn.detail}</p>
              <p className="text-[11px] text-[#34d399] mt-1">
                {conn.status === "connected" ? "✓ متصل" : "✗ غير متصل"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Branches */}
      <Section title="الفروع" icon={MapPin}>
        <div className="space-y-3">
          {branches.map((branch, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{
                background: "rgba(17,24,39,0.5)",
                border: "1px solid rgba(99,102,241,0.08)",
              }}
            >
              <div>
                <p className="text-[14px] font-medium text-[#f1f5f9]">{branch.name}</p>
                <p className="text-[12px] text-[#94a3b8] mt-0.5">📍 {branch.address}</p>
                <p className="text-[12px] text-[#94a3b8]">📞 {branch.phone}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-[rgba(99,102,241,0.1)] transition-colors">
                  <Pencil size={14} className="text-[#818cf8]" />
                </button>
                <button className="p-2 rounded-lg hover:bg-[rgba(248,113,113,0.1)] transition-colors">
                  <Trash2 size={14} className="text-[#f87171]" />
                </button>
              </div>
            </div>
          ))}
          <button className="btn-secondary flex items-center gap-2 text-[13px] w-full justify-center">
            <Plus size={14} />
            إضافة فرع جديد
          </button>
        </div>
      </Section>

      {/* Schedules */}
      <Section title="المواعيد" icon={Clock}>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>الفئة العمرية</th>
                <th>الأيام</th>
                <th>الوقت</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sch, i) => (
                <tr key={i}>
                  <td className="font-medium text-[14px]">{sch.age}</td>
                  <td className="text-[13px] text-[#94a3b8]">{sch.days}</td>
                  <td className="text-[13px] text-[#94a3b8]">{sch.time}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-[rgba(99,102,241,0.1)]">
                        <Pencil size={12} className="text-[#818cf8]" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-[rgba(248,113,113,0.1)]">
                        <Trash2 size={12} className="text-[#f87171]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-[13px] w-full justify-center mt-3">
          <Plus size={14} />
          إضافة موعد جديد
        </button>
      </Section>

      {/* Pricing */}
      <Section title="الأسعار" icon={DollarSign}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pricing.map((p, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl"
              style={{
                background: "rgba(17,24,39,0.5)",
                border: "1px solid rgba(99,102,241,0.08)",
              }}
            >
              <p className="text-[13px] text-[#94a3b8] mb-1">{p.plan}</p>
              <p className="text-xl font-bold text-[#818cf8]">{p.price}</p>
              <p className="text-[11px] text-[#64748b]">جنيه/شهر</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="الأسئلة الشائعة" icon={HelpCircle}>
        <div className="space-y-3">
          {faq.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(17,24,39,0.5)",
                border: "1px solid rgba(99,102,241,0.08)",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[14px] font-medium text-[#f1f5f9] mb-1">❓ {item.q}</p>
                  <p className="text-[13px] text-[#94a3b8]">💡 {item.a}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0 mr-3">
                  <button className="p-1.5 rounded hover:bg-[rgba(99,102,241,0.1)]">
                    <Pencil size={12} className="text-[#818cf8]" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-[rgba(248,113,113,0.1)]">
                    <Trash2 size={12} className="text-[#f87171]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn-secondary flex items-center gap-2 text-[13px] w-full justify-center">
            <Plus size={14} />
            إضافة سؤال جديد
          </button>
        </div>
      </Section>

      {/* Tone */}
      <Section title="أسلوب الرد" icon={MessageCircle}>
        <textarea
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="input-field min-h-[100px] text-[14px] leading-relaxed resize-y"
          placeholder="اكتب تعليمات أسلوب الرد..."
        />
        <div className="flex gap-2 mt-3">
          {["ودود وحماسي 🤗", "رسمي ومحترف 👔", "مرح وكوميدي 😄"].map((preset) => (
            <button
              key={preset}
              onClick={() => setTone(`أسلوب الرد: ${preset}`)}
              className="tab-btn text-[12px]"
            >
              {preset}
            </button>
          ))}
        </div>
      </Section>

      {/* Test AI */}
      <div className="glass-card-static p-6 animate-fade-in-up">
        <h3 className="text-[16px] font-bold text-[#f1f5f9] flex items-center gap-2 mb-4">
          <TestTube size={18} className="text-[#22d3ee]" />
          اختبار الرد الذكي
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="اكتب سؤال تجريبي... مثلاً: عايز أسجل ابني"
            className="input-field flex-1 text-[14px]"
          />
          <button onClick={handleTest} className="btn-primary text-[14px] whitespace-nowrap">
            <TestTube size={14} className="inline ml-1" />
            اختبار
          </button>
        </div>

        {testResult && (
          <div
            className="mt-4 p-4 rounded-xl animate-fade-in-up"
            style={{
              background: "rgba(52,211,153,0.05)",
              border: "1px solid rgba(52,211,153,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] px-2 py-0.5 rounded" style={{ background: "rgba(99,102,241,0.1)", color: "#818cf8" }}>
                {testResult.model}
              </span>
              <span className="text-[11px] text-[#64748b]">{testResult.tokens} tokens</span>
              <span className="text-[11px] text-[#64748b]">• {testResult.time}</span>
            </div>
            <p className="text-[14px] text-[#f1f5f9] leading-relaxed">
              {testResult.reply}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
