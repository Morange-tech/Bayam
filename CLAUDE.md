# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

This is a monorepo:

- `frontend/` — the Next.js 14 App Router app (see "Frontend architecture" below).
- `backend/` — the Laravel 11 API (see "Backend architecture" below).

The two are **mostly not wired together yet** — the storefront/account/admin pages still run on mock data (`frontend/lib/mock/`, `frontend/lib/data/`). The exceptions are **auth** (`app/(auth)/connexion`, `/inscription`, `/mot-de-passe-oublie`) and **staff management** (`app/(admin)/admin/equipe`, via `frontend/lib/data/staff.js`) — both call the real backend via `frontend/lib/api.js` (axios, `NEXT_PUBLIC_API_URL` — see `frontend/.env.local`, gitignored), since both need a genuine Sanctum-backed account (a staff login has to be actually restricted, not just mocked). Run `php artisan serve` (backend) alongside `npm run dev` (frontend) to exercise it: seeded accounts are `admin@bayam.com`, `client@bayam.com`, and `comptable@bayam.com` (staff, poste `comptable`), password `password` for all.

## Commands

```bash
# Frontend
cd frontend
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # next/core-web-vitals eslint

# Backend
cd backend
php artisan serve          # start dev server (localhost:8000)
php artisan migrate --seed # rebuild schema + sample data (SQLite, database/database.sqlite)
php artisan route:list --path=v1   # print the full API surface
```

