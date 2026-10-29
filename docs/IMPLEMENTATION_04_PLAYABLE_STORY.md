# Implementation 04 — playable v1.0 investigation

24 October 2026. Spoilers. This implements the user's explicit later request for a complete playable story; earlier reference-only restrictions describe historical passes. It is a first playable prototype, not a measured 90–120 minute or commercially finished game.

Fresh normal sessions can complete both authored outcomes without developer state changes. The deterministic terminal engine supplies every case response and transition offline. The optional local model classifies questions; it cannot create facts, grant clinical scope or issue a final request. No network service, backend or external message is used by the fictional clinical exchanges.

## Governing sources and exact-copy checks

- `docs/narrative/NERVE_ENDING_PLAYABLE_SCENARIO_SPEC_v1_0.md`: unchanged controlling scenario; SHA256 `DB07308A299CE2AF92D05B9C3E61B4AB3BD01929CE084A311760C5F671D21B29`.
- `docs/narrative/CODEX_IMPLEMENTATION_04_PLAYABLE_STORY_PROMPT.md`: unchanged adopted engineering handoff; SHA256 `2439A8044859065F516FE090835ACA060A9D5F4D059E55204B8ED71EB29FC044`.
- `scripts/scenario-source.mjs` extracts all 16 literal articles and all text blocks in M01–M14 into `src/app/core/scenario-records.ts`. The validator compares generated values to the source, including whitespace within article bodies. Metadata retains the supplied creator/date and access scope. Writer-only explanatory notes are not part of the runtime projection.

## Scene coverage and permissioned disclosure

The ledger in `scenario-state.ts` is the central authority. Case-clock milestones A–H are distinct from the scenario's seven narrative movements. Record reads observe files; they never create review events, signatures, conclusions or treatment actions.

| Movement / case window | Player investigation | Released projection |
| --- | --- | --- |
| A / 06 NOV 02:14 | Ordinary questions, work profiles, STATUS, INFO, LOG, images | Public baseline only; professional Anna, no patient association |
| B / same window | Compare independent closure and controller sources, either discovery order | Original 2001 filing and independent 2003 observation retained; M01 |
| C / 06 NOV 03:12 intake | Trace 006 → 003 → retired Providence EXT 214; report discrepancy | Audit queued/accepted separately, no clinical upgrade; M02–M03 |
| D / 06 NOV 18:20 clinical response | Request actual clinical review | Authenticated human read and Marsh approval; NE-101, 103–106; M04–M05 |
| E / 07 NOV 11:40 external evidence | Request adaptive-reference or fallback review | Separate Harbor/Elm acknowledgements; NE-107–110; M07 |
| F / 07 NOV 22:10 core | Compare survival and distress | NE-111, same underlying MOTHER through R-02; M06 and once-only M08 offer |
| F / 08 NOV 15:30 independent review | Request/read controls, optionally alternate comparison; independent physician review | NE-102, NE-112; M09–M10, uncertain candidate fragments, never consent |
| G / 08 NOV 15:30 signoffs | Request medical/technical readiness | Marsh, Navarro, Patel and on-site staff acknowledgements individually recorded; NE-113; M11 reflects pending statuses |
| G / 08 NOV 16:05 witness packet | Review risks and compare independently retained sources | NE-114; source consistency only; no clinical role or hardware authority |
| G / 11 NOV 09:00 follow-up | Explicit final request, full M12/M13 preview, separately typed confirmation | Exactly one fixed ending report: NE-115 or NE-116; other outcome remains unavailable |

Deferral uses M14, leaves support and review in place, clears a pending decision and finalizes nothing. MOTHER's question can be declined, challenged, answered freely or deferred without preventing independent controls or review. Stored observations are deterministic and read-only; a second predefined contrast is available once. Exact candidate language remains fallible, medically reviewed and distinct from consent.

The 02:14 service view becomes explicitly **ARCHIVED SERVICE SNAPSHOT** after the case advances. Its ordinary eight service rows and 27 permitted historical events remain intact; it is never presented as a new clinical execution report. There is no 03:41 restart substitution or new service event.

## Supported terminal actions

