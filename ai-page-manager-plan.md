# AI Page Manager — خطة بناء المنتج الكاملة

## نظرة عامة على المنتج

**AI Page Manager** هو نظام ذكاء اصطناعي يدير صفحات فيسبوك تلقائياً — يرد على الكومنتات والرسائل بالعربي المصري، يكتشف الـ Leads المحتملين، ويبعت إشعارات فورية على واتساب صاحب البزنس.

**المشكلة:** أصحاب البزنس الصغير في مصر (أكاديميات، جيمات، عيادات، مطاعم) بيضيعوا عملاء كل يوم لأن محدش بيرد بسرعة على صفحة الفيسبوك.

**الحل:** مدير صفحة ذكي بيشتغل 24/7 بيرد كأنه موظف بشري، وبيبعت أي lead محتمل على واتساب فوراً.

**أول عميل (Pilot):** أكاديمية جمباز (صفحة أخوك).

---

## الـ Tech Stack

| المكون | الأداة | الإصدار/التفاصيل |
|---|---|---|
| Automation Engine | n8n Cloud | أحدث إصدار (1.x) — self-hosted على `ahmedelshaaaer.app.n8n.cloud` |
| AI Model (أساسي) | Gemini 2.5 Flash | Free Tier — 10 RPM / 250 RPD / 250K TPM |
| AI Model (احتياطي) | OpenRouter Free | `meta-llama/llama-3.3-70b-instruct:free` أو `openrouter/free` |
| Facebook API | Meta Graph API | v23.0 (أحدث إصدار — استخدم HTTP Request Node في n8n) |
| WhatsApp | WhatsApp Business API عبر Meta Cloud API | v23.0 |
| قاعدة بيانات Leads | Airtable | متصل فعلاً |
| Knowledge Base | Airtable | جدول منفصل لكل عميل |
| Dashboard | React (JSX) | Tailwind CSS + Recharts + shadcn/ui |
| Hosting (Dashboard) | Vercel | متصل فعلاً |
| Database (Dashboard) | Supabase | متصل فعلاً |

---

## هيكل المشروع — 4 مراحل

---

## المرحلة 1: إعداد البنية التحتية (الأسبوع الأول)

### 1.1 إعداد Meta App و Facebook Graph API

