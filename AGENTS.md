# Souki — AGENTS.md

## Stack
- Next.js 16.2.10 + React 19.2.4 + Prisma 6.19.3 + SQLite + Tailwind v4
- Auth: JWT (`jsonwebtoken`) + bcrypt, HTTP-Only cookie `souki_token`, 7-day expiry
- Currency: DZD (Algerian Dinar)
- Map: Leaflet + OpenStreetMap (CartoDB Dark Matter tiles) via Nominatim geocoding
- PWA: service worker cache-first + manifest.webmanifest (SVG icons)

## Commands
- **Dev**: `npm run dev` (no turbopack — `--no-turbopack` in package.json)
- **Build + run**: `npm run build && ./start.sh` (use `start.sh`, NOT `npm start` — it sets `PRISMA_QUERY_ENGINE_LIBRARY` env var needed for Prisma engine)
- **Lint**: `npm run lint`
- **Seed DB**: `npx tsx prisma/seed.ts`
- **Push schema**: `npx prisma db push`

## Prisma quirks
- Custom generator output: `../src/lib/generated` → import from `@/lib/generated/client`, NOT `@prisma/client`
- `prisma.config.ts` uses `engine: "classic"` (not default Prisma 6 engine)
- Engine `.so.node` at `src/lib/generated/libquery_engine-debian-openssl-1.1.x.so.node`
- Fix: `next.config.ts` has `outputFileTracingRoot` + `serverExternalPackages: ["@prisma/client", "prisma"]`
- Singleton in `src/lib/prisma.ts`

## Tailwind v4
- Uses `@import "tailwindcss"` syntax (no `@tailwind` directives)
- Custom theme in `@theme inline {}` block in `globals.css`
- Dark class on `<html>` — use `className="... dark"` (not `prefers-color-scheme`)
- No `tailwind.config.js`

## Auth
- Roles in DB: lowercase English `visitor`, `seller`, `organizer` (NOT French)
- `useAuth()` client context in `@/lib/auth-context`, wraps root layout
- Server-side: `getAuthUser()` from `@/lib/auth`
- Role redirect via `router.replace()`:
  - `visitor` → `/visitor/dashboard`
  - `seller` → `/seller/dashboard`
  - `organizer` → `/organizer/dashboard`

## Path alias
- `@/*` → `./src/*` (defined in tsconfig.json)

## API routes (key ones)
- `/api/auth/*` — register, login, me, logout
- `/api/souks` — CRUD (POST also geocodes address → lat/lng, charges 499 DZD for 2nd+ souk)
- `/api/souks/map` — GET geocoded markers with Nominatim fallback for legacy entries
- `/api/souks/[id]` — GET, PATCH, DELETE (PATCH geocodes on address change)
- `/api/souks/[id]/register` — register to souk (charges spotPrice via balance, sends notification)
- `/api/upload` — multipart image upload to `public/uploads/`
- `/api/organizer/*` — organizer-specific endpoints
- `/api/organizer/souks/[id]/status` — change souk status (sends notification to registered users)
- `/api/vehicles` — CRUD (charges 199 DZD for 2nd+ vehicle per souk)
- `/api/bids` — POST/GET (sends outbid + new bid notifications)
- `/api/profile` / `/api/profile/password` — edit name/phone, change password
- `/api/payments` — GET balance + transaction history
- `/api/payments/recharge` — POST credit to wallet
- `/api/notifications` — GET list with unread count
- `/api/notifications/read-all` — POST mark all as read
- `/api/favorites` — GET list (auth required), POST toggle add/remove
- Swagger UI at `/api-docs`

## Models (Prisma schema)
- `User` — roles, balance, name, phone, password
- `Souk` — title, location, status, dates, paid flag, lat/lng, fee
- `SoukRegistration` — links user→souk→vehicle, paid flag, status
- `Vehicle` — brand, model, year, price, images, status
- `Bid` — vehicle, visitor, amount
- `VehicleAccess` — scan tracking
- `Payment` — user, amount, type (credit/debit), description
- `Notification` — user, type, title, message, read flag, link
- `Favorite` — userId + vehicleId (unique compound)

## Key components
- `@/components/Navbar` — glassmorphism, scroll blur, mobile slide-out panel, active link highlighting
- `@/components/Footer` — links to legal pages, map, FAQ
- `@/components/Logo`, `StepsSection`
- `@/components/BarChart`, `DonutChart` (pure SVG, no chart library)
- `@/components/NotificationBell` — 15s polling, badge, dropdown with mark-all-read
- `@/components/OnboardingModal` — 5-step wizard, shown once via localStorage
- `@/components/FavoriteButton` — heart toggle with auth guard
- `@/components/PwaRegister` — registers service worker on mount
- `@/lib/notifications.ts` — `createNotification()` helper
- `@/lib/geocode.ts` — Nominatim geocoding helper
- Animated background (blur orbs) in root `layout.tsx`

## Pages
- `/` — landing with hero, stats counters, 6-step how-it-works, pricing, testimonials, CTA
- `/login`, `/register` — auth with test account hints, password toggle
- `/souks` — filterable grid with search + status/location filters
- `/souks/map` — Leaflet map with dark tiles, sidebar list, geocoded markers
- `/souks/[id]` — souk detail
- `/vehicles/[id]` — gallery, specs, seller card, souk card, bid form/history, favorite button
- `/seller/dashboard`, `/seller/vehicles/new`, `/seller/vehicles/[id]/edit`, `/seller/register`, `/seller/stats`
- `/visitor/dashboard` — souk + bid lists, map button, favorites button
- `/organizer/dashboard`, `/organizer/souks/new`, `/organizer/souks/[id]`, `/organizer/stats`
- `/admin` — dashboard, users, souks, vehicles tables
- `/settings` — dark/light toggle, fr/ar language selector (persisted to localStorage)
- `/profile` — edit name/phone, change password
- `/payments` — wallet balance, recharge form, transaction history
- `/notifications` — full notification history with type icons
- `/favorites` — saved vehicles list
- `/contact`, `/faq`, `/cgu`, `/cookies` — legal/info pages
- `/changelog` — timeline entries
- `/offline` — PWA offline fallback page

## Seed accounts
| Email | Password | Role |
|---|---|---|
| `visitor@souki.dz` | `password123` | visitor |
| `seller@souki.dz` | `password123` | seller |
| `organizer@souki.dz` | `password123` | organizer |
| `admin@souki.dz` | `password123` | admin |

## Migration-free workflow
This project uses `prisma db push` (no migration files). Schema changes rebuild DB directly.

## Fees
- 1st souk: free, 2nd+: 499 DZD
- 1st vehicle per souk: free, 2nd+: 199 DZD
- Souk registration: spotPrice (paid from wallet balance)
- Recharge wallet via `/api/payments/recharge`

## Notes
- `eslint.config.mjs` uses eslint v9 flat config syntax
- `PROJECT_STRUCTURE.md` has full directory tree — see there for file layout
- Theme toggle persists to `localStorage("souki_theme")`, language to `localStorage("souki_lang")` (fr/ar)
- Bid polling every 5s via `/api/bids?vehicleId=X`
- Notifications polling every 15s via `/api/notifications`
- Onboarding gate: `localStorage("souki_onboarding_seen")`
- QR codes contain URL `/vehicles/[id]`
- PWA manifest at `/manifest.webmanifest`, service worker at `/sw.js`
