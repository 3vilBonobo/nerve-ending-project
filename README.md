# Nerve Ending

A browser investigation inside **Meridian Systems — Remote Access Client**. The public office is closed, but its switchboard is still calling the night desk. Read short staff records, question the system, and inspect an attachment missing from the file list. This revised first-act preview has no reading-order or split-code puzzle. Its length and engagement have not been established by an independent human playtest.

The game runs entirely in the browser. No backend, account, API key, or AI download is required. The offline interpreter and authored records ship with the application.

## Run on Windows

Use Node.js **20.19+ in the 20.x line, 22.12+ in the 22.x line, or 24.x**, and npm. Angular 21 was selected because it supports the installed Node 20.19 runtime; Angular 22 requires a newer Node runtime. See [Angular compatibility](https://angular.dev/reference/versions).

Open PowerShell in this project folder:

```powershell
npm ci
npm start
```

Open `http://127.0.0.1:4200/`. The dependency lockfile is committed for reproducible installs. The initial `npm install` has already been completed in this checkout.

```powershell
# Run all unit and component tests once
npm test

# Create the static production build, including offline app shell
npm run build

# Serve the production output locally
npm run preview
```

Production preview: `http://127.0.0.1:4173/`. Deployable files: **`dist/client/`**. Do not open `index.html` with `file://`; use an HTTP server. Stop a local server with `Ctrl+C`.

## Controls

- Start immediately with **Start session** in the simple connection dialog, and skip the connection sequence if desired. Returning players see **Resume session**.
- Type `HELP`, `STATUS`, `DIR`, `CD`, `OPEN`, `SEARCH`, or `CLEAR`.
- Questions accept ordinary wording. General HELP uses neutral company and interface examples.
- Press Enter to submit, Up/Down for input history, or Esc to reveal a reply immediately. Replies otherwise pause briefly and arrive gradually.
- Record names and attached-record links are clickable. **READ BACKUP COPY** opens a saved attachment; no special command or prior reading list is required.
- Restore or minimize the terminal to expose desktop folders. On phones, use **TERMINAL / FILES / RECORDS** tabs. Open-record tabs switch between documents.
- **Settings...** on the opening screen, or **DISPLAY & SETTINGS** in a session, controls CRT effects and font size. Motion follows the device preference.
- After reading the backup, **SESSION STATUS** opens the preview's end report. Records remain available afterward.

Progress, windows, and display settings save in this browser. Restricted or full storage produces a warning and play continues in memory. `CLEAR` only clears terminal text. **NEW SESSION → RESTART INVESTIGATION** resets the current opening and display settings. The revised opening uses `nerve-ending.save.v3`. Earlier saves remain unchanged under `nerve-ending.save`; their display preferences are imported, while obsolete instructions are kept out of the new opening.

## Project organization

```text
src/app/core/                 Shared typed domain
  content.ts                 Immutable authored records
  models.ts                  State, output, evidence, intent contracts
  engine/                    Pure commands, filesystem and progression
  interpretation/            Offline classifier and provider boundary
  persistence/               Versioned save validation and migration
  presentation/              Transient reply timing and text reveal
  session.ts                 Angular state service
src/app/features/            Terminal, file browser, document windows
src/app/app.*                Setup, desktop, settings and completion shell
public/                     Manifest and original local icons
scripts/                    Production preview and icon generator
docs/                       Architecture, deployment and playtest guides
```

There is no backend directory because this slice has no backend implementation. All mutable progress belongs to the local browser, and every world transition is a deterministic function. New features should go into the matching module rather than into a generic utilities folder.

## AI status

**Offline interpreter: implemented and tested. Browser-model runtime: not implemented.** Settings truthfully report that no browser AI model is available. A provider interface and unavailable adapter are ready for a future implementation. No weight downloads or third-party scripts occur during public play.

A development-only Ollama comparison adapter sends classifications to an explicitly selected loopback daemon. No daemon or model was available for end-to-end verification. Public production builds hide its settings. See [AI experiments](docs/AI_EXPERIMENTS.md).

## Visual references

The outer client resembles an early-2000s connection utility. The retained system uses larger DEC-inspired terminal text, line borders, a thick underscore cursor, and optional phosphor softness. VT323 is served locally and cached for offline play; its SIL Open Font License is included in `public/fonts/OFL.txt`. There are no runtime font-CDN requests. See [period references and design choices](docs/VISUAL_REFERENCES.md).

## Guides

- [Architecture](docs/ARCHITECTURE.md)
- [Spoiler-marked solution and evidence](docs/GAMEPLAY_GUIDE.md)
- [Static deployment](docs/DEPLOYMENT.md)
- [AI implementation and limitations](docs/AI_EXPERIMENTS.md)
- [Verification record](docs/VERIFICATION.md)

Shortest developer walkthrough (**spoilers**):

```text
OPEN Unanswered call
OPEN Handover receipt
OPEN backup
```

This is one route, not an unlock sequence. The attachment can also be reached through source links, search, or ordinary questions. Backup reads are ordinary records access and are idempotent. Opening a document does not print a second copy of its body in the terminal.
