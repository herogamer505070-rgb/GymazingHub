// ═══════════════════════════════════════════════════
// Mock Data — AI Page Manager Dashboard
// ═══════════════════════════════════════════════════

export const stats = {
  leadsToday: 12,
  leadsYesterday: 8,
  repliesToday: 47,
  repliesYesterday: 38,
  avgLeadScore: 7.4,
  avgLeadScoreYesterday: 6.9,
  avgResponseTime: "1.2 دقيقة",
  avgResponseTimeYesterday: "2.1 دقيقة",
};

export const weeklyActivity = [
  { day: "السبت", replies: 32, leads: 5 },
  { day: "الأحد", replies: 45, leads: 8 },
  { day: "الاثنين", replies: 38, leads: 6 },
  { day: "الثلاثاء", replies: 52, leads: 11 },
  { day: "الأربعاء", replies: 41, leads: 9 },
  { day: "الخميس", replies: 47, leads: 12 },
  { day: "الجمعة", replies: 29, leads: 7 },
];

export const monthlyLeads = [
  { week: "الأسبوع 1", leads: 28, converted: 12 },
  { week: "الأسبوع 2", leads: 35, converted: 18 },
  { week: "الأسبوع 3", leads: 42, converted: 22 },
  { week: "الأسبوع 4", leads: 51, converted: 29 },
];

export const sourceBreakdown = [
  { name: "كومنتات", value: 45, color: "#818cf8" },
  { name: "ماسنجر", value: 38, color: "#22d3ee" },
  { name: "انستجرام", value: 17, color: "#f472b6" },
];

export const leads = [
  {
    id: 1,
    name: "أحمد محمود",
    phone: "01012345678",
    source: "comment",
    interest: "ابنه 6 سنين عايز يسجل جمباز",
    leadScore: 9,
    status: "new",
    createdAt: "2026-04-05T14:30:00",
    conversationLog: "سأل عن مواعيد الحصص والأسعار",
  },
  {
    id: 2,
    name: "سارة عبدالله",
    phone: "01098765432",
    source: "messenger",
    interest: "بنتها 4 سنين، عايزة تعرف المواعيد",
    leadScore: 8,
    status: "contacted",
    createdAt: "2026-04-05T13:15:00",
    conversationLog: "اتواصلنا معاها وبعتنا المواعيد",
  },
  {
    id: 3,
    name: "محمد حسن",
    phone: "01155566677",
    source: "comment",
    interest: "عايز يعرف الفروع القريبة",
    leadScore: 7,
    status: "new",
    createdAt: "2026-04-05T12:00:00",
    conversationLog: "سأل عن فرع مدينة نصر",
  },
  {
    id: 4,
    name: "نورهان أحمد",
    phone: "01234567890",
    source: "messenger",
    interest: "عايزة تسجل ابنها في الصيفي",
    leadScore: 9,
    status: "converted",
    createdAt: "2026-04-04T18:45:00",
    conversationLog: "سجلت وحجزت أول حصة",
  },
  {
    id: 5,
    name: "كريم وليد",
    phone: "01188899900",
    source: "instagram",
    interest: "استفسار عن التمارين المتاحة",
    leadScore: 5,
    status: "new",
    createdAt: "2026-04-04T16:20:00",
    conversationLog: "سأل سؤال عام عن الأنشطة",
  },
  {
    id: 6,
    name: "فاطمة علي",
    phone: "01066677788",
    source: "comment",
    interest: "بنتها 8 سنين، عايزة تعرف الأسعار",
    leadScore: 8,
    status: "contacted",
    createdAt: "2026-04-04T14:10:00",
    conversationLog: "بعتنالها عرض الـ 3 شهور",
  },
  {
    id: 7,
    name: "يوسف إبراهيم",
    phone: null,
    source: "comment",
    interest: "سأل لو فيه تجربة مجانية",
    leadScore: 6,
    status: "new",
    createdAt: "2026-04-04T11:30:00",
    conversationLog: "اترد عليه إن أول حصة مجانية",
  },
  {
    id: 8,
    name: "مريم حسام",
    phone: "01277788899",
    source: "messenger",
    interest: "عايزة تسجل توأمها",
    leadScore: 10,
    status: "converted",
    createdAt: "2026-04-03T20:00:00",
    conversationLog: "سجلت التوأم وحجزت حصتين",
  },
  {
    id: 9,
    name: "عمر طارق",
    phone: "01199900011",
    source: "instagram",
    interest: "عايز يعرف لو فيه كلاسات للكبار",
    leadScore: 4,
    status: "lost",
    createdAt: "2026-04-03T15:00:00",
    conversationLog: "مفيش كلاسات للكبار حالياً",
  },
  {
    id: 10,
    name: "هنا محمد",
    phone: "01055544433",
    source: "comment",
    interest: "عايزة تعرف مواعيد فرع الشيخ زايد",
    leadScore: 7,
    status: "contacted",
    createdAt: "2026-04-03T10:00:00",
    conversationLog: "بعتنالها مواعيد فرع الشيخ زايد",
  },
];

