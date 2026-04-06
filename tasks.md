# Gymazing Hub — Production Tasks

> Execute milestones **in order**. Each task has exact commands/code/SQL.
> After each milestone, run its verification before moving to the next.
> **Do NOT skip steps. Do NOT improvise.**

---

## Credentials Reference (Use These Exact Values)

| Key                        | Value                                                                                                                                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase Project ID        | `txjelclkegfbrzqlcrml`                                                                                                                                                                                                                                               |
| Supabase URL               | `https://txjelclkegfbrzqlcrml.supabase.co`                                                                                                                                                                                                                           |
| Supabase Anon Key          | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4amVsY2xrZWdmYnJ6cWxjcm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MDU1ODQsImV4cCI6MjA5MDk4MTU4NH0.w9i_9l_T-iSYO7GMi7Wp0IDr5NXPC5szcY0T8vMb9K0`                                                   |
| Facebook Page ID           | `100065686834933`                                                                                                                                                                                                                                                    |
| Facebook Page Access Token | `EAANasfBeJw8BREd69dJZBWSgLTQIaxzK5FJmYdwK7ztpmpjK4vHQzdZBsg1VXzpN3byknb1cDer3wt3gFZCo1ayJpj1PdpgYEnmyJxByaGoGI0eVkaaEobrpdGBZBTiPBnNLTZBf4flijHi7FaHx4c0qvgxg9b4xowJbBEpQoJlopPCmsVUB4TByjFGIHXMCxtocQQdqdxaG9KBdZCurcFB5vp0EtBaKCBiJj4H6f6ZAyuz6XCK22QrZBIlSZCOCO` |
| WhatsApp Phone Number ID   | `1053887997812417`                                                                                                                                                                                                                                                   |
| WhatsApp API Token         | `EAANasfBeJw8BRGrfjtetalAdH64amgmd8AdWb8CG5ZBQ77XDPmY4c2izPpWzivWydnvZAGZBZBexAnVTaW63BpXICoEXqWF8lBMp4tBYZAs9rTq7ny1seex4OXVTs80qGFdKOKhNQRmf0zuBGpQNyobVlt3ueVNZASwFgsgUiuaU0vAyBoaLAuUkflocYLzAwcngZDZD`                                                          |
| Brother WhatsApp           | `+201004650795`                                                                                                                                                                                                                                                      |
| Admin Email                | `elshaer2021@gmail.com`                                                                                                                                                                                                                                              |
| Admin Password             | `Profess0r`                                                                                                                                                                                                                                                          |
| Demo Email                 | `demo@gymazing.com`                                                                                                                                                                                                                                                  |
| Demo Password              | `demo_password_123`                                                                                                                                                                                                                                                  |
| Business ID (Gymazing HuB) | `6b7861d0-5aa6-4a0d-a049-e4b9dd704165`                                                                                                                                                                                                                               |
| Business ID (Demo Academy) | `41465cb0-6bbb-4389-8b0f-9ff344e7747c`                                                                                                                                                                                                                               |
| Business ID (Old Test)     | `b1b2c3d4-e5f6-7890-abcd-ef1234567890`                                                                                                                                                                                                                               |
| n8n Comment Handler ID     | `TdPEIvsmjJ0MBAlg`                                                                                                                                                                                                                                                   |
| n8n Messenger Handler ID   | `LvKx0YGnyNKpQJfw`                                                                                                                                                                                                                                                   |
| n8n Lead Handler ID        | `quQr3eqwe7wcrNCE`                                                                                                                                                                                                                                                   |
| n8n Daily Digest ID        | `nycDNs6e9oJm42u4`                                                                                                                                                                                                                                                   |
| Vercel Team ID             | `team_hL5EoylTU6DGdq4JFmnppVYq`                                                                                                                                                                                                                                      |

---

## Milestone 1: Database Foundation

**Goal**: Create auth users, link them to businesses, store tokens, fix data shapes.
**Tool**: Supabase MCP `execute_sql` with `project_id: "txjelclkegfbrzqlcrml"` for ALL SQL tasks.

### Task 1.1: Create admin auth user

Run this SQL. It inserts into both `auth.users` AND `auth.identities` (both are required for Supabase Auth to work):

```sql
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'elshaer2021@gmail.com',
    crypt('Profess0r', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', 'elshaer2021@gmail.com'),
    'email',
    new_user_id::text,
    now(),
    now(),
    now()
  );
