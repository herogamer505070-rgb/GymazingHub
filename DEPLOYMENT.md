# 🚀 Gymazing Hub - Deployment & Handover Guide

This guide provides everything you need to deploy the **Gymazing Hub** dashboard to production and link it with the Facebook automation workflows.

---

## 1. Dashboard Deployment (Next.js)

### Platform: [Vercel](https://vercel.com) (Recommended)
1. **Connect Repository**: Import the `face page gymazing` repository.
2. **Root Directory**: Select `dashboard`.
3. **Environment Variables**: Add the following precisely from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://txjelclkegfbrzqlcrml.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your Project Anon Key)
4. **Build Settings**: 
   - Framework: `Next.js`
   - Install Command: `npm install`
   - Build Command: `npm run build`

---

## 2. n8n Productionalization

### Switch to Production Webhooks
In your n8n instance, each webhook node has two URLs:
- **Test URL**: `/webhook-test/...` (Use for testing inside n8n).
- **Production URL**: `/webhook/...` (Use for real Facebook messages).

**Production Webhook Endpoints:**
- **Comment Handler**: `https://gymzinghub.app.n8n.cloud/webhook/fb-comment-handler`
- **Messenger Handler**: `https://gymzinghub.app.n8n.cloud/webhook/messenger-handler`

> [!IMPORTANT]
> **Manual Credential Linking**: Ensure you have linked your **Supabase** and **OpenRouter** credentials in n8n for these workflows to work in production.

---

## 3. Meta Developer Portal Setup

1. **Webhook Registration**:
   - Go to your Facebook App -> **Webhooks**.
   - select **Page** from the dropdown.
   - Subscribe to the production URLs above.
   - **Verification Token**: You can set any secret string (e.g. `GYMAZING_SECRET`) in both n8n and Facebook.
2. **App Permissions**:
   - Ensure the app is in **Live Mode**.
   - Request `pages_messaging` and `pages_read_engagement`.

---

## 4. Manual Account Provisioning (SQL)

Since we are doing manual setups for managers, use the following SQL in the **Supabase SQL Editor** to add new clients:

### Step A: Register the Business
```sql
INSERT INTO businesses (id, name, page_id, knowledge_base, tone_instructions)
VALUES (
  'UNIQUE_BUSINESS_ID', 
  'Business Name', 
  'FACEBOOK_PAGE_ID', 
  '{"schedules": "...", "prices": "..."}'::jsonb, 
  'Friendly gym tone'
);
```

### Step B: Link the User (Manager)
1. Invite the user via **Supabase Auth** dashboard.
2. Get their `user_id` from the Auth table.
3. run this:
```sql
UPDATE businesses 
SET user_id = 'THE_AUTH_USER_ID' 
WHERE id = 'UNIQUE_BUSINESS_ID';

INSERT INTO users (id, email, full_name, business_id)
VALUES (
  'THE_AUTH_USER_ID', 
  'manager@email.com', 
  'Manager Name', 
  'UNIQUE_BUSINESS_ID'
);
```

---

## 🏋️ AI Persona (Gymnastics)
The AI is now tuned to behave like a **Gymnastics Coach (Captain)**:
- **Language**: Egyptian Arabic ("يا بطل", "كابتن").
- **Persona**: Energetic, professional, encourages body-building and confidence.
- **Key CTA**: Always offers a **Free Trial Session** and asks for the **child's age**.

---

### Need Help?
If you hit any issues during deployment, I am here to help. Reach out to me for specific debugging!
