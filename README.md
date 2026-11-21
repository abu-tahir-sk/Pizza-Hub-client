# PizzaHub — Client

A modern pizza ordering & delivery web app built with **Next.js 16 (App Router)** and **Better Auth**.
Customers browse local menus and place orders; vendors manage their menu and subscriptions; admins
moderate the platform.

> **Live links** — replace these placeholders after deployment:
>
> - Client: `https://pizzahub-client.vercel.app`
> - API server: `https://pizzahub-api.onrender.com`

## Features

### Authentication (Better Auth)
- Email + password sign in / sign up with inline validation
- Google social sign in
- Role selection at signup (customer or vendor — **admins can never self-register**)
- Session cookie handled by Better Auth; protected API calls use a short-lived JWT minted by the server
- Client-side route guard (`AuthGuard`) + server-side JWT/role checks on every protected endpoint
- Blocked users are signed out and denied access

### Public & customer
- Animated pizza-themed home page (hero, featured items, categories, testimonials, vendor CTA)
- Browse menu with debounced search, category/location filters, price sorting and pagination
- Private item details page with image gallery and an order form
- Customer dashboard: order statistics, activity chart, order history, cancel pending orders
- Profile settings: name, avatar (ImgBB upload), vendor business name; role/plan read-only

### Vendor
- Dashboard with order statistics and a status bar chart
- Menu item CRUD with approval workflow (pending → approved/rejected), availability toggle, delete confirm
- Add item form with multi-image upload (max 3, 5 MB each) through the server → ImgBB proxy
- Order management: accept / reject pending orders
- Stripe Checkout upgrade to Premium + payment history (read-only)

### Admin
- Platform overview: users/vendors/customers/menu items/pending/revenue cards and two charts
- Manage users: search, role filter, block/unblock with confirmation (admins are protected)
- Moderate menu items: search, status/category filters, approve, reject with a reason, delete
- Transactions: read-only ledger with status filter and total paid revenue

### UX
- Pizza palette (warm reds, oranges, cream), fully responsive, ShadCN-style components
- Motion animations, Sonner toasts (no browser `alert`)
- Loading skeletons, empty states and error states everywhere
- Dark / light mode (optional feature #1)
- Favorites saved to `localStorage` (optional feature #2)
- Custom 404 page, payment success / cancel pages

## Tech stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + ShadCN-style components (Radix primitives) |
| Auth | Better Auth (`better-auth/react`) |
| Animation | Motion (Framer Motion) |
| Charts | Recharts |
| Toasts | Sonner |
| Icons | Lucide React + inline brand SVGs |

## Getting started

```bash
# 1. install dependencies
npm install

# 2. create your env file
cp .env.example .env.local
#    then set NEXT_PUBLIC_API_URL to your running server

# 3. run the dev server
npm run dev
# → http://localhost:3000
```

The API server must be running first (see the `server` repository).

## Environment variables

| Name | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | yes | Base URL of the Express API, e.g. `http://localhost:5000` |

## Roles & test accounts

| Role | How to get one |
| --- | --- |
| Customer | Sign up normally |
| Vendor | Choose “Vendor” on the signup page |
| Admin | Created only through the server seed script (`npm run seed:admin` in the server repo) |

Default seed credentials (change via server env):

```
admin@pizzahub.com / Admin123
```

## Project structure

```
src/
├── app/
│   ├── (auth)/               # sign-in & sign-up (shared brand layout)
│   ├── dashboard/
│   │   ├── admin/            # overview, users, items, transactions
│   │   ├── customer/         # overview, orders
│   │   └── vendor/           # overview, items, add item, orders, subscription
│   ├── favorites/            # saved items (localStorage)
│   ├── menu/                 # browse + private [id] details
│   ├── payment/              # Stripe success & cancel
│   ├── profile/              # profile settings
│   ├── layout.tsx            # providers, header, footer
│   └── not-found.tsx         # custom 404
├── components/
│   ├── auth/                 # AuthGuard, Google button
│   ├── dashboard/            # shell, stat cards
│   ├── layout/               # site header & footer
│   ├── menu/                 # menu item card
│   └── ui/                   # ShadCN-style primitives
├── context/                  # theme + favorites
├── lib/                      # api client, auth client, types, utils
└── types/                    # shared domain types
```

## Challenge Requirements Implementation

### 1. Advanced Search & Sorting
- **API Parameters Supported**:
  - `search`: Case-insensitive text search matching pizza title and description keywords
  - `category`: Matches one of the 6 authentic categories (Classic, Vegetarian, Meat Lovers, Specialty/Gourmet, Sides, Desserts)
  - `location`: Case-insensitive partial matching on restaurant / delivery area
  - `minPrice` & `maxPrice`: Numeric price boundary filtering
  - `sortBy`: Set to `price` for price ordering or `createdAt` for recency
  - `sortDir`: `asc` (Low to High) or `desc` (High to Low / Newest)
  - `page` & `limit`: Server-side pagination
- **Frontend Integration**:
  - Built with responsive category selector tabs, location input, and live price sorting dropdown.
  - Graceful debouncing and instant URL query sync.

### 2. JWT / Token Verification Architecture
```
[User Browser]
      │
      ▼  (Better Auth Session Cookie)
[POST /api/auth-extra/token]
      │  (Verifies session & validates user isn't blocked)
      ▼
[Mints Signed HS256 JWT]
      │  (Returned to client memory)
      ▼
[Protected API Request] ──> Headers: Authorization: Bearer <jwt>
                                      │
                                      ▼
                        [verifyJWT Middleware]
                                      │
                                      ▼
                        [requireRole("vendor" | "admin" | "customer")]
                                      │
                                      ▼
                        [Resource Ownership Check & Business Logic]
```

### 3. Professional Visuals & Animations
- Warm pizza theme palette (brick oven reds, amber accents, creamy dough backgrounds).
- Smooth Framer Motion entrance animations on homepage sections.
- Recharts dashboard data visualization (order status bars & transaction charts).
- Interactive 5-star Customer Reviews & Ratings section on item details.
- Confetti celebration effects on order placement and Stripe payment completion.

## Testing & Evaluation Guide

### Admin Credentials
- **Email**: `admin@pizzahub.com`
- **Password**: `Admin123`
- *(Run `npm run seed:admin` in the `server` directory to initialize)*

### Stripe Test Card (for Vendor Premium Upgrade)
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g. `12/28`)
- **CVC**: `123`
- **Postal Code**: `90210`

### Customer Pizza Ordering
- Customers can browse any approved pizza on `/menu` or the Home page, click **View Details**, and submit delivery date & address. Food orders use pay-on-delivery (no credit card needed).

## Security notes

- JWTs are kept in memory only and re-issued from the Better Auth session cookie after reload.
- Route guards are a UX convenience; the Express API independently verifies the JWT, role, block state
  and resource ownership.
- Premium is never granted client-side — only the verified Stripe webhook can activate it.
- Image uploads go through the API proxy so the ImgBB key never reaches the browser.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint |

## Deployment

1. Deploy the server first and note its public URL.
2. Set `NEXT_PUBLIC_API_URL` in your hosting provider (Vercel → Project → Settings → Environment Variables).
3. On the server, set `CLIENT_URL` to the deployed client URL so CORS and Better Auth trusted origins match.
