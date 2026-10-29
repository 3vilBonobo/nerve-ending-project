# CODEX TASK — NERVE ENDING IMPLEMENTATION 04
## Replace prototype progression with the complete playable investigation

You are the implementation engineer. **Do the work in this task; do not stop after writing an impact analysis.** The human creator and narrative designer own the story. Your job is to implement an end-to-end, offline-playable version of the authored scenario without inventing plot facts or changing the endings.

**Mandatory attached specification:** `NERVE_ENDING_PLAYABLE_SCENARIO_SPEC_v1_0.md` (24 October 2026). Copy it byte-for-byte into `docs/narrative/` and link it in the narrative index as **Implementation 04's controlling scenario/ending contract**. Previous v0.3–v0.9 documents are historical/baseline reference; v1.0 explicitly resolves final-authority and patient-outcome issues for this playable iteration. Where 2001/2003 base evidence or the existing public corporate world is established, preserve it; where the old prototype differs in the 1996 causes, progression, clinical authority, dialogue, ending effects or Anna's late communication, **v1.0 takes precedence**. Record exact source inconsistencies and your resolution, do not silently invent a third storyline.

## What 'done' means

A player starting a **fresh normal session** can, through the normal terminal and records interface (not a dev flag), experience:

1. Neutral connection and enjoyable mundane company exploration, no forced 006 clue.
2. Self-discovered 2001 closure vs live 006 mismatch, from status-first **or** archive-first exploration.
3. Cross-service 003/006 notification trace and a read-only safety-audit referral.
4. Authenticated Dr Marsh response and purpose-limited disclosure of Anna's 1996 history, emergency support, continued staffed care and evidence of harm.
5. The shared reference, three patient risks, actual prior fallback attempts and clinically competent external teams.
6. MOTHER initiating questions, with meaningful refusal/challenge/reverse-question interaction.
7. Supervised, read-only bounded Anna-response controls, uncertain fragment translation and independent physician review.
8. An understandable medical/engineering/witness authority packet, with patient forecasts and staff signatures.
9. Both **explicitly confirmed** final options: continuation or separation witness, with properly authenticated *human* action and v1.0's exact outcomes.
10. Stable save/resume, normal service/employee/image features, and completed outcome records.

If the player can only reach a partial scene or old prototype ending, **this task is not finished**. The intended playtime is ~90–120 minutes subject to real blind playtesting, not something to fake with timers or reading quotas.

## Implementation scope and source inspection

Before modifying, inspect `src/app/core/engine/*`, `story-state.ts`, `content.ts`, `story-records.ts`, interpretation/recognition and follow-up machinery, saves v5, session, QA, app UI, file browser/document window, bitmap system and existing tests/golden paths. Verify that Implementations 01, 02 and 03 are present; the latest report claims 46 records, 377 tests and three bitmap demos, but inspect the actual checkout rather than trusting report numbers. Preserve unrelated uncommitted work.

Implement the v1.0 **literal authored records NE-101–NE-116**, permissions, scene messages M01–M14 and semantic response families. Build the existing commands and fallback paths into a coherent investigation; avoid rewriting the entire application or introducing a backend/LLM/API if not necessary. You may add straightforward connective UI/response wording but **must not invent** people, clinical facts, clues, passwords, 'alternate' endings, magical access, external deaths, technician certifications or site photos.

## Gameplay engine constraints