END $$;
```

### Task 1.2: Create demo auth user

```sql
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'demo@gymazing.com',
    crypt('demo_password_123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', 'demo@gymazing.com'),
    'email',
    new_user_id::text,
    now(),
    now(),
    now()
  );
END $$;
```

### Task 1.3: Get the auth user IDs and create public.users rows

Run this single query — it reads the auth user IDs and inserts into public.users in one step:

```sql
INSERT INTO public.users (id, email, name)
SELECT id, email,
  CASE
    WHEN email = 'elshaer2021@gmail.com' THEN 'Ahmed ElShaer'
    WHEN email = 'demo@gymazing.com' THEN 'Demo User'
  END
FROM auth.users
WHERE email IN ('elshaer2021@gmail.com', 'demo@gymazing.com')
ON CONFLICT (id) DO NOTHING;
```

### Task 1.4: Link businesses to auth users

```sql
-- Link Gymazing HuB to admin
UPDATE businesses
SET user_id = (SELECT id FROM auth.users WHERE email = 'elshaer2021@gmail.com')
WHERE id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165';

-- Link Demo Academy to demo user
UPDATE businesses
SET user_id = (SELECT id FROM auth.users WHERE email = 'demo@gymazing.com')
WHERE id = '41465cb0-6bbb-4389-8b0f-9ff344e7747c';
```

### Task 1.5: Store Facebook and WhatsApp tokens in businesses table

```sql
UPDATE businesses
SET
  page_access_token = 'EAANasfBeJw8BREd69dJZBWSgLTQIaxzK5FJmYdwK7ztpmpjK4vHQzdZBsg1VXzpN3byknb1cDer3wt3gFZCo1ayJpj1PdpgYEnmyJxByaGoGI0eVkaaEobrpdGBZBTiPBnNLTZBf4flijHi7FaHx4c0qvgxg9b4xowJbBEpQoJlopPCmsVUB4TByjFGIHXMCxtocQQdqdxaG9KBdZCurcFB5vp0EtBaKCBiJj4H6f6ZAyuz6XCK22QrZBIlSZCOCO',
  whatsapp_number = '+201004650795'
WHERE id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165';
```

### Task 1.6: Reassign seed data to Gymazing HuB

The 10 leads, 5 conversations, and 8 activity_log rows may be linked to the old test business. Move them:

```sql
UPDATE leads SET business_id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165'
WHERE business_id = 'b1b2c3d4-e5f6-7890-abcd-ef1234567890';

UPDATE conversations SET business_id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165'
WHERE business_id = 'b1b2c3d4-e5f6-7890-abcd-ef1234567890';

