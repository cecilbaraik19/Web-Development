# PRD — Cecil Baraik Portfolio (Standalone MERN)

## Original Problem Statement
Build a complete, production-ready, 100% independent MERN stack portfolio for Cecil Baraik — a learner building toward DevSecOps. No Emergent services, no Next.js/Firebase/Supabase, no paid services. Vite + React + Tailwind client, Express + Mongoose server, MongoDB Atlas-ready, deployable on Vercel (client) and Render (server) with only env vars. Banned UI words: Professional, Experienced, Senior, Expert, Lead, Specialist.

## User Persona
Cecil Baraik — self-taught developer learning MERN, AWS, networking and cybersecurity (bug bounty, web app pentesting). Wants an honest "learner" portfolio with an easy admin page to add projects/certifications.

## Architecture
- Location: `/app/portfolio/` (client/ + server/), fully independent of the Emergent template
- Client: React 18 + Vite 5 + Tailwind 3 + React Router 6 + Axios + Framer Motion + Lenis + React Icons
- Server: Node/Express (ESM) + Mongoose + dotenv + cors, auto-seeds on first boot
- Auth: single `ADMIN_KEY` secret (header `x-admin-key`), no JWT/OAuth by request
- Design: dark cybersecurity theme (#0F172A/#111827/#00E5FF/#22C55E), glassmorphism, kinetic masked-reveal hero, canvas particle network, Lenis momentum scroll, editorial marquee, numbered chapters 01–08

## Implemented (2026-08-07)
- All sections: Navbar (sticky, mobile hamburger), Hero (typing, particles, floating icons, parallax), Marquee, About (counters, profile placeholder), Skills (current + "Currently Learning" roadmap), Projects (filter/search/pagination, generated covers), Journey timeline, Certifications (Earned/Planned), Learning Now (progress bars), GitHub Stats placeholders, Contact (validated, saves to MongoDB), Footer with disclaimer
- Admin page `/admin`: key login, CRUD for Projects + Certifications + Journey steps, Messages inbox
- API: /api/projects|certifications|contact|journey|skills|admin/login + /api/health
- SEO: meta/OG tags, favicon.svg, robots.txt, sitemap.xml, placeholder resume.pdf
- README with full install/MongoDB Atlas/Vercel/Render instructions
- Verified: all endpoints curled (CRUD, validation, auth guard); e2e browser test of filters, pagination, contact submit, admin login

## Iteration 2 (2026-08-07)
- Live GitHub stats: ghchart contributions + github-profile-summary-cards (stats, languages) with username preflight via api.github.com and dashed-placeholder fallback when the username is invalid or a service is down
- Resume button polish: shine sweep, bouncing download icon, PDF tag, spring hover/tap
- Journey admin tab: full CRUD UI for timeline steps (title/description/period/status/order)
- Note: user provided no real GitHub/LinkedIn/email or resume file — placeholders remain in client/src/config/site.js

## Backlog
- P1: Replace placeholder links/email in client/src/config/site.js (user must supply real values); drop real resume.pdf into client/public
- P2: Rate limiting + helmet on contact endpoint for production hardening
- P2: Image upload instead of URL-only (needs object storage)
