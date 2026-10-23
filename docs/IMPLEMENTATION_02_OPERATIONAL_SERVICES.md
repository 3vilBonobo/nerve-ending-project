# Implementation 02 — Meridian operational services

Delivered 23 October 2026. Author-facing engineering report; contains prototype investigation details. This pass implements the explicit eight-service/read-only brief. The supplied reference documents are source material; their internal proposals do not independently authorize runtime changes. Their bytes and status labels remain unchanged.

Implementation 01 was verified in the actual working tree: neutral startup, 34 permitted public work profiles, four ordinary records, deterministic corporate questions and filtered search are present. Its uncommitted changes were preserved. The starting checkout is `5d618cb`; the file inventory for this pass includes those pre-existing changes, rather than treating them as new Implementation 02 work. No missing corporate prerequisite blocked this pass.

## Delivered registry

Initial STATUS output is exactly:

```text
MERIDIAN SYSTEMS / REGISTERED SERVICES
06 NOV 2003

ID   SERVICE                 STATE
001  Contract Support        RUNNING
002  Equipment Register      RUNNING
003  Message Router          STANDBY
004  Billing                 STOPPED
005  Building Sensors        STOPPED
006  Continuity Monitor      RUNNING
007  Records Access          RUNNING
008  Archive Index           RUNNING

Type INFO <id> for service details.
```

Eight definitions in `src/app/core/service-records.ts` supply both command and natural-language views. All rows use identical formatting and normal identifier order, without links, highlighted services, clinical additions or an unsolicited discrepancy explanation. Service 006 reads `operating.service006Running`, so it displays STOPPED after an existing ending that stops it. Other states use the approved working register; this is not a service simulator.

RUNNING means reported execution; STANDBY means installed and available without current normal scheduled processing; STOPPED means no active execution; RETIRED requires formal retirement plus an observed operating state. No ninth or retired service was invented. Service numbers do not establish facility identity.

INFO gives purpose, current state, fixed observation, normal functions, ordinary limitations, history and authored work contacts where supplied. Only the explicitly authored Historical Technical Operations unit is used as a responsible-unit field. Missing registration dates, uptime, unique owners and execution counts are omitted. The dated counts inside log samples are retained as historical event text, not fabricated live measurements. INFO 006 initially exposes neither protected equipment nor a patient identity, care location or clinical procedure.

## Commands and factual questions

| Input | Accepted behavior |
| --- | --- |
| `STATUS` | Complete current register; no arguments |
| `INFO <id>` | One registered three-digit identifier, 001–008 |
| `LOG <id>` | One registered three-digit identifier; all available permitted retained events, newest first |
| `INFO` / `LOG` | Requests a service identifier |
| Invalid identifier | Uniform no-registered-service error; does not echo private-looking input |
| Extra INFO/LOG arguments | Explains syntax and unsupported date ranges, filters and pagination |
| Natural-language date/filter/paging requests | Explains the supported LOG syntax; does not guess a range |
| “Show me recent service warnings.” | Available WARN/ERROR records across services, newest first; explicitly a retained-event view, not a current outage summary |
| `STOP 006`, `START 004`, `REROUTE 003` and equivalent bounded service-control requests | Refused; no operational capability granted |

Commands are case-insensitive. Existing HELP, DIR/LS, CD, OPEN/READ, SEARCH, DIAG, RECOVER, CLEAR/CLS and investigation/confirmation controls remain. HELP now advertises implemented INFO/LOG and two neutral question examples, without plot recommendations. No new shell, ABOUT/LIST/DIAGNOSTICS alias, date filter or paging language is advertised.

All twelve factual examples in the brief work offline: running/active services; Service 001's function; router availability; billing's stop; equipment logs; Building Sensors history; Service 004's stop time; STANDBY meaning; records-system work contacts; available warnings; and the distinction between a shutdown report and current status. Broad service requests select the complete register rather than defaulting to 006. INFO/LOG and explicit factual questions set the existing `lastTopic` service context. Short “Is it working?”, “What does it do?” and “Show me its logs” follow-ups retain that service, including after save/reload. Without a service context, these request clarification.

`interpretation/service-questions.ts` supplies shared deterministic recognition to offline and optional-model paths. The engine checks the actual input independently of a provider's proposed intent. Existing authored story questions retain their early/revealed dialogue and gates; ordinary service questions remain usable during a pending review. No new intent IDs, recognition examples or embeddings are introduced. Provider validation now accepts service-001 through service-008; the loopback comparison adapter's classification instructions match that range. Providers still cannot generate game facts or invoke an operation.