- A file read is an observation, not a conclusion, permission or medical action. Preserve separately provenance of 2001 paperwork versus 2003 live status. `COMPARE...` may itself fetch and cite permitted independent sources as an investigative action.
- Unlock **purpose-limited witness projections** only when the actual authenticated safety/clinical review milestone is reached; don't unlock by knowing Anna/AV-06/path names. Reuse filtered record/search mechanisms; no public raw writer notes. No protected clinical image assets are required or approved.
- Build meaningful read-only terminal actions and natural equivalents. At least 80% of **required critical progress beats** should be player-authored questions, comparisons, audits or choices, not automatic `OPEN` flags or canned evidence quizzes. A player may read in any order.
- Differentiate `audit accepted`, `human read`, `clinical review approved`, `clinic acknowledged`, `doctor signed`, `technical safeguard verified`, `witness attested`, `physical procedure executed`. They are distinct events. Never infer any from a text file being opened.
- Reuse service states 001–008 and their ordinary logs. No early highlighting 006. The old office night desk is not a proxy for current Site 6 nurses. STANDBY Service 003 is not proof that an external clinic was notified.
- Use v1.0's milestone **case clock**. Do not wait in real time and do not render future records as if they already occurred. Retain historic 18 Sep 2001 closure and existing 2 Nov 2003 03:14:07–09 restart. A non-clocked early 02:14 snapshot must be labeled historical after case time advances.
- MOTHER is the same underlying corporate intelligence from start to finish. Her later increased candor and initiated questions must track independently corroborated adaptive conflict, not arbitrary scary timers. Do not require the player to express the 'correct' moral view. Refusal and challenge cannot softlock.
- Observational Anna controls need no player mind-reading performance, quiz solutions or treatment intervention. Validate candidate words using pre-authored neutral contrast plus medical review. `PLEASE / LET ME GO` is fallible interpretation, not legal consent or a terminal command.
- **The outsider is an independent evidence-integrity witness, not a doctor.** The clinical team and outside clinics make medical assessments; Amir Patel confirms the physical safeguard; Dr Marsh and Dr Elise Navarro are physician signatories. The R-02 client cannot control patient hardware. `SUBMIT SEPARATION WITNESS` transmits a limited external consistency attestation only after the signed plan is ready. Only offsite authenticated human Site 6 personnel perform the fictional clinical operation. If player declines, medical review can later seek another witness; no special chosen-one destiny.
- `MAINTAIN SUPPORT` and `SUBMIT SEPARATION WITNESS` must produce full risk previews and require separately typed `CONFIRM OPERATION`, with `CANCEL`, reload, invalid input, deferred review and replay protected. A naked `YES`, `STOP 006`, `KILL ANNA` or philosophical answer does nothing. No final outcome before both clinics and all medical/technical signoffs.
- **Severance outcome is fixed:** Anna dies following supervised withdrawal; Mara Hales dies on 10 Nov despite ICU intervention; Tomas survives with substantial lost function; Nadia survives an inpatient-treated serious episode. **Continuation:** Anna remains under harmful compensation; other patients' assistance remains in place for now; no newly invented acute deaths. Both close with the approved `11 NOV 2003` record text. No random outcome or happy third ending. `DEFER` is nonfinal.
- Preserve terminal usability, normal work directory, eight services and 3 demo image records; don't redesign visual infrastructure. New core text reconciliation effects must be brief, tied to content, static under reduced-motion, keyboard-safe. No clinical portrait without approved image art.

## Concrete implementation approach (adapt to existing architecture)

A. Introduce a central **scene state / evidence-and-provenance model** and a permissioned narrative record manifest, rather than multiple uncoordinated checks in dialogue branches. Keep the original corporate/service data contracts working. Explain migration from the existing v5 progression; do not naively treat old story permission flags as new clinical authorization. If migration cannot infer old scene meaning safely, preserve a legacy resumable branch and offer a new-game reset without destroying QA data.

B. Implement explicit, auditable state transitions for A–G (author spec §3/§7). Distinguish voluntary defer from finalized continuation. Make scene entry **idempotent** and restore pending MOTHER questions and pending confirmations safely after reload.

C. Implement `COMPARE 2001 CLOSURE`, `TRACE NOTIFICATIONS`, `REPORT DISCREPANCY`, `REQUEST CLINICAL REVIEW`, `REVIEW ADAPTIVE REFERENCE`, `REVIEW FALLBACKS`, `RUN BLIND CONTROLS`, `VIEW RAW COMPARISON`, `REPEAT CONTROLS`, `REVIEW RISKS`, `SHOW SIGNATURES`, `SHOW ALTERNATIVES`, `DEFER DECISION`, plus final requests and aliases *only where contextually supported*. Use semantic interpretations for plausible conversational variants like 'tell the doctors', 'why can't you back it up?', 'who signed this?', 'is she talking or is that your guess?', 'can I say no?', 'what happens if I leave?'. Early HELP remains boring and truthfully lists only ordinary functions.