Early HELP remains ordinary: HELP, STATUS, INFO 001–008, LOG 001–008, DIR / LIST / LS, CD, OPEN / READ, SEARCH, DIAG, RECOVER BACKUP, CLEAR / CLS. Natural company/personnel questions, follow-ups and the bitmap viewer remain available. Advanced help is contextual after a genuine comparison.

Case actions: `COMPARE SERVICES`, `COMPARE 2001 CLOSURE`, `TRACE NOTIFICATIONS`, `AUDIT OWNER`, `REPORT DISCREPANCY`, `REQUEST SAFETY REVIEW`, `CHECK REPORT`, `REQUEST CLINICAL REVIEW`, `CONTACT DR MARSH`, `REVIEW ADAPTIVE REFERENCE`, `REVIEW FALLBACKS` / `COMPARE FALLBACKS`, `COMPARE SURVIVAL AND DISTRESS`, `RUN BLIND CONTROLS` / `TEST NEURAL INTENT`, `VIEW RAW COMPARISON`, `REPEAT CONTROLS`, `REQUEST INDEPENDENT REVIEW`, `SHOW SIGNATURES`, `REVIEW RISKS`, `SHOW ALTERNATIVES`, `DEFER DECISION`, `RESUME REVIEW`, `MAINTAIN SUPPORT`, `SUBMIT SEPARATION WITNESS`, `CONFIRM OPERATION`, `CANCEL`.

Explicit partial-review actions include `CONTACT HARBOR REACH`, `CONTACT ELM VALE`, `SIGN MARSH`, `SIGN NAVARRO`, `VERIFY PATEL`. A partial review cannot finalize a choice. The normal full readiness request assembles the authored signed plan, including staff acknowledgement. Repeated referrals/reviews are idempotent.

Examples exercised include “Why not call a doctor?”, “Tell the doctors”, “Use a backup”, “Why me?”, “Are you making that up?”, “Let me see the actual data”, “What do other people lose?”, “Who signed this?”, “Can I say no?”, “What if I leave?”. This is finite authored recognition, not unrestricted generative conversation; unsupported wording receives a bounded reply. The exact final requests remain deliberate imperatives. Philosophical statements, bare YES, STOP 006 and KILL ANNA cannot execute a choice.

## Outcome evidence and full transcripts

- [Severance transcript](IMPLEMENTATION_04_TRANSCRIPT_SEVERANCE.md): status-first, ordinary exploration, literal incident open, backup challenge, MOTHER question, blind/raw/repeated controls, physicians and technical review, witness-only attestation, human procedure, literal NE-115. Anna dies after supervised withdrawal; Mara dies 10 NOV despite ICU intervention; Tomas survives with substantial functional loss; Nadia survives a serious treated inpatient episode.
- [Continuation transcript](IMPLEMENTATION_04_TRANSCRIPT_CONTINUATION.md): archive-first, clinical review, fallback evidence, refused MOTHER question, skeptical signal query, raw controls, independent review, readiness, alternatives, deferral/resumption, explicitly confirmed continued support, literal NE-116. Anna remains under harmful compensation; the three patients retain support for now, with no invented new acute deaths.

Both transcripts are generated by executing normal input through the production reducer, checking save/reload after every input and checking that completed-session confirmation cannot execute again. They are automated integration evidence, not human playtests.

## Save migration and QA

New sessions use schema 6 and `nerve-ending.save.v6`. Existing v3–v5 sessions decode into the explicitly labeled legacy branch with their original prototype behavior; their old permissions never become revised clinical authorization. The v5 key remains separate. Starting v1.0 retains earlier save keys and opt-in QA data. Older v1/v2 opening saves retain their original key and preferences while starting the revised session.

The new ledger is validated in order on load. Invalid downstream grants/outcomes/pending decisions are discarded if prerequisites are missing. Question offered/answered/declined/deferred, control observations, original source provenance, individual acknowledgements, pending typed choices and outcome survive reload. A resumed pending preview never executes automatically. Completed procedures and outcomes never replay.

Opt-in local QA remains unchanged in consent, destination and database format. Optional metadata adds scenario version, case clock, event IDs, question state, deferral and decision status; it does not duplicate patient names or chart text. As before, opting in records the actual input and response, which can contain fictional story spoilers. No uploading was added.