Representative interactions, with INFO and LOG excerpts shortened here only:

```text
> What does Service 003 do?
SERVICE 003 / MESSAGE ROUTER
STATE: STANDBY
PURPOSE:
Accepts notifications from registered services and forwards them to
configured mailboxes, internal telephone-extension systems or maintenance endpoints.

> Is it working?
SERVICE 003 / MESSAGE ROUTER
STATE: STANDBY
Installed and available, but not currently processing its normal scheduled work.
Standby is not necessarily a fault.

> Show me its logs.
SERVICE 003 / MESSAGE ROUTER / RETAINED LOG
AVAILABLE THROUGH: 06 NOV 2003 / 02:14
Dated events; this retrieval is not a current execution report.
06 NOV 2003 02:13 | WARN | Message to EXT 214 received no acknowledgement
  SOURCE: Service 003 event history

> INFO 999
There is no registered service with that identifier.

> LOG
Which service log would you like to inspect?
Syntax: LOG <id> (001–008).

> REROUTE 003
CONTROL UNAVAILABLE.
This connection does not have permission to modify message routing.
```

## Retained events and provenance

There are **27 events**: 24 exact v0.5 sample entries plus three existing restart-log entries. Each has a stable ID, service ID, installation-local timestamp at authored precision, INFO/NOTICE/WARN/ERROR/HIST category, message, reference/section/origin/kind and permitted visibility. Public retrieval checks visibility and the fixed observation cutoff. Only a permitted source description is printed; writer provenance is not an extra player-facing document or search field. No protected or private-client event is bundled to fill missing history.

| Service | Events admitted | Source |
| --- | --- | --- |
| 001 | 05 NOV 2003 08:10 renewal index, 19 records; 31 OCT 16:22 MS-204 signature pending | v0.5 §4.1; 2 exact samples |
| 002 | 05 NOV 08:12 synchronization, 139 records; 03 NOV 11:06 duplicate legacy serial; 03 NOV 11:42 duplicate correction | §4.2; 3 exact samples |
| 003 | 06 and 05 NOV 02:13 unacknowledged EXT 214 messages; 29 OCT 12:20 support-mailbox route test | §4.3; 3 exact samples |
| 004 | 18 SEP 2001 18:04 export archived; 18:30 Finance Operations stop request; 18:31 stop confirmed; 18:33 archive handover | §4.4; all 4 samples |
| 005 | 18 SEP 2001 17:45 final inspection; 18:01 collection disabled; 18:02 stop confirmed | §4.5; all 3 samples |
| 006 | 06, 05, 04 and 01 NOV 2003 02:13 unacknowledged alerts; 18 SEP 2001 date-only closure-batch annotation | §4.6; 5 exact samples |
| 006 | 02 NOV 2003 03:14:07 stop requested / scheduled maintenance; 03:14:08 stopped; 03:14:09 automatically restarted | Existing `/OPERATIONS/STATUS_LOG_2003.TXT`; 3 reused entries |
| 007 | No permitted public event at this observation; limitation explained in LOG | See exclusions below; no replacement event invented |
| 008 | 06 NOV 01:55 unresolved ARC-91-044; 01:56 remaining index available; 05 NOV 01:55 integrity scan; 04 NOV 14:20 twelve retention records updated | §4.8; all 4 samples |

003 routing attempts and 006 originating notifications are different perspectives, not evidence of additional independent messages. The 006 HIST entry is explicitly sourced as a historical registry annotation and keeps its date-only precision. Reading 004/005 logs retrieves retained history: both end on 18 September 2001, with no invented 2003 execution or sensor reading. The archive-handover entry does not restart Billing.

## Excluded draft material and unresolved chronology

The observation remains the existing **06 NOV 2003 / 02:14** snapshot. It does not advance with browser time. No timezone, server clock, retention policy or chronology migration is silently introduced.

Exactly nine of the 33 draft sample events are excluded:

| Service | Draft sample | Reason |
| --- | --- | --- |
| 001 | 06 NOV 2003 08:10 renewal index, 18 records | Later than the observation |
| 002 | 06 NOV 08:14 synchronization, 142 records | Later than the observation |
| 003 | 06 NOV 07:41 delivery after retry | Later than the observation |
| 006 | 02 NOV 03:41 automatic restart | Conflicts with the existing 03:14:09 restart; no second restart invented |
| 006 | 02 NOV 03:41 continuity monitoring resumed | Same unresolved restart chronology; not relocated to an invented time |
| 007 | 06 NOV 08:55 remote-records index available | Later than the observation |
| 007 | 06 NOV 08:50 health check passed | Later than the observation |
| 007 | 03 NOV 09:15 old remote client requesting an absent record | Exact activity of another client; v0.5 §4.7 prohibits ordinary disclosure |
| 007 | 03 NOV 09:15 file-unavailable response to that client | Same privacy boundary |

