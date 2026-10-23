# Architecture

Static Angular 21, strict TypeScript, signals, ordinary CSS and local browser saves. No application backend, paid generation service or required model download.

## Domain and transitions

The existing `engine/game.ts` remains the entry point for commands and questions. Mouse operation buttons submit the same command strings through `Session`; record inspection uses the same pure access checks. The 39 source records have stable IDs and virtual paths. Nine retained opening records are followed by 30 continuation records in `story-records.ts`. Historical text never changes with the ending; current telemetry and transport status are separate reducer output.

State has three distinct layers:

| Layer | Source | Meaning |
| --- | --- | --- |
| Observations | `viewedFileIds` / `discoveredEvidenceIds` | Records or source facts encountered; no inferred conclusion or authority |
| Knowledge | `knowledge` / `Knowledge` | Conclusions established by an evidence encounter or explicit audit |
| Capability | `permissions` / `Permission` | An operation delegated by archive provenance or retained review procedure |
| Operating | `operating` / `OperatingState` | Actual support, relay, credentials, queue, isolation and final intervention state |

`engine/continuation.ts` owns the operation catalogue, prerequisite functions, explicit-action grammar, pending confirmation and idempotent event IDs. Confirming rechecks prerequisites. Safe investigations never silently restore a vendor route. Read-only diagnostics and outbound vendor communications are separate capabilities and states. Temporary isolation can be reversed; revocation and final interventions cannot. Final state freezes further interventions while allowing records and questions.

Acts are derived from established knowledge and the ending rather than a single mutable act counter. `engine/investigation.ts` defines the two opening encounters, grounded source requirements, deterministic meaning checks, partial answers, explanations and defer/resume behavior. The first distinguishes administrative closure from operational release; the second corroborates the preservation controller's transfer acknowledgement through BRIDGE-02 and its lack of release authority. Completion delegates only a read-only audit. A separate audit request establishes Site 6 and Act II. No file inspection grants knowledge or permissions, in any act. 0417 remains a partial historical identifier.

## Recognition and dialogue

Explicit operations and commands precede file references, deterministic catalogue/guarded questions, optional sentence similarity, clarification and accessible-record fallback. Operational recognition is anchored to an explicit imperative; informational wording and question marks cannot enter the intervention reducer. Model output has no operation-ID field or mutation API. A forged stop intent cannot release a patient.

`dialogue-catalog.ts` holds intents with family, examples, reveal condition, sources, early/revealed answers and easter egg marker. The retained semantic catalogue supplies opening subjects. Exact examples, conservative overlap and compositional guards work offline. `dialogue-matching.ts` resolves recent-subject follow-ups, with clarification when context is absent. Source requests preserve the recent subject. Repetition counters and hint escalation are harmless conversational memory.

`engine/dialogue.ts` selects authored responses and current-state additions. Administrative, clinical, defensive, cooperative, conflicted and preservation-critical profiles derive from evidence, subject and pending intervention. Trust, preservation conflicts, repeated greetings and completed interventions have additional responses. No anomalous output is a deliberate message from Anna.

The optional pinned all-MiniLM-L6-v2 q8 model runs in a worker with same-origin WASM and reference vectors. It classifies against 1,638 questions across 205 categories. It receives examples and copied conversation context, not a dialogue-generation prompt or record bodies. Similarity scores are not calibrated probabilities. Nearby meanings clarify unless their authored answers are substantively equivalent. Production hides the retained loopback-only Ollama adapter.

Optional assets use manifest byte sizes/hashes, a separate browser cache, warmup, readiness, cancellation and inference timeout. There is no external model endpoint. Missing model assets do not block any ending.

## Persistence and presentation

Schema 5 uses `nerve-ending.save.v5`. Pending encounter stage, attempts, partial findings and deferral survive reload. `pendingClarification` retains the original request and validated interpretation/options so a subject or first/second answer resolves that request. Schema-3/4 opening observations migrate without the former backup-derived inference. Advanced schema-4 investigations preserve their existing access with an explicit legacy marker; their originals are preserved. Schema-1/2 prototypes retain preferences. Decoding validates identifiers, availability, enums, booleans, history bounds and pending prerequisites, and normalizes ending invariants. Migration never replays operations or sends a package.

The fixed clinical snapshot has one canonical source in `story-state.ts`; it does not fabricate a constantly advancing pain counter. Present transport output distinguishes none, queued and confirmed depot receipt. Receipt never proves installation or injury.

`TerminalPlayback` separates transient presentation from saved complete output. Esc skips printing; reduced motion is immediate. The monochrome terminal, local VT323, file windows and mobile tabs are retained. Record references and backup paths are plain text. The automatic operation menu is removed. The terminal shows persistent verification/clarification text, an input, ordinary controls and a reviewable safety confirmation panel with keyboard focus.

## Local QA telemetry

`core/qa/` owns an independent IndexedDB database, persistent consent (off by default), anonymous investigation sessions, transactionally allocated event sequences/statistics, redaction and JSONL export. `Session` observes transitions and input lifecycles; it never invokes gameplay operations just to log them. Engine response traces describe the selected authored variant without adding fields to narrative saves. Before/after snapshots and interaction IDs connect recognition, exact output, actions, milestones, act changes and endings. Storage failures stop QA recording while gameplay continues. The production settings panel offers consent, current/all exports, current copy, feedback, statistics and separate QA deletion. See [QA_LOGGING.md](QA_LOGGING.md) for retention, privacy and event schema.

## Validation

Unit/component checks cover the opening, all acts, permission/reveal boundaries, reversibility, confirmation/cancellation, endings, storage, unavailable models and post-ending review. `playthroughs.ts` supplies reproducible golden paths. `npm run game:validate` checks duplicate/conflicting phrases, conditions, references, reachable late variants, accidental operation recognition and save round trips at every golden-path step. JSON and Markdown reports live in `docs/`.

Real-model development, holdout, continuation and catalogue checks are separate scripts. Evaluations write distinct temporary bundles so they cannot overwrite a shared recognition module.
