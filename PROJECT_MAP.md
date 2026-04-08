# SuperPen Frontend Project Map

Last updated: 2026-04-08
Project root: `C:/Users/dresden/Documents/superpen/superpen-frontend`

This document is a high-context map of the repository for use with an LLM.
It is designed to help another model understand the project before generating prompts, tasks, or code changes.

## 1) Project identity

- Name: `superpen-frontend`
- Version: `0.1.2`
- Type: Next.js app using the App Router
- Purpose:
  - Public marketing / landing site for SuperPen
  - Download distribution UI for current and past releases
  - Admin login and admin dashboard for release management
  - Analytics tracking proxy and analytics admin dashboards
- Product domain:
  - SuperPen is presented as a Qt-based screen annotation overlay / lightweight digital whiteboard
  - Current messaging strongly targets teachers, tutors, presenters, and on-screen explanation workflows
  - Current release focus is Windows, with some copy referencing broader cross-platform direction

## 2) Tech stack

### Core
- Next.js `16.2.1`
- React `19.2.4`
- React DOM `19.2.4`
- TypeScript `^5`

### Styling / UI
- Tailwind CSS `^4`
- `@tailwindcss/postcss` `^4`
- Heavy use of utility classes in JSX
- Custom CSS variables in `src/app/globals.css`
- Light/dark/system theme switching handled manually via `data-theme`

### Animation
- Framer Motion `^12.38.0`

### Tooling
- ESLint `^9`
- `eslint-config-next` `16.2.1`
- React Compiler enabled via Next config and Babel plugin present in devDependencies

## 3) Package scripts

From `package.json`:

- `npm run dev` → `next dev`
- `npm run build` → `next build`
- `npm run start` → `next start`
- `npm run lint` → `eslint`

## 4) Current quality / status checks

- `npm run lint` passes
- `npx tsc --noEmit` passes
- No test framework is configured
- Public landing page now supports English and Turkish localization with locale persistence, browser/request detection, and a navbar language switcher
- Recent landing-page UI work added a race-style comparison section, accent-driven audience cards, and custom navbar hash scrolling offsets for sticky-header-safe in-page navigation
- No `TODO`, `FIXME`, `HACK`, or `XXX` markers were found outside generated/vendor dirs

## 5) Important repository rules

From `AGENTS.md`:

- This project uses a newer / breaking-change Next.js version
- When writing code, relevant docs under `node_modules/next/dist/docs/` should be read first
- This matters especially for route handlers, middleware, metadata, and file conventions

## 6) Top-level repository structure

```text
.
├─ .env
├─ .env.example
├─ .env.netlify.example
├─ .git/
├─ .next/
├─ AGENTS.md
├─ CLAUDE.md
├─ eslint.config.mjs
├─ middleware.ts
├─ netlify.toml
├─ next.config.ts
├─ next-env.d.ts
├─ node_modules/
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ public/
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src/
│  ├─ app/
│  └─ lib/
├─ tsconfig.json
└─ tsconfig.tsbuildinfo
```

## 7) Source tree map

```text
src/
├─ app/
│  ├─ admin/
│  │  ├─ login/page.tsx
│  │  └─ page.tsx
│  ├─ api/
│  │  ├─ admin/
│  │  │  ├─ analytics/
│  │  │  │  ├─ export/top/route.ts
│  │  │  │  ├─ overview/route.ts
│  │  │  │  └─ timeline/route.ts
│  │  │  ├─ releases/
│  │  │  │  ├─ [version]/route.ts
│  │  │  │  ├─ current/route.ts
│  │  │  │  └─ route.ts
│  │  │  └─ session/
│  │  │     ├─ login/route.ts
│  │  │     ├─ logout/route.ts
│  │  │     └─ route.ts
│  │  ├─ analytics/track/route.ts
│  │  └─ releases/download/route.ts
│  ├─ AdminPanel.tsx
│  ├─ AnalyticsTracker.tsx
│  ├─ AudienceSection.tsx
│  ├─ CapabilitiesSection.tsx
│  ├─ ComparisonSection.tsx
│  ├─ CtaSection.tsx
│  ├─ FaqSection.tsx
│  ├─ FeaturesSection.tsx
│  ├─ Hero.tsx
│  ├─ LocaleProvider.tsx
│  ├─ Navbar.tsx
│  ├─ Reveal.tsx
│  ├─ WorkflowSection.tsx
│  ├─ landing-content.ts
│  ├─ layout.tsx
│  ├─ opengraph-image.tsx
│  ├─ page.tsx
│  ├─ robots.ts
│  ├─ sitemap.ts
│  ├─ twitter-image.tsx
│  └─ globals.css
└─ lib/
   ├─ admin-api.ts
   ├─ admin-auth-shared.ts
   ├─ admin-jwt.ts
   ├─ admin-session.ts
   ├─ download-tracking.ts
   ├─ i18n.ts
   ├─ superpen-api.ts
   └─ superpen-api-server.ts
```

