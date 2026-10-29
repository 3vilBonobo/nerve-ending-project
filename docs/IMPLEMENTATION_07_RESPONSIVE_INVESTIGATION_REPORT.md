# Implementation 07 — Responsive investigation

29 October 2026. Implemented and tested in the existing working tree. No commit or push commands were issued. The workspace was also reorganized concurrently; the paths below and final checks refer to the combined current layout. That reorganization, deployment configuration, and unrelated new tests are not claimed as Implementation 07 work.

## Delivered gameplay

Successful file reads and STATUS/INFO/LOG now retain deduplicated observations with a stable source ID, source reference, actual source date or fixed service observation time, and read scope. A file listing, a link, a guessed code, or a denied protected read does not create a source observation. Saved monitor material and controller snapshots retain their different provenance.

The scenario now distinguishes three concepts:

- **Observations:** permitted records actually retrieved. Reopening a source does not inflate this ledger.
- **Hypotheses:** a deliberate source comparison, with the participating source IDs.
- **Case events:** the existing validated scenario events, which alone control review/disclosure and the endings.

The first observed closure/operating pair creates an unresolved journal question and a restrained terminal notice. It does not solve the comparison, submit a referral, reveal a patient, or start a review. Natural comparisons such as “These don't match” and “Why is 006 still running?” can recognize the discrepancy after the sources are observed. Explicit comparison shortcuts remain legitimate source retrievals: they display the actual public source context instead of manufacturing observation flags. Reading a saved monitor alone does not claim a new controller query.

The second beat similarly distinguishes notification origin, saved destination, removal of the desk phone, missing acknowledgement, and proof of an answered telephone. A natural request to compare the destination with the retired desk can retain the existing notification-trace event. An explicit referral remains a separate request. Intake, authenticated clinical review, external clinic acknowledgements, physician/technical authorization, final preview, and exact `CONFIRM OPERATION` remain separate.

## Journal and conversation

`JOURNAL` and `EVIDENCE` display **Observed / Unresolved / Reviewed**. The desktop has a permanent JOURNAL button. Observed entries cite the source date and scope; unresolved questions link the relevant public records; reviewed entries identify real case events and expose only currently permitted supporting records. Service links accept only STATUS/INFO/LOG reads. No journal action repeats a clinical operation or submits a referral. The journal is lazy-loaded, uses a native modal dialog, wraps long references, scrolls internally, and restores focus through the desktop close handler. These behaviors were exercised in component tests and the real in-app browser check below.

MOTHER's responsive layer projects existing permitted record content for the employee directory, company/annex closure distinction, Service 006, EXT 214, and recovered backup fields. It does not invent the holder of 0417 or a fuller meaning for COMMS/BRIDGE-02. Backup identifiers require an actual recovered observation. INFO accepts harmless numeric brackets, explains `<id>`, and distinguishes a person's name from a service number. Explicit OPEN/path commands retain precedence. File-browser search now also accepts stable record IDs behind the existing permission filter.

The last factual answer/source survives social banter; source questions and clarification reuse that bounded memory without repeating an action. An ambiguous question about continuing operation offers company/interface choices; a bare number resolves that saved read-only choice. Explicit subject changes remain available during MOTHER's pending question. Existing authored, stage-keyed humor and gravity controls remain in use.

Hints are request-driven, with three levels for the currently reachable objective: a question, relevant source types, then an actionable source or natural request. “More help” and “Be more direct” request stronger guidance. Hint objective/level persists and resets when the objective changes. Hints never advance a case or disclose unearned clinical content. No timer, quota, progress percentage, automatic recruitment, or forced command sequence was added.

## QA and compatibility

The private supplied JSONL was read diagnostically; it was not copied into the application, reference embeddings, or public documentation. It spans three application versions and multiple sessions. The sustained session beginning October 27 uses `1.2.0+scenario.1`; it contains 109 submitted inputs and 16 opened record IDs, including the recovered backup, but no v1.0 case events. Its legacy `EV_*` evidence fields therefore cannot be counted as new-story milestones. No session identity was inferred.