**Remaining content gap:** Records Access is described as RUNNING and maintained for support contracts, but none of its four draft log samples can be displayed safely at 02:14. LOG 007 works and explains the absence of permitted service-wide events. A past, service-wide operational history needs author-supplied entries or an explicitly approved chronology/disclosure decision. This pass does not claim that all eight services now have populated public logs.

The original September closure record remains unchanged: 006 is listed as Closed, with “Shutdown approved: 18 Sep 2001.” The draft §4.9 “Decommissioning marked COMPLETE / All listed services removed” wording is not substituted. The existing November restart cause, maintenance wording and 03:14:07–09 timestamps remain prototype facts pending final chronology ratification. ARC-91-044 remains mundane unresolved archive bookkeeping; no secret link is assigned.

## Investigation, saves and QA

The narrow compatibility change is in `inspectFile` and the opening review's source collection:

- Reading the saved service register or restart file records the file observation without adding `EV_SERVICE_ACTIVE`. LOG also does not add that live observation.
- STATUS and INFO 006 can record the current running observation. They grant no inferred knowledge, permission, equipment effect or encounter completion.
- The existing opening service-source prerequisite accepts either a live observation or the saved monitor/restart source, as it effectively did before. Its trace distinguishes `live-service-006` and `archived-service-006`, under `service-state-source`. This prevents the historical path from becoming blocked when the false fresh-observation flag is removed.
- The review's questions, accepted causal answers, partial/wrong/missing-evidence checks, deferral, corroboration and delegated audit permissions are retained. Opening a log cannot solve it. Both closure-first and status-first discovery, unrelated-service exploration and saved-monitor-first paths are covered.
- Ordinary “What is 006?” now gives the permitted service description without automatically supplying the administrative closure observation. The alternative opening fixture and real-model validator now explicitly read the closure record. The source requirement and final assertions were not weakened.

No archive record body, dialogue catalogue, clinical disclosure gate, continuation operation, consequential confirmation, patient-support state transition or ending reducer was changed by this pass. Existing protected SEARCH results remain filtered, and ordinary public Anna/work profiles still work. STATUS no longer appends clinical/transport details; those existing specialized views retain their own queries.

Schema **5**, save keys, decoder, QA schema/database and event types remain unchanged. Context uses the existing string field. The provider's expanded subject validation also permits those service subjects in existing pending-clarification saves. INFO/LOG are recorded by the existing command telemetry, and natural questions carry deterministic response variants and service IDs. No operation or authority event is synthesized by logging. Older valid evidence flags are preserved; their historically mixed provenance is not guessed or retroactively migrated. Existing transcript text is retained.

## Validation actually run

| Check | Result |
| --- | --- |
| `npm.cmd test` | **337 tests passed, 14 files.** Includes all IDs/views, uniform registry, four state meanings, chronology, privacy, invalid syntax, offline/incorrect-model routes, ready browser-model path, follow-ups, read-only invariants, existing corporate exploration, saves, QA and all existing suites. |
| `npm.cmd run game:validate` | Passed with zero errors: 43 archive records, unchanged 22 operations, 205 intents, 1,638 examples, 378 catalogue variants, all three ending paths with every-step save/reload. Generated coverage reports refreshed. |
| `npm.cmd run build` | Passed production budgets: approximately **497.01 kB** initial raw / **134.22 kB** estimated transfer. Output `dist/client/`. |
| `node scripts/validate-services.mjs --model` | Passed: 24 exact draft messages/timestamps/categories, 3 reused restart entries, 9 exclusions, 4 unchanged source hashes, 27 factual/error/follow-up queries and **27 actual local-model inferences**, with offline output and save-round-trip parity. |
| `node scripts/validate-opening.mjs` | Passed 12 question regressions and 3 opening paths in both offline and real-model modes; **40 actual local inferences**, reloading after every input. |
| `node scripts/validate-corporate.mjs --model --dist` | Passed 34 safe profiles, 6 exclusions, 4 source-equivalent bodies, **48 actual model inferences**, and privacy scan of 13 production JS/JSON/MD assets. |
| `npm.cmd run model:holdout` | 36 cases: 32 direct matches, 4 clarifications, zero wrong routes. |
| `npm.cmd run model:verify` | All 10 original language asset sizes/hashes verified; 41,906,219 bytes. No recognition-asset regeneration was needed. |