## 8) Architecture summary

The app has 4 major concerns:

1. **Public landing page**
   - SEO-driven marketing page
   - Built from centralized locale-aware content plus live site/release data fetched from the backend service
   - Includes animated demo, download CTAs, a theme switcher, and a language switcher

2. **Release data integration**
   - Frontend fetches site data from a separate backend / release server
   - Public release data comes from `/api/public/site-data` on the backend
   - Admin release operations are proxied through Next route handlers to the backend

3. **Admin auth + dashboard**
   - Login happens through a Next route handler, not directly in the browser against the backend
   - Release-server JWT is stored in an HTTP-only cookie
   - Middleware protects `/admin` and `/api/admin/*`
   - Admin panel includes release management + analytics views

4. **Analytics collection and reporting**
   - Client-side tracker sends events to a Next route handler
   - Next route handler enriches payload with geo/device-related request headers and proxies to backend analytics API
   - Download redirects also generate analytics events
   - Admin dashboard can view overview, timeline, and export top reports

## 9) Runtime data flow

### Public page flow
1. Browser requests `/`
2. `src/app/layout.tsx` resolves initial locale using shared i18n helpers with order: locale cookie -> `Accept-Language` -> default `en`
3. `src/app/page.tsx` runs on server
4. `getSiteData()` in `src/lib/superpen-api-server.ts` requests backend `/api/public/site-data`
5. Page renders locale-aware marketing content plus fetched `currentRelease` / `releases`
6. `src/app/LocaleProvider.tsx` safely reconciles client locale using saved localStorage preference, then browser language, then fallback
7. Client-side `AnalyticsTracker` mounts and starts sending events

### Admin login flow
1. User goes to `/admin/login`
2. Middleware allows login page but redirects authenticated users to `/admin`
3. Login form posts to `/api/admin/session/login`
4. Route handler calls backend `/auth/login`
5. Returned JWT is stored in HTTP-only cookie `superpen-admin-session`
6. Client redirects to requested admin route

### Admin protected API flow
1. Admin UI calls `/api/admin/...`
2. Middleware checks `superpen-admin-session` cookie
3. Middleware validates JWT signature/issuer/expiry locally
4. Route handler proxies request to backend with `Authorization: Bearer <jwt>`

### Analytics event flow
1. `AnalyticsTracker` sends event to `/api/analytics/track`
2. Next route handler reads body and request headers
3. Route handler obtains service token using backend service credentials
4. Route handler forwards event to backend `/api/analytics/track`

### Download tracking flow
1. User clicks download CTA
2. Link targets `/api/releases/download?...`
3. Route handler optionally logs `download_started` and `download_completed`
4. User gets redirected to actual binary URL with HTTP 307

## 10) Route inventory

### Public pages
- `/` → landing page
- `/admin` → admin dashboard
- `/admin/login` → admin sign-in page

### Metadata/file routes
- `/robots.txt` generated by `src/app/robots.ts`
- `/sitemap.xml` generated by `src/app/sitemap.ts`
- `/opengraph-image` generated by `src/app/opengraph-image.tsx`
- `/twitter-image` re-exports opengraph image

### Internal API routes exposed by Next

#### Admin session
- `GET /api/admin/session`
  - Returns `{ authenticated: boolean }`
  - Only checks cookie presence via `getAdminSessionToken()`, not full JWT validity
  - Middleware separately enforces validity on protected access
- `POST /api/admin/session/login`
  - Body: `{ username, password }`
  - Calls backend login and sets cookie
- `POST /api/admin/session/logout`
  - Clears cookie

#### Admin releases
- `GET /api/admin/releases`
- `POST /api/admin/releases`
- `POST /api/admin/releases/current`
- `DELETE /api/admin/releases/[version]`
- All proxied to backend admin release endpoints

