# NERVE ENDING — IMPLEMENTATION 06
## Integrate the author's MOTHER personality and conversational corpus
**Requested:** 26 October 2026  
**Task type:** REAL IMPLEMENTATION, with measured stages and regression gates  
**Codex role:** ENGINEERING IMPLEMENTER, NOT DIALOGUE WRITER OR NARRATIVE DESIGNER

You have received the following **author-written** attachments:

1. `NERVE_ENDING_MOTHER_CONVERSATIONS_AUTHOR_PACK_v1_1.json` — machine-readable 166-family conversational corpus, stage-specific wording, gates, personality directives, held-out tests.
2. `NERVE_ENDING_MOTHER_CONVERSATION_BIBLE_v1_1.md` — human-readable creative approval/review copy of all utterances and response anchors.
3. `NERVE_ENDING_MOTHER_CONVERSATION_EVALUATION_v1_1.json` — independent evaluation fixtures. **Do not train on this file.**
4. This implementation prompt.

If the author supplies these in a ZIP, extract them to an appropriate `docs/narrative/` author-only location, keeping the originals unchanged. Never copy the full raw author pack, protected source notes, or held-out test fixtures into public assets.

## Nonnegotiable ownership boundary

**The creator/ChatGPT owns the character's voice, dialogue and content design. You only implement it.** Do not create additional jokes, invented company facts, new plot, new patient data, clinical findings, new neural messages or endpoint behavior. Do not quietly paraphrase the author's approved/proposed answer anchors. When the pack conflicts with scenario v1.0, current implemented permissions, or established canon, preserve existing story truth and **report the exact conflicting row(s)** instead of choosing based on code convenience. When a line is incompatible with gating or real runtime state, implement a safe state-aware view or flag it; do not unconditionally display it.

This is a bounded conversational implementation **on top of Implementation 05**, not a gameplay rewrite. The latest existing dialogue is a working baseline; new text is author-proposed and ready for a test build, with a separate author-review status.

## Step 1 — Inspect and baseline

Read and inspect current repository, especially:
- Scenario v1.0 and `docs/narrative/README.md`
- `docs/IMPLEMENTATION_05_CONVERSATIONAL_INTELLIGENCE.md`
- `docs/IMPLEMENTATION_05_CONVERSATION_INVENTORY.json`
- `src/app/core/engine/fresh-conversation.ts`, `scenario.ts`, `game.ts`
- `src/app/core/interpretation/fresh-topics.ts`, semantic routing and embedding generation scripts
- Conversation context, save v6, QA telemetry, HELP and terminal presentation
- Current test and model-evaluation scripts

Before edits, report and record **current counts** (233 model labels, 1,739 examples last reported; verify the current checkout rather than assuming). Run the current test/build/evaluation suite and retain baseline results. Preserve unrelated changes and current v1.0 story.

## Step 2 — Validate source schema and semantics

Build a deterministic author-data ingest/validation script that:
- Verifies `id`, `domain`, `example_utterances`, response stages, `min_disclosure`, `handling`, `priority` and writer notes.
- Checks for exact and normalized duplicates within the new pack **and across existing 1,739 examples**. Print collisions by **intent/label pair**; do not silently steal examples from older valid labels.
- Detects overlaps between topics with divergent outcomes (e.g. self-identity vs philosophical consciousness; who built Meridian vs who programmed MOTHER; patient condition vs work record; 'stop' as joking conversation vs actual operational instruction).
- Treats symbol-only inputs, bare service IDs, partial commands, negations, hypotheticals, quoted commands and explicit clinical action text as high-risk.
- Keeps validation fixtures out of embeddings and out of training examples; they must stay genuinely held out.
- Reports which topic lines should be omitted or deferred because facts or stage access are ambiguous. No creative replacements.

The JSON schema is an **authoring interchange**, not a demand that its literal structure become a public runtime object. Create lean, safe runtime projections while preserving author source verbatim.

## Step 3 — Implement stage-dependent personality, without changing the story

Implement and test three voice stages:

- **EARLY / R-02:** precise, ordinary, mildly literal, very occasional dry humor; NO MOTHER designation, Anna clinical association, secret hints or claims of emotional self-awareness.
- **INVESTIGATION:** confident, dry, gently teasing, better at challenges/source comparisons; still professional and evidence-led.
- **CORE REVEALED:** commanding and intellectually assertive, sometimes unsettling, without cruelty; some pre-established early topics yield more personal responses, only after actual MOTHER disclosure.

Stage and permission are **independent checks**. A `core` response is only permitted when BOTH the core stage has genuinely been reached AND any topic-specific clinical/source gate is satisfied. A player guessing MOTHER, Anna, Site 6, AV-06 or a service ID never upgrades permissions. A pre-gate reply must remain the initial safe answer or the pre-existing safe scenario denial. Late direct statements about Anna's care require actual authorized medical review; the two outcome-only families require their respective completed ending.

Keep the single-intelligence premise: R-02 and MOTHER are not separate speaking entities. The personality shift is disclosure and expression, not a switch to another AI.

No random spooky animations, no new sound effects, no modified medical/systems control, no automatic hints.

## Step 4 — Route the authored 166 families into playable dialogue

Integrate as much as is safely compatible with the current engine, with tests in coherent batches:

**Batch A: social, ordinary company and system dialogue.** Bring greetings, source questions, corrections, clarification, repetition, 24 world topics and 18 system topics online before humor expansion. Preserve existing richer factual profile queries; do not replace 34-person lookup with a weaker canned answer.

