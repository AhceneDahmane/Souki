# Souki — Project Structure

## Overview

**Souki** is a dark-themed SaaS platform for managing Algerian car souks (auto markets). Built with Next.js 16 (App Router), Prisma 6, SQLite, Tailwind CSS v4, and Framer Motion.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2.10 | Framework (App Router) |
| React | 19.2.4 | UI library |
| Prisma | 6.19.3 | ORM + SQLite |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | latest | Animations |
| QRCode | 1.5.4 | QR generation |
| TypeScript | 5.x | Type safety |

---

## Directory Layout

```
souki/
├── .env                          # DATABASE_URL (SQLite)
├── AGENTS.md                     # LLM rules (Next.js 16 notes)
├── PROJECT_STRUCTURE.md          # ← this file
├── README.md                     # Project README
├── package.json
├── next.config.ts                # outputFileTracingRoot, serverExternalPackages
├── postcss.config.mjs            # @tailwindcss/postcss
├── prisma.config.ts              # Prisma v6 config (classic engine)
├── tsconfig.json                 # Path alias @/* → ./src/*
│
├── prisma/
│   ├── schema.prisma             # 6 models: User, Souk, Vehicle, SoukRegistration, Bid, VehicleAccess
│   ├── seed.ts                   # Seeds organizer, seller, visitor, 2 souks, 2 vehicles
│   └── dev.db                    # SQLite database file
│
├── public/                       # Static assets (icons)
│
└── src/
    ├── app/
    │   ├── globals.css           # Tailwind v4 @theme custom colors
    │   ├── layout.tsx            # Root layout (Navbar + dark background)
    │   ├── page.tsx              # Landing page (hero, stats, how-it-works, pricing, testimonials)
    │   │
    │   ├── api/                  # All API routes (Next.js App Router route handlers)
    │   │   ├── souks/
    │   │   │   ├── route.ts              # GET (list), POST (create)
    │   │   │   └── [id]/
    │   │   │       ├── register/route.ts  # POST (register seller), PATCH (update status)
    │   │   │       └── vehicles/route.ts  # GET (list vehicles in souk)
    │   │   ├── vehicles/
    │   │   │   ├── route.ts              # POST (add vehicle)
    │   │   │   └── [id]/route.ts         # GET (details), PATCH (update)
    │   │   ├── bids/
    │   │   │   ├── route.ts              # GET (list), POST (create)
    │   │   │   └── [id]/route.ts         # PATCH (update status)
    │   │   ├── organizer/souks/[id]/status/route.ts  # PATCH (change souk status)
    │   │   └── qrcode/
    │   │       ├── generate/route.ts     # POST (generate QR)
    │   │       └── scan/route.ts        # POST (scan + process QR)
    │   │
    │   ├── souks/
    │   │   ├── page.tsx          # Browse all souks (server component)
    │   │   └── [id]/
    │   │       ├── page.tsx      # Souk detail (vehicles, bidding)
    │   │       └── BidButton.tsx # Client component for placing bids
    │   │
    │   ├── organizer/
    │   │   ├── dashboard/page.tsx   # All souks owned by the organizer
    │   │   └── souks/
    │   │       ├── new/page.tsx      # Create a new souk form
    │   │       └── [id]/
    │   │           ├── page.tsx           # Manage souk (server)
    │   │           └── ManageSoukClient.tsx # Client component (registrations, vehicles, status)
    │   │
    │   └── seller/
    │       ├── dashboard/page.tsx   # Available souks + seller's vehicles + registrations
    │       └── vehicles/new/page.tsx  # Register a new vehicle to a souk
    │
    ├── components/
    │   └── Navbar.tsx            # Sticky top nav (Souks, Organisateur, Vendeur links)
    │
    └── lib/
        ├── prisma.ts             # Singleton PrismaClient instance
        └── qrcode.ts             # generateQRCode(data) → data URL
```

---

## Database Models

### User
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| email | String (unique) | |
| name | String | |
| password | String | plain text (TODO: hash) |
| role | String | `visitor` / `organizer` / `seller` |
| phone | String? | |
| createdAt/updatedAt | DateTime | |

Relations: `souks`, `vehicles`, `bids`, `registrations`

### Souk
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| title | String | |
| description | String? | |
| location | String | |
| date | DateTime | |
| startTime | String | `HH:mm` |
| endTime | String? | `HH:mm` |
| spots | Int | total spots available |
| spotPrice | Float | price per seller spot |
| services | String? | JSON string of optional services |
| status | String | `pending` / `active` / `completed` / `cancelled` |
| organizerId | String | FK → User |

