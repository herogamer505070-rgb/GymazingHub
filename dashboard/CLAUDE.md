# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gymazing Hub** — AI-powered Facebook Page Manager dashboard for Arabic-speaking gym/gymnastics businesses. Built with Next.js 16 + React 19, connected to Supabase for data and n8n for Facebook automation workflows.

The dashboard monitors Facebook/Messenger/Instagram interactions, tracks leads, displays analytics, and manages business knowledge base settings. All UI is RTL Arabic (Egyptian dialect).

## Tech Stack

- **Next.js 16.2.2** (App Router, no Pages Router)
- **React 19.2.4** (hooks only, no class components)
- **JavaScript** (no TypeScript — uses jsconfig.json for `@/` path aliases)
- **Tailwind CSS 4** (new `@theme` syntax in globals.css, no tailwind.config.js)
- **Supabase** (PostgreSQL + Auth — direct client queries, no ORM)
- **Recharts 3** (analytics charts)
- **Lucide React** (icons)
- **date-fns 4** (date formatting)

## Commands

All commands run from the `dashboard/` directory:

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint with Next.js core-web-vitals
```

## Architecture

### Monorepo Layout

```
/                        # Root — docs, plans, screenshots
/dashboard/              # Next.js application (this is the app)
/dashboard/src/          # All source code
```

### App Router Structure (`src/app/`)

- `layout.js` — Root layout: IBM Plex Sans Arabic font, RTL `<html dir="rtl" lang="ar">`
- `page.js` — Public landing page (marketing)
- `login/page.js` — Email/password login via Supabase Auth
- `dashboard/layout.js` — Wraps all dashboard routes with `AuthProvider` + `Sidebar`
- `dashboard/page.js` — Main dashboard: stats cards, activity chart, recent leads
- `dashboard/leads/page.js` — Leads table with filtering
- `dashboard/conversations/page.js` — Chat history viewer
- `dashboard/analytics/page.js` — 7+ Recharts visualizations
- `dashboard/settings/page.js` — Knowledge base editor (branches, schedules, pricing, FAQ, tone)

### Data Flow Pattern

Pages → Custom Hooks → Supabase Client → PostgreSQL

- **No API routes** — all data fetching happens client-side via Supabase JS SDK
- **Custom hooks** (`src/hooks/`) each manage their own `useState` + `useEffect` + Supabase query
- **Mock data** (`src/lib/mock-data.js`) serves as fallback when Supabase returns empty

### Key Modules

| Directory                       | Purpose                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `src/hooks/useStats.js`         | Daily/weekly stats, lead counts, response times                                 |
| `src/hooks/useLeads.js`         | Leads list with snake_case→camelCase mapping                                    |
| `src/hooks/useConversations.js` | Conversations with nested messages                                              |
| `src/hooks/useActivityLog.js`   | Activity log + analytics aggregations                                           |
| `src/context/AuthContext.js`    | Session state, `businessId` lookup, auth listener                               |
| `src/lib/supabase.js`           | Supabase client init + `getCurrentBusinessId()`                                 |
| `src/lib/utils.js`              | `formatDate`, `getScoreColor`, `getStatusBadge`, `getSourceBadge`, `calcChange` |
| `src/lib/mock-data.js`          | Fallback data matching Supabase schema shape                                    |
| `src/middleware.js`             | Redirects unauthenticated users from `/dashboard/*` to `/login`                 |

### Components (`src/components/`)

All presentational — receive data via props, no direct Supabase calls:

- `Sidebar.jsx` — Nav with collapse, mobile overlay, user profile
- `StatsCards.jsx` — 4 metric cards with trend arrows
- `ActivityChart.jsx` — Weekly line chart (Recharts)
- `LeadsTable.jsx` — Filterable data table
- `LeadScoreGauge.jsx` — Visual score indicator (0-10 scale)
- `ConversationPreview.jsx` — Chat list preview
- `ConversationView.jsx` — Full message thread
- `LoadingSpinner.jsx` — Loading state

## Supabase Database Schema

| Table           | Key Columns                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `businesses`    | `id`, `user_id`, `name`, `page_id`, `knowledge_base` (JSONB), `tone_instructions`                      |
| `leads`         | `id`, `business_id`, `name`, `phone`, `source`, `interest`, `lead_score`, `status`, `conversation_log` |
| `conversations` | `id`, `business_id`, `user_name`, `platform`, `lead_score`                                             |
| `messages`      | `id`, `conversation_id`, `sender`, `text`, `time`, `ai_model`                                          |
| `activity_log`  | `id`, `business_id`, `event_type`, `platform`, `user_name`, `ai_model`, `tokens_used`                  |

Auth links users to businesses via `businesses.user_id` → Supabase Auth user ID.

## Styling System

- **No tailwind.config.js** — Tailwind v4 uses `@theme` blocks in `src/app/globals.css`
- Dark mode only (background `#0a0e1a`)
- Glassmorphism cards with `backdrop-filter: blur`
- CSS custom properties for all colors, gradients, shadows
- Custom animations: `fadeInUp`, `slideInRight`, `pulse-glow`, `countUp`
- Recharts custom overrides in globals.css

## Critical Conventions

- **RTL Arabic** — All text content uses Egyptian Arabic. Layout is right-to-left.
- **Next.js 16 breaking changes** — Read `node_modules/next/dist/docs/` before using any Next.js API. Do not assume training data is current.
- **`'use client'`** — All pages under `dashboard/` and all hooks/components use client-side rendering. Add `'use client'` directive to any new client component.
- **Path alias** — Use `@/` to import from `src/` (e.g., `import { supabase } from '@/lib/supabase'`)
- **No TypeScript** — This is a JS project. Do not add `.ts`/`.tsx` files.
- **Supabase queries** — Use direct `.from().select().eq()` pattern. No ORM, no API routes.
- **Environment vars** — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

## Deployment

- **Platform**: Vercel
- **Root directory**: `dashboard`
- **n8n webhooks**: Comment handler and Messenger handler at `gymzinghub.app.n8n.cloud`
- **Account provisioning**: Manual SQL in Supabase (see DEPLOYMENT.md)
