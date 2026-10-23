# Opening investigation redesign — implementation and QA report

Implemented 20 October 2026. Scope: Act I through the read-only continuity audit at the beginning of Act II. This supersedes the earlier click-through opening described in the historical status audit. Acts III–VII and the dialogue catalogue were not redesigned or expanded.

## Result

Record access now supplies observations only. It never adds inferred knowledge, grants permissions or completes an act. The player must establish two different claims through terminal interaction before the engine delegates an audit. A separate explicit audit request establishes Site 6 and Act II. The entire opening preserves `operating` state, including service 006, support, relay, credentials and the package queue.

The ordinary file browser, directory navigation, searches, document windows/tabs, accessibility controls and explicit safety confirmations remain. Terminal references and document references are selectable plain paths. Automatic operation buttons, the backup-reader shortcut and the recovered-receipt taskbar shortcut are removed. `STATUS` no longer prints the operation catalogue. `READ` aliases `OPEN`, including direct reading of the backup's displayed path.

## Implemented encounters

| Contract | Closure discrepancy | Handover provenance |
| --- | --- | --- |
| Stable ID | `closure-discrepancy` | `handover-provenance` |
| Availability | New opening, before provenance is established | After establishing the closure distinction |
| Trigger | Ask about the discrepancy/restart, request an investigation, or request handover verification | System initiates the next verification after the first accepted interpretation |
| System question | What is missing before administrative closure can count as operational release? | Which system accepted the transfer, and does that confirmation release the hold? |
| Required observations | Live service 006, the administrative closure, and the handover requirement | The retained backup and BRIDGE-02 status |
| Accepted meaning | Office approval is not operational release; the holding system's release acknowledgement remains missing | The preservation/holding controller accepted the transfer through the bridge; transfer acceptance does not authorize release |
| Alternative sources | STATUS or service-status inquiry or the service record; closure inquiry or record; handover inquiry, reference or backup | Read BRIDGE-02 or request its historical status; the backup can be read before or after the first question |
| Partial/incorrect handling | Missing sources or unsupported release claims retain the question and grant no access | Origin and release boundary can be established in separate replies; contradictory origin/release claims grant nothing |
| Effects | Moves to provenance review; no new permission or clinical fact | Adds `handoverVerified`, `clinicalHoldKnown`, `archiveAuditAccess`, `bridgeStatusAccess`; marks the opening investigation complete |
| Operational consequence | None | Only a read-only audit is delegated; an audit request then establishes `site6Known` |

`OPENING_ENCOUNTERS` holds prompts, explanations, source concepts and IDs. The deterministic reducer validates observations and answer meanings. Semantic output cannot supply encounter completion, permissions or operation IDs. The parser accepts causal variants and partial answers; it does not compare an answer against one password or exact phrase. No document date, partial authorization number or arbitrary name is a quiz answer.

Both questions support `EXPLAIN`, ordinary file/terminal navigation, unrelated inquiries, `DEFER`, and `RESUME INVESTIGATION`. Partial findings, attempt counts, current stage and deferral persist. The terminal's pending-review text reflects the remaining part of a partially answered question. The interface continues to identify itself as R-02; neither Anna nor MOTHER's designation is revealed in the opening.

## Exact opening path

Run from a new session, with or without Improved questions:

```text
STATUS
READ Closure list
Why is 006 still running despite being closed?
READ Handover receipt
The office approval is not an operational release; the holding system confirmation is missing.
OPEN backup
READ /COMMS/BRIDGE_02_STATUS.LOG
The preservation controller accepted the transfer via BRIDGE-02, but release is still withheld.
Request a read-only continuity audit
```

The discrepancy question initiates the first verification. The first evidence statement initiates the second. The second statement delegates the audit. The final request reports Meridian Site 6, closed research and exempt essential support. At this boundary, neither `motherIdentified` nor `annaIdentified` is established.

The backup can alternatively be read with:

```text
READ /ARCHIVE/HANDOVER_006.BAK
```

Another valid approach reads the backup first, requests `CHECK BRIDGE STATUS`, asks `What is 006?`, requests investigation, distinguishes administrative approval from release, identifies the holding controller, and separately explains why a release reply is still required. All these steps can survive a reload.

Example partial-answer exchange after reading the backup and bridge status:

```text
PLAYER: The preservation controller, through BRIDGE-02
R-02:   Confirmation origin corroborated. Does transfer acceptance
        establish authority to end the hold? Explain what is still required.
PLAYER: No, transfer acceptance is not permission to release;
        the hold still needs a reply.
R-02:   Handover provenance established. Read-only continuity audit delegated.
```

