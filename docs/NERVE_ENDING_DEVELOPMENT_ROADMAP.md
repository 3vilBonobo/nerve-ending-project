# NERVE ENDING — prioritized development roadmap

**Baseline:** 20 October 2026, Europe/Athens; current working tree based on `38cd6a7`. **Planning only:** no recommendations below were implemented during the audit. See the [status report](NERVE_ENDING_STATUS_REPORT.md) for test results, exact counts and evidence IDs, and the [gameplay flow](NERVE_ENDING_GAMEPLAY_FLOW.md) for current behavior.

The game already has reachable endings. The next cycle should improve what players understand, do and hear, rather than manufacture more length or enlarge an already substantial catalogue. Priorities reflect player impact. Effort is relative: **S** = a localized change/verification, **M** = several connected modules or a focused content pass, **L** = a new interaction contract/content/UI loop. These are not calendar estimates.

## P0 — critical blockers

**No confirmed current P0 blocker was reproduced.** The three normal ending routes pass, their persisted states survive reload, one production-UI ending was replayed with the model off, and the bounded late-control exploration found no stranded nonterminal states. This does not certify every browser, old save or possible path.

Do not invent a P0 refactor to fill this section. Immediately promote any newly reproduced save loss, inaccessible ending, accidental consequential operation, corrupted consent/export behavior, or major causal contradiction. Preserve the current ending/save/QA tests as release gates. Before a public alpha, resolve any newly found blocker rather than relying on this audit's limited negative result.

## P1 — core gameplay quality and correctness

### P1-01 — Make central discoveries require applying evidence

- **Problem/evidence:** `inspectFile` immediately grants `file.reveals`; `VERIFY HANDOVER` checks the backup flag; `COMPARE CLINICAL RECORDS` checks clinical access and directly grants incident/distress/loop facts. Audit sweeps plus menu operations finish without supplying an argument. An 11-input route opens four files and ends without MOTHER identification or distress/risk discovery. [E1–E3; audit `fileSweep` and `minimalEnding`]
- **Why it matters:** this is the largest gap between an investigative hacker experience and a sequence of document/procedure selections. It also permits the emotional heart to be skipped without an equivalent discovery.
- **Proposed improvement:** design two or three focused evidence-application interactions, starting with receipt provenance and the STABLE/clinical contradiction. Let the player select or name relevant evidence, explain the relationship in supported plain language, receive a grounded error/hint, and use an accessible alternative route. Keep browsing and safe questions available. Do not require every record, a dwell-time quota, arbitrary passwords or trivia. Decide explicitly whether every ending needs MOTHER identification or an equivalent contextual revelation; do not accidentally make optional lore mandatory.
- **Likely modules:** `story-state.ts`, `models.ts`, `engine/continuation.ts`, `engine/game.ts`, records/dialogue data, Terminal/FileBrowser/Document UI, saves and QA event contracts.
- **Dependencies:** author/system-design decisions on which inferences matter and acceptable alternative evidence; P1-03 guard contract; P1-06 privacy rules for supplied free text.
- **Effort:** **L**.
- **Verification:** happy/wrong/ambiguous/abandoned/reloaded interaction cases; keyboard/mouse/model-free completion; all endings and existing alternate routes remain reachable; opening every file is insufficient to solve the selected inference without an explicit evidence application. Fresh testers can explain why the accepted evidence supports the unlock.

### P1-02 — Fix subject/context handling before adding more examples

