# Nerve Ending — implementation report

20 October 2026. Author reference; contains spoilers.

## Delivered

The Angular prototype now continues from the recovered handover through all seven acts and three final interventions. Its opening, nine records, terminal/file/document controls, local VT323, monochrome styling, CRT controls, text scaling, reduced motion and optional local model remain in use.

Thirty new records provide facility, personnel, research, clinical, engineering, vendor and intervention evidence: **39 records total**. They have dates, authors, provenance, stable paths and source links. Historical text remains immutable; current diagnostics and transport status are separate output. The unsupported 08:10 sign-in claim is corrected to a staff-mail timestamp.

Twenty-two operations cover provenance verification, service/controller audits, index search, diagnostic connection, clinical comparison, route/safety/release review, queue inspection, restoration/testing/isolation/reversal, revocation, isolation verification and intervention preparation. Consequential actions have visible warnings and separate confirmation that rechecks prerequisites. Safe investigations do not silently change equipment.

Typed knowledge, delegated permissions and operating state are separate. Acts derive from discoveries. Stable event IDs prevent duplicate effects. Source inspection and safe audit/comparison actions provide alternate routes to major findings. No unrelated reading count or arbitrary password grants authority; 0417 remains a partial historical identifier.

## Endings

| State | Anna | Known external route | Cost |
| --- | --- | --- | --- |
| `MERCY_PROPAGATION` | Dies after standard release | Depot delivery only if the relay was actually operational; otherwise queued without receipt | A dangerous recovery profile can reach legacy clinic infrastructure |
| `CONTAINMENT_CONTINUATION` | Alive on support | Relay permanently isolated for the completed session; queued data held | Corrections and distress remain unresolved |
| `SEVERANCE_COSTLY_COMPASSION` | Dies after controlled release | Credentials revoked and isolation verified; known distribution blocked | Legitimate clinic support interrupted pending replacements |

All require explicit final confirmation. No question or model match initiates an ending. Final reports show actual consequences; records and questions remain available afterward. Depot receipt never proves installation or injury. Undocumented infrastructure is not invented or treated as certain.

## Conversation

Generated figures: [DIALOGUE_COVERAGE.md](DIALOGUE_COVERAGE.md), [DIALOGUE_COVERAGE.json](DIALOGUE_COVERAGE.json).

- **205 recognition intent definitions**, including unknown input.
- **1,638 distinct examples**, including short fragments, contractions, technical/plain wording, emotional questions and reviewed spelling errors.
- **378 new early/revealed response variants**, plus retained opening replies and live-state/repetition responses.
- **20** unorthodox/easter egg intent triggers; **16** checked contextual follow-ups.
- **13** catalogue phrases request a subject when presented without context.
- **0** duplicate/conflicting examples, deterministic catalogue misroutes, missing/unreachable late variants or golden-path reducer/save errors.

Intents separate recognition text, subject family, reveal conditions, sources and authored answers. Behavioral profiles derive from evidence, subject and pending intervention. Source requests preserve context; ambiguity clarifies. Repetition keeps useful facts available. Completed-session answers distinguish historical records from present support. Rare classification conflicts arise from the feedback mechanism, never deliberate Anna messages.

The all-MiniLM-L6-v2 q8 worker, local cache and loading lifecycle remain. Regenerated embeddings and manifest hashes cover ten assets totaling **41,906,219 bytes**. No question goes to a model server. The optimized initial application with local QA tools is approximately **439 kB raw / 119 kB estimated transfer**, excluding optional assets and the lazy worker.

## Verification

| Command | Result |
| --- | --- |
| `npm test` | **153 passing unit/component checks**, including local QA logging, export, ordering and persistence |
| `npm run game:validate` | Three ending fixtures, every-step save/reload and dialogue/data integrity pass |
| `npm run build` | Production build passes existing budgets |
| `npm run model:verify` | 10 asset sizes and SHA-256 hashes verified |
| `npm run model:evaluate` | 50/50 intended answers |
| `npm run model:holdout` | 32 direct answers, 4 clarifications, 0 wrong routes in 36 cases |
| `npm run model:continuation` | 24/24 continuation regression questions |
| `npm run model:catalogue` | 1,638/1,638 with documented subject context for short pronouns |

The continuation questions exposed narrow-meaning confusions during development. Compositional guards now distinguish consent, supported life, welfare, diagnostics versus delivery, receipt versus installation and reversibility. Those 24 cases are regression data after fixes, not an independent unseen-wording benchmark. The retained holdout is reported separately. Catalogue accuracy measures authored coverage, not unrestricted understanding.

Golden paths run without a model. Tests cover all acts, alternative reading order, locked names/sources, safe/repeated/invalid operations, forged classifier output, queued/transmitted recovery, reversal, revocation, cancellation, confirmation, unavailable-model final choice, completed-session review and schema-3 migration. Old saves are preserved; schema 4 never replays operations on load.

Production-browser checks at desktop width and an embedded **390 × 844 CSS-pixel viewport** verified mouse-only backup-to-audit continuation, mobile tabs, record search/opening, source metadata, model READY/LOCAL, real sentence-model clarification, keyboard input, Escape-to-skip, confirmation focus and cancellation. The responsive harness is a temporary ignored build artifact.

## Local playtest QA

The settings panel now provides opt-in IndexedDB telemetry, disabled on a fresh profile. Ordered events capture inputs, recognized/effective intents, recognition methods/confidence/fallback, exact response selection and conditions, record access, comparisons, commands, permission challenges, successes/failures, narrative milestones, acts and ending selection. Response feedback links to a specific event. QA storage is separate from investigation saves; restarting retains recordings, and clearing QA disables it without changing progress. Current/all JSONL download and current-session copy make recordings portable. Common credential/personal text patterns are redacted before persistence. No upload or automatic training is implemented. [QA_LOGGING.md](QA_LOGGING.md) documents scope, schema, retention and privacy limits.

Production-browser smoke checks confirmed default-off controls, opt-in, real question/response recording, linked feedback, the download request, same anonymous session and event count after reload, and retained recordings after opt-out. The local preview was left with recording off. Automated tests also compare all three recorded ending paths against normal engine results, verify IndexedDB reopen and concurrent transaction ordering, and exercise storage failure without disrupting gameplay.

## Remaining limits

- The game and endings are playable; **90–120-minute duration and emotional pacing are unmeasured**. [GAMEPLAY_GUIDE.md](GAMEPLAY_GUIDE.md) contains the human playtest plan.
- Responsive checks are not physical-phone, touch-keyboard or screen-reader testing.
- Worker loading/inference were observed locally. Offline caching remains, but a physically disconnected full playthrough was not performed in this pass. Browser eviction may require another optional download.
- Unfamiliar natural language can still clarify or fail. No unrestricted-conversation claim is made.
- The private hosted preview was not updated. The completed build is local in `dist/client/`. No deployment, commit or push was requested or performed.

The existing user-authored `CREATIVE_GAMEPLAY_HANDOFF.md` was left untouched. README, architecture, playable paths, catalogue and generated coverage now describe this implementation.