“J. Kell approved it, so we can stop the service” and “The night desk confirmed the transfer” do not unlock access. A correct-looking assertion without the required observations also does not unlock access. Questions about releasing or stopping anything do not perform an intervention.

## Conversation fixes and clarification

The twelve reported inputs have explicit regressions with offline recognition and real q8 model evaluation:

| Input | Relevant response |
| --- | --- |
| Are you human? / Are you AI? / Robot / Intelligence | Automated records interface, no human operator, no unsupported complete intelligence architecture |
| Who is J. Kell? | Filed the retained closure list; full name, title and present location unavailable |
| Where are Meridian headquarters? | No headquarters address in this copy |
| Where is your server located? | Physical server location unspecified; this connection does not establish it |
| Show me what you have saved locally | Describes this client's game save, recent history/preferences and separate opt-in QA/export controls |
| What is records access 007? | The running records connection the player is using |
| Online | Asks whether the player means service 006 or records connection 007 |
| What is biological activity? | Physiological processes; the term alone does not establish consciousness, comfort or recovery |
| What is the live monitor? | Current registered-service status and its distinction from saved administrative records |

Clarification stores the original input and validated interpretation/options. A service identifier, matching subject, first/second choice or confirmation of a single proposed subject resolves that original request. Commands and unrelated questions remain usable while clarification is pending. `CANCEL CLARIFICATION` dismisses it. The terminal shows the saved clarification after reload.

Targeted routes reuse existing intents; no recognition-example catalogue or model vectors were expanded. The local model still classifies meaning rather than generating narrative or authorizing actions.

## Persistence and telemetry

Game schema 5 uses `nerve-ending.save.v5`. New fields store encounter progress and clarification context. Earlier opening observations, backup recovery and display preferences migrate without counting a backup read as a solved investigation. Already advanced schema-4 sessions retain their progress and receive a `legacy` investigation marker; starting a new session uses the redesigned opening. The old save keys are preserved.

QA remains local, opt-in and off on a fresh browser origin. It records stable encounter IDs, prompts, explanations, deferrals, resumptions, attempts, partial/wrong/missing-evidence outcomes, source concepts and completion. Contextual question resolution records both predicted and effective intent and `resolutionMethod: deterministic-context`. Response variants use `encounter:<id>:<action>:<outcome>`. JSONL snapshots contain stage, attempts and partial progress; ordinary session order and local IndexedDB/export behavior remain intact. Application identifier: `1.1.0+opening.1`.

Successful verification is separate from an authorization challenge or a medical decision. Recording observes the transition; it never solves or advances it. Existing credential/personal-text redaction and feedback/export controls remain in use.

## Reproducible later-act technical fixtures

These preserve reachability, not the claim that the later acts now have engaging evidence encounters. Start with the exact opening path above, then run the common continuation:

```text
SEARCH CLINICAL INDEX
OPEN /CLINICAL/AV06_STATUS.CLIN
AUDIT CONTROLLER
CONNECT DIAGNOSTICS
CONFIRM OPERATION
COMPARE CLINICAL RECORDS
REVIEW COMMUNICATION ROUTES
REVIEW SAFETY
REVIEW RELEASE
PREPARE RELEASE
```

Append one branch:

| Ending | Commands, in order |
| --- | --- |
| Mercy / Propagation | `RESTORE BRIDGE` → `CONFIRM OPERATION` → `TEST RECOVERY ROUTE` → `CONFIRM OPERATION` → `INSPECT QUEUE` → `RELEASE PATIENT` → `CONFIRM OPERATION` |
| Containment / Continuation | `CONTAIN SITE` → `CONFIRM OPERATION` |
| Severance / Costly Compassion | `OPEN /CONTROL/VENDOR_REVOCATION.MAN` → `REVOKE VENDOR` → `CONFIRM OPERATION` → `ISOLATE BRIDGE` → `CONFIRM OPERATION` → `VERIFY ISOLATION` → `CONTROLLED RELEASE` → `CONFIRM OPERATION` |

These complete 26-, 21- and 27-input fixtures respectively. Every step is saved/reloaded in the tests. `GOLDEN_PATHS` is the executable source of truth, and `tmp/game-validation/playthroughs.json` contains full generated transcripts. No debug skip or bypass control was added to the game.

