# Trail — Backend

REST API for **Trail**, a career roadmap platform. It collects job postings for a role, extracts the skills employers ask for, turns them into an ordered roadmap, and stores each user's progress. The UI lives in [`trail-frontend`](../trail-frontend).

## Tech Stack

| Purpose | Tool |
|---|---|
| Runtime / framework | Node.js + Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcryptjs, Google sign-in |
| Security | helmet, CORS, express-rate-limit |
| Scheduled jobs | node-cron |
| Job data | Adzuna and JSearch APIs |
| Skill extraction / curriculum | Groq (primary), Gemini (fallback), keyword matching (last resort) |

## Project Structure

```
trail-backend/
├── package.json
├── .env.example
└── src/
    ├── server.js            # Entry: loads env, connects DB, starts server + cron
    ├── app.js               # Express app: middleware, route mounting, error handlers
    │
    ├── config/
    │   ├── db.js            # MongoDB connection
    │   └── cronJobs.js      # Daily market-data refresh (02:00)
    │
    ├── routes/              # URL → controller mapping
    │   ├── authRoutes.js
    │   ├── jobRoutes.js
    │   ├── skillRoutes.js
    │   ├── roadmapRoutes.js
    │   ├── progressRoutes.js
    │   └── resourceRoutes.js
    │
    ├── controllers/         # Handle request/response, call services
    │   ├── authController.js
    │   ├── jobController.js
    │   ├── skillController.js
    │   ├── roadmapController.js
    │   ├── roadmapSaveController.js
    │   ├── progressController.js
    │   └── resourceController.js
    │
    ├── services/            # Core business logic
    │   ├── jobService.js        # Fetch + de-duplicate + store job postings
    │   ├── llmService.js        # Skill extraction and curriculum generation
    │   ├── skillService.js      # Skill normalisation + market analysis
    │   └── roadmapService.js    # Build / fetch roadmaps
    │
    ├── middleware/
    │   └── authMiddleware.js    # `protect`: verifies Bearer JWT
    │
    ├── models/              # Mongoose schemas
    │   ├── User.js
    │   ├── JobPosting.js
    │   ├── Skill.js
    │   ├── SkillRelationship.js
    │   ├── MarketSnapshot.js
    │   ├── Roadmap.js
    │   ├── Progress.js
    │   └── Resource.js
    │
    └── seed/                # One-off scripts to fill the database
        ├── seed.js              # Skills + prerequisite relationships
        ├── seedResources.js     # Learning resources
        └── seedAll.js           # Skills, relationships, roadmaps, resources
```

## How It Works

**Request flow.** `Route → (protect middleware) → Controller → Service → Model`. Routes only map URLs, controllers handle HTTP, services hold the logic, and models talk to MongoDB.

**Data pipeline.**
1. `jobService` pulls postings for a role from Adzuna / JSearch (falling back from one to the other) and stores them. A unique index on `externalId + source` prevents duplicates.
2. `llmService` extracts skills from postings or generates a curriculum for the role (Groq, then Gemini, then keyword matching).
3. `skillService` normalises raw skill names to canonical `Skill` documents (using aliases), counts how often each appears, and saves a `MarketSnapshot`. Snapshots under 24 hours old are reused.
4. `roadmapService` combines the top skills with `SkillRelationship` prerequisites, assigns each skill a stage, and saves a `Roadmap` made of **nodes** (skills) and **edges** (prerequisites).
5. A cron job repeats steps 1–4 daily at 02:00 for the pre-built roles (Frontend, Backend, Full Stack, Data Analyst, Data Scientist, DevOps).

**Auth.** Users register with email/password (hashed with bcrypt) or sign in with Google. The server returns a JWT; protected routes require `Authorization: Bearer <token>`, and `protect` puts `{ id, name, email }` on `req.user`.

**Progress.** Each user has one `Progress` document per roadmap storing a status per skill. The completion percentage is calculated on the server and never accepted from the client.

## API Endpoints

Base path: `/api/v1`. 🔒 means a JWT is required.

| Area | Method & Path | Purpose |
|---|---|---|
| Health | `GET /health` | Server status |
| Auth | `POST /auth/register` | Create account |
| | `POST /auth/login` | Log in |
| | `POST /auth/google` | Google sign-in |
| | `GET /auth/me` 🔒 | Current user |
| | `PUT/PATCH /auth/profile` 🔒 | Update profile |
| Jobs | `GET /jobs/search?role=` | Search/store job postings |
| Skills | `GET /skills` | List skills |
| | `GET /skills/analyze?role=` | Market skill analysis for a role |
| | `POST /skills/role-match` | Which roles fit a set of skills |
| Roadmaps | `GET /roadmaps` | List roadmaps |
| | `POST /roadmaps/generate` | Generate a roadmap for a role |
| | `GET /roadmaps/saved` 🔒 | User's saved roadmaps |
| | `GET /roadmaps/:slug` | One roadmap |
| | `GET /roadmaps/:slug/export-data` | Export data |
| | `POST/DELETE /roadmaps/:slug/save` 🔒 | Save / unsave |
| Progress | `GET /progress/:roadmapSlug` 🔒 | Get progress |
| | `PATCH /progress/:roadmapSlug/skills/:skillId` 🔒 | Update skill status |
| | `DELETE /progress/:roadmapSlug/skills/:skillId` 🔒 | Remove skill from journey |
| | `POST /progress/:roadmapSlug/skills/:skillId/restore` 🔒 | Restore removed skill |
| | `POST /progress/:roadmapSlug/reset-skills` 🔒 | Reset all skills |
| Resources | `GET /resources` | List resources |
| | `GET /resources/:id` | One resource |
| | `GET /resources/bookmarks` 🔒 | User's bookmarks |
| | `POST /resources/bookmarks/:resourceId` 🔒 | Toggle bookmark |

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `PORT` | Server port (default in `.env.example`: 8080) |
| `NODE_ENV` | `development` / `production` |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Token signing secret and lifetime |
| `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` | Adzuna job API |
| `JSEARCH_API_KEY` | JSearch (RapidAPI) job API |
| `GROQ_API_KEY`, `GROQ_MODEL` | Groq LLM for skill extraction / curriculum |
| `GEMINI_API_KEY` | Gemini fallback |
| `GOOGLE_CLIENT_ID` | Google sign-in |
| `CLIENT_ORIGIN` | Optional: extra allowed frontend origins, comma-separated |

## Deployment

Hosted on **Render**, with **MongoDB Atlas** as the database.
