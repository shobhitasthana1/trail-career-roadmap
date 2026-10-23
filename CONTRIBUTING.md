# Contributing to TRAIL — Career Roadmap Platform

TRAIL is a monorepo: the frontend lives in `trail-frontend/` and the backend in
`trail-backend/`. Please do not move or rename these folders.

## Permanent branches

| Branch | Purpose |
|---|---|
| `main` | Stable, production-ready code. Protected. Deployed to production. Never commit or push directly. |
| `develop` | Integration branch. Frontend and backend work is combined and tested here before anything reaches `main`. |
| `Trail-frontend` | Consolidated frontend development (navbar, hero, animations, typography, responsive design, footer, charts, all UI). |
| `Trail-backend` | Consolidated backend development (Express APIs, MongoDB, JWT authentication, roadmap generation, job-market API integrations). |

Recovery references under `backup/pre-consolidation/` preserve the original
pre-consolidation branch tips. Do not delete or force-update them.

## Workflow

```
feature branch -> Trail-frontend or Trail-backend -> develop -> main
```

1. Create a short-lived feature/fix branch (see naming below) from the
   integration branch your work belongs to.
2. Open a pull request into that integration branch (`Trail-frontend` for UI
   work, `Trail-backend` for API/server work).
3. Integration branches are merged into `develop` by pull request for
   full-application testing.
4. `develop` is merged into `main` by pull request only after testing passes
   and the repository owner approves. This is the only path to production.

## Who targets what

- **Shobhit (frontend):** feature branches -> `Trail-frontend`
- **Anshika, Abhay (backend):** feature branches -> `Trail-backend`
- **Sharad (data / Power BI analytics):** feature branches -> `develop`
  (a dedicated data flow can be added later by team decision)

## Branch naming

- `feature/<short-description>` — new functionality
- `fix/<short-description>` — bug fixes
- `style/<short-description>` — styling-only changes

Do not use GitHub web-UI "patch" branches (for example `username-patch-1`) for
code changes. If a quick web edit is unavoidable, open its pull request into
the correct integration branch like any other change.

## Pull request requirements

- Target the correct integration branch (never `main` directly).
- Describe what changed, why, and how you tested it.
- Keep each PR to one concern; do not mix frontend and backend changes.
- Resolve merge conflicts by inspecting both versions — never blindly accept
  one side.
- At least one review/approval from the repository owner before merging.
- Use normal merge commits. Do not squash, rebase, reset, or force-push shared
  branches, and do not rewrite published history.

## Testing before merging

- Frontend (in `trail-frontend/`): `npm run build` and `npm run lint` must pass.
- Backend (in `trail-backend/`): the server must start without syntax errors
  (`node server.js` with a valid local `.env`).
- When both sides change, verify the integrated app on `develop`: API URLs,
  CORS, and the authentication flow.

## Environment variables and secrets

- Never commit `.env` files, API keys, tokens, passwords, or database
  credentials.
- Refer to variables by name only (for example `PORT`, `MONGO_URI`) in docs
  and pull requests.

## Deleting branches

- A feature branch may be deleted only after its pull request is merged and
  its commits are confirmed present in the target branch.
- When in doubt, keep the branch and ask the repository owner. Preserving work
  always takes priority over reducing the branch count.
