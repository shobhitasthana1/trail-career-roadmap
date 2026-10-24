<<<<<<< HEAD
# TRAIL Backend API

> Career Roadmap Platform — Node.js / Express / MongoDB backend

## Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + Google Identity Services |
| Job Data | Adzuna API |
| Skill Extraction | Google Gemini 3.6 Flash |
| Scheduler | node-cron (daily refresh) |

---

## Setup

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`)

### 2. Install dependencies

```bash
cd trail-backend
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | Server port (default 8080) |
| `JWT_SECRET` | Random 64-byte hex string |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `ADZUNA_APP_ID` | Adzuna API App ID |
| `ADZUNA_APP_KEY` | Adzuna API App Key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |

### 4. Seed the database

```bash
npm run seed           # Skills and relationships (51 skills, 54 relationships)
npm run seed:resources # Learning resources (42 resources)
```

### 5. Start the server

```bash
npm run dev    # Development (nodemon)
npm start      # Production
```

---

## API Reference

Base URL: `http://localhost:8080/api/v1`

### Health

```
GET /health
```

---

### Auth

| Method | Endpoint | Body | Auth |
|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password }` | — |
| POST | `/auth/login` | `{ email, password }` | — |
| POST | `/auth/google` | `{ credential }` (Google JWT) | — |
| GET | `/auth/me` | — | ✅ Bearer |

All protected endpoints require: `Authorization: Bearer <token>`

---

### Skills

| Method | Endpoint | Description |
|---|---|---|
| GET | `/skills` | List all 51 canonical skills |
| GET | `/skills/analyze?role=backend+developer` | Run market analysis (calls Gemini) |
| POST | `/skills/role-match` | Match user skills to career roles |

**Role match body:**
```json
{ "skills": ["javascript", "react", "nodejs"] }
```

---

### Jobs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/jobs?role=backend+developer&page=1` | Search/cache job postings |
| GET | `/jobs/:id` | Get single job posting |

---

### Roadmaps

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/roadmaps` | — | List all roadmaps |
| POST | `/roadmaps/generate` | — | Generate from market data |
| GET | `/roadmaps/saved` | ✅ | User's saved roadmaps |
| GET | `/roadmaps/:slug` | — | Full roadmap (nodes + edges) |
| GET | `/roadmaps/:slug/export-data` | — | Structured export for frontend |
| POST | `/roadmaps/:slug/save` | ✅ | Save to user account |
| DELETE | `/roadmaps/:slug/save` | ✅ | Remove from user account |

**Generate body:**
```json
{ "role": "Backend Developer" }
```

**Node structure:**
```json
{
  "id": "nodejs",
  "label": "Node.js",
  "stage": "Intermediate",
  "marketDemand": 3,
  "category": "framework"
}
```

**Edge structure:**
```json
{
  "id": "javascript-nodejs",
  "source": "javascript",
  "target": "nodejs",
  "type": "prerequisite"
}
```

Stages: `Foundation → Core → Intermediate → Advanced`

---

### Progress

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/progress/:roadmapSlug` | ✅ | Get full progress |
| PATCH | `/progress/:roadmapSlug/skills/:skillId` | ✅ | Update one skill's status |

**PATCH body:**
```json
{ "status": "completed" }
```
Valid statuses: `not_started`, `in_progress`, `completed`

**PATCH response:**
```json
{
  "completionPercentage": 7,
  "completedCount": 2,
  "totalCount": 27
}
```

---

### Resources

| Method | Endpoint | Description |
|---|---|---|
| GET | `/resources` | All resources |
| GET | `/resources?skillSlug=nodejs` | Resources for a specific skill |
| GET | `/resources/:id` | Single resource |

---

## Roadmap Generation Pipeline

```
Adzuna API → Job Postings (cached)
    ↓
Gemini 3.6 Flash → Skill extraction per posting
    ↓
Normalization → Match against canonical skill library
    ↓
Market Snapshot → skill + demand percentage
    ↓
Prerequisite expansion → add ancestor skills
    ↓
Topological sort (Kahn's) → Foundation → Core → Intermediate → Advanced
    ↓
Roadmap saved to MongoDB → returned as nodes + edges
```

