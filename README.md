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
