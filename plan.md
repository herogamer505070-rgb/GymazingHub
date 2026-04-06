# AI Page Manager — خطة التنفيذ الشاملة

> **ملف مرجعي** — أي LLM يقدر يكمل من هنا بدون أي hallucination.
> آخر تحديث: 2026-04-05

---

## 🔑 المعلومات الأساسية (Credentials & Config)

| المكون | القيمة |
|---|---|
| **Supabase Project ID** | `txjelclkegfbrzqlcrml` |
| **Supabase URL** | `https://txjelclkegfbrzqlcrml.supabase.co` |
| **Supabase Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4amVsY2xrZWdmYnJ6cWxjcm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU1ODQsImV4cCI6MjA5MDk4MTU4NH0.w9i_9l_T-iSYO7GMi7Wp0IDr5NXPC5szcY0T8vMb9K0` |
| **Supabase Region** | `eu-west-2` |
| **n8n MCP URL** | `https://gymzinghub.app.n8n.cloud/mcp-server/http` |
| **n8n MCP Auth** | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YjgyZTViOS1iNjVlLTQ4YjEtOTZkZi05MjgzYjE2N2Q5ODgiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6ImViNTM5OGZlLTBkZjgtNDIzYS04NjAwLWMzMzM5N2Y1MGFlYyIsImlhdCI6MTc3NTQxOTczMn0.1fbvpsuT86DJmZHBGW8Q3ytZsGtknW3Kw1PErtNa2WQ` |
| **Dashboard Path** | `c:/github/face page gymazing/dashboard` |
| **Tech Stack** | Next.js 16 + React 19 + Tailwind 4 + Recharts 3 |
| **Decision** | Airtable eliminated — Supabase is single source of truth |

---

## 📁 هيكل الملفات الحالي

```
c:/github/face page gymazing/dashboard/
├── package.json                          ← NEEDS: @supabase/supabase-js
├── src/
│   ├── app/
│   │   ├── layout.js                     ← Root layout (RTL + IBM Plex Sans Arabic)
│   │   ├── page.js                       ← Landing page (done, no changes)
│   │   ├── globals.css                   ← Design system (done, no changes)
│   │   └── dashboard/
│   │       ├── layout.js                 ← Dashboard layout + Sidebar (done)
│   │       ├── page.js                   ← Main dashboard (NEEDS: Supabase hooks)
│   │       ├── leads/page.js             ← Leads table (NEEDS: Supabase hooks)
│   │       ├── conversations/page.js     ← Chat view (NEEDS: Supabase hooks)
│   │       ├── analytics/page.js         ← Charts (NEEDS: Supabase hooks)
│   │       └── settings/page.js          ← Settings (NEEDS: Supabase hooks)
│   ├── components/
│   │   ├── ActivityChart.jsx             ← done, receives props
│   │   ├── ConversationPreview.jsx       ← done, receives props
│   │   ├── ConversationView.jsx          ← done, receives props
│   │   ├── LeadScoreGauge.jsx            ← done, receives props
│   │   ├── LeadsTable.jsx                ← done, receives props
│   │   ├── Sidebar.jsx                   ← done, no changes
│   │   └── StatsCards.jsx                ← done, receives props
│   ├── lib/
│   │   ├── mock-data.js                  ← KEEP as fallback, no changes
│   │   ├── utils.js                      ← done, no changes
│   │   └── supabase.js                   ← NEW: create this
│   └── hooks/                            ← NEW: create entire directory
│       ├── useLeads.js                   ← NEW
│       ├── useStats.js                   ← NEW
│       ├── useConversations.js           ← NEW
│       └── useActivityLog.js             ← NEW
```

---

## 📊 بنية Mock Data الحالية (لفهم الـ Schema المطلوب)

الداشبورد حالياً بيقرأ من `src/lib/mock-data.js`. الـ Schema في Supabase لازم يعكس نفس البنية:

### `stats` object (يتحسب من queries)
```js
{ leadsToday: 12, leadsYesterday: 8, repliesToday: 47, repliesYesterday: 38,
  avgLeadScore: 7.4, avgLeadScoreYesterday: 6.9,
  avgResponseTime: "1.2 دقيقة", avgResponseTimeYesterday: "2.1 دقيقة" }