## File Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cronJobs.js        # Daily market data refresh
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   ├── progressController.js
│   ├── resourceController.js
│   ├── roadmapController.js
│   ├── roadmapSaveController.js
│   └── skillController.js
├── middleware/
│   └── authMiddleware.js  # JWT protect()
├── models/
│   ├── JobPosting.js
│   ├── MarketSnapshot.js
│   ├── Progress.js
│   ├── Resource.js
│   ├── Roadmap.js
│   ├── Skill.js
│   ├── SkillRelationship.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── progressRoutes.js
│   ├── resourceRoutes.js
│   ├── roadmapRoutes.js
│   └── skillRoutes.js
├── seed/
│   ├── seed.js            # Skills + relationships
│   └── seedResources.js   # Learning resources
├── services/
│   ├── jobService.js      # Adzuna API integration
│   ├── llmService.js      # Gemini API integration
│   ├── roadmapService.js  # Topological sort engine
│   └── skillService.js    # Market analysis + normalization
├── app.js
└── server.js
```
=======
# Trail — Career Roadmap Platform

**YOUR JOURNEY. YOUR ROADMAP. YOUR FUTURE.**

TRAIL helps you discover the right career path, learn the skills that matter, follow a structured roadmap, and track your progress — all in one place.

Explore career paths, discover the skills that matter, and find a roadmap built around your goals. Built as an MCA final-year academic project.

🔗 [trail-career-roadmap.vercel.app](https://trail-career-roadmap.vercel.app)

<br/>
<img width="1469" height="800" alt="image" src="https://github.com/user-attachments/assets/4f55e682-6603-4c20-aed5-a17d58b5c54c" />
<br/>
<br/>

## How It Works

**1. Search your role**
: Type in any tech role you're aiming for — Backend Developer, Data Analyst, whatever it is.

**2. Get a living roadmap**
: We pull current job postings and turn them into an ordered skill path, not a fixed list.

**3. Track your progress**
: Check off skills as you learn them. Your progress updates and takes you closer to the destination.

<br/>
<img width="1470" height="801" alt="image" src="https://github.com/user-attachments/assets/f313bf31-87cd-4630-8e00-8c22e7328348" />
<br/>
<br/>

## Features

- **Real-time skill data** — Skills pulled from live job postings, not outdated.
- **Ordered roadmap** — See exactly what to learn first, not just a pile of skills.
- **Progress tracking** — Mark skills as learned and watch your gap shrink against your desired job role.
- **Personalised resources** — Get a list of resources matched to your desired job profile.
- **Save and revisit** — Build a roadmap once, come back anytime — it stays updated for you.
<br/>
<br/>

## FAQ

**1. How is this different from a roadmap I'd find online?** <br/>
Most roadmaps are hardcoded once and never updated. Trail rebuilds its skill list from real, current job postings — so what you see today reflects what employers are actually asking for right now.

**2. Where does the job data come from?** <br/>
We pull listings through job-search APIs that aggregate sources like LinkedIn and   — not by scraping those platforms directly.

**3. How often does the roadmap update?** <br/>
Automatically, roughly every 24 hours per role. Nothing you need to refresh yourself.

**4. Is Trail free to use?** <br/>
Yes — fully free, built as an academic project with no paid tiers.

**5. Do I need an account to search a role?** <br/>
No — Explore is open to everyone. An account's only needed to save roadmaps and track progress.

**6. What if the role I search isn't in the system yet?** <br/>
Search it anyway — Trail fetches live data for a role the first time anyone searches it.
<br/>
<br/>

## Tech stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion, GSAP, Three.js, Recharts
<br/>
**Backend:** Node.js, Express, MongoDB, JWT auth
<br/>
**Data:** Live job postings via Adzuna / JSearch / Jooble
<br/>
<br/>

## Team

| Name | Role |
|---|---|
| Anshika | Backend |
| Abhay | Backend |
| Shobhit | Frontend |
| Sharad | Data/Power BI analytics |

<br/>
<br/>
>>>>>>> ef462084770e996261e8144c0f8d2f6de8d0aabd
