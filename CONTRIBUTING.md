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
`abhayraj81-patch-1` is frozen (it holds an unmerged commit) until the
repository owner decides what to do with it — do not merge or delete it.

## Workflow

```
feature branch -> Trail-frontend or Trail-backend -> develop -> main
```

1. Create a short-lived feature/fix branch (see naming below) from the
   integration branch your work belongs to.
2. Open a pull request into that integration branch (`Trail-frontend` for UI
   work, `Trail-backend` for API/server work).
3. Integration branches are merged into `develop` by pull request for
   full-application testing. Open this PR when a coherent feature set is
   complete on the integration branch — not for every small change.
4. `develop` is merged into `main` by pull request only after the release
   checklist below passes and the repository owner approves. This is the
   only path to production.

Never push directly to `main`, `develop`, `Trail-frontend`, or
`Trail-backend` — every change arrives by pull request.

## Who targets what

- **Shobhit (frontend):** feature branches -> `Trail-frontend`
- **Anshika, Abhay (backend):** feature branches -> `Trail-backend`
- **Sharad (data / Power BI analytics):** feature branches -> `develop`,
  changing only files under `docs/data/` (see "Data and Power BI workflow").

## Branch naming

- `feature/<short-description>` — new functionality
- `fix/<short-description>` — bug fixes
- `style/<short-description>` — styling-only changes
- `docs/<short-description>` — documentation-only changes

Do not use GitHub web-UI "patch" branches (for example `username-patch-1`) for
code changes. If a quick web edit is unavoidable, open its pull request into
the correct integration branch like any other change.

## Pull request requirements

- Target the correct integration branch (never `main` directly, except the
  release and hotfix flows below).
- Describe what changed, why, and how you tested it — paste the actual check
  results (build/lint output, server start log) into the description.
- Keep each PR to one concern; do not mix frontend and backend changes.
- Resolve merge conflicts by inspecting both versions — never blindly accept
  one side.
- Use normal merge commits. Do not squash, rebase, reset, or force-push shared
  branches, and do not rewrite published history.

### Review ownership

- The repository owner (Shobhit) reviews and approves every PR before it is
  merged. No PR is merged without the owner's review.
- Backend PRs additionally get a peer review from the other backend
  developer (Anshika reviews Abhay's PRs and vice versa) before owner review.
- The author never merges their own PR.

## Testing before merging

- Frontend (in `trail-frontend/`): `npm run build` and `npm run lint` must pass.
- Backend (in `trail-backend/`): the server must start with a valid local
  `.env` (`node server.js`) and log a successful MongoDB connection before
  the "Server running" line; a failed database connection must fail the
  start, never pass silently.
- When both sides change, verify the integrated app on `develop`: API URLs,
  CORS, and the authentication flow.

> **Temporary note (known lint failures):** the frontend code carried 21
> pre-existing ESLint errors + 1 warning (unused imports, refs during
> render, fast-refresh export rules, one exhaustive-deps warning). These are
> being fixed on the `fix/eslint-cleanup` branch (PR into `Trail-frontend`).
> Until that PR merges, frontend lint results must be reported against this
> known baseline — no *new* lint problems may be introduced by any PR. Once
> the cleanup merges, this note should be removed and the lint gate above
> applies in full.

## Release checklist (develop -> main)

Only the repository owner opens and merges release PRs.

- [ ] Frontend `npm run build` passes on `develop`
- [ ] Frontend `npm run lint` passes on `develop` (after the cleanup PR, in full)
- [ ] Backend starts on `develop` with a successful MongoDB connection
- [ ] Smoke test on `develop`: home/hero, roadmap timeline, section pages load
- [ ] No `.env` files, credentials, or secrets anywhere in the diff
- [ ] Owner approves the release PR
- [ ] After merging: verify the live site responds and key pages load
- [ ] Tag the release on `main` (for example `v0.2.0`)

## Hotfix flow (production bugs)

1. Branch `fix/<short-description>` from `main`.
2. Open a PR into `main`; owner review is still required, but the checklist
   can be shortened to the affected area plus build/lint.
3. Immediately after the hotfix merges, open a back-merge PR `main` ->
   `develop` so the fix is not lost in the next release.

## Environment variables and secrets

- Never commit `.env` files, API keys, tokens, passwords, or database
  credentials.
- Refer to variables by name only (for example `PORT`, `MONGO_URI`) in docs
  and pull requests.
- Each package keeps a committed `.env.example` listing variable names with
  placeholder values only (see `trail-backend/.env.example`). Copy it to
  `.env` and fill in real values locally; `.env` is git-ignored — verify
  with `git check-ignore .env` if you are ever unsure.
- The backend uses MongoDB Atlas. Connection strings are credentials:
  they live only in local `.env` files and deployment environment settings,
  never in the repository.

## Data and Power BI workflow (Sharad)

- Repository files for data work live under `docs/data/`: data dictionaries,
  dataset schemas and source notes, cleaned CSV exports, DAX measure
  documentation, and exported report screenshots/PDFs.
- Data changes go on a feature branch from `develop` with a PR back into
  `develop`, touching only `docs/data/`.
- `.pbix` files are large binaries and do **not** belong in Git. Keep the
  master `.pbix` in the team's shared Drive folder and record the link in
  `docs/data/README.md`.

## Deleting branches

- A feature branch may be deleted only after its pull request is merged and
  its commits are confirmed present in the target branch.
- When in doubt, keep the branch and ask the repository owner. Preserving work
  always takes priority over reducing the branch count.