#### Admin analytics
- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/export/top`
- `GET /api/admin/analytics/timeline?visitorId=...&sessionId=...`
- All proxied to backend admin analytics endpoints

#### Public analytics + download
- `POST /api/analytics/track`
  - Requires eventType in payload
  - Uses service token to forward analytics event to backend
- `GET /api/releases/download?...`
  - Redirect endpoint for tracked downloads

## 11) Middleware behavior

File: `middleware.ts`

Protected patterns:
- `/admin/:path*`
- `/api/admin/:path*`

Logic:
- Non-admin paths pass through
- `/api/admin/session*` is excluded from auth gating
- Reads cookie `superpen-admin-session`
- Calls `verifyAdminJwt(token)`
- For admin API routes:
  - valid token → continue
  - invalid token → clear cookie and return `401 { error: "Unauthorized" }`
- For `/admin/login`:
  - valid token → redirect `/admin`
  - invalid token → continue with cleared cookie
- For other admin pages:
  - valid token → continue
  - invalid token → redirect to `/admin/login?next=<original path+search>` and clear cookie

## 12) Authentication model

### Cookie
- Name: `superpen-admin-session`
- HTTP-only: yes
- SameSite: `lax`
- Secure: only in production
- Path: `/`

### JWT verification
Implemented locally in `src/lib/admin-jwt.ts`:
- Supports only `HS256`
- Verifies structure `header.payload.signature`
- Checks issuer against:
  - `process.env.SUPERPEN_JWT_ISSUER`
  - fallback `superpen-release-server`
- Checks expiration `exp`
- Verifies HMAC SHA-256 signature using Web Crypto
- Uses constant-time byte comparison

### Important auth nuance
`GET /api/admin/session` only checks whether the cookie exists. It does **not** validate the token there. Real protection still happens in middleware and admin API middleware path handling. This means the UI may briefly think it is authenticated until a protected request returns 401.

## 13) Backend dependency / external service contract

The frontend depends on a separate backend / release server, configured by base URL env vars.

Known backend endpoints used:

### Auth
- `POST /auth/login`

### Public
- `GET /api/public/site-data`

### Admin releases
- `GET /api/admin/releases`
- `POST /api/admin/releases`
- `POST /api/admin/releases/current`
- `DELETE /api/admin/releases/:version`

### Admin analytics
- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/export/top`
- `GET /api/admin/analytics/timeline`

### Public/service analytics
- `POST /api/analytics/track`

## 14) Shared domain types

Defined in `src/lib/superpen-api.ts`.

### Release
```ts
{
  version: string
  channel: string
  platform: string
  downloadUrl: string
  publishedAt: string
  summary: string
  notes: string[]
  fileSize: string
  checksum: string
}
```

### SiteData
```ts
{
  productName: string
  currentVersion: string
  currentRelease: Release | null
  releases: Release[]
  generatedAt: string
}
```

### LoginResponse
```ts
{
  token: string
  user: { username: string }
  expiresInMinutes: number
}
```

### AnalyticsOverview
Includes:
- summary metrics
- funnel
- trafficByDay
- geoByCountry
- clicksByTarget
- downloadsByRelease
- devices
- referrers
- retention
- apiPerformance
- recentEvents
- alerts

### AnalyticsExport
Includes:
- generatedAt
- topPages
- topCountries
- topReleases

### AnalyticsTimelineEvent
Fields include:
- eventType
- occurredAt
- visitorId
- sessionId
- path
- label
- targetId
- releaseVersion
- elapsedSeconds
- country
- browser
- os

## 15) Public landing page composition

Main page file: `src/app/page.tsx`

It renders, in order:
1. JSON-LD structured data script
2. `AnalyticsTracker`
3. `Navbar`
4. `Hero`
5. `FeaturesSection`
6. `ComparisonSection`
7. `WorkflowSection`
8. `AudienceSection`
9. `CapabilitiesSection`
10. `FaqSection`
11. `CtaSection`

### Page metadata
- Title: `Superpen | Qt screen annotation overlay in alpha early access`
- Canonical: `/`
- Keyword-focused description for screen annotation / overlay product positioning

### Layout metadata (`src/app/layout.tsx`)
- `metadataBase = https://superpen.app`
- Includes Open Graph + Twitter metadata
- Description here differs from homepage wording and leans more toward "digital whiteboard for math teachers and students"

## 16) Messaging / brand positioning currently in code

