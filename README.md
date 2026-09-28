# BAYAM

Monorepo for the BAYAM e-commerce platform.

- [`frontend/`](frontend) — Next.js storefront, buyer account, and admin back-office. Still runs on mock data (`frontend/lib/mock/`, `frontend/lib/data/`) rather than calling the API below. See `frontend/README.md` for setup.
- [`backend/`](backend) — Laravel 11 API (routes, models, migrations, controllers). Not yet wired up to the frontend. See `backend/README.md` for setup.
