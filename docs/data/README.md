# TRAIL — Data & Power BI Assets

This folder holds the repository-side assets for TRAIL's data and Power BI
analytics work (owner: Sharad). It follows the data workflow in the root
`CONTRIBUTING.md`.

## What belongs here

- **Data dictionaries** — what each dataset/field means (use
  `DATA_DICTIONARY_TEMPLATE.md` as the starting point).
- **Dataset schemas & source notes** — where data comes from (for example
  job-market APIs such as Adzuna / JSearch / Jooble), how it is cleaned, and
  how often it refreshes.
- **Cleaned CSV exports** that the app or the reports consume.
- **DAX measure documentation** — measure name, definition, and purpose.
- **Exported report screenshots / PDFs** for review.

## What does NOT belong here

- **`.pbix` files.** Power BI workbooks are large binaries that Git versions
  badly. Keep the master `.pbix` in the team's shared Drive folder instead.
- Raw credentials, API keys, or connection strings — never commit secrets.

## Power BI workbook (shared Drive)

- **Master `.pbix` location:** _TODO — Sharad to add the shared Drive link
  here in the first data PR._
- One master file only; name local working copies with your name and date
  (for example `trail-dashboard_sharad_2026-10-23.pbix`) and never overwrite
  the master without noting it in the change log below.

## How changes are made

1. Branch from `develop` (for example `feature/data-<short-description>`).
2. Change only files under `docs/data/`.
3. Open a PR back into `develop` describing the dataset/report change and
   where the corresponding `.pbix` update lives in Drive.
4. Owner review before merging, like every other PR.

## Change log

| Date | Change | Author | Drive / PR link |
|---|---|---|---|
| — | Folder created with the data workflow | — | — |