UPDATE activity_log SET business_id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165'
WHERE business_id = 'b1b2c3d4-e5f6-7890-abcd-ef1234567890';
```

### Task 1.7: Fix knowledge_base JSONB shape

The settings page (`dashboard/settings/page.js`) expects objects with properties like `branch.name`, `branch.address`, `schedule.age`, `pricing.plan`, etc. The current DB has flat strings. Fix:

```sql
UPDATE businesses
SET knowledge_base = '{
  "branches": [
    {"name": "فرع مدينة نصر", "address": "مدينة نصر، القاهرة", "phone": "01012345678"},
    {"name": "فرع القاهرة الجديدة", "address": "القاهرة الجديدة", "phone": "01098765432"}
  ],
  "schedules": [
    {"age": "4-6 سنوات", "days": "السبت - الاثنين - الأربعاء", "time": "4:00 م - 5:30 م"},
    {"age": "7-10 سنوات", "days": "الأحد - الثلاثاء - الخميس", "time": "5:30 م - 7:00 م"},
    {"age": "11-16 سنة", "days": "السبت - الاثنين - الأربعاء", "time": "7:00 م - 9:00 م"}
  ],
  "pricing": [
    {"plan": "شهري", "price": "800"},
    {"plan": "3 شهور", "price": "2200"},
    {"plan": "6 شهور", "price": "4000"},
    {"plan": "سنوي", "price": "7500"}
  ],
  "faq": [
    {"q": "السن المناسب لبداية الجمباز؟", "a": "من 4 سنين. كل ما يبدأ بدري كل ما يتطور أسرع."},
    {"q": "في حصة تجريبية؟", "a": "أيوه! أول حصة مجانية عشان الطفل يجرب ويحب."},
    {"q": "إيه اللي المفروض يجيبه معاه؟", "a": "لبس رياضي مريح وزجاجة مية. إحنا بنوفر كل الأدوات."},
    {"q": "الأسعار بتشمل إيه؟", "a": "التدريب + استخدام كل الأجهزة + متابعة المستوى."}
  ]
}'::jsonb
WHERE id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165';

UPDATE businesses
SET knowledge_base = '{
  "branches": [
    {"name": "Demo Branch", "address": "123 Demo Street", "phone": "0100000000"}
  ],
  "schedules": [
    {"age": "All ages", "days": "Mon-Wed-Fri", "time": "4 PM - 8 PM"}
  ],
  "pricing": [
    {"plan": "Monthly", "price": "500"}
  ],
  "faq": [
    {"q": "Is this a demo?", "a": "Yes, this is read-only demo data."}
  ]
}'::jsonb
WHERE id = '41465cb0-6bbb-4389-8b0f-9ff344e7747c';
```

### Verification 1

Run ALL of these queries. Every one must return the expected result.

```sql
-- Must return 2 rows (elshaer2021@gmail.com and demo@gymazing.com)
SELECT id, email FROM auth.users WHERE email IN ('elshaer2021@gmail.com', 'demo@gymazing.com');

-- Must return 2 rows in public.users
SELECT id, email, name FROM public.users WHERE email IN ('elshaer2021@gmail.com', 'demo@gymazing.com');

-- Must show user_id set (NOT NULL) for Gymazing HuB and Demo Academy
SELECT id, name, user_id FROM businesses WHERE user_id IS NOT NULL;

-- Must show page_access_token is set (NOT NULL)
SELECT name, page_access_token IS NOT NULL AS has_token FROM businesses WHERE id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165';

-- Must show structured knowledge_base (first branch name should be "فرع مدينة نصر")
SELECT knowledge_base->'branches'->0->>'name' AS first_branch FROM businesses WHERE id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165';