The generated coverage report retains one pre-existing classifier-label mismatch: “Are you a robot?” uses `ask_identity` rather than the catalogue's `q_robot`. No new mismatch remains. Initial development runs caught overbroad interception of call/recovery questions, the obsolete implicit-closure fixture and a test parameterization error; those were corrected before the successful final suite. The initial sandbox test could not access Console Ninja's localhost port; authorized test runs completed. No real-browser, mobile-device or screen-reader session was performed in this pass; automated UI/engine checks and the production build are the evidence reported here.

## Exact files changed in this pass

**24 project files: 6 added, 18 modified**, measured against the full pre-pass working-tree hash inventory, including uncommitted Implementation 01 files. Build/cache/transcript outputs in ignored `dist/`, `.angular/` and `tmp/` are excluded. No commit, push, deployment or deletion was performed.

| Action | Path | Purpose |
| --- | --- | --- |
| Add | `src/app/core/service-records.ts` | Structured definitions, states, permitted events, provenance and fixed cutoff |
| Add | `src/app/core/interpretation/service-questions.ts` | Bounded factual recognition and contextual follow-ups |
| Add | `src/app/core/engine/services.ts` | Uniform read-only STATUS/INFO/LOG, errors and ordinary explanations |
| Add | `src/app/core/engine/services.spec.ts` | Service, chronology, authority, evidence, privacy, save and QA regressions |
| Add | `scripts/validate-services.mjs` | Authored-event fidelity, source preservation, real-model and save checks |
| Add | `docs/IMPLEMENTATION_02_OPERATIONAL_SERVICES.md` | This report |
| Modify | `src/app/core/engine/commands.ts` | INFO/LOG command parsing |
| Modify | `src/app/core/engine/game.ts` | Service dispatch, HELP, current registry and historical-read correction |
| Modify | `src/app/core/engine/investigation.ts` | Narrow source/provenance compatibility correction |
| Modify | `src/app/core/interpretation/fallback.ts` | Shared deterministic service recognition |
| Modify | `src/app/core/interpretation/semantic.ts` | Same routing with the optional model |
| Modify | `src/app/core/interpretation/providers.ts` | Eight-service subject validation and comparison-provider instructions |
| Modify | `src/app/core/interpretation/browser-ai.spec.ts` | Ready-model service/follow-up route |
| Modify | `src/app/app.spec.ts` | Requested registry UI expectation |
| Modify | `src/app/core/engine/corporate.spec.ts` | Allow newly implemented INFO/LOG in neutral HELP |
| Modify | `src/app/core/engine/investigation.spec.ts` | Explicit closure observation in the alternative opening fixture |
| Modify | `scripts/validate-opening.mjs` | Same explicit closure observation in real-model validation |
| Modify | `README.md` | Current commands/capabilities and report link |
| Modify | `docs/ARCHITECTURE.md` | Service data/routing, evidence and persistence boundaries |
| Modify | `docs/narrative/README.md` | Narrow Implementation 02 authorization/status |
| Modify | `docs/narrative/CANON_CONFLICTS.md` | Partial resolution, exclusions and remaining Records Access gap |
| Modify | `docs/narrative/IMPLEMENTATION_IMPACT_MAP.md` | Completed scope versus future design dependencies |
| Modify, generated | `docs/DIALOGUE_COVERAGE.json` | Refresh to 43 records and the retained known label mismatch |
| Modify, generated | `docs/DIALOGUE_COVERAGE.md` | Matching generated mismatch count |

All four supplied narrative sources, Implementation 01's historical report, corporate data/records, save implementation, runtime UI components/styles, story state, continuation/ending code, QA implementation and language assets retain their pre-pass content. Historical development documents were not deleted or rewritten.

## Remaining author work

Author permitted past Records Access events; ratify the exact closure assertion, restart chronology/cause, timezone and retention policy; decide whether any future date/paging/filter surface is useful. Missing unique service owners or registration metadata should remain absent until authored. Public/internal/clinical history depths, session exposure/authentication, Site 6 care and legitimate intervention authority remain separate design work. The incident/adaptive mechanism, MOTHER's late questions, Anna's communication, revised investigation and new endings require their next specifications. This service pass does not complete or certify the revised seven-act narrative.