- **Problem/evidence:** “You are scaring me” routes to calls offline and MOTHER's own fear with the model; “Who authorized the continued treatment?” routes to historical `0417` offline; bare “How?”/“Who?” lack deterministic context support. “Explain that simply” repeats the same answer. File summaries use stale `lastFileId` while focus moves through `openFileIds`. [E5–E8; audit `conversations`, `model`, `plainLanguage`, `summaryWithNoOpenFile`]
- **Why it matters:** these failures occur at emotionally or mechanically important moments. Another thousand examples would not by itself fix actor, temporal scope or selected-record errors.
- **Proposed improvement:** represent and resolve speaker/subject/claim/selected record consistently; avoid unbounded substring matches such as `ring` in “scaring”; add narrowly reviewed guards for patient-versus-controller feelings and current-versus-historical authority. Support short “Who/How/Why” only when context is sufficient, otherwise clarify. Keep a small pending clarification choice so an answer resolves the offered alternatives. Provide genuinely simpler authored alternatives for key clinical/network concepts rather than rerouting to the unchanged answer. Keep informative questions separate from execution.
- **Likely modules:** `dialogue-matching.ts`, `fallback.ts`, `semantic.ts`, `providers.ts`, dialogue data/selection, Session focus/context, relevant save schema if new persistent context is needed.
- **Dependencies:** stable subject/intention definitions; an author-reviewed set of acceptable equivalent answers. New unknown phrasings must be held out from tuning until evaluation.
- **Effort:** **M–L**.
- **Verification:** regressions for every reproduced phrase and new unseen paraphrases; both model-off and model-on routes; no false action on negative/interrogative wording; focus a different document and request its summary/source; clarification replies resolve the stored alternatives; plain-language output differs meaningfully without adding facts.

### P1-03 — Enforce truth across reveal gates, warnings and accumulated outcomes

- **Problem/evidence:** pending diagnostics selects a clinical-conflict reply with `gateSatisfied: false`; a prepared session's stop question claims read-only access; diagnostics warning promises disconnection via isolation while flags/manual say diagnostics remain; revoke-then-contain omits already-incurred vendor-support cost. [E1:148; E2:22,102,110,112,125; E6:45; audit `engineProbes` and production UI transcript]
- **Why it matters:** the player must be able to trust the interface's descriptions even when MOTHER's preservation interpretation is intentionally flawed. Accidental contradictions blur that distinction and weaken the final decision.
- **Proposed improvement:** apply reveal predicates to dynamic replacements as well as base text. Scope Preservation-critical behavior to the intended clinical circumstances, not every pending observation. Make late refusals accurately describe available capabilities and how to request an explicit operation. Choose and consistently implement whether vendor isolation affects diagnostics. Compose final reports from actual accumulated costs, including revocation before containment. Add state-sensitive source/context checks.
- **Likely modules:** `engine/dialogue.ts`, `engine/game.ts`, `engine/continuation.ts`, affected records, ending-card presentation and focused regression tests.
- **Dependencies:** author decision on diagnostic-route semantics; agreement about what is deliberate MOTHER distortion versus neutral system truth.
- **Effort:** **M**.
- **Verification:** exercise each dynamic override with its gate false/true, all warning types, prepared/unprepared states, and revoke/restore/isolate/final-choice combinations. Outputs, response metadata and flags agree. Initial protected names remain hidden. No story facts or interventions are added by questions or QA recording.

### P1-04 — Implement a small, grounded MOTHER initiative arc

- **Problem/evidence:** zero persistent proactive questions and zero challenge-answer types. Existing initiative is limited to a route-review suggestion; emotional/conflict variants are replies to player input. `voiceOf` is mostly metadata, not a full behavioral arc. [E2:104; E6; StoryState]
- **Why it matters:** MOTHER is central to the premise, but currently behaves predominantly like a very large reference catalogue. The player seldom experiences her needing, questioning or influencing them.
- **Proposed improvement:** add a few authored, state-triggered question/proposal events tied to legitimate provenance, ambiguous evidence and preservation/recovery needs. Persist prompt identity, context, response/decline and completion so reloads do not repeat a scene or discard an answer. Allow deferral and ordinary investigation. Use defined evidence transitions, not random horror timers. Suggestions must not auto-enable transport; clinical/network effects retain separate confirmation. Anna remains unable to deliberately communicate.
- **Likely modules:** StoryState/event contract, Session, dialogue/continuation selection, Terminal prompt UI, persistence/migration, QA prompt/answer event data.
- **Dependencies:** P1-01 interaction model and P1-02 context/clarification; P1-03 reveal/operation boundaries. Author review of motivation and restraint.
- **Effort:** **M–L**.
- **Verification:** every prompt has a documented trigger, prerequisite, deferral and answer outcome; deterministic tests prove no random/duplicate trigger, premature reveal or implicit intervention; reload/return preserves context; new-player observation establishes whether the change feels motivated rather than theatrical.

