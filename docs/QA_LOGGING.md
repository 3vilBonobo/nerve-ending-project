# Local playtest QA

QA recording is an optional local playtest tool, disabled on a fresh browser profile. It is independent of the investigation save and optional question model. It never grants knowledge, changes permissions, confirms operations or chooses an ending. No QA data is uploaded or used for training automatically.

## Tester workflow

1. Open **Display & Settings → Local Playtest QA**, or **Settings…** before starting. Expand the panel and enable local QA logging.
2. Play normally. A `QA RECORDING / LOCAL` indicator appears in the desktop footer. Enabling partway through a game records the current state and subsequent actions; it does not import earlier transcript entries.
3. Optionally expand **Mark a response**. Select a recent question/response, review its exact reply, choose **confusing**, **incorrect**, **repetitive** or **particularly effective**, and add an optional note. Feedback refers to the response's event ID and sequence.
4. Choose **Export current session** or **Export all sessions**. The browser downloads `nerve-ending-qa-<session-prefix|all-sessions>-<UTC timestamp>.jsonl` to Downloads or its configured save location. **Copy current JSONL** also supports manual copying if clipboard permission is unavailable. Exports do not remove or modify recordings.
5. Disable logging when finished. Stored events remain exportable. **Clear recorded QA data…** asks for an inline confirmation, removes all local QA sessions and turns logging off, while retaining the investigation save and model cache.

The anonymous QA session follows one saved investigation through reloads and opt-out/opt-in gaps. Restarting the investigation creates a new session when its next recorded event occurs. QA IDs are random and unrelated to an account or device. Gaps while disabled are intentional: the enable/disable markers and following state snapshots identify them. Recording cannot recover actions before opt-in or while disabled.

## Local storage and retention

Database: **IndexedDB → `nerve-ending-qa`**, version 1, on the game's browser origin. Developer tools can inspect its `events`, `sessions` and `settings` stores. This is browser-managed storage, not a project-directory log file. Use the export controls to create a portable, easy-to-locate file. Different browsers, profiles, domains and local ports have separate databases. “All sessions” means all QA sessions stored on that origin in this browser, not data from other players or devices.

There is no automatic age limit or silent event cap. Data is retained until cleared through the panel, site-data controls or browser eviction. Private browsing may discard it on exit. Export before changing browser/device or clearing site data. IndexedDB write errors stop recording and display a warning; gameplay continues, and previously committed events remain exportable. A failed batch is atomic and creates no partial event sequence or statistics. Accepted writes are queued and exported only after the queue drains; abrupt browser/process termination can still lose uncommitted work.

The panel loads at most 200 recent events for the current session and offers the latest 30 response records within that window for feedback. Its inspector shows the latest 20 events. These display limits do not truncate exported sessions or total statistics. Exporting all sessions currently assembles the JSONL file in memory, so very large archives should be exported and cleared periodically.

## Event format and ordering

Every line in JSONL is one JSON object. Embedded response newlines are escaped inside the JSON value. Every event contains:

| Field | Meaning |
| --- | --- |
| `schemaVersion` | QA schema version, currently 1 |
| `applicationVersion` | Release/build identifier, currently `1.1.0+opening.1`; update `core/qa/types.ts` when releasing gameplay changes |
| `id` | Random unique event ID |
| `sessionId` | Anonymous investigation recording ID, persisted independently of the game save |
| `instanceId` | Random identifier for this client/tab lifetime; distinguishes overlapping tabs |
| `timestamp` | ISO UTC time at capture, not the fictional game clock |
| `sequence` | Persistent, increasing per-session sequence number |
| `order` | Database-wide increasing commit order, used by exports |
| `interactionId` | Links a submitted input, its resolution, response, effects and feedback; null for independent UI actions |
| `source` | Terminal, operation button, evidence button, record link/tab, file browser or client |
| `type` | Event name |
| `state` | Snapshot of current narrative conditions, never a mutable reference to the game save |
| `data` | Event-specific structured fields |

Reconstruct a session by filtering `sessionId` and reading increasing `sequence`. Use `order` for the combined archive. Wall-clock timestamps can tie or move backwards and must not determine event order. Sequence allocation, event insertion, statistics and consent checks share an IndexedDB transaction, including when multiple tabs write concurrently. Previously open tabs cannot keep recording after another tab disables or clears consent: each batch checks persisted consent. Their UI synchronizes when they next attempt a write. `instanceId` distinguishes concurrent branches when two tabs use the same investigation save.