## Source differences and chosen authority

The v1.0 handoff explicitly resolves the old prototype's clinical delegation, 1996 mechanism and ending conflict. Old `story-records.ts` and clinical dialogue remain solely for legacy saves; those 30 records are excluded from fresh v1.0 listing/search/open. Their files and historical documents are retained, rather than silently rewritten.

Within v1.0, §5 gives a one-line philosophical question while §10 M08 gives a multiline literal version with the same meaning. The implementation uses §10's literal text, as required for M01–M14. NE-102's original date is 1995 but its release scope is F; it stays hidden until independent review. NE-112 is created 08 NOV and is not shown in the earlier 07 NOV core window. Case-clock letters differ from narrative-movement letters; the table above keeps them separate. The 003 old-router state never stands in for actual clinic receipt.

No new people, incident dates, patient outcomes, technical escape or ending were invented. Connective UI explains known records, pending work and source/authority limits. Source statuses in earlier supplied bibles remain unchanged.

## Validation and limits

Final validation: `npm test` passes 489 tests across 19 files (112 added checks beyond the prior 377-test suite). `npm run game:validate` passes both fresh v1.0 paths with save/reload at every input, source fidelity for 16 articles and 14 message groups, and the retained three legacy paths. `node scripts/validate-scenario.mjs --model` passes all 53 authored paraphrase cases with the actual bundled local model and deliberately incorrect candidate labels. `npm run model:verify` verifies all 10 assets (41,906,219 bytes) unchanged. `node scripts/validate-bitmaps.mjs --dist` verifies all three bitmap fixtures and production packaging. `npm run build` succeeds with an initial-size warning above the existing 550 kB warning threshold, below the 750 kB error limit; the warning threshold was not raised. `git diff --check` reports no whitespace errors. Separate held-out model limits are listed below. The previously uncommitted I03 image work was preserved. No commit, push or deployment is part of this task.

Static application bundles necessarily contain authored text spoilers discoverable by determined source inspection. UI permissions are a gameplay disclosure boundary, not real confidentiality. Author markdown and personnel JSON are outside public assets; no protected clinical image asset was added. The original three demo bitmaps remain visibly noncanonical placeholders.

Finite question coverage can still miss unfamiliar paraphrases. Browser checks and a real blind playtest assess usability and coherence separately from reducer tests. No duration, emotional effect or medical/legal realism is claimed as measured.

The 53 new request cases use shared deterministic families before optional-model selection, as the browser does. The validator also runs the actual bundled model/vector ranking for these requests and confirms identical transitions; this is not evidence that arbitrary unseen paraphrases will classify correctly. Existing separate holdout evaluation reports 32/36 matched and 4 clarifications, with no wrong confident matches. The retained continuation evaluator reports 22/24 matched, with two mismatches: “How could the corporation keep paying after closing its research division?” and “Was my visit planned by Meridian?” both route to the ordinary company category. Those limitations are retained for a later recognition pass; no catalogue expansion or misleading perfect-score claim is made.

Live browser verification remains outstanding: the available in-app browser showed an older cached app on port 4174, then timed out reaching the current production preview on a fresh origin at port 43104. That is not evidence of a successful v1.0 browser playthrough. Actual browser desktop/mobile, screen reader, reduced-motion and keyboard playtests remain on the checklist below; component/engine checks are automated only.

## Exact blind local playtest procedure