#### الخطوات:
1. اذهب إلى [Meta Developer Dashboard](https://developers.facebook.com) وأنشئ App جديد
2. اختر نوع التطبيق: **Business**
3. أضف المنتجات التالية للـ App:
   - **Webhooks** — لاستقبال الكومنتات والرسائل في الوقت الحقيقي
   - **Facebook Login for Business** — للصلاحيات
   - **WhatsApp Business** — لإرسال الإشعارات
4. اطلب الصلاحيات التالية (Permissions):

```
pages_show_list
pages_read_engagement
pages_read_user_content
pages_manage_engagement      ← للرد على الكومنتات
pages_manage_metadata
pages_messaging               ← لاستقبال وإرسال رسائل Messenger
whatsapp_business_messaging   ← لإرسال إشعارات واتساب
```

5. اعمل **App Review** للصلاحيات اللي محتاجة review
6. اعمل **System User** في Business Manager واعمله Page Access Token طويل الأمد (60 يوم) — أو استخدم Long-lived token عبر token exchange

#### ملاحظة مهمة عن Graph API في n8n:
n8n الـ built-in Facebook Graph API node بيكون أحياناً متأخر عن آخر إصدار من Meta (حالياً v23.0). **الحل:** استخدم **HTTP Request Node** مباشرة مع الـ Graph API:

```
Base URL: https://graph.facebook.com/v23.0/
Authorization: Bearer {PAGE_ACCESS_TOKEN}
```

### 1.2 إعداد Webhooks في Meta

#### Subscriptions المطلوبة:

```json
{
  "object": "page",
  "callback_url": "https://ahmedelshaaaer.app.n8n.cloud/webhook/fb-page-events",
  "verify_token": "YOUR_VERIFY_TOKEN",
  "fields": [
    "feed",           // كومنتات وبوستات جديدة
    "messages",       // رسائل Messenger
    "messaging_postbacks"  // أزرار الشات بوت
  ]
}
```

#### n8n Webhook Node Setup:
- أنشئ **Webhook Node** في n8n بـ path: `/webhook/fb-page-events`
- اختر Method: **POST**
- الـ Webhook هيستقبل كل الأحداث من فيسبوك (كومنت جديد، رسالة جديدة، إلخ)

### 1.3 إعداد Gemini API

1. اذهب إلى [Google AI Studio](https://aistudio.google.com)
2. اعمل API Key (مجاني، بدون كريديت كارد)
3. الموديل المستخدم: `gemini-2.5-flash`

#### الحدود المجانية (أبريل 2026):

| البُعد | الحد |
|---|---|
| Requests/Minute (RPM) | 10 |
| Requests/Day (RPD) | 250 |
| Tokens/Minute (TPM) | 250,000 |
| Context Window | 1,000,000 tokens |

#### استراتيجية التعامل مع الحدود:
- **الأساسي:** Gemini 2.5 Flash (أسرع وأكتر quota)
- **الاحتياطي (Fallback):** OpenRouter Free — `meta-llama/llama-3.3-70b-instruct:free`
- **المنطق:** لو Gemini رجع خطأ 429 → حول الطلب لـ OpenRouter

#### OpenRouter Free Setup:

```
Base URL: https://openrouter.ai/api/v1/chat/completions
Headers:
  Authorization: Bearer {OPENROUTER_API_KEY}
  Content-Type: application/json

Body:
{
  "model": "meta-llama/llama-3.3-70b-instruct:free",
  "messages": [...]
}
```

حدود OpenRouter المجانية: 20 RPM / 200 RPD

### 1.4 إعداد Airtable

#### جدول 1: Knowledge Base (قاعدة المعرفة)

| Field | Type | مثال |
|---|---|---|
| client_id | Text | `gym_academy_01` |
| business_name | Text | أكاديمية الجمباز |
| category | Single Select | أكاديمية رياضة |
| branches | Long Text (JSON) | `[{"name":"مدينة نصر","address":"...","phone":"01x"}]` |
| schedules | Long Text (JSON) | `[{"age":"4-6","days":"سبت ثلاثاء","time":"4-5 م"}]` |
| pricing | Long Text (JSON) | `[{"plan":"شهري","price":800},{"plan":"3 شهور","price":2000}]` |
| faq | Long Text (JSON) | `[{"q":"فيه تجربة مجانية؟","a":"أيوا أول حصة مجانية"}]` |
| tone_instructions | Long Text | "رد بالمصري بود وحماس، خاطب الأمهات باحترام" |
| whatsapp_number | Phone | `+201xxxxxxxxx` |
| page_id | Text | `123456789` |
| page_access_token | Text | `EAAG...` (مشفر) |

#### جدول 2: Leads

| Field | Type | وصف |
|---|---|---|
| lead_id | Autonumber | رقم تلقائي |
| client_id | Link to Knowledge Base | ربط بالعميل |
| name | Text | اسم الـ Lead |
| phone | Phone | رقم التليفون |
| source | Single Select | Comment / Messenger / Instagram |
| interest | Text | "ابنه 6 سنين عايز يسجل" |
| status | Single Select | New / Contacted / Converted / Lost |
| lead_score | Number | 1-10 (يحدده الـ AI) |
| created_at | Created Time | تلقائي |
| conversation_log | Long Text | ملخص المحادثة |
| notified_via_whatsapp | Checkbox | هل تم الإشعار؟ |

#### جدول 3: Activity Log

| Field | Type | وصف |
|---|---|---|
| log_id | Autonumber | رقم تلقائي |
| client_id | Link | ربط بالعميل |
| event_type | Single Select | comment_reply / message_reply / lead_detected / error |
| platform | Single Select | Facebook / Messenger |
| user_message | Long Text | رسالة المستخدم |
| ai_response | Long Text | رد الـ AI |
| ai_model_used | Text | gemini-2.5-flash / llama-3.3-70b |
| timestamp | Created Time | تلقائي |
| tokens_used | Number | عدد التوكنز المستخدمة |

---

## المرحلة 2: بناء الـ n8n Workflows (الأسبوع الأول والثاني)

### Workflow 1: معالجة الكومنتات الجديدة

**Trigger:** Facebook Webhook → كومنت جديد

#### الخطوات بالتفصيل (n8n Nodes):

```
[Webhook Trigger]
    ↓
[IF Node: هل الحدث = comment؟]
    ↓ نعم
[HTTP Request: جلب تفاصيل الكومنت]
    GET https://graph.facebook.com/v23.0/{comment_id}
    ?fields=message,from,created_time,parent
    ↓
[IF Node: هل الكومنت من الصفحة نفسها؟ (تجاهل)]
    ↓ لا (كومنت من مستخدم)
[Airtable Node: جلب Knowledge Base للصفحة]
    Filter: page_id = {page_id من الـ webhook}
    ↓
[HTTP Request → Gemini API: تصنيف + رد]
    POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}
    ↓
[IF Node: هل فيه Lead محتمل؟ (lead_score >= 7)]
    ↓ نعم                          ↓ لا
[Sub-workflow: Lead Handler]    [HTTP Request: رد على الكومنت]
    ↓                              POST /{comment_id}/replies
[HTTP Request: رد على الكومنت]     ?message={ai_reply}
    ↓
[Airtable: تسجيل في Activity Log]
```

#### Gemini API Prompt (لتصنيف الكومنت والرد):

```json
{
  "contents": [{
    "parts": [{
      "text": "أنت مدير صفحة فيسبوك لـ {{business_name}}.\n\nمعلومات البزنس:\n{{knowledge_base_json}}\n\nتعليمات الأسلوب:\n{{tone_instructions}}\n\nكومنت جديد من {{user_name}}:\n\"{{comment_text}}\"\n\nالمطلوب منك:\n1. صنّف الكومنت (inquiry / lead / complaint / spam / general)\n2. حدد lead_score من 1 لـ 10 (10 = عايز يشتري/يسجل دلوقتي)\n3. اكتب رد مناسب بالمصري (قصير، ودود، مفيد)\n4. لو lead_score >= 7، اقترح رسالة خاصة للمستخدم تطلب رقمه\n\nرد بـ JSON فقط بدون أي كلام تاني:\n{\"category\": \"...\", \"lead_score\": N, \"public_reply\": \"...\", \"private_message\": \"...أو null\", \"lead_summary\": \"...أو null\"}"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 500,
    "responseMimeType": "application/json"
  }
}
```

#### HTTP Request لنشر الرد على الكومنت:

```
POST https://graph.facebook.com/v23.0/{comment_id}/replies
Content-Type: application/json

{
  "message": "{{ai_public_reply}}",
  "access_token": "{{page_access_token}}"
}
```

### Workflow 2: معالجة رسائل Messenger

**Trigger:** Facebook Webhook → رسالة جديدة

```
[Webhook Trigger: messages event]
    ↓
[IF Node: هل هي رسالة من مستخدم (وليس من الصفحة)؟]
    ↓ نعم
[Airtable: جلب Knowledge Base]
    ↓
[Airtable: جلب سجل المحادثة السابقة (آخر 5 رسائل)]
    Filter: platform = "Messenger" AND user_id = {sender_id}
    Sort: timestamp DESC, Limit: 5
    ↓
[HTTP Request → Gemini API: رد ذكي مع سياق المحادثة]
    ↓
[IF Node: هل فيه Lead؟ (lead_score >= 7)]
    ↓ نعم                              ↓ لا
[Sub-workflow: Lead Handler]        [التالي]
    ↓                                   ↓
[HTTP Request: إرسال رد Messenger]
    POST https://graph.facebook.com/v23.0/me/messages
    {
      "recipient": {"id": "{sender_id}"},
      "message": {"text": "{ai_reply}"},
      "messaging_type": "RESPONSE",
      "access_token": "{page_access_token}"
    }
    ↓
[Airtable: تسجيل في Activity Log]
```

#### Gemini Prompt لرسائل Messenger (مع سياق):

```json
{
  "contents": [{
    "parts": [{
      "text": "أنت مدير صفحة فيسبوك لـ {{business_name}} وبترد على رسائل العملاء على Messenger.\n\nمعلومات البزنس:\n{{knowledge_base_json}}\n\nتعليمات الأسلوب:\n{{tone_instructions}}\n\nسجل المحادثة السابقة:\n{{conversation_history}}\n\nرسالة جديدة من {{user_name}}:\n\"{{message_text}}\"\n\nالمطلوب:\n1. رد بالمصري بشكل طبيعي ومفيد\n2. لو العميل مهتم (سأل عن سعر/مواعيد/تسجيل)، اطلب رقمه بأدب\n3. لو العميل أعطاك رقمه، سجله\n4. حدد lead_score من 1 لـ 10\n\nرد بـ JSON:\n{\"reply\": \"...\", \"lead_score\": N, \"extracted_phone\": \"...أو null\", \"extracted_name\": \"...أو null\", \"interest_summary\": \"...أو null\"}"
    }]
  }],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 500,
    "responseMimeType": "application/json"
  }
}
```

### Workflow 3: Sub-workflow — Lead Handler

**Trigger:** يتنادى من Workflow 1 أو 2

```
[Execute Sub-workflow Trigger]
    ↓
[Airtable: تسجيل Lead جديد]
    Table: Leads
    Fields: name, phone, source, interest, lead_score, client_id
    ↓
[HTTP Request → WhatsApp Cloud API: إشعار لصاحب البزنس]
    POST https://graph.facebook.com/v23.0/{whatsapp_phone_number_id}/messages
    {
      "messaging_product": "whatsapp",
      "to": "{{owner_whatsapp_number}}",
      "type": "template",
      "template": {
        "name": "new_lead_notification",
        "language": {"code": "ar"},
        "components": [{
          "type": "body",
          "parameters": [
            {"type": "text", "text": "{{lead_name}}"},
            {"type": "text", "text": "{{lead_phone}}"},
            {"type": "text", "text": "{{interest_summary}}"},
            {"type": "text", "text": "{{lead_score}}"}
          ]
        }]
      }
    }
    ↓
[Airtable: تحديث Lead — notified_via_whatsapp = true]
    ↓
[Airtable: تسجيل في Activity Log]
```

#### WhatsApp Message Template (يتم إنشاؤه مسبقاً في Meta Business):

```
Template Name: new_lead_notification
Language: ar
Category: UTILITY

Header: 🔥 Lead جديد!
Body: 
اسم العميل: {{1}}
رقم التليفون: {{2}}
مهتم بـ: {{3}}
درجة الاهتمام: {{4}}/10

📱 تواصل معاه في أقرب وقت!
```

### Workflow 4: Fallback — لو Gemini مش متاح

**منطق الـ Fallback (يتطبق في كل workflow):**

```
[HTTP Request → Gemini]
    ↓ خطأ (429 أو 500)
[IF Node: هل فيه خطأ؟]
    ↓ نعم
[HTTP Request → OpenRouter (Llama 3.3 70B)]
    POST https://openrouter.ai/api/v1/chat/completions
    Headers:
      Authorization: Bearer {OPENROUTER_API_KEY}
    Body:
    {
      "model": "meta-llama/llama-3.3-70b-instruct:free",
      "messages": [
        {"role": "system", "content": "{same_system_prompt}"},
        {"role": "user", "content": "{same_user_message}"}
      ],
      "temperature": 0.7,
      "max_tokens": 500
    }
    ↓
[تكملة الـ Flow بشكل عادي]
```

### Workflow 5: Daily Digest (ملخص يومي)

**Trigger:** Schedule Trigger — كل يوم الساعة 9 مساءً

```
[Schedule Trigger: 9:00 PM Daily]
    ↓
[Airtable: جلب إحصائيات اليوم]
    Filter: created_at = TODAY()
    ↓
[Code Node: حساب الإحصائيات]
    - عدد الكومنتات اللي اترد عليها
    - عدد الرسائل اللي اترد عليها
    - عدد الـ Leads الجديدة
    - متوسط lead_score
    ↓
[HTTP Request → WhatsApp: إرسال ملخص يومي]
    Template: daily_summary
    "📊 ملخص اليوم:
     كومنتات: {{comments_count}}
     رسائل: {{messages_count}}
     Leads جديدة: {{leads_count}}
     أعلى Lead: {{top_lead_name}} ({{top_lead_score}}/10)"
```

---

## المرحلة 3: بناء الـ React Dashboard (الأسبوع الثالث)

### 3.1 هيكل المشروع

```
ai-page-manager-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx              ← Landing/Login
│   │   ├── dashboard/
│   │   │   ├── page.jsx          ← الصفحة الرئيسية
│   │   │   ├── leads/
│   │   │   │   └── page.jsx      ← جدول الـ Leads
│   │   │   ├── conversations/
│   │   │   │   └── page.jsx      ← سجل المحادثات
│   │   │   ├── analytics/
│   │   │   │   └── page.jsx      ← الإحصائيات والرسوم البيانية
│   │   │   └── settings/
│   │   │       └── page.jsx      ← إعدادات البزنس / Knowledge Base
│   ├── components/
│   │   ├── ui/                   ← shadcn/ui components
│   │   ├── StatsCards.jsx        ← كروت الإحصائيات
│   │   ├── LeadsTable.jsx        ← جدول الـ Leads
│   │   ├── ConversationView.jsx  ← عرض المحادثات
│   │   ├── ActivityChart.jsx     ← رسوم بيانية (Recharts)
│   │   ├── LeadScoreGauge.jsx    ← مؤشر درجة الاهتمام
│   │   └── Sidebar.jsx           ← القائمة الجانبية
│   ├── lib/
│   │   ├── supabase.js           ← Supabase client
│   │   ├── airtable.js           ← Airtable API wrapper
│   │   └── utils.js
│   └── hooks/
│       ├── useLeads.js
│       ├── useStats.js
│       └── useConversations.js
├── tailwind.config.js
└── package.json
```

### 3.2 Supabase Schema

```sql
-- المستخدمين (أصحاب البزنس)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- البزنس (كل مستخدم ممكن يكون عنده أكتر من بزنس)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  category TEXT,
  page_id TEXT,                    -- Facebook Page ID
  page_access_token TEXT,          -- مشفر
  whatsapp_number TEXT,
  knowledge_base JSONB,            -- كل المعلومات
  tone_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- الـ Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
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

-- سجل النشاط
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),
  event_type TEXT,
  platform TEXT,
  user_message TEXT,
  ai_response TEXT,
  ai_model TEXT,
  tokens_used INT,
  lead_id UUID REFERENCES leads(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own businesses" ON businesses
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users see own leads" ON leads
  FOR ALL USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users see own activity" ON activity_log
  FOR ALL USING (business_id IN (
    SELECT id FROM businesses WHERE user_id = auth.uid()
  ));
```

### 3.3 الصفحات الرئيسية

#### Dashboard الرئيسي — المطلوب عرضه:

1. **Stats Cards (4 كروت):**
   - Leads اليوم (مع مقارنة بالأمس)
   - إجمالي الردود اليوم (كومنتات + رسائل)
   - متوسط Lead Score
   - وقت الرد المتوسط

2. **Activity Chart (Recharts):**
   - رسم بياني خطي — آخر 7 أيام
   - خطين: الردود + الـ Leads
   
3. **Latest Leads Table:**
   - آخر 10 leads
   - الأعمدة: الاسم، المصدر، الاهتمام، Lead Score (color-coded)، الحالة، التاريخ
   - فلتر بالحالة (New / Contacted / Converted)

4. **Recent Conversations:**
   - آخر 5 محادثات
   - كل محادثة تعرض: رسالة المستخدم + رد الـ AI + Lead Score

#### صفحة Settings:

1. **Knowledge Base Editor:**
   - فورم لتعديل معلومات البزنس
   - أقسام: الفروع، المواعيد، الأسعار، FAQ
   - كل قسم فيه Add/Edit/Delete
   - زر "Test AI Response" — يبعت سؤال تجريبي ويشوف الرد

2. **Tone Configuration:**
   - Textarea لتعليمات الأسلوب
   - أمثلة جاهزة (ودود، رسمي، حماسي)

3. **Connection Status:**
   - حالة اتصال Facebook Page
   - حالة اتصال WhatsApp
   - آخر نشاط

---

## المرحلة 4: التحويل لمنتج قابل للبيع (الأسبوع الرابع)

### 4.1 Onboarding Flow للعملاء الجدد

```
[العميل يسجل في الداشبورد]
    ↓
[يملا استمارة البزنس]
    - اسم البزنس
    - النوع (أكاديمية / جيم / عيادة / مطعم / أخرى)
    - الفروع والمواعيد والأسعار
    - FAQ (أسئلة وأجوبة شائعة)
    - رقم الواتساب لاستقبال الإشعارات
    ↓
[يربط صفحة الفيسبوك عبر Facebook Login]
    ↓
[النظام أوتوماتيك:]
    - ينشئ Knowledge Base في Airtable
    - ينسخ n8n Workflow Template
    - يضبط الـ Webhooks
    - يشغل الـ Workflows
    ↓
[العميل يبدأ يشوف الردود في الداشبورد]
```

### 4.2 نموذج التسعير المقترح

| الخطة | السعر (شهري) | المميزات |
|---|---|---|
| Starter | 500 ج.م | صفحة واحدة، 500 رد/شهر، إشعارات واتساب |
| Growth | 1,000 ج.م | صفحة واحدة، ردود غير محدودة، ملخص يومي، داشبورد |
| Pro | 2,000 ج.م | حتى 3 صفحات، أولوية في الرد، تقارير أسبوعية |

### 4.3 خطة التسويق الأولية

1. **Case Study:** وثّق نتائج أكاديمية أخوك (كام lead جه، كام واحد اتحول لعميل)
2. **المجال الأول:** أكاديميات رياضة وجيمات (نفس المجال = نفس الـ Knowledge Base template)
3. **الرسالة التسويقية:** "مدير صفحة ذكي بيشتغل 24/7 وبيبعتلك أي حد مهتم على الواتساب فوراً — بربع تمن مرتب موظف"
4. **القنوات:** Facebook Ads (إعلانات موجهة لأصحاب الأكاديميات والجيمات)

---

## ملاحظات تقنية مهمة

### حدود Facebook API:
- **Rate Limits:** 200 calls/hour per user per app (Graph API)
- **24-Hour Messaging Window:** Messenger بيسمح بالرد فقط خلال 24 ساعة من آخر رسالة من المستخدم. بعد كده محتاج Message Template
- **Comment Reply:** مفيش حد زمني للرد على الكومنتات

### حدود الـ AI:
- **Gemini Free:** 250 request/day — كفاية لصفحة واحدة أو اتنين
- **للتوسع:** لما العملاء يزيدوا، فعّل Gemini Paid Tier 1 ($0.30/M input tokens) — أرخص بكتير من أي بديل
- **Fallback:** دايماً خلي OpenRouter كبديل عشان ماتقفش لو Gemini وقع

### أمان:
- خزّن كل الـ Access Tokens مشفرة في Supabase (أو n8n Credentials)
- استخدم Supabase Row Level Security (RLS) عشان كل عميل يشوف بياناته بس
- لا تخزن بيانات حساسة في Airtable — استخدمه للـ Knowledge Base فقط

### تعامل مع الأخطاء:
- كل HTTP Request في n8n لازم يكون عنده **Error Handling** (Continue on Error أو Error Workflow)
- لو الـ AI مرجعش JSON صحيح → استخدم **Code Node** لـ parsing مع try/catch
- لو Facebook API رجع خطأ → سجل في Activity Log وما تردش

---

## Checklist — قبل الإطلاق

- [ ] Meta App مفعّل ومتاخد عليه App Review
- [ ] Webhooks شغالة وبتستقبل events في n8n
- [ ] Page Access Token طويل الأمد (وعنده auto-refresh)
- [ ] Gemini API Key شغال والحدود مفهومة
- [ ] OpenRouter API Key جاهز كـ fallback
- [ ] WhatsApp Business Account مفعّل + Message Template معتمد
- [ ] Airtable tables جاهزة ومتصلة بـ n8n
- [ ] n8n Workflows 1-5 شغالة ومتجربة
- [ ] Dashboard متنشر على Vercel
- [ ] Supabase schema مطبق + RLS مفعّل
- [ ] تم الاختبار على صفحة أخوك لمدة 3 أيام على الأقل
- [ ] الردود الـ AI مراجعة ومقبولة من أخوك
- [ ] Daily Digest بيوصل على الواتساب
- [ ] Error handling متجرب (إيه بيحصل لو Gemini وقع؟)