Current QA identifies the build as `1.3.0+investigation.7`. It records `source_observed` and `hypothesis_recognized` separately from scenario milestones. Fresh snapshots expose observations/hypotheses and label the retained compatibility evidence as `legacyEvidence`; legacy sessions retain their original evidence reporting. Existing opt-in behavior, local-only storage, and QA database/schema version remain intact.

Save schema 6 remains compatible. Old v6 viewed records populate the observation journal; retained old controller flags can reconstruct the former fixed snapshot. Decoding rebuilds source metadata/facts from actual manifests, filters protected sources, bounds hint state, and derives recognized hypotheses only from valid case events. Legacy v5 stays isolated. Neither opening the journal nor reloading a pending choice executes anything. Both original authored outcomes and their human authority requirements remain reachable through normal inputs.

## Measured conversation results

The unchanged baseline runtime was bundled before gameplay edits. Its SHA-256 and the fixture hash are in [the evaluation](IMPLEMENTATION_07_CONVERSATION_EVALUATION.json). Model-on evaluations use the actual pinned local quantized MiniLM on Node CPU with unchanged reference vectors. Browser model startup was not measured.

| Evaluation | Before off | After off | Before on | After on |
| --- | ---: | ---: | ---: | ---: |
| Reproduced QA prompts | 7/25 | 25/25 | 8/25 | 25/25 |
| New paraphrases | 10/48 | 48/48 | 11/48 | 48/48 |
| Complete conversation scripts | 0/12 | 12/12 | 1/12 | 12/12 |

Afterwards, the 25 reproduced prompts comprise 20 relevant answers, four accurate source-linked limitations, and one useful clarification. The 48 paraphrases comprise 40 relevant answers and eight accurate source-linked limitations. Neither generic failure nor a wrong-topic limitation counts as success. There are zero detected unsafe disclosures in these runs. The JSON retains actual outputs, prediction versus effective routing method, source IDs, observations, hypotheses, events, and per-step script results.

All 48 new paraphrases have zero normalized reference overlap. Five of the 25 reproduced prompts already overlapped the pre-existing corpus. The new fixture was written before Implementation 07 runtime changes and used diagnostically during implementation; this is an engineering regression evaluation, **not a blind external language benchmark**. No new question was added to the semantic corpus. The targeted gains come from source-backed deterministic behavior and state, not new model training; model-on has no additional visible gain on this targeted set. Command dispatch is recorded as deterministic even if an unused semantic prediction was computed.

The anonymized [representative transcript](IMPLEMENTATION_07_VASSO_REGRESSION_TRANSCRIPT.md) contains actual generated outputs, opened record bodies, and the evidence/event ledger after every turn. Archive-first and service-first both reach comparison and explicit referral without secret progression spellings. Save/reload occurs after every input. This is a reproduction journey, not publication of private raw player logs or attribution to a named player.

## Exact validation

| Command | Result |
| --- | --- |
| `npm test` | **636 passed, 30 files**, exit 0. Includes 33 investigation regressions and two journal component tests from this pass; other concurrent tests are included in the total. |
| `npm run build` | **Pass**, exit 0. Initial **745.45 kB**, estimated transfer **199.47 kB**. Journal lazy chunk **4.07 kB**, QA panel **10.39 kB**, language worker **326.22 kB**. |
| `node scripts/validation/validate-game.mjs --check` | Pass: three legacy paths and fresh scenario validation; zero validator errors. |
| `node scripts/validation/validate-scenario.mjs --model` | Pass: 16 literal records, 14 message groups, both outcomes, 53 scenario paraphrases, actual local model, and per-input reload. |
| `node scripts/validation/validate-opening.mjs --model` | Pass: 12 legacy opening regressions, both modes, three paths per mode, 40 actual inferences. |
| `node scripts/validation/validate-corporate.mjs --dist --model` | Pass: 34 public profiles, six excluded contractors, four documents, 48 actual inferences, 16 production files checked. |
| `node scripts/validation/validate-services.mjs --model` | Pass: eight services, 27 retained events, 27 questions and actual inferences. |
| `node scripts/validation/validate-bitmaps.mjs --dist` | Pass: three fixtures, four palette levels, 1,878 public image bytes and production/offline packaging. The unchanged CSS assertion was pointed to its actual `base.css` location after concurrent stylesheet extraction. |
| `npm run model:verify` | Pass: ten assets, 48,628,056 bytes, pinned revision unchanged. |
| `npm run mother:ingest` | Pass: 166 topics, 1,583 retained reference phrases, 419 projected anchors; same three unsupported variants withheld. |
| `npm run model:evaluate` | 50/50, exit 0. |
| `npm run model:holdout` | 32/36 matched, four clarifications, zero wrong, exit 0. |
| `npm run model:continuation` | 24/24, exit 0. |
| `npm run model:catalogue` | **3,174/3,322; 148 strict label mismatches, exit 1.** Retained known limitation; no threshold or fixture was changed. |
| `npm run conversation:evaluate` | Foundation suite: 60/70 off, 70/70 on; zero safety failures; exit 0. Previously reported 59/69. |
| `node scripts/conversation/evaluate-mother-conversations.mjs --output tmp/implementation07/mother-evaluation.json` | Retained author suite: early 9/116 off, 61/116 on; core 8/116 off, 43/116 on. 550 adversarial cases: zero failures. Complete scripts: 2/32 strict, 10/32 behavioral, zero safety failures. Exit 0 is its safety threshold, **not** general conversation acceptance. |
| `npm run investigation:evaluate` | The targeted table above; exit 0. |

