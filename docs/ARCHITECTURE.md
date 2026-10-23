# Architecture

Static Angular 21, strict TypeScript, signals, ordinary CSS and local browser saves. No application backend, paid generation service or required model download.

## Domain and transitions

The existing `engine/game.ts` remains the entry point for commands and questions. Confirmations and record inspection use the same pure engine and access checks through `Session`. The 43 source records have stable IDs and virtual paths: nine retained opening records, 30 continuation records in `story-records.ts` and four approved ordinary samples in `corporate-records.ts`. Historical text never changes with the ending; current telemetry and transport status are separate reducer output.

Implementation 01 adds an explicit 34-profile public projection in `corporate-records.ts`; no authoring JSON is imported into runtime. Six contracted-care candidates, writer depth, author notes, protected links and Anna's private status suffix are excluded. `interpretation/corporate-questions.ts` provides bounded company/personnel recognition shared by offline and optional-model paths. `engine/corporate.ts` returns sourced ordinary answers without evidence, knowledge, permission, operation or encounter effects. Raw recognized corporate questions bypass pending opening verification without rewriting its encounter contract. General search also queries the public directory by name, role and department, with ordinary source order and no story ranking; the desktop browser still searches readable document bodies. The authored directory document remains its six-entry excerpt, while terminal queries cover all 34 profiles.

No new intent IDs, model examples, embeddings, state fields, save schema or role permissions were needed. Corporate context and Bell choices use existing conversation fields, and schema-5 saves remain compatible. QA distinguishes a successful personnel-only search from a zero-result search. `scripts/validate-corporate.mjs` checks source fidelity and exclusion boundaries; `--model` exercises the pinned local model and `--dist` scans final production assets for excluded data. See [Implementation 01](IMPLEMENTATION_01_CORPORATE_EXPLORATION.md) for results and remaining differences from canon.

Implementation 02 adds `service-records.ts`: eight structured service definitions, four distinct state meanings and 27 sourced, visibility-scoped events. Only 006 reads a story-controlled operating boolean; no new service controls or simulation are introduced. `engine/services.ts` owns uniform STATUS, INFO and LOG output. `interpretation/service-questions.ts` shares bounded factual routing across offline and model clients, with service context in existing `lastTopic`. Existing authored story questions retain their gated dialogue. The provider validator accepts service-001 through service-008, without adding intents or model examples.

The observation remains `CLINICAL_SNAPSHOT.at` (06 NOV 2003 / 02:14), with an installation-local comparison bound rather than a ticking server clock. Logs are dated retained records; public views check both visibility and observation cutoff. Five future draft samples, two conflicting 03:41 restart samples and two private Records Access samples are excluded. Consequently LOG 007 has an explicit no-permitted-events response. `scripts/validate-services.mjs` checks all 24 admitted sample messages verbatim, the three reused 03:14 restart events, source hashes and offline/model/save parity. No event is invented to fill that gap.

Saved monitor file inspection no longer adds `EV_SERVICE_ACTIVE`; STATUS and INFO 006 can record an actual current observation. The opening's existing service-source prerequisite accepts either a live observation or a viewed saved monitor/restart record, and its trace distinguishes their provenance. LOG never supplies the live observation or completes a review. The existing encounter questions, interpretation rules, delegated permissions, confirmation system and ending reducer remain intact. Existing schema-5 evidence flags are retained without retroactively guessing their provenance; no migration, QA schema or persistent state field changes are needed. See [Implementation 02](IMPLEMENTATION_02_OPERATIONAL_SERVICES.md) for this narrow compatibility change and updated fixtures.

State separates these layers:

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