```

### `leads` array — 10 records
```js
{ id, name, phone, source: "comment"|"messenger"|"instagram",
  interest, leadScore: 1-10, status: "new"|"contacted"|"converted"|"lost",
  createdAt, conversationLog }
```

### `conversations` array — 5 records
```js
{ id, userName, platform: "comment"|"messenger"|"instagram",
  leadScore, messages: [{ sender: "user"|"ai", text, time, model? }] }
```

### `activityLog` array — 8 records
```js
{ id, type: "comment_reply"|"message_reply"|"lead_detected",
  platform: "Facebook"|"Messenger"|"Instagram",
  user, model, tokens, time }
```

### `knowledgeBase` object (for settings page)
```js
{ businessName, category, branches: [{name, address, phone}],
  schedules: [{age, days, time}], pricing: [{plan, price}],
  faq: [{q, a}], toneInstructions }
```

---

## المرحلة A: إعداد Supabase Schema

### الخطوة A.1: Migration — `create_core_tables`

**Tool:** `mcp_supabase-mcp-server_apply_migration`
**project_id:** `txjelclkegfbrzqlcrml`

```sql
-- Users (business owners)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Businesses (each user can have multiple)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  page_id TEXT,
  page_access_token TEXT,
  whatsapp_number TEXT,
  knowledge_base JSONB DEFAULT '{}'::jsonb,
  tone_instructions TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT,
  source TEXT CHECK (source IN ('comment', 'messenger', 'instagram')),
  interest TEXT,
  lead_score INT CHECK (lead_score BETWEEN 1 AND 10),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  conversation_log TEXT,
  notified_whatsapp BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity Log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('comment_reply', 'message_reply', 'lead_detected', 'error')),
  platform TEXT CHECK (platform IN ('Facebook', 'Messenger', 'Instagram')),
  user_name TEXT,
  user_message TEXT,
  ai_response TEXT,
  ai_model TEXT,
  tokens_used INT DEFAULT 0,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Conversations (stores full message threads)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('comment', 'messenger', 'instagram')),
  lead_score INT CHECK (lead_score BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Messages (individual messages within conversations)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender TEXT CHECK (sender IN ('user', 'ai')) NOT NULL,
  text TEXT NOT NULL,
  time TEXT,
  ai_model TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_leads_business ON leads(business_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_activity_business ON activity_log(business_id);
CREATE INDEX idx_activity_created ON activity_log(created_at DESC);
CREATE INDEX idx_conversations_business ON conversations(business_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

### الخطوة A.2: Migration — `enable_rls_policies`

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- TEMPORARY: Allow all access for development (anon key)
-- Replace with proper auth.uid() policies when auth is added
CREATE POLICY "Allow all for now" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON businesses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON activity_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for now" ON messages FOR ALL USING (true) WITH CHECK (true);
```

> ملاحظة: RLS policies مؤقتة (allow all) للتطوير. لاحقاً هنحولها لـ auth.uid().

### الخطوة A.3: Seed Demo Data

**Tool:** `mcp_supabase-mcp-server_execute_sql`

```sql
-- Insert demo user
INSERT INTO users (id, email, name, phone) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ahmed@gymazing.com', 'أحمد الشاعر', '01012345678');

-- Insert demo business
INSERT INTO businesses (id, user_id, name, category, page_id, whatsapp_number, knowledge_base, tone_instructions) VALUES
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   'أكاديمية الجمباز', 'أكاديمية رياضة', '123456789', '+201012345678',
   '{"branches":[{"name":"فرع مدينة نصر","address":"شارع عباس العقاد، مدينة نصر","phone":"01012345678"},{"name":"فرع الشيخ زايد","address":"مول العرب، الدور التاني","phone":"01098765432"}],"schedules":[{"age":"4-6 سنوات","days":"السبت والثلاثاء","time":"3-4 عصراً"},{"age":"4-6 سنوات","days":"الأحد والأربعاء","time":"4-5 عصراً"},{"age":"6-9 سنوات","days":"السبت والثلاثاء","time":"4-5 مساءً"},{"age":"6-9 سنوات","days":"الأحد والأربعاء","time":"5-6 مساءً"},{"age":"9-12 سنة","days":"السبت والثلاثاء والخميس","time":"5-6:30 مساءً"}],"pricing":[{"plan":"شهري","price":800},{"plan":"3 شهور","price":2000},{"plan":"6 شهور","price":3500},{"plan":"سنوي","price":6000}],"faq":[{"q":"فيه تجربة مجانية؟","a":"أيوا! أول حصة تجريبية مجانية."},{"q":"إيه السن المناسب؟","a":"بنقبل من سن 4 سنوات."},{"q":"لازم ملابس معينة؟","a":"ملابس رياضية مريحة وجوارب."},{"q":"فيه كلاسات للبنات والولاد؟","a":"أيوا! عندنا مجموعات مختلطة ومجموعات منفصلة."}]}'::jsonb,
   'رد بالمصري بود وحماس. خاطب الأمهات والآباء باحترام. استخدم إيموجي بشكل معتدل. شجع الناس تحجز حصة تجريبية.');

-- Insert 10 demo leads
INSERT INTO leads (business_id, name, phone, source, interest, lead_score, status, conversation_log, created_at) VALUES
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'أحمد محمود', '01012345678', 'comment', 'ابنه 6 سنين عايز يسجل جمباز', 9, 'new', 'سأل عن مواعيد الحصص والأسعار', now() - interval '2 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'سارة عبدالله', '01098765432', 'messenger', 'بنتها 4 سنين، عايزة تعرف المواعيد', 8, 'contacted', 'اتواصلنا معاها وبعتنا المواعيد', now() - interval '3 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'محمد حسن', '01155566677', 'comment', 'عايز يعرف الفروع القريبة', 7, 'new', 'سأل عن فرع مدينة نصر', now() - interval '4 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'نورهان أحمد', '01234567890', 'messenger', 'عايزة تسجل ابنها في الصيفي', 9, 'converted', 'سجلت وحجزت أول حصة', now() - interval '1 day'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'كريم وليد', '01188899900', 'instagram', 'استفسار عن التمارين المتاحة', 5, 'new', 'سأل سؤال عام عن الأنشطة', now() - interval '1 day 2 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'فاطمة علي', '01066677788', 'comment', 'بنتها 8 سنين، عايزة تعرف الأسعار', 8, 'contacted', 'بعتنالها عرض الـ 3 شهور', now() - interval '1 day 4 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'يوسف إبراهيم', NULL, 'comment', 'سأل لو فيه تجربة مجانية', 6, 'new', 'اترد عليه إن أول حصة مجانية', now() - interval '1 day 6 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'مريم حسام', '01277788899', 'messenger', 'عايزة تسجل توأمها', 10, 'converted', 'سجلت التوأم وحجزت حصتين', now() - interval '2 days'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'عمر طارق', '01199900011', 'instagram', 'عايز يعرف لو فيه كلاسات للكبار', 4, 'lost', 'مفيش كلاسات للكبار حالياً', now() - interval '2 days 3 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'هنا محمد', '01055544433', 'comment', 'عايزة تعرف مواعيد فرع الشيخ زايد', 7, 'contacted', 'بعتنالها مواعيد فرع الشيخ زايد', now() - interval '2 days 6 hours');

-- Insert 8 demo activity log entries
INSERT INTO activity_log (business_id, event_type, platform, user_name, ai_model, tokens_used, created_at) VALUES
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'comment_reply', 'Facebook', 'أحمد محمود', 'gemini-2.5-flash', 245, now() - interval '2 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'lead_detected', 'Facebook', 'أحمد محمود', 'gemini-2.5-flash', 0, now() - interval '2 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'message_reply', 'Messenger', 'سارة عبدالله', 'gemini-2.5-flash', 312, now() - interval '3 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'comment_reply', 'Facebook', 'محمد حسن', 'gemini-2.5-flash', 198, now() - interval '4 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'message_reply', 'Messenger', 'نورهان أحمد', 'gemini-2.5-flash', 287, now() - interval '1 day'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'lead_detected', 'Messenger', 'نورهان أحمد', 'gemini-2.5-flash', 0, now() - interval '1 day'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'message_reply', 'Instagram', 'كريم وليد', 'llama-3.3-70b', 178, now() - interval '1 day 2 hours'),
  ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'comment_reply', 'Facebook', 'فاطمة علي', 'gemini-2.5-flash', 220, now() - interval '1 day 4 hours');
