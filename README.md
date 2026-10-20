# Nerve Ending

A playable browser investigation inside **Meridian Systems — Remote Access Client**. Explore a corporate records mirror, question a service that should have stopped, compare original evidence, and reconcile a missing archive. This prototype contains Act 01 only. It is designed for roughly 10–15 minutes of exploration; that duration has not been established by a timed human playtest.

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
- Type `HELP`, `STATUS`, `DIR`, `CD`, `OPEN`, `SEARCH`, `CLEAR`, or `RECOVER ARCHIVE 006`.
- Ask questions such as **“Why is service six still running?”** or **“Where is its archive?”**.
- Press Enter to submit and Up/Down for input history. Records and file paths are clickable.
- Restore or minimize the terminal to expose desktop folders. On phones, use **TERMINAL / FILES / RECORDS** tabs. Open-record tabs switch between documents.
- **Settings...** on the opening screen, or **DISPLAY & SETTINGS** in a session, controls CRT effects and font size. Motion follows the device preference.
- After recovery, read the fragment and select its **END OF PROTOTYPE / SESSION REPORT** control. Review the records or restart.

Progress, record windows, and display settings save in this browser. Restricted or full browser storage produces a warning and the game continues in memory. `CLEAR` only clears scrollback. **NEW SESSION → RESTART INVESTIGATION** clears this game's save after confirmation. It also restores display defaults. The save key is `nerve-ending.save`.

## Project organization

```text
src/app/core/                 Shared typed domain
  content.ts                 Immutable authored records
  models.ts                  State, output, evidence, intent contracts
  engine/                    Pure commands, filesystem and progression
  interpretation/            Offline classifier and provider boundary
  persistence/               Versioned save validation and migration
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
OPEN /OPERATIONS/SERVICE_REGISTER.DAT
OPEN /ARCHIVE/TRANSFER_LEDGER_2001.LOG
OPEN /ARCHIVE/INDEX_REPAIR_NOTES.TXT
RECOVER ARCHIVE 006
OPEN /ARCHIVE/RECOVERED_006.FRAG
```

The service register supplies both activity and retirement corroboration. The two archive records supply the independent routing parts. No exact question wording or password is required.