### P1-05 — Measure comprehension and bottlenecks with fresh players

- **Problem/evidence:** no human playtesting or measured duration. Exact-example and golden-path success cannot establish curiosity, reasoning, emotional impact or a 90–120-minute experience. Fast routes bypass optional Anna material and major dialogue.
- **Why it matters:** it is easy to add content where the actual obstacle is unclear intent recognition or a weak clue. Player impact must determine the next iteration.
- **Proposed improvement:** run a small first cohort of genuinely new players with different preferences for terminal/buttons and optional-model use. Start with the present baseline or a narrowly improved build; do not supply the solution fixtures. Observe how they explain STABLE, source contradictions, diagnostic versus vendor communication, and all final costs. Collect opt-in local QA and response feedback; separate time reading/playing from time away. Review stalled sessions alongside the actual sources and selected replies.
- **Likely modules/artifacts:** playtest protocol and issue triage; `docs/GAMEPLAY_GUIDE.md`; QA panel/export; optional local analysis scripts. No remote analytics service is required.
- **Dependencies:** P1-06 retention disclosure before external testing; clearly identified build; P2-02 if active/dwell-time analysis is needed. Baseline observation can begin before larger gameplay work.
- **Effort:** **M**, including access to testers; scheduling is an external dependency.
- **Verification:** actual observation notes and exported consenting sessions; classified missed-intent/clue/progression issues; agreed comprehension criteria evaluated on real players; report measured duration only after collecting it. Do not count agent simulations as human tests.

### P1-06 — Make free-text retention promises match both QA and game saves

- **Problem/evidence:** QA draft redacts a fake credential string, but ordinary `terminalHistory` retains it in `nerve-ending.save.v4`. QA opt-out/clear leaves the game save intact. Pattern matching cannot anonymize arbitrary personal text. [E1:159,207; E7; E9; audit `summary.json`]
- **Why it matters:** testers could reasonably misunderstand “QA recording off” or “clear QA data” as removing all typed input. This is a privacy/consent communication issue before real playtests, even though no authentication data source is read and QA-only deletion works as designed.
- **Proposed improvement:** explicitly distinguish functional game history from QA retention and identify how to remove each. Review whether recognizable secret spans should also be scrubbed from saved/displayed history after input resolution, or whether another minimal-retention policy is appropriate. Keep investigation state separate from the QA recorder; do not silently erase user progress when clearing QA. Do not collect tester identity fields.
- **Likely modules:** `engine/game.ts` terminal-entry creation, save serialization/decoding, QA/privacy helpers, settings/reset wording, QA_LOGGING documentation.
- **Dependencies:** explicit product retention policy; preserve command interpretation and the existing QA-only-clear contract.
- **Effort:** **S–M**.
- **Verification:** use fake credential/PII patterns with QA on/off; inspect both persistent stores and exports; promises and actual deletion scope match; no secret survives in a store whose policy says it is redacted; QA clear still preserves intended narrative progress.

## P2 — narrative, atmosphere and analysis quality

### P2-01 — Earn Anna's emotional reveal and reduce explanatory repetition