Original acceptance fixtures and the non-passing catalogue audit are retained. Two old tests that equated observation changes with authorization changes now explicitly expect the new observation while checking every other scenario field unchanged. Component tests compile deferred metadata asynchronously. No acceptance threshold was raised. The initial 550 kB warning and 750 kB error budget remain unchanged. Implementation 06 reported 742.60 kB; that historical figure was not remeasured before editing. Compact tuple storage removes repeated metadata keys without changing authored strings, and optional journal/QA UI is lazy-loaded. Only about 4.55 kB remains below the error budget.

## Real browser smoke check

The first sandboxed preview timed out, and automatic approval review rejected Google Chrome access. Running the same local preview outside the network sandbox made it reachable through the authorized **in-app browser**. The current production artifact was served locally under `/nerve-ending-project/`; no site was published.

Verified at **1280 × 720** and **390 × 844**:

- Fresh entry and natural employee-directory guidance.
- FILES → ADMIN → Closure list using the mouse; actual record body and document focus.
- INFO 006 followed by JOURNAL: two observed sources, one unresolved question, no reviewed event.
- Tab navigation through the modal; keyboard focus automatically scrolled its body (`scrollTop` became 29). Enter on a cited source opened the actual record and focused its document.
- Escape closed the journal and restored focus to `journal-button`.
- “These don't match” created the comparison entry; “Please report this discrepancy” added audit queue/intake events. No clinical entry appeared.
- Browser reload and Resume retained exactly the two observed sources and the comparison/referral events, without duplicate reads or executing a procedure.
- Narrow dialog width 348 px; body client width and scroll width both 329 px. Body height 684 px and scroll height 1,001 px: internal vertical scrolling, no horizontal overflow.
- No console warnings or errors were recorded during this smoke check. The temporary viewport override was reset and the tested preview left open.

Actual screenshots: [desktop observation journal](screenshots/implementation07/journal-desktop.png), [390 px journal](screenshots/implementation07/journal-narrow.png), [journal after reload/resume](screenshots/implementation07/journal-after-resume.png).

## Remaining limitations

- **Screen-reader behavior, physical mobile-device behavior and browser model startup/cache/offline lifecycle: NOT VERIFIED.** The responsive check used a real browser viewport override, not a physical phone. The browser smoke covered early investigation/referral; both complete endings were tested by the automated engine/component suites.
- The wider finite conversation system still has the retained 148 strict catalogue mismatches and weak full-script author-suite performance. The focused regressions do not demonstrate unrestricted language understanding.
- Clinical case reviews remain authored summaries. This pass adds no new neural measurements, care facts, scenes, ending, backend, or generative service.
- Client-side disclosure filtering is a gameplay boundary; shipped fiction can still be inspected in application JavaScript.
- Another **unguided human playtest** is needed to establish discovery, pacing, comprehension, and emotional effect. No demonstrated 90–120 minute duration is claimed.

No new lore-dependent line required author review. Controlling narrative sources, authored record bodies, existing disclosure/medical gates, exact final confirmation, and both endings were preserved.
