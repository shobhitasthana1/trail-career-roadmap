# Trail — Frontend

React single-page app for **Trail**, a career roadmap platform. A user searches a tech role, sees an interactive skill roadmap built from current job-market data, saves it, and tracks progress against it. This folder is only the UI; all data comes from [`trail-backend`](../trail-backend) over a REST API.

## Tech Stack

| Purpose | Tool |
|---|---|
| UI framework / build | React 19 + Vite |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Routing | React Router v7 |
| Page transitions | Motion (Framer Motion) |
| Smooth scroll + scroll animation | Lenis + GSAP ScrollTrigger |
| Roadmap graph | `@xyflow/react` (React Flow) + `dagre` for auto-layout |
| 3D / hero effects | Three.js, React Three Fiber, drei |

## Project Structure

```
trail-frontend/
├── index.html                # Vite entry HTML
├── vite.config.js            # React + Tailwind plugins
├── eslint.config.js
├── .env.example              # VITE_API_BASE_URL
├── public/
│   ├── fonts/                # Self-hosted fonts (Satoshi, Inter, Exo, Geist)
│   └── images/               # Logo, section images, hero frame sequence
└── src/
    ├── main.jsx              # Mounts <App/> inside BrowserRouter
    ├── App.jsx               # Route table, Lenis smooth scroll, page transitions
    ├── index.css / fonts.css # Tailwind import + global styles + @font-face
    │
    ├── pages/                # One file per route
    │   ├── Home.jsx          # Landing page (assembles the sections below)
    │   ├── Explore.jsx       # Role search + roadmap view
    │   ├── Roadmap.jsx       # Saved roadmaps
    │   ├── Progress.jsx      # Skill status tracking + charts
    │   ├── Resources.jsx     # Learning resources, filters, bookmarks
    │   ├── Profile.jsx       # Account and settings (protected)
    │   ├── Login.jsx         # Login / register form
    │   └── Signup.jsx        # Reuses Login in "register" mode
    │
    ├── components/
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx   # Redirects guests away from private pages
    │   ├── LockScreen.jsx       # "Log in to continue" placeholder
    │   ├── ScrollToTop.jsx
    │   ├── hero/                # Landing hero, marquee, timeline, frame-sequence engine
    │   ├── section2/            # Career selector + 3D cylinder
    │   ├── section3/
    │   ├── Section4/            # Features section
    │   ├── Faq/
    │   ├── footer/
    │   ├── buttons/             # Reusable button variants
    │   └── roadmap/
    │       ├── RoadmapCanvas.jsx     # React Flow graph + dagre layout
    │       ├── SkillNode.jsx         # Single node in the graph
    │       └── SkillDetailPanel.jsx  # Side panel: skill info, status, resources
    │
    ├── context/
    │   └── AuthContext.jsx   # Auth state (user + JWT), login/logout helpers
    ├── services/
    │   └── api.js            # Every backend call lives here
    └── data/
        └── resourcesData.js  # Static curated resource list
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL, including `/api/v1` |

## Deployment

Deployed on **Vercel**. Set `VITE_API_BASE_URL` in the project's environment settings.