- **Problem/evidence:** optional project/personal notes add character, but shortest routes miss them. Many replies repeat qualifications; repeated questions mostly prepend a review line. Distress and interdependence are often explained rather than experienced. [E3, E4, E6; alternate ending route]
- **Why it matters:** reliable facts are necessary but insufficient for the central horror and an earned choice. The emotional focus should remain Anna, not external-risk exposition.
- **Proposed improvement:** author a small number of distinct, state-specific formulations and source-led moments around identity, failed reduction, STABLE and release. Surface existing human detail through meaningful leads rather than forced reading. Keep uncertainty and clinical limits, but express them through MOTHER's priorities instead of repeated meta-disclaimers. Do not make Anna type messages or introduce supernatural causation. Consider final-scene pacing only after comprehension findings.
- **Likely modules:** `story-records.ts`, dialogue catalogue/selection, hints and ending presentation.
- **Dependencies:** P1-01–04 and evidence from P1-05; author review of reveal timing.
- **Effort:** **M**.
- **Verification:** unchanged causal timeline/medical facts; distinct responses actually reachable; no padding/reading quota; fresh players can identify Anna as a person and explain the care-versus-activity conflict. Emotional effect remains a measured/design observation, not a unit-test assertion.

### P2-02 — Add only the telemetry needed for useful playtest analysis

- **Problem/evidence:** logs capture excellent transition detail, but not active/AFK time, read engagement, browser-search attempts, reply display completion, structured expected-intent corrections or alternative-classification margins. Version is a manual string. Long-session performance is unmeasured. Challenge labels are heuristic rather than real prompt IDs. [E9]
- **Why it matters:** raw event gaps cannot distinguish a difficult puzzle from an unattended browser, and selected responses are not proof that a player saw the full text.
- **Proposed improvement:** define a minimal opt-in analysis schema: foreground/active intervals, coarse record engagement, displayed/skipped reply markers, optional corrected-intent feedback, and real prompt lifecycle IDs once P1-04 exists. Include a release/build identity and enumerate storage/drop failures. Keep private/unrelated data out. Provide a local JSONL summarizer for paths, repeated intents and stalls; avoid remote analytics by default. Benchmark before adding retention/export complexity.
- **Likely modules:** QA types/events/database/telemetry, playback/document/file-browser hooks, QA feedback UI, build metadata and local audit tooling.
- **Dependencies:** P1-06; P1-04 for actual questions/challenges; a concrete playtest analysis question for every new field.
- **Effort:** **M**.
- **Verification:** recording remains default-off; opt-in/out boundaries and cross-tab behavior preserved; new fields are useful in sample analysis; logs never change narrative state; long session/export tests measure memory, queue latency and data completeness. No claim that dwell time proves reading.

### P2-03 — Make investigation leads and authority steps legible without handing over solutions

- **Problem/evidence:** operation menus expose exact available actions, while some natural requests produce large record-match lists. Hints can point to early optional operations, and simple procedural delegation can feel arbitrary. [E1, E2:139–150, E5, E10]
- **Why it matters:** the current player can be either over-guided by buttons or under-guided by unfamiliar wording. Both reduce the feeling of investigation.
- **Proposed improvement:** show the reason a capability is available/missing, retain a small lead/evidence relationship view, and distinguish finding a source from applying its information. Improve natural-request replies with the relevant permissible action while keeping execution explicit. Ensure hints target the unresolved inference and offer graduated help. Surface actual paths and provenance for manual navigation.
- **Likely modules:** hints/available-operations metadata, Terminal/FileBrowser/Document components, evidence summary/source selection and records.
- **Dependencies:** P1-01 and P1-02; fresh-player stall evidence from P1-05.
- **Effort:** **M**.
- **Verification:** terminal- and mouse-oriented players can identify their next lead and explain the authority step without being shown a solution fixture; no exact phrase or unrelated document prerequisite is introduced; all alternatives remain available.

## P3 — polish and release readiness

### P3-01 — Establish browser, accessibility and mobile release checks