There are **two overlapping product narratives** in the codebase:

### Narrative A: screen annotation overlay
Found heavily in:
- `page.tsx`
- `Hero.tsx`
- `landing-content.ts`
- comparison/content sections

Themes:
- transparent desktop overlay
- annotate over slides, PDFs, apps, websites
- pen, highlighter, shapes, screenshots
- toolbar / click-through / board mode

### Narrative B: friendly digital whiteboard for math
Found mainly in:
- `layout.tsx` metadata
- `opengraph-image.tsx`

Themes:
- digital whiteboard
- math teachers and students
- calm classroom-ready UI

This is important context for future prompting because branding/copy work may need to unify or preserve one of these narratives deliberately.

## 17) Landing content constants

Defined in `src/app/landing-content.ts`.

### Localization structure
- Centralized bilingual landing-page copy for `en` and `tr`
- Includes navbar labels, hero copy, section headings, comparison labels, FAQ, CTA copy, and structured-data defaults
- Exposes `getLandingContent(locale)` so homepage UI reads from one content source

### Features emphasized
- annotate on top of screen
- fast tool switching
- built-in teaching utilities

### Workflow emphasized
- launch overlay
- draw/type/capture
- persistent preferences

### Audience emphasized
- teaching and tutoring
- demos and presentations

### Capability emphasized
- math and shape tools
- screenshot workflow
- personalized workspace

### Competitive comparison target
- Epic Pen

### FAQ themes
- who it is for
- what current alpha can do
- current platform (Windows) vs broader direction

### Structured data
- `SoftwareApplication`
- operating system: Windows
- price: 0 USD
- softwareVersion default in static object: `0.1.2-alpha`
- runtime page overrides `softwareVersion` and `downloadUrl` using backend site data

## 18) UI component notes

### `Navbar.tsx`
- Client component
- Theme switch cycles through `system -> light -> dark`
- Stores preference in `localStorage['superpen-theme']`
- Writes to `document.documentElement.dataset.themePreference`
- Writes resolved mode to `document.documentElement.dataset.theme`
- Reads theme state through a hydration-safe client snapshot/store to avoid SSR/client text mismatches
- Includes an `EN` / `TR` language switcher in the navbar
- Explicit locale changes persist to both `localStorage['superpen-locale']` and cookie `superpen-locale`
- Links to in-page anchors: features, workflow, FAQ, download
- Uses custom hash scrolling instead of raw anchor jumps so sticky-navbar height/top spacing are accounted for
- Repositions direct hash loads on mount so deep links land below the sticky navbar instead of underneath it

### `Hero.tsx`
- Client component
- Framer Motion animated hero
- Interactive mock demo with 3 modes:
  - `annotate`
  - `screenshot`
  - `board`
- Reads `currentRelease` and enables tracked primary CTA only when a release exists
- Download CTA points to tracked redirect endpoint
- Hero copy and demo labels are now locale-aware via `LocaleProvider`

### `Reveal.tsx`
- Small reusable in-view animation wrapper using Framer Motion

### Content sections
- Mostly presentational, driven by `landing-content.ts`
- Styled as soft glassmorphism / cards with coral/mint palette
- `ComparisonSection.tsx` is no longer a simple table/card hybrid; it is now a race-metaphor comparison panel with sticky headers, per-row reveal timing, animated score bars, a pulsing Superpen finish dot, and a vertical scroll rail
- `AudienceSection.tsx` now uses accent-cycled audience cards with emoji icons, explicit animated bullet markers, and an optional featured middle card when exactly 3 audience cards are present

### `CtaSection.tsx`
- Shows current release summary if present
- Shows up to 4 recent releases with download buttons
- Uses tracked download redirect links
- Formats release dates using the active locale (`en-US` / `tr-TR`)

## 19) Admin dashboard details

Main file: `src/app/AdminPanel.tsx`

This is a large client component handling both login state and the full admin UI.

### Main responsibilities
- check current session on mount
- perform login
- fetch release dashboard data
- fetch analytics overview
- export analytics report JSON
- load user timeline by visitor/session id
- create/update release
- set current release
- delete release
- logout

### State handled locally
- auth state
- session check loading state
- login form
- release form
- timeline lookup form
- release data
- analytics overview data
- analytics export snapshot
- timeline events
- status message
- busy state

