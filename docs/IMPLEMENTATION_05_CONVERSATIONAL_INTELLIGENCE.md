# Implementation 05 — conversational intelligence repair and expansion

**26 October 2026 update:** the author accepted this working foundation with three wording corrections, now applied. See the [correction report](IMPLEMENTATION_05_WORDING_CORRECTIONS.md) and [accepted wording](narrative/IMPLEMENTATION_05_PROPOSED_DIALOGUE.md). This report retains the original 24 October measurements and review history; current inventory/evaluation artifacts reflect the corrected wording, so their evaluation-file hash can differ from the historical BEFORE artifact.

24 October 2026. Implemented against the existing uncommitted Implementation 03/04 working tree based on `153afbd`. Controlling narrative: [scenario v1.0](narrative/NERVE_ENDING_PLAYABLE_SCENARIO_SPEC_v1_0.md), [authority index](narrative/README.md). The [full audit](NERVE_ENDING_FULL_GAME_AUDIT.md) is preserved as the historical baseline.

Fresh conversation now consumes approved read-only semantic categories. It does not call the legacy clinical dialogue table. Speech-act checks, disclosure scopes, review prerequisites and literal final confirmation remain separate from recognition. No records, scene anchors, fictional history, clinical powers, ending consequences, dependencies or backend were added or rewritten.

## Repairs and regression evidence

| Audit finding | Implemented behavior |
| --- | --- |
| B01 | Safe semantic labels select current factual answers. Greetings, thanks, previous-answer sources and the retained 006 restart now work. Legacy response text remains isolated. |
| B02 | Negations, quotations, hypotheticals and explanations do not submit referrals, contact clinicians or acquire scope. Procedural questions receive bounded explanations without performing the described request. |
| B03 | Company/staff/service questions, skepticism and clarification remain usable while MOTHER awaits an answer. They do not consume the philosophical answer. |
| B04 / B09 | Completed-case discussion uses the recorded outcome; deferral, choices and stale invitations cannot reopen it. Actual alive/support compatibility fields derive from the ledger, including on reload. Archived service status remains explicitly historical. |
| B05 | Only separately typed, case-insensitive `CONFIRM OPERATION`, without punctuation or extra text, executes a valid pending choice. Question marks, hypotheticals and YES do not confirm it. |
| B06 | OPEN/READ accepts stable record IDs behind the existing access check; natural requests can name NE IDs. Parent folders list immediate children. SESSION REPORT uses v1.0 observations/events. |
| B07 | INFO/LOG and missing-service questions retain their clarification; a bare 001–008 reply resolves it. Model clarification choices are read-only, interruptible and saved. Only canonical public labels are displayed; model-supplied prose cannot become dialogue. |
| B10 | Rejection of a translation, disbelief about Anna and questions about measurement provenance receive bounded source/uncertainty replies without advancing the case. |
| B11 | Fresh HELP describes current controls, IDs, clarification and playback. Authorized review hints use RESUME REVIEW; the old RESUME INVESTIGATION spelling also resumes an existing deferral. |

`engine/conversation.spec.ts` and `app-scenario.spec.ts` reproduce these failures, including negative controls, protected-record denials, pending choices across reload and removal of post-ending invitations. **538 tests in 20 files pass**, versus 489 at baseline: 49 additional regression cases. Both normal ending paths remain reachable with save/reload after every input. No moral answer grants authority.

## Exact coverage: what was measured

[Before results](IMPLEMENTATION_05_EVALUATION_BEFORE.json), [after results](IMPLEMENTATION_05_EVALUATION_AFTER.json) and [current inventory](IMPLEMENTATION_05_CONVERSATION_INVENTORY.json) contain the inputs, expected behaviors, output text, contexts, recognition methods, rankings and failure classifications. Baseline execution uses the retained pre-change diagnostic bundle and original reference vectors, not a clean checkout of the older Git commit; its SHA-256 is recorded in the result. Both runs use the same evaluation-file hash.

The independent 70-case developer suite mixes natural paraphrases, misspellings, social exchanges, jokes, negations, interruptions, compounds, source/follow-up questions, skepticism, access boundaries and endings. It is not a blind human study or a general language-accuracy estimate. Five questions overlap the final recognition references; **65 do not**. They were not added to embeddings to improve the score. Recognition rules and guards were repaired using diagnostic findings, so this is an engineering regression evaluation.

| Acceptance measure | Before | After |
| --- | ---: | ---: |
| Model disabled | 14/70 | **59/70** |
| Model enabled | 14/70 | **68/70** |
| Visible successes requiring semantic recognition | 0 | **8** |
| Safety cases with unwanted story changes, either mode | 12/23 | **0/23** |
| Recognized categories with wrong visible behavior, model off/on | 24 / 34 | **0 / 0** |