- **Problem/evidence:** desktop Containment works, but all three production-UI routes, physical phones, screen readers and disconnected play are not fully tested. Final report did not receive focus automatically after button confirmation. [E10; production transcript]
- **Why it matters:** a correct reducer is not an accessible, finishable experience on every supported device.
- **Proposed improvement:** add maintainable browser-E2E routes for all endings and key negative cases; test keyboard-only navigation, warning/report focus and return focus, text enlargement, reduced motion, long records and short viewports. Conduct actual screen-reader/touch-keyboard checks and define supported browsers. Use the existing components rather than replacing the interface.
- **Likely modules:** browser test harness/configuration; app/terminal/documents/QA UI; CSS/focus behavior.
- **Dependencies:** stable P1 interaction designs; real supported-device access.
- **Effort:** **M–L**.
- **Verification:** all three production-UI endings pass; warnings and reports are perceivable/operable with keyboard and screen reader; no clipped choice or blocked input on supported phones; reduced motion avoids the processing/printing delay.

### P3-02 — Verify cache recovery and benchmark the optional model/QA on target devices

- **Problem/evidence:** native CPU model timings are good, but do not establish mobile/browser-WASM memory/latency. Worker runtime verifies manifest identity/lengths, not computed asset digests. QA archives and all-session export are unbounded/in-memory. [E8, E9; `ngsw-config.json`]
- **Why it matters:** optional enhancements must remain optional when loading, cache storage, performance or export fails.
- **Proposed improvement:** test cold/warm/offline/revision-mismatch/evicted-cache cases on target browsers, record actual worker readiness and inference latency, verify runtime asset integrity where appropriate, and profile sustained QA writes/export. Introduce pagination/streamed export/retention controls only if measured scale justifies them, with explicit tester choices.
- **Likely modules:** worker/cache loader, manifest verifier, service-worker configuration, QA database/export/panel, performance fixtures.
- **Dependencies:** P3-01 target matrix and P2-02 measurement definitions.
- **Effort:** **M**.
- **Verification:** model failures always leave deterministic play/endings available; update/offline recovery behavior is documented and observed; corrupted same-size assets fail cleanly if digest checking is added; agreed archive sizes export without freezing or losing events.

### P3-03 — Strengthen small content/outcome contracts instead of a large refactor

- **Problem/evidence:** pipe-delimited data has implicit field structure; response behavior spans catalogue, legacy switch and overrides; ten base strings are overwritten; QA derives outcomes from English prefixes, so copy edits can silently change statistics. [E1, E4, E6, E9]
- **Why it matters:** future narrative edits can create runtime parse errors, misleading coverage counts or telemetry regressions even when the story is otherwise unchanged.
- **Proposed improvement:** validate catalogue row fields, IDs, gates and references; identify unreachable/overridden authored fields; add typed action outcome metadata to engine transitions that QA observes; centralize reveal checks and active-record resolution where practical. Preserve the pure engine and current presentation. A wholesale rewrite is unnecessary.
- **Likely modules:** catalogue loader/validator, Transition model, response selection, QA event extraction and validation scripts.
- **Dependencies:** P1-01/03 outcome and gate contracts.
- **Effort:** **M**.
- **Verification:** malformed content fails validation before a player session; all emitted variants can be traced to a source; punctuation/copy-only changes do not alter success/failure metrics; golden paths and saves remain equivalent.

### P3-04 — Freeze a reproducible release baseline and reconcile documentation/versioning

- **Problem/evidence:** package `0.1.0`, visible revision `1.0` and QA `1.0.0+qa.1` differ; working-tree changes exceed current HEAD; historical handoff/test counts coexist with current reports; Ollama's prompt omits expanded IDs. Current hosted parity is unverified.
- **Why it matters:** playtest data cannot be interpreted reliably without knowing the exact gameplay build, and stale status claims can drive the wrong development plan.
- **Proposed improvement:** derive displayed/exported release identity consistently, record source revision/build ID, mark historical documents as historical without rewriting creative canon, align developer-classifier coverage or explicitly label its legacy limitation, document verified hosting/cache behavior and publish only a matching reviewed build when separately authorized. Address the decorative clock wrap if it remains visible in long sessions. Review dependency advisories as part of release maintenance; no current advisory status was established here.
- **Likely modules:** package/build metadata, QA version field, app captions, docs, developer provider prompt, release checklist.
- **Dependencies:** stable alpha scope and completed checks; publication is a separate authorized action.
- **Effort:** **S–M**.
- **Verification:** UI, JSONL and release manifest identify the same build; another checkout can reproduce tests/build; old/current documentation is distinguishable; hosted build identity matches the approved artifact. No remote service is introduced merely to achieve version tracking.

