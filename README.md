# BRIJ® — Portfolio

A full stack portfolio site with a physics-based skill cloud, a working command palette, a terminal emulator, a GitHub contribution heatmap, hidden achievements, and a real admin panel backed by its own API and database — not just a static page.

**Live:** [brij.blog](https://brij.blog)

## Features

- **Hero & scroll motion** — GSAP + Lenis smooth scroll, slat reveal transitions
- **Physics skill cloud** — Matter.js powered draggable/collidable skill bubbles
- **Command palette** — `⌘K` / `Ctrl+K` fuzzy-navigate the site
- **Terminal panel** — a fake shell with real skill bars and a live GitHub contribution heatmap
- **Custom cursor & desk buddy** — a cursor trail and a pettable eyes widget that reacts to the pointer
- **Achievements system** — hidden easter eggs unlock toast achievements (open devtools, find them yourself)
- **Admin CMS** (`/admin.html`) — token-gated panel to edit projects, skills, and all site copy without redeploying
- **Real backend** — Rust/Actix API + Postgres, not hardcoded content

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, GSAP, Framer Motion, Lenis, Matter.js |
| Backend | Rust, Actix-web, sqlx |
| Database | PostgreSQL (Neon serverless) |
| Hosting | Vercel (frontend) + Render (backend) + Neon (db) |
| Lint | Oxlint |

## Project structure

```
├─ src/                  # React app (main site)
│  ├─ components/        # Hero, Projects, Terminal, TechGravity, CommandPalette, ...
│  ├─ admin/              # Admin.jsx — the CMS panel (separate Vite entry: admin.html)
│  └─ content.jsx         # fetches /api/content, provides site copy to components
├─ server/                # Rust API
│  ├─ src/main.rs         # actix-web routes, migrations, seed logic
│  └─ src/seed.sql        # default projects/skills seed data
├─ index.html             # main site entry
├─ admin.html             # admin panel entry
├─ render.yaml            # Render blueprint (backend)
└─ vercel.json            # Vercel build + /api rewrite (frontend)
```

## Getting started

**Prerequisites:** Node 18+, Rust (`cargo`), and a free [Neon](https://neon.tech) Postgres database.

```bash
git clone https://github.com/gudhalarya/portfolio.git
cd portfolio
npm install
```

**Backend:**

```bash
cd server
cp .env.example .env
# edit .env: paste your Neon DATABASE_URL and pick an ADMIN_TOKEN
cargo run
```

On first run it auto-creates tables and seeds default projects/skills/content. The API listens on `http://localhost:8787`.

**Frontend** (separate terminal, from repo root):

```bash
npm run dev
```

Vite proxies `/api/*` to `localhost:8787` in dev (see `vite.config.js`), so the site talks to your local API automatically. Open `http://localhost:5173` for the main site, `http://localhost:5173/admin.html` for the admin panel (log in with your `ADMIN_TOKEN`).

## Environment variables

Set in `server/.env` locally, and in your Render service dashboard for production.

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (`postgres://user:pass@host/db?sslmode=require`) |
| `ADMIN_TOKEN` | Password for the `/admin.html` panel — pick a long random string |
| `PORT` | Optional, defaults to `8787`. Render sets this automatically |

## Scripts

| Command | Runs |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (outputs both `index.html` and `admin.html` to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Oxlint |
| `cargo run` (in `server/`) | Backend API, dev mode |
| `cargo build --release` (in `server/`) | Backend API, production build |

## Deployment (Neon + Render + Vercel)

**1. Database — Neon**
Create a free project at [neon.tech](https://neon.tech), grab the pooled connection string from the dashboard.

**2. Backend — Render**
This repo has a `render.yaml` blueprint at the root:
1. Push the repo to GitHub.
2. On Render: **New → Blueprint**, point it at the repo. It reads `render.yaml` and creates a web service rooted at `server/`.
3. In that service's **Environment** tab, set `DATABASE_URL` (from Neon) and `ADMIN_TOKEN`.
4. Deploy. Health check is `/api/health`.

**3. Frontend — Vercel**
`vercel.json` at the root sets the build command/output dir and proxies `/api/*` to the Render backend, so the frontend code (which calls relative `/api/...` paths) needs no changes.
1. Import the repo in Vercel (framework auto-detects as Vite).
2. Make sure `rewrites.destination` in `vercel.json` matches your actual Render URL.
3. Deploy. The main site builds from `index.html`, the admin panel from `admin.html`.

**Note:** Render's free plan spins down on idle, so the first API request after inactivity is slow (cold start) — expected, not a bug.

## License

MIT — see [LICENSE](LICENSE). Do whatever you want with it; credit is appreciated.