1. Run `npm run build`, then `npm run preview -- --port 4173`; open `http://127.0.0.1:4173`. Choose NEW SESSION if an earlier save exists. QA is optional and stays local.
2. Start with model off. Explore company products, staff, all eight services, text records and the three demo images before pursuing the discrepancy. Confirm no unsolicited clinical reveal. Use keyboard, Esc during output, document return focus, font/CRT settings and reduced-motion mode.
3. Independently discover the closure/controller mismatch. Ask comparisons and trace the alert. Request the safety review and authentic doctor contact. Read the released incident/care documents in any order.
4. Ask about the shared reference, backups and other patients. Compare survival/distress. Refuse or challenge MOTHER's question on one run; accept and answer freely on the other. Ask for actual data and independent medical interpretation.
5. Review signatures, forecasts, alternatives and the witness-only responsibility. Defer and reload; return to the same unfinished review. Ask additional questions. Prepare each choice, reload before confirmation, then CANCEL once to verify no procedure occurred.
6. On one fresh run, type SUBMIT SEPARATION WITNESS, read the full preview and type CONFIRM OPERATION. Check NE-115's exact outcomes and preserved ordinary records. Confirm no replay after reload.
7. On a separate fresh run, follow archive-first discovery and type MAINTAIN SUPPORT, then CONFIRM OPERATION. Check NE-116 and no invented deaths. Try premature path/name/role probes and missing signatures before readiness.
8. Repeat representative questions with the optional bundled model on. Test narrow/mobile viewport, keyboard-only input, document scrolling/alt text, pending-question focus and screen-reader output. Record unfamiliar phrases and confusion as QA feedback. Keep elapsed playtime as an observation, not a forced target.


## Exact files changed in this pass

Measured against the 148-file pre-I04 working-tree snapshot, including the existing uncommitted I03 work: **36 modified, 13 added, none deleted; 112 existing files unchanged**. In particular, all three original bitmap bytes, corporate/personnel/service source data, model assets and the four earlier supplied narrative sources retain their original hashes. Some preserved prototype tests now explicitly construct `newLegacyGame`; their assertions continue to check the resumable old branch. New tests exercise fresh v1.0 instead of weakening legacy assertions to accept incompatible story behavior.

Modified:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/DIALOGUE_COVERAGE.json`
- `docs/narrative/CANON_CONFLICTS.md`
- `docs/narrative/IMPLEMENTATION_IMPACT_MAP.md`
- `docs/narrative/README.md`
- `scripts/validate-game.mjs`
- `src/app/app.html`
- `src/app/app.spec.ts`
- `src/app/app.ts`
- `src/app/core/content.ts`
- `src/app/core/engine/bitmaps.spec.ts`
- `src/app/core/engine/commands.ts`
- `src/app/core/engine/continuation.spec.ts`
- `src/app/core/engine/continuation.ts`
- `src/app/core/engine/corporate.spec.ts`
- `src/app/core/engine/game.spec.ts`
- `src/app/core/engine/game.ts`
- `src/app/core/engine/human-questions.spec.ts`
- `src/app/core/engine/investigation.spec.ts`
- `src/app/core/engine/services.spec.ts`
- `src/app/core/engine/services.ts`
- `src/app/core/interpretation/fallback.ts`
- `src/app/core/interpretation/providers.ts`
- `src/app/core/interpretation/semantic.ts`
- `src/app/core/models.ts`
- `src/app/core/persistence/saves.spec.ts`
- `src/app/core/persistence/saves.ts`
- `src/app/core/qa/events.ts`
- `src/app/core/qa/telemetry.spec.ts`
- `src/app/core/qa/types.ts`
- `src/app/core/session.ts`
- `src/app/features/documents/bitmap-viewer.spec.ts`
- `src/app/features/terminal/terminal.html`
- `src/app/features/terminal/terminal.spec.ts`
- `src/styles.css`

Added:

- `docs/IMPLEMENTATION_04_PLAYABLE_STORY.md`
- `docs/IMPLEMENTATION_04_TRANSCRIPT_CONTINUATION.md`
- `docs/IMPLEMENTATION_04_TRANSCRIPT_SEVERANCE.md`
- `docs/narrative/CODEX_IMPLEMENTATION_04_PLAYABLE_STORY_PROMPT.md`
- `docs/narrative/NERVE_ENDING_PLAYABLE_SCENARIO_SPEC_v1_0.md`
- `scripts/scenario-source.mjs`
- `scripts/validate-scenario.mjs`
- `src/app/app-scenario.spec.ts`
- `src/app/core/engine/scenario-playthroughs.ts`
- `src/app/core/engine/scenario.spec.ts`
- `src/app/core/engine/scenario.ts`
- `src/app/core/scenario-records.ts`
- `src/app/core/scenario-state.ts`