-- Must show leads linked to Gymazing HuB (count should be >= 10)
SELECT COUNT(*) FROM leads WHERE business_id = '6b7861d0-5aa6-4a0d-a049-e4b9dd704165';
```

If ANY query fails, STOP and fix before continuing.

---

## Milestone 2: Fix Dashboard Middleware

**Goal**: Install `@supabase/ssr` and rewrite middleware so auth cookies work properly.

### Task 2.1: Install @supabase/ssr

```bash
cd "c:/github/face page gymazing/dashboard" && npm install @supabase/ssr
```

### Task 2.2: Create server Supabase client utility

Create new file `dashboard/src/lib/supabase-server.js` with this EXACT content:

```js
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}
```

### Task 2.3: Rewrite middleware.js

Replace the ENTIRE content of `dashboard/src/middleware.js` with this EXACT content:

```js
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(req) {
  let supabaseResponse = NextResponse.next({ request: req });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
```

**WHY `getUser()` not `getSession()`**: `getUser()` validates the JWT with Supabase server. `getSession()` only reads the local cookie without validation — insecure for middleware.

### Verification 2

```bash
cd "c:/github/face page gymazing/dashboard" && npm run build
```

Must complete with **zero errors**. If `createServerClient` import fails, verify `@supabase/ssr` is in `package.json` dependencies.

---

## Milestone 3: RLS Security

**Goal**: Remove insecure "Allow all for now" RLS policies. Keep proper user-scoped ones.
**Tool**: Supabase MCP `execute_sql`.

### Task 3.1: Drop insecure policies

```sql
DROP POLICY IF EXISTS "Allow all for now" ON users;
DROP POLICY IF EXISTS "Allow all for now" ON businesses;
DROP POLICY IF EXISTS "Allow all for now" ON leads;
DROP POLICY IF EXISTS "Allow all for now" ON conversations;
DROP POLICY IF EXISTS "Allow all for now" ON messages;
DROP POLICY IF EXISTS "Allow all for now" ON activity_log;
```

### Task 3.2: Add UPDATE policies for dashboard

The dashboard settings page needs to UPDATE businesses (save tone/knowledge_base). Add these policies:

```sql
CREATE POLICY "Users can update their own business"
ON businesses FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());
```

### Task 3.3: Add INSERT policy for n8n service role

n8n uses the service_role key (bypasses RLS), so no policy needed for n8n. But verify that the anon key (used by dashboard) can still SELECT data:

```sql
-- This should already exist, just verify
SELECT policyname, cmd FROM pg_policies
WHERE schemaname = 'public' AND cmd = 'SELECT'
ORDER BY tablename;
```

Expected: 6 SELECT policies (one per table). If any are missing, the dashboard pages will show empty data.

### Verification 3

```sql
-- Must show ZERO rows with "Allow all for now"
SELECT tablename, policyname FROM pg_policies
WHERE schemaname = 'public' AND policyname = 'Allow all for now';