Neither project has a test runner configured yet (Laravel's default Pest/PHPUnit scaffold is present under `backend/tests/` but unused).

## Frontend architecture

BAYAM's frontend is a Next.js 14 App Router e-commerce storefront (French-language, targeting Cameroon/Africa — currency XAF, Mobile Money payment messaging). Everything except auth currently runs on **mock data**.

### Route groups

`app/` uses four parallel route groups, each with its own layout and access rules:

- `app/(storefront)/` — public shop pages. Layout wraps children in `Header` + `CategoryNav` + `Footer`. The checkout tunnel (`checkout/livraison` → `checkout/paiement` → `checkout/confirmation`) lives here under its own nested client layout (`app/(storefront)/checkout/layout.js`), which renders a `StepIndicator` + sticky `OrderSummary` and redirects to `/panier` if the cart is empty — except on the confirmation route, which it special-cases (skips the guard and the stepper/sidebar) since that page clears the cart on arrival.
- `app/(account)/` — customer account pages. Client-side layout guard: redirects to `/connexion` if `useAuthStore` has no `user` after hydration.
- `app/(admin)/` — admin back-office pages. Client-side layout guard: redirects to `/connexion` if unauthenticated. `user.role` is `'admin'` (full access) or `'staff'` (scoped to the section(s) its `staffSections` — from the backend's `StaffRole::sections()` — allow, e.g. a `comptable` poste only reaches `/admin/finances`); a staff user hitting a route outside its sections is redirected to the first one it can reach (see `ROUTE_SECTIONS` in `app/(admin)/layout.js`). `components/admin/AdminSidebar.jsx` renders the full nav for admins and only the matching link(s) for staff.
- `app/(auth)/` — `connexion`, `inscription`, `mot-de-passe-oublie`. Minimal `AuthLayout` (logo-only header, no footer nav). These call the real backend (see below) — the only pages in the frontend that do.

`(account)`, `(admin)`, and the checkout layout all gate rendering on a `hasHydrated` flag from the zustand persist middleware (see below) to avoid a flash of redirect before localStorage rehydrates. Root-level `middleware.js` adds a coarse edge-level guard on top: it reads a `bayam_token` cookie (written by `authStore.setToken`/cleared by `logout`, kept in sync alongside the localStorage-persisted token so both the edge middleware and the client-side layout guards agree) and redirects `/compte/*`+`/admin/*` → `/connexion` when absent, or `/connexion`+`/inscription`+`/mot-de-passe-oublie` → `/` when present. It only checks token presence, not role — admin-role gating still happens client-side in `app/(admin)/layout.js`.

### Data fetching layer (`lib/data/`)

Pages call `async` functions in `lib/data/*.js` (`catalogue.js`, `home.js`, `product.js`, `account.js`, `admin.js`, plus `lib/checkout.js` for pure helpers/constants). These currently read from `lib/mock/*.js` (products, orders, admin), but are written with the same async shape a real API call would have (`async function fetchX() { return ... }`) — the intent is to swap the function bodies for `api.get(...)` calls later without touching call sites. When adding new data needs, follow this same pattern rather than fetching directly in components.

Catalogue filtering/sorting/pagination (search, category, price range, rating, sort, page) lives in `lib/data/catalogue.js:fetchProducts` and operates on `searchParams` passed straight from the page's `searchParams` prop — filters are URL-driven, not component state. The same URL-driven-filter pattern is reused for order history (`components/account/FilterPills.jsx`) and reuses `components/shop/Pagination.jsx` as-is.

### State (`stores/`)

Zustand stores, each using the `persist` middleware to sync to localStorage:

- `authStore.js` — `user`, `token`, `isAuthenticated`, `isAdmin`, `hasHydrated`. `setUser`/`setToken` are separate calls (both invoked after a successful login/register); `setToken` also writes the `bayam_token` cookie `middleware.js` reads, and `logout` clears both the cookie and the flat `localStorage['bayam_token']` key `lib/api.js`'s interceptor reads. Exports both a named (`{ useAuthStore }`) and default binding for the same store.
- `cartStore.js` — normalized cart lines (`productId`, `variant: {color, size}`, `stock`, ...). `addItem(productLike, quantity)` accepts a full product object and maps/merges it; also owns mock promo-code application (`applyPromo`, `PROMO_CODES`) and `hasHydrated`.
- `favoritesStore.js` — array of favorited product ids.
- `checkoutStore.js` — `delivery` (the livraison form's last submission) and `lastOrder` (a snapshot captured at payment time — items/totals/delivery — that `checkout/confirmation` reads before clearing the cart, and that `compte/commandes/[id]` falls back to for orders not yet in the mock order list).
- `adminProductsStore.js` / `adminPromotionsStore.js` / `adminOrdersStore.js` / `adminUsersStore.js` / `adminNotificationsStore.js` / `adminSettingsStore.js` — persisted, seeded from `lib/mock/*.js`, each with its own CRUD/action set. These power the admin panel but are **not** wired back into the storefront's own (separately mocked) data — admin edits only affect the admin panel's own session.
- `ordersStore.js` / `reviewsStore.js` — same persisted-mock-seed pattern as the admin stores, but customer-facing (order history, product reviews) rather than admin.
- `toastStore.js` — transient UI notification queue, not persisted.

### API client (`lib/api.js`)

Single axios instance (`api`) with `NEXT_PUBLIC_API_URL` base URL (`frontend/.env.local`, gitignored — copy from `.env.example`; expects `http://localhost:8000/api/v1` for local dev against `backend/`). Request interceptor attaches `Bearer` token from `localStorage['bayam_token']`. Response interceptor clears that token and hard-redirects to `/connexion` on any 401. Used by the `(auth)` pages; not yet wired into `lib/data/*` — those still use mock data.

### Components (`components/`)

Organized by domain, not by page:

- `components/ui/` — generic design-system primitives (Button, Card, Badge, Input, Select, Skeleton, StarRating, PriceDisplay, EmptyState). Use `cn()` from `lib/utils.js` (clsx + tailwind-merge) for conditional/merged class names, and follow the `variants`/`sizes` object-map pattern used in `Button.jsx` for new variant-driven components.
- `components/shop/` — storefront/catalogue/product-detail components (ProductCard, FilterSidebar, ProductGallery, ProductTabs, ReviewCard, etc.).
- `components/layout/` — header/nav/footer shared across storefront pages.
- `components/checkout/` — `StepIndicator`, `OrderSummary`, `StripeCardForm` (a presentational mock — no real Stripe integration yet).
- `components/account/` — `AccountSidebar`, `OrderCard`, `OrderTimeline`, `FilterPills`, `FavoriteCard`.
- `components/admin/` — `AdminSidebar`, `ProductForm` (shared by the new/edit product pages), `MarkdownEditor` (a small custom write/preview editor — not `react-md-editor` — used for product descriptions; DOMPurify is lazy-`import()`'d so it never runs during server prerendering).
- `components/auth/` — `FormError`, `PasswordStrengthBar`, `SocialButton` (Google/Facebook buttons are presentational only — no OAuth SDK wired up, `/auth/social` on the backend returns 501).

### Styling

Tailwind, configured in `tailwind.config.js` with a custom BAYAM palette (`tailwindcss-animate` plugin also registered, used for the checkout payment step's field reveal) — use these tokens instead of default Tailwind colors when matching the existing UI:
- `violet-deep` / `violet-active` / `violet-soft` / `violet-light` — brand/primary color scale.
- `beige-base` / `beige-card` / `beige-border` / `beige-gold` — surface/background scale.
- Custom shadows: `shadow-card`, `shadow-card-hover`.

Path alias `@/*` maps to `frontend/` (`frontend/jsconfig.json`), e.g. `@/components/ui/Button`, `@/lib/utils`, `@/stores/authStore`.

## Backend architecture

A standard Laravel 11 app (minimal `bootstrap/app.php`-based skeleton, no `Kernel.php`). SQLite by default (`DB_CONNECTION=sqlite`, `backend/database/database.sqlite`, gitignored) — no external DB server needed for local dev.

- **Auth**: Sanctum, token-based (`Authorization: Bearer <token>` via `createToken()->plainTextToken`), not cookie/SPA mode — matches the frontend's axios interceptor. `AuthController` (register/login/logout/me/socialLogin — the last a 501 stub) + `PasswordController` (Laravel's built-in password-reset broker; `sendResetLink` always responds 200, even for an unknown email, to avoid user enumeration). `app/Http/Requests/Auth/` (`RegisterRequest`, `LoginRequest`) validate; login uses `Auth::attempt()` purely for credential-checking within the request (no session persistence needed since a Sanctum token is issued immediately after).
- **Authorization**: two middleware layer the `/api/v1/admin/*` group. `role:<role1>,<role2>,...` (`app/Http/Middleware/EnsureUserHasRole.php`, alias in `bootstrap/app.php`) checks `$user->role` against a comma-separated allow-list (note the variadic `handle()` signature — Laravel splits `role:admin,staff` into separate middleware-parameter arguments, not one string). `staff.section:<key>` (`app/Http/Middleware/EnsureStaffCanAccessSection.php`) then narrows a sub-group to one section for staff accounts via `User::canAccessSection()` — always true for an admin, true for staff only when their `staff_role` (`app/Enums/StaffRole.php`; the "poste" an admin picks when creating the account, e.g. `comptable`) lists that section in `sections()`. See `backend/README.md`'s "Staff & permissions" table for the current poste → section map.
- **Routes** (`routes/api.php`): everything is under `/api/v1`. Public catalogue/auth routes, a `Sanctum`-gated group (cart/orders/wishlist/reviews/account), and a nested `role:admin,staff`-gated `/admin/*` group — itself split into an inner `role:admin`-only subset (dashboard, categories, banners, user bans, notifications, staff management) and several `staff.section:<key>`-gated subsets (finances/commandes/catalogue/utilisateurs) a staff poste can also reach. Run `php artisan route:list --path=v1` to see the full surface with controller actions.
- **Controllers**: `app/Http/Controllers/Api/` for public + authenticated-customer endpoints, `app/Http/Controllers/Api/Admin/` for admin-only ones. Controllers return Eloquent models/collections directly (casts handle JSON shaping) — the one exception is `User`, always returned through `app/Http/Resources/UserResource.php`, which maps `first_name`/`last_name`/etc. to the camelCase shape (`firstName`, `avatarUrl`, ...) the frontend's `authStore`/`User` interface expects. Request bodies stay snake_case (Laravel convention); only user-shaped responses are camelCased.
- **Models & enums**: one model per table in `app/Models/`; status/role/type fields are native PHP backed enums in `app/Enums/` (`UserRole`, `ProductStatus`, `OrderStatus`, `PaymentStatus`, `PromoType`), cast on the model (e.g. `Product::casts()`). `User` stores `first_name`/`last_name` (not a single `name`) — anywhere a controller eager-loads a partial `user:id,...` column list, use those two, not `name`.
- **Money**: prices/totals are unsigned integers (XAF has no minor unit), matching the frontend's `formatPrice`.
- **Mocked/stubbed pieces** (each flagged with a comment at the point of use — see `backend/README.md`): `PaymentController` has no real CinetPay/Stripe keys yet (mock payment reference; webhook handlers don't verify gateway signatures); `AdminNotificationController::send` logs instead of dispatching; `ProductController::flashSale`/`recommended` are reasonable stand-ins since the schema has no dedicated flash-sale or recommendation tables.
- **Seeder** (`database/seeders/DatabaseSeeder.php`): creates an admin (`admin@bayam.com`), a customer (`client@bayam.com`), and a `comptable`-poste staff account (`comptable@bayam.com`) — all password `password` — plus 6 categories, 8 products, 2 promo codes, and 2 banners mirroring the frontend's mock catalog, so the API is testable without the frontend.
