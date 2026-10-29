# Nerve Ending

Implementation 05 repairs fresh-session conversation dispatch, negation/confirmation, interruptions, source questions, clarification, record IDs and outcome reporting. It adds 28 bounded ordinary topics. [Report and validation](docs/IMPLEMENTATION_05_CONVERSATIONAL_INTELLIGENCE.md) · [Reviewable dialogue proposal](docs/narrative/IMPLEMENTATION_05_PROPOSED_DIALOGUE.md) · [Fresh inventory](docs/IMPLEMENTATION_05_CONVERSATION_INVENTORY.json). Run `npm run conversation:evaluate` for model-on/off visible-answer checks. Legacy catalogue counts do not describe fresh playable dialogue.

Implementation 04 adds the complete revised playable investigation and both v1.0 outcomes for fresh sessions. [Delivery report, commands and local playtest instructions](docs/IMPLEMENTATION_04_PLAYABLE_STORY.md) · [Severance transcript](docs/IMPLEMENTATION_04_TRANSCRIPT_SEVERANCE.md) · [Continuation transcript](docs/IMPLEMENTATION_04_TRANSCRIPT_CONTINUATION.md). Existing prototype saves remain separately resumable; NEW SESSION starts v1.0 without deleting earlier save keys or local QA recordings.

A browser investigation inside **Meridian Systems — Remote Access Client**, set on 6 November 2003. A neutral welcome opens a read-only exploration layer: company information, 34 public work profiles, four ordinary text records, eight operational services with permitted retained logs and three explicitly labeled bitmap demonstrations. The existing two opening evidence encounters and seven-act investigation remain available when the player pursues them. Three endings remain technically reachable; the later acts retain their existing gameplay and still need the investigation redesign. The olive terminal interface is retained.

All essential gameplay works without a model, account, backend or API key. The optional local sentence model recognizes questions; every story reply is authored. Duration and engagement require human playtesting; no measured 90–120-minute playtime is claimed.

## Run

The existing Angular 21 project uses Node 20.19+, 22.12+ or a compatible later runtime. Dependencies are pinned in the lockfile.

```powershell
npm ci
npm start
```