### Admin UI sections
- sign-in screen when unauthenticated
- analytics summary cards
- alerts panel
- conversion funnel
- downloads by release table
- clicks by target
- geographic results
- export snapshot panels
- device mix charts
- traffic by day table
- API performance table
- referrers
- recent events
- release create/update form
- published releases list with edit/current/delete actions
- user timeline lookup

### Notable implementation details
- `authenticatedFetch()` redirects to `/admin/login?next=...` on 401
- release form reuses data from existing release via `toFormState(release)`
- top analytics export is downloaded in-browser as JSON blob
- all charts are simple custom UI, no chart library used

## 20) Analytics tracking details

### Client tracker (`src/app/AnalyticsTracker.tsx`)
Creates / manages:
- persistent visitor id in `localStorage['superpen-visitor-id']`
- per-tab/session id in `sessionStorage['superpen-session-id']`
- session start timestamp in `sessionStorage['superpen-session-started-at']`
- mirror cookies:
  - `superpen-visitor-id`
  - `superpen-session-id`

### Events emitted
- `page_view` on mount
- `session_heartbeat` every 15 seconds
- `session_end` on `pagehide` and `beforeunload`
- generic click tracking from elements with `data-analytics-event`
- if eventType is not `click`, tracker emits both:
  - a generic `click`
  - the specific event type

### Payload fields included by tracker
- visitorId
- sessionId
- path
- pageTitle
- referrer
- occurredAt
- event-specific extra fields

### Tracked DOM dataset fields supported
- `data-analytics-event`
- `data-analytics-label`
- `data-analytics-target`
- `data-analytics-release`

### Server analytics proxy (`src/app/api/analytics/track/route.ts`)
- Accepts JSON or raw JSON text body
- Requires `eventType`
- Adds geo fields from headers when missing
- Forwards user-agent and forwarding headers to backend
- Needs a service token obtained from backend credentials

## 21) Download tracking implementation

### Helper
`src/lib/download-tracking.ts`
- `buildTrackedDownloadUrl(release, label, target, path = "/")`
- Produces `/api/releases/download?...`

### Redirect route
`src/app/api/releases/download/route.ts`
- Reads query params:
  - `release`
  - `url`
  - `visitorId` (optional, usually from cookie fallback)
  - `sessionId` (optional, usually from cookie fallback)
  - `label`
  - `target`
  - `path`
- Emits backend analytics events if service token exists:
  - `download_started`
  - `download_completed`
- Redirects to actual `downloadUrl` with status `307`

### Important nuance
`download_completed` is emitted before the actual binary transfer is verified. In practice this means "completed redirect flow" rather than guaranteed downloaded-to-disk completion.

## 22) Server-side helper modules

### `src/lib/superpen-api.ts`
Responsibilities:
- type definitions
- API base URL resolution
- backend login helper

Behavior:
- Base URL resolution preference:
  1. `SUPERPEN_API_BASE_URL`
  2. `NEXT_PUBLIC_SUPERPEN_API_BASE_URL`
  3. fallback `http://127.0.0.1:8787`
- trailing slashes are trimmed

### `src/lib/superpen-api-server.ts`
Responsibilities:
- service login using env creds
- service token retrieval
- fetching public site data server-side

Behavior:
- returns safe default site data on backend failure
- if backend returns partial data, fills reasonable defaults

### `src/lib/admin-api.ts`
Responsibilities:
- proxy authenticated admin requests from Next to backend
- inject `Authorization: Bearer <admin session token>`
- return backend response body and content-type
- convert missing session to 401 JSON
- convert proxy failures to 502 JSON

### `src/lib/admin-session.ts`
Responsibilities:
- get/set/clear admin session cookie using `next/headers`

### `src/lib/admin-auth-shared.ts`
Exports:
- `ADMIN_SESSION_COOKIE = 'superpen-admin-session'`
- `DEFAULT_SUPERPEN_JWT_ISSUER = 'superpen-release-server'`

## 23) SEO / metadata / robots

### `src/app/layout.tsx`
Defines site-wide metadata including:
- default title/template
- description
- Open Graph metadata
- Twitter metadata
- category = education
- server-side initial locale resolution and `LocaleProvider` wiring
- inline theme bootstrap script rendered directly in layout body for pre-hydration theme sync

### `src/app/page.tsx`
Defines homepage-specific metadata including:
- title
- description
- keywords
- canonical

### `src/app/opengraph-image.tsx`
- Generates OG image using `next/og`
- Visual emphasizes math classroom / graph demo

