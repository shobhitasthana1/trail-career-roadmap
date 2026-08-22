# Trail - A Career Roadmap App

A web app where a user enters a job role and gets back the skills required and a learning roadmap — built from real, current job posting data instead of a static skill list.

## What It Does

- **Home** - the landing page that shows all the details about the app
- **Explore** — search a role, see the skills employers are actually asking for right now
- **Roadmaps** — save a personalized learning path for a role
- **Progress** — track your skill progress against a target that updates as the job market shifts
- **Resources** — curated free/paid learning material, matched to your specific skill gaps
- **Profile** — login, settings, dark/light mode

## What Makes This Different

- Skill requirements are pulled from live job postings, not a fixed database — so roadmaps update as the market changes
- Reverse lookup: enter your current skills, see which roles you already fit
- Progress is tracked against a moving target, since required skills for a role can shift over time
- Resource suggestions are tied to each user's actual skill gap, not just generic per-role lists
- A companion market-analytics dashboard (SkillPulse) backs the skill data with real trend analysis

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Framer Motion — app-wide page transitions
- GSAP / Three.js — animated hero on the Home page only
- Recharts — progress and in-app charts

**Backend**
- Node.js + Express
- MongoDB — raw job postings, roadmaps, resources
- JWT authentication (optionally Firebase/Clerk)
- node-cron — scheduled job data refresh
- Job data sourced from Adzuna / JSearch / Jooble APIs (chosen over scraping LinkedIn/Naukri to avoid ToS issues)

**Deployment**
- Vercel — frontend
- Render / Railway — backend + database

## Data Pipeline

1. A scheduled job (node-cron) pulls postings from the job-search API
2. New postings are deduplicated against existing records (matched on title + company + location) before being saved to MongoDB
3. Skill and resource data is cleaned and structured in Excel, then imported into MongoDB
4. The app reads from MongoDB to power Explore, Roadmaps, and Progress

## Market Analytics Dashboard

A companion project built alongside the app: a Power BI dashboard showing top skills overall, top skills by role, skill demand trends over time, and location-wise demand — built from the same job posting data the app uses. Demoed live from the `.pbix` file during presentations.

## Team

| Area | Owner |
|---|---|
| Frontend | Shobhit |
| Backend | Anshika, Abhay |
| Data & Analytics | Sharad |
| Communication & Presentation | Anshika |

## Project Status

🚧 In development — backend in progress.
