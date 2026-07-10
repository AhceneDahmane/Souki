# Souki — AGENTS.md

## Stack
- Next.js 16.2.10 + React 19.2.4 + Prisma 6.19.3 + SQLite + Tailwind v4
- Auth: JWT (`jsonwebtoken`) + bcrypt, HTTP-Only cookie `souki_token`, 7-day expiry
- Currency: DZD (Algerian Dinar)

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
- `/api/souks` — CRUD
- `/api/souks/[id]` — GET, PATCH, DELETE
- `/api/upload` — multipart image upload to `public/uploads/`
- `/api/organizer/*` — organizer-specific endpoints
- Swagger UI at `/api-docs`

## Key components
- `@/components/Navbar`, `Footer`, `Logo`, `StepsSection`
- `@/components/BarChart`, `DonutChart` (pure SVG, no chart library)
- Animated background (blur orbs) is embedded in root `layout.tsx`

## Seed accounts
| Email | Password | Role |
|---|---|---|
| `visitor@souki.dz` | `password123` | visitor |
| `seller@souki.dz` | `password123` | seller |
| `organizer@souki.dz` | `password123` | organizer |

## Migration-free workflow
This project uses `prisma db push` (no migration files). Schema changes rebuild DB directly.

## Notes
- `eslint.config.mjs` uses eslint v9 flat config syntax
- `PROJECT_STRUCTURE.md` has full directory tree — see there for file layout