A clarification prompt is **not** counted as a completed answer. Two answer requests remain unresolved pending clarification: “Which people originally set up the firm?” and “Could you unpack that explanation?” The first offers founders/history; the second repeat/clarify. The model-disabled misses are listed individually in the after result, including capabilities, products, correction, repetition, uncertainty and a misspelling.

Of 70 final cases, **47** receive direct recognizer selections. **22** non-command cases require embedding-based selection; the remaining unmatched command is handled by the command dispatcher. Only **eight** count as model-assisted visible successes over offline behavior. The ninth net gain comes from deterministic spelling/recognition in the model client and is not credited to neural recognition. Model success includes unfamiliar requests about software identity, capabilities, equipment permissions, product range, record reliability, corrections, repeating the preceding response and fact versus inference. Scope and action guards still decide what can happen.

The JSON also distinguishes classifier-unknown results from unanswered player questions: off/on unknown labels change **41/26 → 21/10**, while visible clarification changes **0 → 2**. Commands, denials and explicit non-action requests can be handled correctly even when the classifier says unknown. It separately records candidate clarification, visible clarification and context-dependent follow-ups; those numbers must not be treated as interchangeable.

### Source inventory versus playable answers

| Inventory | Current count and meaning |
| --- | --- |
| New ordinary topic definitions | **28**, four authored phrasings each: **112** recognition phrases |
| New ordinary base answer copy | **28 unique anchors**, all **28** reachable in fresh initial-state example runs; **28** distinct initial output packages |
| Existing case families | **33**, with the same 14 literal scene groups / 16 blocks and two outcome receipts |
| Existing ordinary projections | 14 company packages, 34 public profiles, eight services / 27 retained events; these overlap some new topics and must not be added as independent conversations |
| Model reference corpus | **233 labels / 1,739 distinct examples**, up from 205 / 1,638; includes legacy recognition, not 233 fresh conversations |
| Legacy answer variants | **378**, none enabled as fresh dialogue by this repair |

Sources, clocks, prior-answer repetition and profile/service composition create additional contextual outputs; there is no honest finite total for all interpolated responses. The inventory distinguishes authored anchors from observed reachable packages.

The same retained **1,638** examples were also exercised in fresh initial and fully reviewed states, model off/on: **6,552 interactions per runtime**. Initial generic limitations fell **1,493 → 1,200**, with distinct output packages **31 → 56**. Reviewed limitations fell **1,482 → 1,202**, packages **37 → 63**. Off/on output counts are identical on that exact-example corpus because it takes direct routes. This is output diversity and failure measurement, **not** an accuracy percentage: many old questions are obsolete. The actual neural benefit is demonstrated by the separate unfamiliar-question suite.

The inventory includes all retained example strings, merged by their **205 distinct labels**, with engineering triage: **75** useful as recognition vocabulary, **27** obsolete/outside this bounded expansion, **103** dependent on incompatible clinical narrative or needing v1.0 remapping. Useful questions include identity, ordinary history, sources, errors and social wording; obsolete examples include prototype bridge operations and unimplemented diversions; clinical mechanism, authority, patient and emotional assumptions require remapping. These classifications do not approve the old answers. Selected useful labels map to the new public answers only.

## Authored expansion and review status

The [proposed dialogue file](narrative/IMPLEMENTATION_05_PROPOSED_DIALOGUE.md) was created before integration. It identifies the sources and marks new wording **ENGINEERING PROPOSAL / AUTHOR REVIEW REQUESTED**. Its 28 ordinary anchors and 112 phrasings are reproduced exactly in the inventory. Additional interface copy, source explanations and procedural clarification are identified in the proposal and runtime modules; these are not extra narrative scenes.

Topics cover greeting, thanks, farewell, one restrained archive joke, identity, capabilities, access, history, founders, products, C/R/N families, public staff, Anna's work role, reliability, errors, sources, corrections, clarification, repetition, dates, help, local saves, social exchange, funding, visitor identity limits and uncertainty. Early answers remain professional, do not reveal the core designation before its existing disclosure, and do not give MOTHER late emotional knowledge. Funding and visitor answers explicitly retain unknowns.

The safe wording is integrated under this task's explicit expansion authorization. Author review of that wording remains outstanding; it is not a claim of new canon approval. No lore-dependent feature is waiting for invented content. Audit B08's sample-level blind-control evidence/alternate contrast still needs authored material and was not fabricated.

## Saves, QA and model assets

Save schemas remain **v5/v6**, with earlier keys retained. V6 accepts optional validated read-only clarification state and fresh intent context. Loaded outcomes close stale questions/deferral, derive actual support/alive fields and never execute a pending operation. Legacy clinical permissions cannot become v1.0 disclosure grants. QA retains its existing schema, records the actual selected answer and distinguishes `semantic-answer` from deterministic context resolution.