Relations: `organizer`, `registrations`, `vehicles`

### Vehicle
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| title | String | e.g. "Renault Clio 4" |
| brand | String | |
| model | String | |
| year | Int? | |
| mileage | Int? | |
| fuelType | String? | `essence` / `diesel` / `électrique` / `hybride` |
| description | String? | |
| price | Float? | null = negotiable |
| priceType | String | `fixed` / `negotiable` |
| images | String? | JSON array |
| qrCode | String? | QR data URL |
| status | String | `pending` / `assigned` / `sold` |
| soukId | String | FK → Souk |
| sellerId | String | FK → User |

Relations: `souk`, `seller`, `bids`, `accessLogs`

### SoukRegistration
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| soukId + sellerId | | Unique composite |
| spotNumber | Int? | assigned by organizer |
| qrCode | String | QR data URL for entry |
| status | String | `pending` / `accepted` / `rejected` / `present` |

### Bid
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| amount | Float | |
| vehicleId | String | FK → Vehicle |
| visitorId | String | FK → User |
| status | String | `active` / `outbid` / `won` / `lost` |

### VehicleAccess
| Field | Type | Notes |
|-------|------|-------|
| id | String (cuid) | PK |
| vehicleId | String | FK → Vehicle |
| visitorId | String? | |
| scannedAt | DateTime | auto timestamp |

---

## User Roles

| Role | Capabilities |
|------|-------------|
| **Organizer** | Create/manage souks, accept/reject registrations, assign spots, change souk status |
| **Seller** | Register to souks, add vehicles, get QR codes |
| **Visitor** | Browse souks/vehicles, place bids, scan QR codes |
| *(Auth not yet implemented — all routes use hardcoded placeholders)* |

---

## Frontend Pages

| Route | Page | Type |
|-------|------|------|
| `/` | Landing (hero, stats, how-it-works, pricing, testimonials) | Client |
| `/souks` | Browse all souks | Server |
| `/souks/[id]` | Souk detail + vehicle list + bid button | Server + Client |
| `/organizer/dashboard` | All souks owned by organizer | Server |
| `/organizer/souks/new` | Create souk form | Client |
| `/organizer/souks/[id]` | Manage souk (registrations, vehicles, status) | Server + Client |
| `/seller/dashboard` | Available souks + seller's vehicles + registrations | Server |
| `/seller/vehicles/new` | Add vehicle to a souk | Client |

---

## API Endpoints

See full documentation with request/response schemas at **`/api-docs`** (Swagger UI).

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/souks` | List souks (optional `?status=pending,active`) |
| POST | `/api/souks` | Create a souk |
| POST | `/api/souks/[id]/register` | Register a seller to a souk |
| PATCH | `/api/souks/[id]/register` | Update registration status/spot |
| GET | `/api/souks/[id]/vehicles` | List vehicles in a souk (prices hidden) |
| GET | `/api/bids` | List bids (optional `?vehicleId=`) |
| POST | `/api/bids` | Place a bid |
| PATCH | `/api/bids/[id]` | Update bid status |
| POST | `/api/vehicles` | Add a vehicle to a souk |
| GET | `/api/vehicles/[id]` | Get vehicle details with seller info |
| PATCH | `/api/vehicles/[id]` | Update vehicle |
| PATCH | `/api/organizer/souks/[id]/status` | Change souk status |
| POST | `/api/qrcode/generate` | Generate a QR code from arbitrary data |
| POST | `/api/qrcode/scan` | Decode and process a scanned QR code |

---

## Key Configuration Files

### `next.config.ts`
- `outputFileTracingRoot` → project root (fixes Prisma engine resolution)
- `serverExternalPackages` → `["@prisma/client", "prisma"]` (load from node_modules)

### `.env`
- `DATABASE_URL="file:/home/ahcened/Bureau/souki/prisma/dev.db"`

### `prisma.config.ts`
- Classic engine, custom migrate path, schema at `prisma/schema.prisma`

---

## Architecture Notes

- **No auth yet**: all endpoints use placeholder IDs (`default-organizer`, `default-seller`, `default-visitor`)
- **Prisma v6 custom output**: generated to `node_modules/@prisma/client/.prisma/client/`
- **Server startup**: due to Turbopack file descriptor limits, use `npm run build && npm start`
- **Dark theme**: Tailwind v4 `@theme` directive with custom color tokens in `globals.css`