export const conversations = [
  {
    id: 1,
    userName: "أحمد محمود",
    platform: "comment",
    leadScore: 9,
    messages: [
      {
        sender: "user",
        text: "السلام عليكم، ابني عنده 6 سنين وعايز أسجله جمباز. إيه المواعيد المتاحة؟",
        time: "2:30 م",
      },
      {
        sender: "ai",
        text: "وعليكم السلام يا أحمد! 🤸 أهلاً بيك وبابنك في أكاديمية الجمباز!\n\nلسن 6 سنين عندنا مجموعات ممتازة:\n📅 السبت والثلاثاء: 4-5 مساءً\n📅 الأحد والأربعاء: 5-6 مساءً\n\n📍 فرع مدينة نصر أو الشيخ زايد\n\nأول حصة تجريبية مجانية! 🎉\nعايز تحجز تجربة؟",
        time: "2:30 م",
        model: "gemini-2.5-flash",
      },
      {
        sender: "user",
        text: "تمام جداً! عايز أحجز يوم السبت الجاي في مدينة نصر",
        time: "2:35 م",
      },
      {
        sender: "ai",
        text: "ممتاز يا أحمد! 🎯 تم الحجز ليوم السبت الجاي الساعة 4 مساءً في فرع مدينة نصر.\n\nممكن تبعتلي رقمك عشان نبعتلك التفاصيل على الواتساب؟ 📱",
        time: "2:35 م",
        model: "gemini-2.5-flash",
      },
      {
        sender: "user",
        text: "01012345678",
        time: "2:38 م",
      },
      {
        sender: "ai",
        text: "تمام يا أحمد! ✅ هنبعتلك كل التفاصيل على الواتساب.\n\nمستنينك أنت وابنك يوم السبت! 🤸‍♂️💪",
        time: "2:38 م",
        model: "gemini-2.5-flash",
      },
    ],
  },
  {
    id: 2,
    userName: "سارة عبدالله",
    platform: "messenger",
    leadScore: 8,
    messages: [
      {
        sender: "user",
        text: "مساء الخير، بنتي عندها 4 سنين ونص. فيه كلاسات مناسبة لسنها؟",
        time: "1:15 م",
      },
      {
        sender: "ai",
        text: "مساء النور يا سارة! 🌟\n\nطبعاً! عندنا مجموعة \"الأبطال الصغيرين\" لسن 4-6 سنين.\n\n🕐 المواعيد:\n• السبت والثلاثاء: 3-4 عصراً\n• الأحد والأربعاء: 4-5 عصراً\n\n💰 الاشتراك الشهري: 800 جنيه\n🎁 عرض 3 شهور: 2000 جنيه (توفير 400 جنيه!)\n\nعايزة تحجزي حصة تجريبية مجانية؟ 😊",
        time: "1:15 م",
        model: "gemini-2.5-flash",
      },
      {
        sender: "user",
        text: "أيوا ممكن أحجز الأربعاء الجاي؟ وفين بالظبط في الشيخ زايد؟",
        time: "1:22 م",
      },
      {
        sender: "ai",
        text: "تمام يا سارة! 📍 فرع الشيخ زايد:\nمول العرب - الدور التاني - بجوار كيدز إريا\n\n✅ محجوزلك يوم الأربعاء الساعة 4 مساءً.\n\nاحضري ملابس رياضية مريحة وجوارب. البنوتة هتنبسط جداً إن شاء الله! 🤸‍♀️",
        time: "1:22 م",
        model: "gemini-2.5-flash",
      },
    ],
  },
  {
    id: 3,
    userName: "محمد حسن",
    platform: "comment",
    leadScore: 7,
    messages: [
      {
        sender: "user",
        text: "فين فروعكم؟ أنا في مدينة نصر",
        time: "12:00 م",
      },
      {
        sender: "ai",
        text: "أهلاً يا محمد! 💪\n\nعندنا فرعين:\n📍 مدينة نصر - شارع عباس العقاد (قريب منك!)\n📍 الشيخ زايد - مول العرب\n\nالفرع قريب منك! عايز تعرف المواعيد والأسعار؟ 🤸",
        time: "12:00 م",
        model: "gemini-2.5-flash",
      },
    ],
  },
  {
    id: 4,
    userName: "نورهان أحمد",
    platform: "messenger",
    leadScore: 9,
    messages: [
      {
        sender: "user",
        text: "أنا عايزة أسجل ابني في كورس صيفي. فيه حاجة كده؟",
        time: "6:45 م",
      },
      {
        sender: "ai",
        text: "أهلاً يا نورهان! 🌞\n\nأيوا! الكورس الصيفي بيبدأ من يونيو:\n\n🏖️ الكورس الصيفي المكثف:\n• 3 أيام في الأسبوع (سبت/اثنين/أربعاء)\n• ساعتين يومياً (10 صباحاً - 12 ظهراً)\n• مدة الكورس: شهرين\n• السعر: 3000 جنيه شامل الزي\n\n🎁 خصم 20% لو سجلتي قبل نهاية أبريل!\n\nابنك عنده كام سنة؟",
        time: "6:45 م",
        model: "gemini-2.5-flash",
      },
      {
        sender: "user",
        text: "عنده 7 سنين. عايزة أسجله وعايزة أستفيد من العرض",
        time: "6:50 م",
      },
      {
        sender: "ai",
        text: "ممتاز يا نورهان! 7 سنين سن مثالي للجمباز 🤸‍♂️\n\n✅ تم تسجيل اهتمامك بالكورس الصيفي.\n\nممكن تبعتيلي:\n1. اسم ابنك\n2. رقمك للتواصل\n\nعشان نبعتلك تفاصيل التسجيل والدفع 📱",
        time: "6:50 م",
        model: "gemini-2.5-flash",
      },
    ],
  },
  {
    id: 5,
    userName: "كريم وليد",
    platform: "instagram",
    leadScore: 5,
    messages: [
      {
        sender: "user",
        text: "إيه الرياضات المتاحة عندكم غير الجمباز؟",
        time: "4:20 م",
      },
      {
        sender: "ai",
        text: "أهلاً يا كريم! 🏋️\n\nإحنا متخصصين في الجمباز بس بنقدم:\n• جمباز فني 🤸\n• جمباز إيقاعي 🎀\n• أيروبكس للأطفال 💃\n• تمارين مرونة ولياقة 💪\n\nعايز تعرف تفاصيل أكتر عن أي نوع؟",
        time: "4:20 م",
        model: "llama-3.3-70b",
      },
    ],
  },
];