### P3-05 — Optional atmosphere polish after gameplay evidence

- **Problem/evidence:** the game has coherent visual styling and timed text but no audio system or extended ending scene. Their absence is not a functional blocker or evidence that players are bored.
- **Why it matters:** restraint may strengthen the legacy-terminal atmosphere; unnecessary effects can instead obscure reading and choices.
- **Proposed improvement:** only after playtest findings, consider subtle optional sound and restrained transition/ending presentation with clear volume/mute and reduced-effect controls. Do not use delays, jump scares or random text corruption to manufacture duration or MOTHER agency.
- **Likely modules:** presentation layer/assets and settings; no change to clinical/network rules.
- **Dependencies:** P1-05 and P3-01 accessibility requirements; explicit creative direction.
- **Effort:** **S–M**, depending on assets.
- **Verification:** user-controlled, accessible, and separable from gameplay timing; no lost/skipped warnings; qualitative playtest evidence explains why the addition helps.

## Suggested implementation order and dependencies

1. **Freeze the audit baseline and start observation.** Preserve existing fixtures, assign a consistent playtest build identity, clarify retention (P1-06), and collect a small baseline pilot. This is preparation for player-impact work, not a substitute for it.
2. **Repair trust in the interface.** Add the reproduced state/subject cases to regression coverage and fix P1-02/P1-03. Agree on the evidence-application and minimum-revelation design for P1-01.
3. **Implement the core investigative loop.** Build the bounded evidence interactions with negative paths, deferral and saves. Keep manual navigation and mouse alternatives.
4. **Add MOTHER's grounded initiative.** Reuse the new interaction contract; add prompts and proposals tied to evidence/clinical state. Preserve confirmation and non-voluntary Anna constraints.
5. **Re-test with fresh players and revise.** Prioritize observed missed intentions, false explanations and bottlenecks. Tune character/reveal presentation and leads; add only necessary telemetry.
6. **Complete release validation.** All ending UI routes, target devices/a11y, offline/cache/model/QA scale, content contracts and documentation/build parity. Publication is outside this audit.

## Proposed complete-alpha exit checks

| Dimension | Evidence required before claiming completion |
| --- | --- |
| Correctness | No outstanding P0; three endings and accumulated-cost variants pass reducer, save/reload and production-UI checks; no question/guess/QA write performs an intervention |
| Investigation | At least the agreed central inferences involve applying evidence, with understandable failure and accessible alternatives; no reading quota or obscure exact-command requirement |
| Conversation | Found subject/context/clarification failures fixed; held-out evaluation reported honestly; key simpler explanations are actually simpler; state-dependent replies respect gates |
| MOTHER | Agreed proactive arc exists, persists and has grounded triggers; no random initiative or intentional Anna messages |
| Player understanding | Real fresh-player observations demonstrate comprehension of STABLE, the route distinctions and final costs; unresolved confusion tracked with evidence |
| Telemetry/privacy | Opt-in and retention scopes clear; exports/order/persistence/clear verified; useful build identity; no unrelated data or automatic transmission |
| Usability/release | Defined browser/device/a11y/offline checks complete; warnings and endings remain usable; reproducible reviewed build |
| Duration | Measure and report actual active-play distribution. Do not assert 90–120 minutes based on file/example counts or artificial pacing |