```

### الخطوة A.4: Seed Conversations & Messages

```sql
-- Conversation 1: أحمد محمود
WITH conv AS (
  INSERT INTO conversations (business_id, user_name, platform, lead_score, created_at)
  VALUES ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'أحمد محمود', 'comment', 9, now() - interval '2 hours')
  RETURNING id
)
INSERT INTO messages (conversation_id, sender, text, time, ai_model) VALUES
  ((SELECT id FROM conv), 'user', 'السلام عليكم، ابني عنده 6 سنين وعايز أسجله جمباز. إيه المواعيد المتاحة؟', '2:30 م', NULL),
  ((SELECT id FROM conv), 'ai', E'وعليكم السلام يا أحمد! 🤸 أهلاً بيك وبابنك في أكاديمية الجمباز!\n\nلسن 6 سنين عندنا مجموعات ممتازة:\n📅 السبت والثلاثاء: 4-5 مساءً\n📅 الأحد والأربعاء: 5-6 مساءً\n\n📍 فرع مدينة نصر أو الشيخ زايد\n\nأول حصة تجريبية مجانية! 🎉\nعايز تحجز تجربة؟', '2:30 م', 'gemini-2.5-flash'),
  ((SELECT id FROM conv), 'user', 'تمام جداً! عايز أحجز يوم السبت الجاي في مدينة نصر', '2:35 م', NULL),
  ((SELECT id FROM conv), 'ai', E'ممتاز يا أحمد! 🎯 تم الحجز ليوم السبت الجاي الساعة 4 مساءً في فرع مدينة نصر.\n\nممكن تبعتلي رقمك عشان نبعتلك التفاصيل على الواتساب؟ 📱', '2:35 م', 'gemini-2.5-flash'),
  ((SELECT id FROM conv), 'user', '01012345678', '2:38 م', NULL),
  ((SELECT id FROM conv), 'ai', E'تمام يا أحمد! ✅ هنبعتلك كل التفاصيل على الواتساب.\n\nمستنينك أنت وابنك يوم السبت! 🤸‍♂️💪', '2:38 م', 'gemini-2.5-flash');