Development: [127.0.0.1:4200](http://127.0.0.1:4200/).

```powershell
npm test
npm run game:validate
npm run build
npm run preview
```

Production preview: [127.0.0.1:4173](http://127.0.0.1:4173/). Static output: `dist/client/`. Use an HTTP server rather than opening index.html directly. A different local port can be selected with `node scripts/serve.mjs --port 4174`.

## Play

- Start or resume. Use the file browser or type `OPEN` / `READ` with a title or path. Record references are plain text.
- Ask “Who founded Meridian?”, “What was the N-Series?” or “Who is Leah Morgan?”. `SEARCH Bell`, `SEARCH Engineering` and `SEARCH staff` find public work profiles by name, department or role. The two Bell entries can be clarified by name, department or first/second. Anna's ordinary career is public; her medical association is protected. Ordinary browsing and questions grant no story knowledge or authority.
- `STATUS` lists all eight services. `INFO 002` describes a service; `LOG 002` retrieves its permitted historical events. Ask “Is the message router working?” or “Show me recent service warnings.” Short follow-ups retain the selected service. INFO/LOG accept one three-digit identifier, without date filters or pagination. Records Access currently has no public event samples safe to display at the fixed 02:14 observation; the view explains that limitation.
- `SEARCH equipment diagram` finds an ordinary demonstration bitmap. `OPEN /ARCHIVE/DEMO_EQUIPMENT_LAYOUT.BIT` opens it in the existing record window; the file browser also lists all three demos in ARCHIVE. Use FIT or 1×–4× integer zoom, scroll the image if enlarged, and return to the terminal or press Escape to close. On narrow screens, the existing RECORDS tab shows open documents. The portrait, diagram and equipment-room still are generic placeholders without employee/facility associations or archival dates. Text records retain their existing viewer.
- Investigate the discrepancy between service 006 and its administrative closure. Apply evidence through terminal replies to two persistent verification prompts. Opening records supplies observations, never conclusions or authority.
- During a verification, answer in your own words, ask `EXPLAIN`, continue reading and asking questions, or use `DEFER` and `RESUME INVESTIGATION`.
- Consequential changes display a complete warning and require **CONFIRM OPERATION**. **CANCEL** leaves the system unchanged. Informational questions never perform an intervention.
- Ask “What should I do next?”, “What have I discovered?”, “Explain that simply”, or “Show me the evidence”. Repeated hint requests give more direct guidance.
- `HELP`, `DIR`, `OPEN`, `READ`, `SEARCH`, `CD`, `STATUS`, `INFO`, `LOG`, `DIAG`, `RECOVER` and `CLEAR` remain available. Up/Down recalls input. Esc or **SHOW FULL REPLY** reveals output immediately. Investigation operations require typed requests; their former button menu is removed.
- Use **TERMINAL / FILES / RECORDS** on mobile. The file browser searches available records. Display settings retain CRT controls, text size and reduced-motion support.
- Final intervention reports show consequences. Records and questions remain available afterward; another outcome requires a new session.

Progress saves in this browser under `nerve-ending.save.v5`, including pending verification, partial answers, deferral and question clarification. Earlier opening observations migrate without automatically solving the investigation. Already advanced schema-4 sessions retain their progress and are marked as legacy investigations. Original save keys are preserved. Restricted storage permits play in memory with a warning.

## Questions and optional model

The catalogue contains **205 intent definitions**, **1,638 distinct examples**, **378 new early/revealed response variants**, plus the retained opening replies and live-state responses. Twenty unorthodox/easter egg intent triggers are gated by evidence. Sixteen explicit short-follow-up cases are checked.

Enable **Improved questions** for the self-hosted all-MiniLM-L6-v2 q8 model. The ten model/runtime/reference assets total **41,906,219 bytes** (about 42 MB). Loading, cancellation, cache and failure remain separate from gameplay. Questions stay on the device. Optional recognition uses a background worker; it does not generate facts or execute operations.

```powershell
npm run model:verify
npm run model:evaluate
npm run model:holdout
npm run model:continuation
npm run model:catalogue
```

After editing examples, regenerate embeddings with `npm run model:references`, then repeat validation. `npm run game:validate` writes the current coverage and author catalogue. A development-only loopback Ollama comparison adapter remains available; production hides its controls.

## Local playtest QA

Open **Display & Settings → Local Playtest QA** (also available in Settings before starting). QA recording is **off by default**. Opt in to retain ordered questions, recognition results, exact selected replies, file access, operations, failures, milestones and endings in this browser's separate `nerve-ending-qa` IndexedDB database. The panel provides session statistics, response feedback, **Export current session**, **Export all sessions**, **Copy current JSONL**, and a separate **Clear recorded QA data** control.

Exports are readable `.jsonl` files in Downloads or your chosen save location. Recordings survive investigation restarts; turning logging off retains existing data. Clearing QA data turns logging off and keeps investigation progress. Nothing uploads or trains automatically. Do not enter personal information or credentials; common sensitive text patterns are redacted before storage. See [QA logging, event schema and privacy](docs/QA_LOGGING.md).

## Source and author documentation

Narrative references: the [narrative index](docs/narrative/README.md) identifies authority and status for characters, corporate history, personnel, infrastructure and unfinished decisions. [MOTHER & Anna canon v0.3](docs/narrative/NERVE_ENDING_MOTHER_ANNA_CANON_v0_3.md) remains the author-reviewed character-and-causality reference; the supplied world/personnel v0.4 and infrastructure v0.5 documents retain their provisional status. See [canon conflicts](docs/narrative/CANON_CONFLICTS.md) and the [future implementation impact map](docs/narrative/IMPLEMENTATION_IMPACT_MAP.md). Reference ingestion does not change runtime or establish conformity; incident, authority and scenario decisions remain unfinished. Prior dated development documents remain historical records.

[Implementation 01](docs/IMPLEMENTATION_01_CORPORATE_EXPLORATION.md) documents the ordinary corporate facts, 34-profile public projection and four selected records. [Implementation 02](docs/IMPLEMENTATION_02_OPERATIONAL_SERVICES.md) separately documents the bounded eight-service registry, INFO/LOG, 27 permitted events, exclusions and saved-versus-live evidence compatibility fix. Protected access, consequential operations and ending logic retain their prior rules. The complete world and revised narrative remain unfinished.

`src/app/core/engine/game.ts` remains the shared entry point. `story-state.ts` defines knowledge, permissions and operating state; `story-records.ts` adds the continuation records; `engine/continuation.ts` implements operations and endings; `interpretation/dialogue-catalog.ts` holds structured authored dialogue. The existing session, worker, playback, files and document windows remain in use.

[Implementation 03](docs/IMPLEMENTATION_03_LEGACY_BITMAPS.md) documents the reusable bitmap contract/viewer, three ordinary placeholder assets, deterministic processing, access and static-asset security boundaries, tests and the browser-validation limitation. Their original sources and regeneration instructions are in [the artwork notes](docs/artwork/implementation-03/README.md). No clinical image, new progression or character association is added.

- [Implementation report and limitations](docs/IMPLEMENTATION_REPORT.md)
- [Opening redesign, exact paths, tests and limitations](docs/OPENING_REDESIGN.md)
- [Spoiler-marked gameplay paths](docs/GAMEPLAY_GUIDE.md)
- [Generated dialogue coverage](docs/DIALOGUE_COVERAGE.md)
- [Full question catalogue — spoilers](docs/QUESTION_CATALOG.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Verification](docs/VERIFICATION.md)
- [Deployment](docs/DEPLOYMENT.md)

The human playtest plan is in the gameplay guide. Automated routes establish reachability and consistency, not emotional effect or playtime.