The narrow later-operation compatibility change is vendor delegation: reading its manual no longer grants a permission. The existing explicit, confirmed revocation operation validates retained route access, observed procedure and known risk, then records its delegation on execution. Clinical and network warnings/endings otherwise retain their existing behavior.

## Verification performed

| Check | Result |
| --- | --- |
| `npm test` | 198 tests, 12 files, passed |
| `npm run build` | Production Angular build passed |
| `npx tsc --noEmit -p tsconfig.spec.json` and worker/app configurations | Passed |
| `node scripts/validate-game.mjs --check` | Three ending paths, every-step reload, all late dialogue gates reachable, zero errors; author catalogue files not rewritten |
| `node scripts/validate-opening.mjs` | Twelve recorded inputs plus three opening paths in each of offline and real local-model modes; reload after every input; 39 real model inferences; passed |
| `npm run model:holdout` | 32 direct matches, 4 clarifications, zero wrong factual routes, passed |
| `npm run model:verify` | Ten pinned assets verified, 41,906,219 bytes |
| Production browser, clean local origin | Model-off opening, deferred-review reload, partial-provenance reload, model-ready follow-up, continuity audit pointing to Site 6; clarification reload also checked |

The automated suite covers all currently accessible files without progression; the previous 11-input shortcut; executing every available operation without solving; browser record/control clicking without solving; applied-evidence progression; paraphrases with misleading semantic candidates; wrong/negated answers; missing evidence; partial answers; explain/defer/resume; clarification; source/permission boundaries; legacy migration; pending saves; ordered/exported encounter telemetry; all three later endings and existing QA privacy/persistence behavior.

## Affected files

Paths are relative to the repository root. These are changes for this focused redesign, not the earlier already-present continuation/QA implementation.

- `src/app/core/engine/investigation.ts` and `investigation.spec.ts`: encounter contracts, source/meaning validation, prompts, partial/defer behavior and 42 regression cases.
- `src/app/core/engine/game.ts`, `commands.ts`, `continuation.ts`, `dialogue.ts`, `playthroughs.ts`: reducer integration, READ, observation/inference separation, guarded audit, hints, explicit backup reading and technical fixtures.
- `src/app/core/interpretation/opening-questions.ts`, `fallback.ts`, `semantic.ts`, `providers.ts`: targeted question routes and validated clarification candidates.
- `src/app/core/models.ts`, `persistence/saves.ts`, `persistence/saves.spec.ts`: schema, encounter/context serialization and migration.
- `src/app/core/qa/types.ts`, `events.ts`, `telemetry.spec.ts`: encounter events, versioned snapshots, contextual resolution and ordered JSONL regression.
- `src/app/core/story-records.ts`: BRIDGE-02 availability depends on backup access rather than an inferred hold conclusion; record text preserved.
- `src/app/core/session.ts`, `src/app/app.html`, `app.ts`, `app.spec.ts`, `features/terminal/terminal.html`, `terminal.ts`, `terminal.spec.ts`, `features/documents/document.ts`, `src/styles.css`: remove shortcuts and event hooks, retain ordinary controls/confirmations, display persistent prompts and plain references.
- `src/app/core/engine/game.spec.ts`, `continuation.spec.ts`: update obsolete file-read progression expectations and preserve ending coverage.
- `scripts/validate-opening.mjs`, `scripts/validate-game.mjs`: real-model opening checks and a validation mode that does not rewrite catalogue documents.
- `README.md`, `docs/ARCHITECTURE.md`, `GAMEPLAY_GUIDE.md`, `QA_LOGGING.md`, this report: current interaction/save/QA contract and exact routes.

## Remaining limitations

- Acts III–VII retain broad operations such as clinical comparison and route review. They are technically reachable and tested, but can still progress quickly once the opening is solved. Their encounter redesign is future work.
- Meaning validation covers bounded English concepts and tested paraphrases, including common negative claims. It is not unrestricted language understanding. Unrecognized wording can require rephrasing; no similarity score alone authorizes access. More actual playtest language should guide refinement.
- Source validation establishes that relevant records/status were encountered; it cannot prove a person read or understood every line. Search excerpts alone do not count as full backup/bridge provenance review.
- Existing advanced saves intentionally preserve their previous access. A fresh session is necessary to playtest the new opening from its beginning.
- Automated reachability, source checks and UI verification do not establish human engagement or a target playtime. Another human QA session is needed to measure conversation after Act I and whether the opening feels investigative.
- The old, dated status-audit documents remain a historical baseline. This report, README and executable fixtures describe the revised opening.
