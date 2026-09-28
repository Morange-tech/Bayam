# BAYAM API

Laravel 11 API for the BAYAM e-commerce platform (see `../frontend` for the Next.js storefront/admin panel that consumes it).

## Setup

```bash
composer install
cp .env.example .env   # already done in this repo; edit as needed
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Defaults to SQLite (`database/database.sqlite`, gitignored) — no separate DB server needed for local dev. Auth is token-based via Sanctum (`Authorization: Bearer <token>`), matching the frontend's existing `lib/api.js` axios client.

The seeder creates three accounts (password `password` for all):
- `admin@bayam.com` — role `admin`
- `client@bayam.com` — role `customer`
- `comptable@bayam.com` — role `staff`, poste `comptable` (restricted to `/admin/stats/*` — see "Staff & permissions" below)

...plus 6 categories, 8 products, 2 promo codes (`BAYAM10`, `BAYAM5000`), and 2 banners, mirroring the frontend's mock catalog.

## API surface

All routes are under `/api/v1`. See `routes/api.php` for the full list (public catalogue/auth, Sanctum-gated cart/orders/account/wishlist/reviews, and `role:admin,staff`-gated `/admin/*` management endpoints). Run `php artisan route:list --path=v1` to print them with their controller actions.

## Staff & permissions

Besides `customer` and `admin`, `UserRole` has a `staff` role for team members an admin creates via `/admin/staff` (admin-only — `AdminStaffController`). Each staff account gets a `staff_role` ("poste", `App\Enums\StaffRole`) that determines which `/admin/*` sections it may reach:

| Poste | Sections |
|---|---|
| `comptable` | `finances` (`/admin/stats/revenue`, `/admin/stats/payments`) |
| `commandes` | `commandes` (`/admin/orders*`) |
| `catalogue` | `catalogue` (`/admin/products*`, `/admin/promotions*`) |
| `support` | `utilisateurs` (`/admin/users` — read-only; banning stays admin-only) |

Enforced by two middleware layered on the `admin/*` route group: `role:admin,staff` (keeps plain customers out) and, per sub-group, `staff.section:<key>` (`App\Http\Middleware\EnsureStaffCanAccessSection`) which checks `User::canAccessSection()` — always true for an admin, true for staff only when `staff_role`'s `sections()` include that key. Routes with no `staff.section` gate (dashboard, categories, banners, user bans, notifications, staff management itself) stay behind an inner `role:admin` check, unreachable by any staff poste.

## Notes on scope

A few endpoints are intentionally mocked pending real integrations — each is marked with a comment in its controller:
- `PaymentController` — no CinetPay/Stripe credentials are configured; `initiate()` returns a mock reference, and the webhook handlers update order status from a trusted payload shape but don't yet verify gateway signatures.
- `AdminNotificationController::send` — logs the payload instead of dispatching a real push/SMS/email.
- `ProductController::flashSale` / `recommended` — there's no dedicated flash-sale or recommendation-engine table in the schema; these use reasonable stand-ins (discounted products; highest-rated products) documented inline.