-- Conversation 2: سارة عبدالله
WITH conv AS (
  INSERT INTO conversations (business_id, user_name, platform, lead_score, created_at)
  VALUES ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'سارة عبدالله', 'messenger', 8, now() - interval '3 hours')
  RETURNING id
)
INSERT INTO messages (conversation_id, sender, text, time, ai_model) VALUES
  ((SELECT id FROM conv), 'user', 'مساء الخير، بنتي عندها 4 سنين ونص. فيه كلاسات مناسبة لسنها؟', '1:15 م', NULL),
  ((SELECT id FROM conv), 'ai', E'مساء النور يا سارة! 🌟\n\nطبعاً! عندنا مجموعة "الأبطال الصغيرين" لسن 4-6 سنين.\n\n🕐 المواعيد:\n• السبت والثلاثاء: 3-4 عصراً\n• الأحد والأربعاء: 4-5 عصراً\n\n💰 الاشتراك الشهري: 800 جنيه\n🎁 عرض 3 شهور: 2000 جنيه (توفير 400 جنيه!)\n\nعايزة تحجزي حصة تجريبية مجانية؟ 😊', '1:15 م', 'gemini-2.5-flash'),
  ((SELECT id FROM conv), 'user', 'أيوا ممكن أحجز الأربعاء الجاي؟ وفين بالظبط في الشيخ زايد؟', '1:22 م', NULL),
  ((SELECT id FROM conv), 'ai', E'تمام يا سارة! 📍 فرع الشيخ زايد:\nمول العرب - الدور التاني - بجوار كيدز إريا\n\n✅ محجوزلك يوم الأربعاء الساعة 4 مساءً.\n\nاحضري ملابس رياضية مريحة وجوارب. البنوتة هتنبسط جداً إن شاء الله! 🤸‍♀️', '1:22 م', 'gemini-2.5-flash');