export const activityLog = [
  { id: 1, type: "comment_reply", platform: "Facebook", user: "أحمد محمود", model: "gemini-2.5-flash", tokens: 245, time: "2:38 م" },
  { id: 2, type: "lead_detected", platform: "Facebook", user: "أحمد محمود", model: "gemini-2.5-flash", tokens: 0, time: "2:38 م" },
  { id: 3, type: "message_reply", platform: "Messenger", user: "سارة عبدالله", model: "gemini-2.5-flash", tokens: 312, time: "1:22 م" },
  { id: 4, type: "comment_reply", platform: "Facebook", user: "محمد حسن", model: "gemini-2.5-flash", tokens: 198, time: "12:00 م" },
  { id: 5, type: "message_reply", platform: "Messenger", user: "نورهان أحمد", model: "gemini-2.5-flash", tokens: 287, time: "6:50 م" },
  { id: 6, type: "lead_detected", platform: "Messenger", user: "نورهان أحمد", model: "gemini-2.5-flash", tokens: 0, time: "6:50 م" },
  { id: 7, type: "message_reply", platform: "Instagram", user: "كريم وليد", model: "llama-3.3-70b", tokens: 178, time: "4:20 م" },
  { id: 8, type: "comment_reply", platform: "Facebook", user: "فاطمة علي", model: "gemini-2.5-flash", tokens: 220, time: "2:10 م" },
];