State snapshots include act, knowledge, evidence, delegated permissions, viewed/open records, directory, completed actions, story event IDs, question counts, hint level, previous conversational context, pending operation and operating conditions. Question responses and action results also include the **before** snapshot. QA does not store account metadata, browser history, clipboard contents, model settings, endpoint URLs, raw exceptions or device fingerprints. UI-only display changes are outside the recording scope.

Opening snapshots also include encounter stage, attempts, partial findings and deferral, plus clarification intent/choice IDs (without duplicating the original free text in the snapshot). `encounter_prompted`, `encounter_explained`, `encounter_deferred`, `encounter_resumed` and `encounter_completed` identify stable encounter IDs. `challenge_attempt` and `evidence_compared` report source concepts, incorrect/partial/missing-evidence/accepted outcomes and reasons. `question_resolved` retains the predicted intent, effective encounter or clarified intent, and `resolutionMethod: deterministic-context` when context resolves the input. These are additive schema-1 fields/events identified by the application version. Old recordings remain exportable in order.

| Event group | Captured details |
| --- | --- |
| `question_submitted`, `question_resolved` | Player input, recognized and effective intent, entity/record, deterministic/semantic/Ollama method, provider, confidence when available, ambiguity/clarification, unmatched result, fallback and enumerated reason, recognition context and elapsed time |
| `response_selected` | Exact selected lines, source links, truth/code, variant ID, intent, behavioral profile, reveal gate/result, question/repetition count, modifiers and relevant before/after narrative state |
| `command_submitted`, `operation_requested`, `action_result` | Explicit command/operation, input source, success, outcome, access-denial flag, reason/output, pending confirmation, cancellation, repeated completion and elapsed time |
| `file_opened`, `file_open_attempt`, `file_focused`, `file_closed`, `directory_changed` | Record/path, source, prior viewing and access outcome; terminal failures also appear as action results |
| `evidence_compared`, `authorization_challenged`, `challenge_attempt`, `action_failed` | Comparison sources, authority questions, prerequisite/access challenges, attempted operation, denial/failure reason; empty searches and unmatched questions are unsuccessful, ordinary syntax errors are not authority challenges |
| `milestone_reached`, `act_transition`, `ending_selected` | New knowledge/evidence/permission, act boundaries, ending ID, selected operation and explicit confirmation |
| Lifecycle and feedback | Enable/disable, start/resume/reset, interrupted input and tagged response feedback |

Structured dialogue has stable IDs such as `q_designation:early` / `q_designation:revealed`, with explicit IDs for dynamic state-dependent branches and modifiers for repetition/transport conditions. Retained opening branches use `legacy:<intent>:<FNV-1a-64 output hash>`; clarifications use `clarification:<intent>:<hash>`. Command and operation replies use `command:<name>:<hash>` / `operation:<id>:<hash>` with a `SYSTEM` profile and can also receive tester feedback. Their exact output and before state accompany the identifier. The trace is transient metadata on engine transitions, not a game-save migration or an added narrative event. Authored response text is unchanged.

## Privacy

Only gameplay input and its relevant outcomes are recorded after opt-in. No authentication fields, passwords, tokens, external identifiers or unrelated application data are read. Before an event reaches IndexedDB, a whitelist snapshot and recursive text scrub redact common credential assignments, bearer/basic authentication, recognizable keys/JWTs, URLs, email addresses and phone/identifier patterns. Feedback and echoed input are scrubbed too. Canonical game identifiers such as `0417`, fictional dates and clinical counters are retained. Export repeats the text scrub as a safeguard.

Free text can contain unexpected personal information that pattern matching cannot recognize. Testers must avoid entering personal information or secrets and review exported text before sharing. Redaction may also mask benign text matching a sensitive pattern, so exported input/output may contain `[REDACTED …]` in place of those spans. No tester name, email, account, password or token field is provided. The random session ID is pseudonymous; it is not a claim that arbitrary free text can be perfectly anonymized.

## Verification

`npm test` includes real IndexedDB adapter tests using `fake-indexeddb`, recorder integration tests and panel tests. They cover default-off behavior, consent persistence, connection reopen, same-session resumption, atomic rollback, concurrent ordering, cross-tab consent, session isolation, current/all JSONL, newline handling, privacy before storage, exact response selection, ambiguity/fallback results, failed actions, all three ending paths, feedback, reset retention, clear without game changes and unavailable/full storage. Golden-path states are compared against the uninstrumented reducer results to check that recording itself changes no narrative state.