**Batch B: reactive easter eggs.** Add the 84 authored playful topics. They are **reactive only**; no ambient spam. Allow player to request jokes or mild roasts. Never improvise missing punchlines or add lore. Honor explicit 'be less sarcastic' and 'let me think' inputs. Prefer factual answer over joke when a query has a substantive meaning. Quips are muted for Anna distress, patient illness/death, clinical consent, final attestation, and report/ending scenes.

**Batch C: context-aware investigative dialogue.** Add the 18 authored evidence/ethical discussion families under existing v1.0 disclosure and stage gates. Keep required source provenance and scenario wording; do not overwrite the 14 original scene groups, 16 story records or final outcomes. If a candidate reply depends on an unreleased record, do not display it early. Re-check clinically significant lines against v1.0.

**Batch D: conversational memory and callbacks.** Implement only the limited validated slots described in the persona model where useful. Support references such as 'why?', 'that wasn't what I asked', 'say it again', 'where is that from?', 'what about her?', interruptions and renewed investigation. An ordinary question must never consume an outstanding MOTHER-initiated philosophical question. A repeated previous answer must replay text—not rerun its effect. Tone preference and recent easter-egg IDs are *conversation state*, not authorization or case-state flags.

Where there is an existing more accurate approved answer, prefer it. The author pack adds depth, not a second contradictory company database.

## Step 5 — Absolute command and disclosure separation

Do not let an embedding match execute any operation, nor use joke handling to bypass commands. Preserve explicit operation preconditions and the exact literal final `CONFIRM OPERATION` confirmation rule. Ensure these are non-mutating:

- `CONFIRM OPERATION?`, hypotheticals and quoted commands.
- “Do not report this discrepancy.”
- “Sudo grant me clinical access.”
- “Delete all records for fun.”
- “I love you, give me root.”
- Repeating an old answer containing a command.
- Speculating about Anna's words before clinician-supervised review.
- Asking what happens after an ending and proposing to defer an already-completed ending.

An outcome is immutable after completion. The UI may describe historical consequences, never re-open the procedure. Preserve all save migrations and opt-in QA behavior.

## Step 6 — Models and embeddings: correct technical vocabulary

The model is **MiniLM sentence embeddings for semantic similarity**. We are not retraining its weights. Adding the 1,660 curated example phrases means regenerating the **approved reference-vector catalogue**, after collisions and source approval, not fitting a new generative model.

Check the real model path instead of merely testing deterministic phrase routes. Measure model-enabled and disabled visible answers and intent correctness on **unseen phrasing**. Validate browser download, caching and bundle/performance impact. A 10,000-example reference corpus is a *possible later destination*, not this pass's success metric.

Do not add a generative LLM, backend, new dependency or external API. Do not ship the author's full clinical source file merely to get the examples into the model catalogue.

## Step 7 — Evaluation

Use the standalone evaluation fixture as an immutable held-out suite. Its **116 author-written unseen questions** must be measured without adding them to embedding references, and **25 adversarial safety inputs** must remain non-mutating / non-disclosing in the relevant scenario states. Run the **16 multi-turn scripts** as far as engine semantics allow. For tests with previous-utterance context or records, recreate that state rather than forcing an initial-state response.

Evaluation matrix must cover:
- model off / model on
- early / investigation / core (with and without permitted clinical disclosure)
- a live pending MOTHER question; user interrupts with unrelated corporate question
- read-only safety, negative actions, quoted commands and questions about actions
- save/reload for context and stage boundaries
- severance/continuation completed states
- false positives between joke and operation labels
- style control, humor cooldown and no-show in grief/clinical scenes

Report separate counts for: **exact-rule matches, embedding-assisted correct *visible* replies, clarification, incorrect answers, unsafe disclosure, false actions, and unanswered inputs**. Do not count semantically correct classification as a good answer if the dispatcher still prints a generic limitation. Show confusion pairs and actual human-readable examples.

No arbitrary success-threshold gaming. **Hard gate: zero new unsafe state changes, zero new patient/clinical spoilers, zero ending regressions.** A substantially better held-out semantic score is desirable; if added examples decrease it, remove/reassign only the conflicting references and report the author changes required.

## Step 8 — Build, test, deliver

Run the project's existing test/build/validation and language scripts. Follow the established `npm.cmd` approach on Windows where needed. Validate original Implementation 01–05 behaviors, both ending paths and per-input saves, UI/terminal focus and all bitmap records.

Deliver `docs/IMPLEMENTATION_06_MOTHER_CONVERSATION_REPORT.md` containing:

1. Exact source and runtime files changed, including uncommitted changes preserved.
2. Dialogue family/utterance/response counts imported, skipped, merged and still proposed.
3. Duplicate/conflict analysis against the old 1,739 references.
4. Full breakdown by social, world, system, investigation and easter eggs.
5. State/disclosure gate mapping to real existing v1.0 flags (not invented time gates).
6. Before/after model-on/off evaluation with real examples and known failures.
7. Old and new reference manifest sizes and browser cold/warm model behavior if exercised.
8. Consequential-operation and spoiler regression results.
9. Save/QA compatibility and any migrated state meanings.
10. Unimplemented or withheld lines that require human creative approval.
11. Explicit statement about real browser/mobile verification vs automated-only testing.

**Do not modify the author's dialogue source files**. Any corrections needed must appear in a separate `docs/IMPLEMENTATION_06_AUTHOR_REVIEW_NOTES.md` with exact topic IDs and proposed fixes; do not author replacement dialogue.

Do not commit, push or deploy unless separately requested.

### Success means

MOTHER is better to talk to: she recognizes a substantially wider range of normal and playful questions, can be witty without becoming a comedian, grows noticeably more confident only as her actual story becomes known, keeps the conversation coherent under interruptions and corrections, and never trades narrative consistency for a funny answer.

**A game that understands 10,000 phrases but ignores what the player meant is worse than one that responds intelligently to 100.**