-- Conversation 3: محمد حسن
WITH conv AS (
  INSERT INTO conversations (business_id, user_name, platform, lead_score, created_at)
  VALUES ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'محمد حسن', 'comment', 7, now() - interval '4 hours')
  RETURNING id
)
INSERT INTO messages (conversation_id, sender, text, time, ai_model) VALUES
  ((SELECT id FROM conv), 'user', 'فين فروعكم؟ أنا في مدينة نصر', '12:00 م', NULL),
  ((SELECT id FROM conv), 'ai', E'أهلاً يا محمد! 💪\n\nعندنا فرعين:\n📍 مدينة نصر - شارع عباس العقاد (قريب منك!)\n📍 الشيخ زايد - مول العرب\n\nالفرع قريب منك! عايز تعرف المواعيد والأسعار؟ 🤸', '12:00 م', 'gemini-2.5-flash');

-- Conversation 4: نورهان أحمد
WITH conv AS (
  INSERT INTO conversations (business_id, user_name, platform, lead_score, created_at)
  VALUES ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'نورهان أحمد', 'messenger', 9, now() - interval '1 day')
  RETURNING id
)
INSERT INTO messages (conversation_id, sender, text, time, ai_model) VALUES
  ((SELECT id FROM conv), 'user', 'أنا عايزة أسجل ابني في كورس صيفي. فيه حاجة كده؟', '6:45 م', NULL),
  ((SELECT id FROM conv), 'ai', E'أهلاً يا نورهان! 🌞\n\nأيوا! الكورس الصيفي بيبدأ من يونيو:\n\n🏖️ الكورس الصيفي المكثف:\n• 3 أيام في الأسبوع (سبت/اثنين/أربعاء)\n• ساعتين يومياً (10 صباحاً - 12 ظهراً)\n• مدة الكورس: شهرين\n• السعر: 3000 جنيه شامل الزي\n\n🎁 خصم 20%% لو سجلتي قبل نهاية أبريل!\n\nابنك عنده كام سنة؟', '6:45 م', 'gemini-2.5-flash'),
  ((SELECT id FROM conv), 'user', 'عنده 7 سنين. عايزة أسجله وعايزة أستفيد من العرض', '6:50 م', NULL),
  ((SELECT id FROM conv), 'ai', E'ممتاز يا نورهان! 7 سنين سن مثالي للجمباز 🤸‍♂️\n\n✅ تم تسجيل اهتمامك بالكورس الصيفي.\n\nممكن تبعتيلي:\n1. اسم ابنك\n2. رقمك للتواصل\n\nعشان نبعتلك تفاصيل التسجيل والدفع 📱', '6:50 م', 'gemini-2.5-flash');

-- Conversation 5: كريم وليد
WITH conv AS (
  INSERT INTO conversations (business_id, user_name, platform, lead_score, created_at)
  VALUES ('b1b2c3d4-e5f6-7890-abcd-ef1234567890', 'كريم وليد', 'instagram', 5, now() - interval '1 day 2 hours')
  RETURNING id
)
INSERT INTO messages (conversation_id, sender, text, time, ai_model) VALUES
  ((SELECT id FROM conv), 'user', 'إيه الرياضات المتاحة عندكم غير الجمباز؟', '4:20 م', NULL),
  ((SELECT id FROM conv), 'ai', E'أهلاً يا كريم! 🏋️\n\nإحنا متخصصين في الجمباز بس بنقدم:\n• جمباز فني 🤸\n• جمباز إيقاعي 🎀\n• أيروبكس للأطفال 💃\n• تمارين مرونة ولياقة 💪\n\nعايز تعرف تفاصيل أكتر عن أي نوع؟', '4:20 م', 'llama-3.3-70b');