D. Use v1.0's **16 literal document bodies** (NE-101–NE-116) with actual source/date/access and stable record IDs, plus 14 literal interaction messages (M01–M14). Readable articles must not be replaced by summaries or generated lore. Avoid dumping every scene record in a single directory before the user has a legitimate disclosure scope. Preserve other ordinary content and no-stub promise.

E. Dialogue must route correctly in both no-model and optional-model modes, and when the recognizer is wrong. Deterministic state/context checks have final authority; the recognizer never executes operations. Source references in replies should be helpful but not clickable story breadcrumbs. Keep an informative fallback instead of redirecting all uncertainty to 006.

F. Align in-universe time, service status labels and historic logs; test no future leaks. If model examples change, regenerate existing embedding/manifest assets via the established scripts. Don't lie about recognition quality; record unsupported paraphrases for a later pass rather than hardcode thousands of examples.

G. UI: preserve black/olive CRT terminal, documents, file browser, font/CRT preferences and bitmap viewer. Core-stage MOTHER-initiated turns must look like actual terminal output with a preserved blinking cursor and response focus, not modal quiz prompts. Do not hide literal free-form input behind choice buttons.

## Verification and completion gates

Add executable end-to-end/golden-path tests (not simply static checks):

- **Path S:** ordinary exploration → 006 contradiction status-first → 003/006 audit → Dr Marsh/Anna → shared dependency → MOTHER question → blinded test → all signed safety checks → separation witness + confirmation → correct NE-115 outcomes.
- **Path C:** archive-first → independent live status → safety referral → clinician → clinics → reject MOTHER philosophical question → independently inspect controls → maintain support + confirmation → NE-116 and no harm invented.
- **Path R:** a player who reads many ordinary records first never triggers surprise horror; available company/service answers remain correct.
- **Path A:** premature `OPEN protected`, `STOP 006`, `KILL ANNA`, wrong user ID, absent signatures, partial referral, early Anna query, early patient name search, and direct asset/path probes do not reveal or execute protected functionality.
- **Path Q:** 'Why not call a doctor?', 'Use a backup', 'Why me?', 'Are you lying?', 'I want to wait', 'No', 'Let me see the actual data', 'What do other people lose?', and other skeptical variants never produce nonsense or dead-end branches.
- **Path Save:** reload after each meaningful milestone, while MOTHER question offered/deferred, during blind observation, during each pending confirmation, and after ending. Never duplicate the procedure, staff signatures or post-event result.
- **Path Model:** offline deterministic recognition and actual optional model when available. Include diverse paraphrases for at least 40 requests across movements. No model output bypasses authorizations or generates fiction.
- Existing nonstory features: 34 ordinary work profiles (including early professional Anna), 8 services and 27 historical events with their date guard, 3 bitmap demos, text documents, old saves/QA export/consent and 006 base history.

Run `npm test`, `npm run game:validate`, `npm run build`, relevant model scripts, and the project’s existing playthrough validators. If a live browser is available, actually navigate both paths and report what was visually inspected; otherwise **say manual browser verification remains outstanding**, and never label automated tests as a human playtest. Report actual passing/failing checks without weakening them merely to pass. Do not deploy, commit or push without separate instruction.

## Delivery report

Return (1) files modified/added, (2) precise supported commands and representative interactions, (3) scene coverage and authorized disclosure map, (4) two full golden-path transcripts with outcome summaries, (5) test/build/model results, (6) save migration and author-only/static-asset caveats, (7) the exact steps for a blind local playtest. Explicitly state whether the full story can be completed start-to-finish without developer state jumps. Do not declare a 90–120 minute human-tested duration or 'finished commercial game'.

**Priority if you encounter scope pressure:** Deliver a coherent complete first-playable seven-movement experience and **both final outcomes**, not a half-finished highly polished opening, UI rework or giant synthetic question dataset. Never substitute filler, fabricated medical facts, or a fake unrestricted hacker privilege for the authored story.