-- Must show SELECT + UPDATE policies for businesses
SELECT policyname, cmd FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'businesses';
```

---

## Milestone 4: Fix n8n Workflows

**Goal**: Fix the Comment Handler, Messenger Handler, and add WhatsApp lead notification.
**Tool**: n8n MCP tools (`validate_workflow`, `update_workflow`, `publish_workflow`).
**Skills to use**: Invoke the `n8n-mcp-tools-expert` skill and `n8n-node-configuration` skill for SDK help.

### Current bugs in n8n workflows (ALL must be fixed)

1. **Business lookup is broken**: "Get Business Info" node uses `operation: "get"` with `id: entry[0].id`. This tries to find a row by UUID primary key, but `entry[0].id` is the Facebook Page ID (a string like `100065686834933`). **Fix**: Change to query by `page_id` column.

2. **No Facebook reply**: The workflows generate an AI response and log it, but never actually POST the reply back to Facebook. **Fix**: Add an HTTP Request node after the AI response.

3. **No WhatsApp notification**: When a new lead interacts, the brother (`+201004650795`) should get a WhatsApp message. **Fix**: Add WhatsApp Cloud API call.

4. **All workflows are INACTIVE**: They must be published/activated.

### Task 4.1: Rebuild Comment Handler

Use the n8n MCP tools to update workflow `TdPEIvsmjJ0MBAlg`. The corrected workflow must do this exact flow:

```
Facebook Comment Webhook (path: fb-comment-handler)
  → Extract Comment Data (Set node: extract page_id, comment_id, user_name, message from webhook body)
  → Get Business By Page ID (Supabase node: getAll from "businesses" where page_id equals extracted page_id, limit 1)
  → Generate AI Response (Agent node with OpenRouter/Gemini model, same prompt as current)
  → Reply to Facebook Comment (HTTP Request node: POST to https://graph.facebook.com/v23.0/{comment_id}/comments with message={ai_output} and access_token from business record)
  → Log to Activity Log (Supabase node: insert into activity_log)
  → Send WhatsApp Notification (HTTP Request node: POST to WhatsApp Cloud API)
  → Respond to Webhook (return 200)
```

**Node details for the NEW/CHANGED nodes:**

**Extract Comment Data** (Set node, version 3.4):

- Extract these fields from the webhook body:
  - `page_id` = `{{ $json.body.entry[0].id }}`
  - `comment_id` = `{{ $json.body.entry[0].changes[0].value.comment_id }}`
  - `user_name` = `{{ $json.body.entry[0].changes[0].value.from.name }}`
  - `message` = `{{ $json.body.entry[0].changes[0].value.message }}`

**Get Business By Page ID** (Supabase node, version 1):

- Operation: `getAll`
- Table: `businesses`
- Filter: `page_id` equals `{{ $json.page_id }}`
- Limit: 1
- Credentials: use existing Supabase credential

**Reply to Facebook Comment** (HTTP Request node, version 4.3):

- Method: POST
- URL: `https://graph.facebook.com/v23.0/{{ $('Extract Comment Data').item.json.comment_id }}/comments`
- Body (form-urlencoded):
  - `message` = `{{ $json.output }}`
  - `access_token` = `{{ $('Get Business By Page ID').item.json.page_access_token }}`

**Send WhatsApp Notification** (HTTP Request node, version 4.3):

- Method: POST
- URL: `https://graph.facebook.com/v23.0/1053887997812417/messages`
- Headers: `Authorization: Bearer EAANasfBeJw8BRGrfjtetalAdH64amgmd8AdWb8CG5ZBQ77XDPmY4c2izPpWzivWydnvZAGZBZBexAnVTaW63BpXICoEXqWF8lBMp4tBYZAs9rTq7ny1seex4OXVTs80qGFdKOKhNQRmf0zuBGpQNyobVlt3ueVNZASwFgsgUiuaU0vAyBoaLAuUkflocYLzAwcngZDZD`
- Content-Type: `application/json`
- Body (JSON):

```json
{
  "messaging_product": "whatsapp",
  "to": "201004650795",
  "type": "text",
  "text": {
    "body": "🏋️ تعليق جديد على الصفحة!\n\n👤 الاسم: {{ $('Extract Comment Data').item.json.user_name }}\n💬 الرسالة: {{ $('Extract Comment Data').item.json.message }}\n🤖 الرد: {{ $json.output }}"
  }
}
```

**Steps**:

1. Use `get_sdk_reference` to learn the SDK syntax
2. Use `search_nodes` to find correct node types for: `webhook`, `set`, `supabase`, `httpRequest`, `agent`, `lmChatOpenAi`, `respondToWebhook`
3. Use `get_node_types` to get exact parameter schemas
4. Write the complete SDK code following the patterns from the SDK reference
5. Call `validate_workflow` with the code — fix any errors until valid
6. Call `update_workflow` with `workflowId: "TdPEIvsmjJ0MBAlg"` and the validated code

### Task 4.2: Rebuild Messenger Handler

Use the n8n MCP tools to update workflow `LvKx0YGnyNKpQJfw`. Same pattern as Comment Handler but for Messenger:

```
Messenger Webhook (path: messenger-handler)
  → Extract Message Data (Set node: extract page_id, sender_id, user_name, message from webhook body)
  → Get Business By Page ID (Supabase node: same as Comment Handler)
  → Generate AI Response (Agent node: same prompt style, for DM context)
  → Send Messenger Reply (HTTP Request: POST to https://graph.facebook.com/v23.0/me/messages with recipient.id={sender_id} and message.text={ai_output})
  → Log to Activity Log (Supabase node: event_type = "message_reply", platform = "Messenger")
  → Send WhatsApp Notification (HTTP Request: same as Comment Handler but with Messenger-specific text)
  → Respond to Webhook (return 200)
```

**Facebook Messenger webhook payload structure** (so you extract the right fields):

```json
{
  "body": {
    "entry": [
      {
        "id": "PAGE_ID",
        "messaging": [
          {
            "sender": { "id": "USER_PSID" },
            "recipient": { "id": "PAGE_ID" },
            "message": { "mid": "MSG_ID", "text": "Hello" }
          }
        ]
      }
    ]
  }
}
```

**Extract Message Data** fields:

- `page_id` = `{{ $json.body.entry[0].id }}`
- `sender_id` = `{{ $json.body.entry[0].messaging[0].sender.id }}`
- `message` = `{{ $json.body.entry[0].messaging[0].message.text }}`
- `user_name` = `{{ $json.body.entry[0].messaging[0].sender.id }}` (Messenger only gives PSID, not name)

**Send Messenger Reply** (HTTP Request):

- Method: POST
- URL: `https://graph.facebook.com/v23.0/me/messages`
- Headers: `Authorization: Bearer {page_access_token from business record}`
- Body (JSON):

```json
{
  "recipient": { "id": "{{ $('Extract Message Data').item.json.sender_id }}" },
  "message": { "text": "{{ $json.output }}" }
}
```

**Steps**: Same as Task 4.1 — validate → update → verify.

### Task 4.3: Publish (activate) all workflows

After updating both handlers, activate all 4 workflows:

```
Call publish_workflow with workflowId: "TdPEIvsmjJ0MBAlg"  (Comment Handler)
Call publish_workflow with workflowId: "LvKx0YGnyNKpQJfw"  (Messenger Handler)
Call publish_workflow with workflowId: "quQr3eqwe7wcrNCE"  (Lead Handler)
Call publish_workflow with workflowId: "nycDNs6e9oJm42u4"  (Daily Digest)
```

### Verification 4

Use `search_workflows` — all 4 workflows must show `active: true`.

---

## Milestone 5: Deploy to Vercel

**Goal**: Deploy the dashboard to a production URL.
**Tool**: Vercel MCP tools OR CLI commands.

### Task 5.1: Deploy via Vercel MCP

Use the Vercel MCP `deploy_to_vercel` tool:

- Team ID: `team_hL5EoylTU6DGdq4JFmnppVYq`
- Project name: `gymazing-hub`
- Root directory: `dashboard`
- Framework: Next.js
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://txjelclkegfbrzqlcrml.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (the anon key from credentials table above)

If MCP deploy is not available, use CLI:

```bash
cd "c:/github/face page gymazing"
npx vercel link --yes
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://txjelclkegfbrzqlcrml.supabase.co"
npx vercel --prod
```

### Task 5.2: Add Vercel URL to Supabase Auth

After deployment, get the production URL from Vercel (e.g., `https://gymazing-hub.vercel.app`).

Then add it to Supabase Auth redirect URLs via SQL:

```sql
-- Note: Supabase redirect URLs are configured in the dashboard, not via SQL.
-- This is a MANUAL step: Go to Supabase Dashboard → Authentication → URL Configuration
-- Add the Vercel production URL to "Redirect URLs"
-- Also ensure http://localhost:3000 is listed
```

### Verification 5

1. Open the Vercel production URL in a browser
2. Landing page should load
3. Navigate to `/login` — login form should appear

---

## Milestone 6: Configure Meta Webhooks (MANUAL — Cannot Be Automated)

**Goal**: Point Facebook to send webhook events to the n8n production URLs.

> **This milestone requires manual action in the Meta Developer Portal.**
> A model CANNOT do this step. Flag it to the user and skip to Milestone 7.

### Task 6.1: Register webhook URLs

1. Go to [Meta Developer Dashboard](https://developers.facebook.com) → your app → **Webhooks**
2. Select **Page** from dropdown
3. Add these subscriptions:

| Field                 | Callback URL                                                  |
| --------------------- | ------------------------------------------------------------- |
| `feed`                | `https://gymzinghub.app.n8n.cloud/webhook/fb-comment-handler` |
| `messages`            | `https://gymzinghub.app.n8n.cloud/webhook/messenger-handler`  |
| `messaging_postbacks` | `https://gymzinghub.app.n8n.cloud/webhook/messenger-handler`  |

4. Verification Token: use `GYMAZING_SECRET` (must match what n8n expects)

### Task 6.2: Ensure Live Mode

1. Meta Developer Dashboard → **App Settings → Basic**
2. App Mode must be **Live** (not Development)
3. Required permissions: `pages_messaging`, `pages_read_engagement`, `pages_manage_engagement`

---

## Milestone 7: End-to-End Verification

### Task 7.1: Test admin login

1. Open production URL → `/login`
2. Enter: `elshaer2021@gmail.com` / `Profess0r`
3. **Expected**: Redirects to `/dashboard` with stats, leads, and conversations visible

### Task 7.2: Test all dashboard pages

| Page                       | What to check                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `/dashboard`               | Stats cards show numbers, weekly chart renders, recent leads table has data                                           |
| `/dashboard/leads`         | Table shows leads, status filter works                                                                                |
| `/dashboard/conversations` | Conversation list loads, clicking one shows messages                                                                  |
| `/dashboard/analytics`     | Charts render (source breakdown, model usage, weekly leads)                                                           |
| `/dashboard/settings`      | Branches show as cards with name/address/phone, pricing shows plan/price, FAQ shows q/a pairs, tone textarea has text |

### Task 7.3: Test settings save

1. Go to Settings → change the tone instructions text to something new
2. Click "حفظ التغييرات"
3. Refresh the page
4. **Expected**: The new text persists

### Task 7.4: Test demo login

1. Log out → navigate to `/login`
2. Click the demo access button
3. **Expected**: Logs in as demo user, shows Demo Academy data (or minimal data)

### Task 7.5: Test Facebook integration (after Milestone 6 is done)

1. Post a comment on the Facebook page (page ID `100065686834933`)
2. **Expected within 30 seconds**:
   - n8n Comment Handler executes (check n8n execution history)
   - AI reply appears as a response to the comment on Facebook
   - WhatsApp notification arrives at `+201004650795`
   - New row appears in `activity_log` in Supabase
3. Send a Messenger message to the page
4. **Expected**: Same flow — AI reply sent, WhatsApp notification, activity logged

---

## Summary: What Changes Where

### Files modified:

| File                          | Change                                               |
| ----------------------------- | ---------------------------------------------------- |
| `dashboard/package.json`      | Added `@supabase/ssr` dependency                     |
| `dashboard/src/middleware.js` | Full rewrite: cookie-based auth with `@supabase/ssr` |

### Files created:

| File                                   | Purpose                                        |
| -------------------------------------- | ---------------------------------------------- |
| `dashboard/src/lib/supabase-server.js` | Server-side Supabase client for future SSR use |

### Database changes:

| What                                     | Detail                                                                |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `auth.users`                             | 2 new users created                                                   |
| `auth.identities`                        | 2 identity rows created                                               |
| `public.users`                           | 2 rows inserted                                                       |
| `businesses`                             | user_id linked, page_access_token stored, knowledge_base restructured |
| `leads`, `conversations`, `activity_log` | business_id reassigned from test to production                        |
| RLS policies                             | 6 "Allow all" dropped, 2 UPDATE policies added                        |

### n8n workflows:

| Workflow                               | Change                                                               |
| -------------------------------------- | -------------------------------------------------------------------- |
| Comment Handler (`TdPEIvsmjJ0MBAlg`)   | Fixed business lookup, added Facebook reply + WhatsApp notification  |
| Messenger Handler (`LvKx0YGnyNKpQJfw`) | Fixed business lookup, added Messenger reply + WhatsApp notification |
| Lead Handler (`quQr3eqwe7wcrNCE`)      | Activated (no code changes)                                          |
| Daily Digest (`nycDNs6e9oJm42u4`)      | Activated (no code changes)                                          |

### External (manual):

| What                  | Detail                                           |
| --------------------- | ------------------------------------------------ |
| Meta Developer Portal | Webhook URLs pointed to n8n production endpoints |
| Supabase Dashboard    | Vercel URL added to auth redirect list           |
