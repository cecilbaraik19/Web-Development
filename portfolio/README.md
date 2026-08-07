# Cecil Baraik — Portfolio (MERN)

A full-stack portfolio built with **MongoDB, Express.js, React (Vite) and Node.js** — dark, minimal, cybersecurity-inspired. Projects, certifications and contact messages live in MongoDB and are managed from a built-in admin page.

## Tech Stack

**Client** — React 18 · Vite · Tailwind CSS · React Router · Axios · Framer Motion · React Icons · Lenis
**Server** — Node.js · Express · MongoDB · Mongoose · dotenv · cors

## Project Structure

```
portfolio/
├── client/                  # React + Vite frontend
│   ├── public/              # favicon, robots.txt, sitemap.xml, resume.pdf
│   └── src/
│       ├── api/             # axios instance
│       ├── components/      # Navbar, Hero, About, Skills, Projects, ...
│       ├── config/          # site.js — your name, links, email
│       ├── context/         # AdminContext
│       ├── hooks/           # useTypewriter, useCountUp
│       ├── layouts/         # MainLayout
│       ├── pages/           # Home, Admin, NotFound
│       ├── services/        # API calls per resource
│       └── utils/           # scroll, date formatting
└── server/                  # Express API
    ├── config/              # db connection
    ├── controllers/
    ├── middlewares/         # adminAuth, errorHandler, notFound
    ├── models/              # Project, Certification, Contact, Journey
    ├── routes/
    └── utils/               # seed data, skills JSON
```

## 1. Installation

```bash
git clone <your-repo-url>
cd portfolio

cd server && npm install
cd ../client && npm install
```

## 2. MongoDB Setup

**Option A — local MongoDB** (quickest): install MongoDB Community Server, then use
`mongodb://localhost:27017/portfolio` (this is the default in `server/.env.example`).

**Option B — MongoDB Atlas** (needed for deployment):
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Database Access → add a database user (username + password)
3. Network Access → allow access from anywhere (`0.0.0.0/0`) so Render can connect
4. Connect → Drivers → Node.js → copy the connection string:
   `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio`

## 3. Environment Variables

**server/.env** (copy from `.env.example`):

| Key | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `MONGO_URI` | Local or Atlas connection string |
| `ADMIN_KEY` | Secret key for the `/admin` page — change it |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated |

**client/.env**:

| Key | Description |
|---|---|
| `VITE_API_URL` | Backend URL, e.g. `http://localhost:5000/api` locally |

## 4. Running Locally

```bash
# Terminal 1 — API on http://localhost:5000
cd server && npm run dev

# Terminal 2 — site on http://localhost:5173
cd client && npm run dev
```

The database **seeds itself** on first boot (sample projects, certifications, journey). To reseed manually: `cd server && npm run seed`.

## 5. Admin Page

Visit `/admin`, enter your `ADMIN_KEY`, and you can add, edit and delete **projects**, **certifications** and **journey steps**, and read/delete **contact messages** — no redeploy needed.

## 6. Deploying

### Frontend → Vercel
1. Push the repo to GitHub
2. Vercel → New Project → import repo → set **Root Directory** to `client`
3. Add env var: `VITE_API_URL=https://<your-render-app>.onrender.com/api`
4. Deploy (Vite is auto-detected; `vercel.json` handles SPA routing)

### Backend → Render
1. Render → New → Web Service → same repo, **Root Directory** `server`
2. Build command: `npm install` · Start command: `npm start`
3. Env vars: `MONGO_URI` (Atlas), `ADMIN_KEY`, `CLIENT_URL` (your Vercel URL)
4. Deploy — free instances sleep after idle, so the first request may take ~30s

## 7. Customizing

- **Your links/name/resume**: `client/src/config/site.js` (one file updates everywhere). Drop your resume at `client/public/resume.pdf`.
- **Skills list**: `server/utils/skillsData.js`
- **Journey timeline**: admin-ready via `PUT/POST /api/journey`, or edit `server/utils/seed.js` and reseed
- **GitHub stats panels**: live by default (ghchart + github-profile-summary-cards) — just set `githubUsername` in `client/src/config/site.js`; cards degrade to placeholders if the username is invalid
- **Domain/SEO**: `client/index.html`, `client/public/sitemap.xml`, `client/public/robots.txt`

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/projects?category=&search=&page=&limit=` | public |
| POST/PUT/DELETE | `/api/projects(/:id)` | admin |
| GET | `/api/certifications` | public |
| POST/PUT/DELETE | `/api/certifications(/:id)` | admin |
| GET | `/api/journey` | public |
| POST/PUT/DELETE | `/api/journey(/:id)` | admin |
| GET | `/api/skills` | public |
| POST | `/api/contact` | public |
| GET/DELETE | `/api/contact(/:id)` | admin |
| POST | `/api/admin/login` | public |

Admin routes expect the header `x-admin-key: <ADMIN_KEY>`.