export const knowledgeBase = {
  businessName: "أكاديمية الجمباز",
  category: "أكاديمية رياضة",
  branches: [
    { name: "فرع مدينة نصر", address: "شارع عباس العقاد، مدينة نصر", phone: "01012345678" },
    { name: "فرع الشيخ زايد", address: "مول العرب، الدور التاني", phone: "01098765432" },
  ],
  schedules: [
    { age: "4-6 سنوات", days: "السبت والثلاثاء", time: "3-4 عصراً" },
    { age: "4-6 سنوات", days: "الأحد والأربعاء", time: "4-5 عصراً" },
    { age: "6-9 سنوات", days: "السبت والثلاثاء", time: "4-5 مساءً" },
    { age: "6-9 سنوات", days: "الأحد والأربعاء", time: "5-6 مساءً" },
    { age: "9-12 سنة", days: "السبت والثلاثاء والخميس", time: "5-6:30 مساءً" },
  ],
  pricing: [
    { plan: "شهري", price: 800 },
    { plan: "3 شهور", price: 2000 },
    { plan: "6 شهور", price: 3500 },
    { plan: "سنوي", price: 6000 },
  ],
  faq: [
    { q: "فيه تجربة مجانية؟", a: "أيوا! أول حصة تجريبية مجانية." },
    { q: "إيه السن المناسب؟", a: "بنقبل من سن 4 سنوات." },
    { q: "لازم ملابس معينة؟", a: "ملابس رياضية مريحة وجوارب." },
    { q: "فيه كلاسات للبنات والولاد؟", a: "أيوا! عندنا مجموعات مختلطة ومجموعات منفصلة." },
  ],
  toneInstructions: "رد بالمصري بود وحماس. خاطب الأمهات والآباء باحترام. استخدم إيموجي بشكل معتدل. شجع الناس تحجز حصة تجريبية.",
};

export const modelUsage = [
  { day: "السبت", gemini: 28, openrouter: 4 },
  { day: "الأحد", gemini: 41, openrouter: 4 },
  { day: "الاثنين", gemini: 35, openrouter: 3 },
  { day: "الثلاثاء", gemini: 48, openrouter: 4 },
  { day: "الأربعاء", gemini: 38, openrouter: 3 },
  { day: "الخميس", gemini: 44, openrouter: 3 },
  { day: "الجمعة", gemini: 25, openrouter: 4 },
];

export const responseTimeData = [
  { hour: "8 ص", time: 1.1 },
  { hour: "10 ص", time: 0.9 },
  { hour: "12 م", time: 1.3 },
  { hour: "2 م", time: 1.8 },
  { hour: "4 م", time: 1.5 },
  { hour: "6 م", time: 2.1 },
  { hour: "8 م", time: 1.7 },
  { hour: "10 م", time: 1.2 },
];