### `src/app/twitter-image.tsx`
- Re-exports same OG implementation

### `src/app/robots.ts`
- allow all
- sitemap points to `https://superpen.app/sitemap.xml`

### `src/app/sitemap.ts`
- only includes homepage URL right now
- `lastModified` is dynamic `new Date()` at request/build time

## 24) Styling system

Main file: `src/app/globals.css`

### Characteristics
- Tailwind imported via `@import "tailwindcss"`
- custom dark variant based on `[data-theme="dark"]`
- CSS variable-driven design tokens
- warm light theme + dark slate theme
- custom scrollbars
- serif display font stack + sans body stack
- background gradients and glassmorphism surfaces

### Core palette tokens
- Coral accent: `#ff7f66`
- Gold accent: `#f6c453`
- Mint accent: `#72d5b7`
- Foreground light: `#25413a`
- Background light: `#fffaf3`
- Background dark: `#0f1414`

## 25) Build and deploy config

### Next config
File: `next.config.ts`
- `reactCompiler: true`
- otherwise minimal/default

### TypeScript config
File: `tsconfig.json`
- strict mode on
- `moduleResolution: bundler`
- path alias: `@/* -> ./src/*`
- includes `.next/types/**/*.ts` and `.next/dev/types/**/*.ts`

### ESLint config
File: `eslint.config.mjs`
- uses Next core web vitals config
- uses Next TypeScript config
- custom ignore list keeps `.next`, `out`, `build`, `next-env.d.ts`

### PostCSS
File: `postcss.config.mjs`
- uses `@tailwindcss/postcss`

### Netlify
File: `netlify.toml`
- build command: `npm run build`
- env: `NETLIFY_NEXT_SKEW_PROTECTION = "true"`

## 26) Environment variables

Documented in README and example env files.

### Required / relevant
- `NEXT_PUBLIC_SUPERPEN_API_BASE_URL`
  - public/client-visible base URL
- `SUPERPEN_API_BASE_URL`
  - server-side base URL
- `SUPERPEN_API_USERNAME`
  - backend service/admin username for internal requests
- `SUPERPEN_API_PASSWORD`
  - backend service/admin password for internal requests
- `SUPERPEN_JWT_SECRET`
  - shared secret for validating admin JWT in middleware
- `SUPERPEN_JWT_ISSUER`
  - expected JWT issuer

### Security note
- `.env` exists in repo root but actual secret values are intentionally not reproduced in this map
- Prefer sharing `.env.example` or sanitized values with external LLMs

## 27) Known design and implementation nuances

1. **Branding is slightly inconsistent**
   - Some code says “screen annotation overlay”
   - Some metadata says “digital whiteboard for math teachers and students”

2. **Admin session check is shallow**
   - `/api/admin/session` checks cookie presence, not token validity

3. **Download completed metric is optimistic**
   - It marks completion at redirect time, not confirmed file completion

4. **Admin UI is monolithic**
   - `AdminPanel.tsx` is very large and mixes auth, analytics, releases, and UI rendering

5. **Backend contract is assumed**
   - Frontend has no local mocks or validation layer beyond basic error handling

6. **No tests**
   - Safety relies on linting and manual runtime checks

## 28) Safe prompt context for another LLM

Use the following when asking another LLM to help create prompts/tasks for this repo:

```text
Project: superpen-frontend
Framework: Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion
Purpose: marketing site + tracked download flow + admin dashboard + analytics proxy for the SuperPen desktop app

Key architecture:
- Public landing page at /
- Admin pages at /admin and /admin/login
- Next route handlers proxy admin and analytics requests to a separate backend/release server
- Admin auth uses backend-issued HS256 JWT stored in HTTP-only cookie `superpen-admin-session`
- Next middleware protects /admin/* and /api/admin/* and locally validates JWT signature, issuer, and exp
- Client analytics tracker creates visitor/session IDs and posts events to /api/analytics/track
- Download links are wrapped with /api/releases/download so analytics events can be logged before redirecting to the real asset URL

Important files:
- src/app/page.tsx
- src/app/layout.tsx
- src/app/AdminPanel.tsx
- src/app/AnalyticsTracker.tsx
- src/app/api/**
- src/lib/superpen-api.ts
- src/lib/superpen-api-server.ts
- src/lib/admin-api.ts
- src/lib/admin-jwt.ts
- middleware.ts
- src/app/landing-content.ts
- src/app/globals.css

Constraints / caveats:
- Next.js version is 16.2.1 and project instructions warn that APIs may differ from older Next.js knowledge
- No tests are configured
- Branding/copy currently mixes two narratives: “screen annotation overlay” and “digital whiteboard for math teachers/students”
- Backend API is external and must be preserved when changing frontend code
- Do not expose real .env secrets; only reference documented env vars

Desired coding style:
- TypeScript strict mode
- Utility-first Tailwind classes
- Existing UI uses warm glassmorphism style with coral/mint accents
- Motion is done with Framer Motion
- Prefer preserving current structure unless task explicitly calls for refactor
```