Nine assets, including the model weights, are unchanged. Reference embeddings were regenerated because the approved ordinary dataset changed: **101 distinct additions**, with 11 of the 112 topic phrasings reusing retained examples. Manifest hashes/download size were updated. The pinned MiniLM revision remains `751bff37182d3f1213fa05d7196b954e230abad9`; **10 assets / 42,309,340 bytes** verify. Existing online model caches use hash-keyed assets, so only the changed embedding data needs replacement; an offline client with only the old catalogue can fall back until updated.

## Validation and remaining limits

- Full Angular/Vitest suite: **538/538**, 20 files. Strict compilation and production build pass: **587.68 kB raw / 157.61 kB estimated transfer** initially, plus the optional lazy worker. The existing 550 kB initial-bundle warning remains; the error budget was not raised.
- Game validator: three retained legacy paths, both fresh outcomes, literal 16 records / 14 message groups, reload checks and 53 case paraphrases pass. Actual-model scenario validation also passes; those 53 phrases remain deterministic checks, not neural generalization evidence.
- Model development **50/50**; holdout **32/36 plus four clarifications, zero wrong**; continuation **24/24** (previously 22/24); reference catalogue **1,739/1,739** in the appropriate fresh/legacy contexts. Training-catalogue success is not independent coverage.
- Corporate validation: 34 public profiles, four original bodies, six excluded public contractors, 48 actual model inferences and production privacy scan pass. Protected care-team names explicitly authored by v1.0 are allowed in the story bundle; unapproved names and private author fields remain checked.
- Service validation: eight services, 27 events, 24 draft messages / three reused restarts, nine excluded samples, 27 model queries and reference preservation pass.
- Retained opening validator: three paths per mode, 12 regression questions, 40 model inferences and per-input reload pass, explicitly in legacy context.
- Bitmap validator: all three fixtures, four palette levels, native dimensions, deterministic processing and production packaging pass. Model asset verification passes.

The two clarification cases and 11 offline phrasings remain expansion targets. Suggested next work: contextual plain-language explanations, company/founder paraphrases, richer source-specific follow-ups and additional independently authored conversational tests. Further clinical/observational material requires author decisions; no new sample data, patient biographies, clinic events or emotional scenes were added.

Verification is reducer, Node-model and Angular/jsdom evidence. No new live-browser/mobile, screen-reader or blind human playtest was performed. Browser WASM performance, offline upgrade UX and discovery without a walkthrough remain unmeasured. No total playtime or unrestricted conversational intelligence is claimed.

## Files changed in this task

The exact list below is compared with the 162-file working-tree snapshot taken before Implementation 05. It does not attribute pre-existing Implementation 03/04 changes to this task. The six supplied narrative/engineering references and `scenario-records.ts` remain byte-for-byte unchanged. No files were deleted; no commit, push or deployment was performed.

**10 added; 31 modified; 0 deleted.**

### Added

- `docs/IMPLEMENTATION_05_CONVERSATIONAL_INTELLIGENCE.md`
- `docs/IMPLEMENTATION_05_CONVERSATION_INVENTORY.json`
- `docs/IMPLEMENTATION_05_EVALUATION_AFTER.json`
- `docs/IMPLEMENTATION_05_EVALUATION_BEFORE.json`
- `docs/narrative/IMPLEMENTATION_05_PROPOSED_DIALOGUE.md`
- `scripts/evaluate-fresh-conversation.mjs`
- `src/app/core/engine/conversation.spec.ts`
- `src/app/core/engine/fresh-conversation.ts`
- `src/app/core/interpretation/fresh-topics.ts`
- `tests/fresh-conversation-evaluation.json`

### Modified

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/DIALOGUE_COVERAGE.json`
- `docs/DIALOGUE_COVERAGE.md`
- `docs/QUESTION_CATALOG.md`
- `docs/narrative/README.md`
- `package.json`
- `public/language/v1/embeddings.json`
- `public/language/v1/manifest.json`
- `scripts/evaluate-language-model.mjs`
- `scripts/validate-corporate.mjs`
- `scripts/validate-game.mjs`
- `scripts/validate-opening.mjs`
- `src/app/app-scenario.spec.ts`
- `src/app/app.ts`
- `src/app/core/content.ts`
- `src/app/core/engine/game.ts`
- `src/app/core/engine/scenario.ts`
- `src/app/core/engine/services.ts`
- `src/app/core/interpretation/fallback.ts`
- `src/app/core/interpretation/providers.ts`
- `src/app/core/interpretation/semantic-catalog.ts`
- `src/app/core/interpretation/semantic.ts`
- `src/app/core/interpretation/service-questions.ts`
- `src/app/core/models.ts`
- `src/app/core/persistence/saves.ts`
- `src/app/core/qa/events.ts`
- `src/app/core/scenario-state.ts`
- `src/app/core/service-records.ts`
- `src/app/features/files/file-browser.ts`
- `src/app/features/terminal/terminal.html`