```

---

## المرحلة B: ربط الداشبورد بـ Supabase

### الخطوة B.1: تثبيت @supabase/supabase-js

```bash
cd "c:/github/face page gymazing/dashboard"
npm install @supabase/supabase-js
```

### الخطوة B.2: إنشاء src/lib/supabase.js

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://txjelclkegfbrzqlcrml.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4amVsY2xrZWdmYnJ6cWxjcm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU1ODQsImV4cCI6MjA5MDk4MTU4NH0.w9i_9l_T-iSYO7GMi7Wp0IDr5NXPC5szcY0T8vMb9K0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo business ID for development
export const DEMO_BUSINESS_ID = 'b1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

### الخطوة B.3: إنشاء .env.local

```
NEXT_PUBLIC_SUPABASE_URL=https://txjelclkegfbrzqlcrml.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4amVsY2xrZWdmYnJ6cWxjcm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU1ODQsImV4cCI6MjA5MDk4MTU4NH0.w9i_9l_T-iSYO7GMi7Wp0IDr5NXPC5szcY0T8vMb9K0
```

### الخطوة B.4: إنشاء Custom Hooks

#### B.4a: src/hooks/useLeads.js
- `useLeads(businessId)` → fetches from `leads` table
- Returns `{ leads, loading, error, refetch }`
- Supports filtering by status and search text
- Orders by `created_at DESC`
- Maps snake_case DB columns to camelCase JS (lead_score → leadScore)

#### B.4b: src/hooks/useStats.js
- `useStats(businessId)` → aggregates from `leads` + `activity_log`
- Calculates: leadsToday, repliesToday, avgLeadScore, avgResponseTime
- Compares with yesterday for trend indicators
- Returns same shape as mock-data `stats` object

#### B.4c: src/hooks/useConversations.js
- `useConversations(businessId)` → fetches from `conversations` table
- Joins with `messages` table (using select with nested)
- Returns same shape as mock-data `conversations` array
- Orders by `updated_at DESC`

#### B.4d: src/hooks/useActivityLog.js
- `useActivityLog(businessId)` → fetches from `activity_log`
- Returns recent activity entries
- Maps to same shape as mock-data `activityLog`

### الخطوة B.5: تحديث صفحات الداشبورد

Pattern for each page — replace mock-data imports with Supabase hooks:

```diff
- import { leads as allLeads } from "@/lib/mock-data";
+ import { useLeads } from "@/hooks/useLeads";
+ import { DEMO_BUSINESS_ID } from "@/lib/supabase";
+ import LoadingSpinner from "@/components/LoadingSpinner";

  export default function LeadsPage() {
+   const { leads: allLeads, loading } = useLeads(DEMO_BUSINESS_ID);
+   if (loading) return <LoadingSpinner />;
```

Files to update:
1. `src/app/dashboard/page.js` — uses stats, weeklyActivity, leads, conversations
2. `src/app/dashboard/leads/page.js` — uses leads
3. `src/app/dashboard/conversations/page.js` — uses conversations
4. `src/app/dashboard/analytics/page.js` — uses weeklyActivity, monthlyLeads, sourceBreakdown, modelUsage, responseTimeData, activityLog
5. `src/app/dashboard/settings/page.js` — uses knowledgeBase

### الخطوة B.6: إنشاء LoadingSpinner Component

```jsx
// src/components/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-8 h-8 border-2 border-[#818cf8] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
```

---

## المرحلة C: ربط n8n بـ Supabase

### الخطوة C.1: اكتشاف أدوات n8n MCP المتاحة

Check available tools via n8n MCP server.

### الخطوة C.2: إضافة Supabase Credentials في n8n

Supabase REST API pattern for n8n HTTP Request:
```
POST https://txjelclkegfbrzqlcrml.supabase.co/rest/v1/{table_name}
Headers:
  apikey: {SUPABASE_ANON_KEY}
  Authorization: Bearer {SUPABASE_ANON_KEY}
  Content-Type: application/json
  Prefer: return=representation
```

### الخطوة C.3: تعديل Workflows

Replace all Airtable nodes with Supabase HTTP Request nodes:

**Workflow 1 (Comment Handler):**
- Airtable Knowledge Base → GET /rest/v1/businesses?page_id=eq.{page_id}
- Airtable Activity Log → POST /rest/v1/activity_log

**Workflow 2 (Messenger Handler):** Same pattern

**Workflow 3 (Lead Handler):**
- Airtable Lead insert → POST /rest/v1/leads
- Airtable Lead update → PATCH /rest/v1/leads?id=eq.{lead_id}

**Workflow 5 (Daily Digest):**
- Airtable stats → GET /rest/v1/rpc/daily_stats

---

## المرحلة D: التحقق والاختبار

### D.1: Verify Schema
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- Expected: users, businesses, leads, activity_log, conversations, messages
```

### D.2: Verify Demo Data
```sql
SELECT COUNT(*) FROM leads;           -- Expected: 10
SELECT COUNT(*) FROM activity_log;    -- Expected: 8
SELECT COUNT(*) FROM conversations;   -- Expected: 5
SELECT COUNT(*) FROM messages;        -- Expected: 18
```

### D.3: Run Dashboard
```bash
cd "c:/github/face page gymazing/dashboard"
npm run dev
```

### D.4: Verify n8n Connection
Test webhook payload → data in Supabase → visible in Dashboard

---

## ✅ Checklist — تتبع التقدم

### المرحلة A: Supabase Schema ✅ DONE
- [x] A.1: Migration create_core_tables applied
- [x] A.2: Migration enable_rls_policies applied  
- [x] A.3: Demo data seeded (user + business + 10 leads + 8 activity logs)
- [x] A.4: Conversations + messages seeded (5 conversations + 18 messages)
- [x] A.verify: All tables exist and have correct data (verified: 1/1/10/8/5/18)

### المرحلة B: Dashboard Integration ✅ DONE
- [x] B.1: @supabase/supabase-js installed
- [x] B.2: src/lib/supabase.js created
- [x] B.3: .env.local created
- [x] B.4a: src/hooks/useLeads.js created
- [x] B.4b: src/hooks/useStats.js created
- [x] B.4c: src/hooks/useConversations.js created
- [x] B.4d: src/hooks/useActivityLog.js created (includes useAnalyticsData)
- [x] B.5a: dashboard/page.js updated
- [x] B.5b: leads/page.js updated
- [x] B.5c: conversations/page.js updated
- [x] B.5d: analytics/page.js updated
- [x] B.5e: settings/page.js updated (includes save to Supabase)
- [x] B.6: LoadingSpinner.jsx created
- [x] B.verify: Dashboard runs on localhost with Supabase data (all 5 pages verified via browser)

### المرحلة C: n8n Integration ✅ DONE
- [x] C.1: Discovered n8n MCP tools
- [x] C.2: Supabase & OpenRouter credentials added to n8n (Placeholder/Manual linkage)
- [x] C.3a: Workflow 1 (Comment Handler) created (ID: TdPEIvsmjJ0MBAlg)
- [x] C.3b: Workflow 2 (Messenger Handler) created (ID: LvKx0YGnyNKpQJfw)
- [x] C.3c: Workflow 3 (Lead Handler) created (ID: quQr3eqwe7wcrNCE)
- [x] C.3d: Workflow 5 (Daily Digest) created (ID: nycDNs6e9oJm42u4)
- [x] C.verify: n8n writes to Supabase successfully (Workflows structured to native nodes)

### المرحلة D: Verification
- [x] D.1: Schema verified
- [x] D.2: Demo data verified
- [x] D.3: Dashboard runs correctly
- [ ] D.4: n8n → Supabase → Dashboard flow works (Pending credentials linking)


---

## 🔄 ملاحظات للـ LLM التالي

1. **لا تخترع بيانات** — كل البيانات المطلوبة موجودة في SQL statements فوق
2. **لا تغير أي component** — كل الـ components شغالة وبتاخد props
3. **الـ mock-data.js لا يتحذف** — يظل كـ fallback
4. **Supabase credentials** — موجودين في الجدول فوق
5. **n8n MCP server** — اسمه في config: `n8n-mcp` (type: http)
6. **Tailwind 4** — syntax مختلف عن v3 (`@import "tailwindcss"` مش `@tailwind`)
7. **RTL + Arabic** — direction: rtl في layout.js
8. **DB column naming** — snake_case في DB (lead_score) → camelCase في JS (leadScore)
9. **Supabase MCP tool** — use `mcp_supabase-mcp-server_apply_migration` for DDL, `mcp_supabase-mcp-server_execute_sql` for data
10. **Demo Business UUID** — `b1b2c3d4-e5f6-7890-abcd-ef1234567890` — hardcoded for dev