## 29) File-by-file quick summary

### Root
- `README.md` — setup and env documentation
- `middleware.ts` — admin/auth protection layer
- `next.config.ts` — Next config with React Compiler enabled
- `netlify.toml` — Netlify build settings
- `eslint.config.mjs` — lint config
- `postcss.config.mjs` — Tailwind PostCSS plugin config
- `tsconfig.json` — TS compiler settings and alias

### `src/app`
- `layout.tsx` — global metadata + initial theme hydration script + server-side locale resolution
- `page.tsx` — homepage assembly + server-side site data fetch
- `landing-content.ts` — centralized bilingual landing-page copy and content structures
- `globals.css` — design tokens and global styling
- `LocaleProvider.tsx` — client locale provider/store for landing-page localization
- `Navbar.tsx` — header + theme switcher + language switcher
- `Hero.tsx` — animated hero and interactive product demo with locale-aware copy
- `FeaturesSection.tsx` — feature cards
- `ComparisonSection.tsx` — race-style Epic Pen comparison with sticky headers, per-row animated bars, and scroll-driven side rail
- `WorkflowSection.tsx` — workflow steps
- `AudienceSection.tsx` — accent-cycled audience cards with featured-center-card behavior for 3-card layouts
- `CapabilitiesSection.tsx` — capability quotes/cards
- `FaqSection.tsx` — FAQ cards
- `CtaSection.tsx` — release CTA and release list
- `Reveal.tsx` — reusable reveal animation wrapper
- `AnalyticsTracker.tsx` — client analytics emitter
- `AdminPanel.tsx` — full admin login/dashboard client UI
- `admin/page.tsx` — admin page shell
- `admin/login/page.tsx` — admin login page shell
- `opengraph-image.tsx` — generated OG image
- `twitter-image.tsx` — same as OG image
- `robots.ts` — robots config
- `sitemap.ts` — sitemap config

### `src/app/api`
- `admin/session/route.ts` — cookie-presence auth status
- `admin/session/login/route.ts` — login and cookie set
- `admin/session/logout/route.ts` — logout and cookie clear
- `admin/releases/route.ts` — list/create releases proxy
- `admin/releases/current/route.ts` — set current release proxy
- `admin/releases/[version]/route.ts` — delete release proxy
- `admin/analytics/overview/route.ts` — analytics overview proxy
- `admin/analytics/export/top/route.ts` — top report proxy
- `admin/analytics/timeline/route.ts` — timeline proxy
- `analytics/track/route.ts` — analytics ingest proxy
- `releases/download/route.ts` — tracked download redirect

### `src/lib`
- `i18n.ts` — shared locale config, normalization, locale resolution helpers, and locale formatting helper
- `superpen-api.ts` — base types + login helper + base URL logic
- `superpen-api-server.ts` — service token logic + public site data fetch
- `admin-api.ts` — bearer-token admin proxy utility
- `admin-auth-shared.ts` — shared auth constants
- `admin-jwt.ts` — local HS256 verification
- `admin-session.ts` — cookie storage helpers
- `download-tracking.ts` — tracked download URL builder

## 30) Recommended future prompting strategy

When asking an LLM to help with this repo, include:
- the exact feature/task
- whether it affects public site, admin, analytics, or auth
- whether backend API contracts can change or must stay fixed
- whether copy should align to “overlay” or “digital whiteboard” positioning
- whether visual changes must preserve current glassmorphism/coral-mint aesthetic
- any relevant files from sections 7 and 29 above

If you want, a next step would be creating either:
1. `PROJECT_MAP.json` for machine-readable LLM ingestion, or
2. a much shorter `PROMPT_CONTEXT.md` optimized for copy-pasting into chats.
