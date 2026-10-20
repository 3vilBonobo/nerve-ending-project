# Verification record

Implementation date: 2026-10-20. Runtime: Windows / Node.js 20.19.0 / npm 11.18.0. Angular 21, strict TypeScript, standalone components and zoneless signals.

## Automated checks

- Dependency installation completed; lockfile generated.
- `npm test`: **57 tests pass** across game rules, commands, fallback/provider validation, persistence, and Angular component behavior.
- Coverage includes all 24 alternate orders of four independent sources, premature recovery, recovery idempotence, locked-file search exclusion, corrupt/legacy saves, restricted storage, reset, 31 question phrasings, and classifier timeout/malformed results.
- `npm run build`: production compilation passes with service-worker output. Initial app: **222.92 kB raw / 62.89 kB estimated compressed transfer**, excluding the deferred service-worker download.

The test runner needed host-level localhost access because a locally installed Console Ninja hook connects to its local process. This is an environment restriction, not a game dependency. Console Ninja is not included in the application or repository dependencies.

## Browser checks

Verified in the available Chromium in-app browser at **1440 × 900** and **390 × 844**:

- Fresh setup, start without any model, skippable connection, `HELP`, `STATUS`, ordinary-language query.
- Premature recovery denial with useful missing-source guidance.
- File index and terminal share directories; locked fragment is absent.
- Clickable source records, side-by-side terminal and document views, multiple open records.
- Independent ledger/repair evidence, successful deterministic recovery, original fragment containing 0417.
- Explicit session report after fragment inspection; continued record review.
- Mobile document/terminal tabs and no page-level horizontal overflow at 390 pixels.

- Reload and resume preserve the completed session and all four opened records. Keyboard Up recalls the latest command. CRT toggle and font-size adjustment update through settings.
- The production static preview was served over localhost, completed Act 01 using the shortest command route, and reported **OFFLINE SHELL READY** after service-worker registration. Production settings omit the developer controls. Full browser-disconnected offline play and cache eviction were not simulated.
- Confirmed the final maximize control brings the terminal above open records. Reset confirmation returns to fresh setup with **START SESSION**, no recovered progress, and default display settings.

## Deliberate limitations

No browser AI model is integrated or benchmarked; no live Ollama daemon was tested. Cross-browser/device testing, physical touch devices, full assistive-technology audits, cache eviction, browser PWA-install UI, and timed human playtests are not claimed. Browser support checks and settings state these limits honestly. There are no later acts, branching endings, drag/resize framework, or custom application backend.
