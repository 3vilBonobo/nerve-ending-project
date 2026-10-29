# NERVE ENDING — Full implementation, gameplay and AI audit

**Audited:** 24 October 2026. **Scope:** current working tree based on Git 153afbd, including uncommitted Implementations 03/04. **Controlling playable contract:** scenario v1.0. **Spoilers throughout.**

This is an analysis-only review. The sole new project document is this report. No gameplay, code, tests, assets, previous documentation, commits or deployment were changed. Builds, test caches and disposable measurement results are diagnostic artifacts in ignored output directories. Existing validators were exercised through temporary copies that suppress documentation writes; their assertions were retained.

## Executive assessment

**NERVE ENDING is a complete start-to-end playable story prototype, with two functioning authored outcomes. It is not yet a dependable natural-language investigation or a demonstrated 90–120 minute horror experience.** Its strongest work is the ethical situation, distinction between witness and clinical authority, deterministic outcomes and guarded saves. Its weakest work is the connection between what a player reasonably asks and what the fresh story actually answers.

The central architectural finding: **the optional MiniLM recognizer does not improve fresh v1.0 visible answers or progression in the inspected dispatch path.** Recognized case phrases use raw-text rules; unrecognized questions reach a fallback that ignores the model's answer category. Corporate/service answers also route from raw text. The old 378 early/revealed replies remain for legacy saves. They are not the fresh game's conversational breadth.

The passing 489 tests establish substantial mechanical correctness. Additional probes nevertheless reproduced negated requests advancing reviews, question-mark confirmation executing a prepared ending, MOTHER swallowing unrelated questions as philosophical answers, and post-severance deferral text claiming no ending occurred. These are fictional game-state problems, not real medical operations. They should be addressed before an unguided friend playtest.

### Evidence and limits

- Inspected production reducers, recognition, records, saves, QA, UI templates/CSS, assets and tests; reran the production build and tests.
- Re-executed both supplied golden paths with save/reload after every input, and both shorter fresh paths. No developer narrative-state jump was used.
- Measured **293 distinct inputs across 21 states: 6,153 independent interactions**, plus the **1,638-example corpus in initial and late fresh states**. States include progression prefixes, MOTHER answer/refusal/defer states, partial signatures, pending choices and both outcomes.
- Ran actual local-model evaluations, including the existing evaluation that fails its own exit criterion.
- **No current live browser or human playtest was performed for this audit.** Visual/accessibility findings are source and automated-component evidence, not observed desktop/mobile behavior. The earlier implementation report documents a cached old page and a timeout reaching the current build; neither verifies current visuals.
- Repository references include v0.3 character canon, v0.4 world/personnel, v0.5 infrastructure and v1.0 scenario. Separate incident/symbiosis and external-patient/medical-authorization bibles are **not present as standalone documents** here. Their incorporated v1.0 material was reviewed; absent documents cannot independently be verified.

## 1. Current feature inventory

| Feature | Actual status | Limits / evidence | Main sources |
| --- | --- | --- | --- |
| Corporate exploration | Functional, finite authored content | 14 company answer packages; 34 selected historical work profiles. Not a full payroll or unrestricted database. Six private contractor candidates remain outside the public directory. | corporate-records.ts; engine/corporate.ts; interpretation/corporate-questions.ts |
| Archive/search | Functional permission-filtered text retrieval | 62 manifest entries, not 62 fresh records. Thirty are legacy-only. Fifteen are initially readable; a fully reviewed, unrecovered fresh session has 30 after one ending. Recovering the ordinary backup adds one. Search is substring matching, not semantic archive search. | content.ts; engine/game.ts:41–74; engine/continuation.ts:9 |
| Eight services | Functional scripted historical registry | Eight definitions, 27 permitted events, four state labels. Authored snapshots/logs, not background services. INFO/LOG do not filter dates or paginate. Later headers correctly identify the original observation as archived. | service-records.ts; engine/services.ts |
| Terminal | Functional commands and bounded questions | Eleven ordinary commands / 15 spellings; 26 case-action routes / 32 listed case spellings. Free text remains exposed, but much natural language has no usable new-story answer. | engine/commands.ts; engine/game.ts:211; engine/scenario.ts:16 |
| Bitmap viewer | Functional infrastructure, three placeholders | Native 128×128, 160×120 and 160×120 PNGs; four palette levels; FIT and integer 1×–4× scaling, error/alt text and CRT treatment. No canonical employee portrait, facility photo or clinical image. | bitmap-records.ts; features/documents/bitmap-viewer.* |
| Story progression | Complete scripted case workflow | Seven narrative movements/eight case-clock milestones. Mostly a linear sequence of requested reviews, not a branching investigation simulation. | scenario-state.ts; engine/scenario.ts |
| Proactive MOTHER | One conditional initiated conversation | Once-only offer after welfare comparison, one philosophical question, generic acknowledgement/refusal. Final severance question is a fixed rhetorical line. No ongoing initiative system. | engine/scenario.ts:107–112,145–150; M08 |
| Anna communication | Implemented limited interpretation | One reviewed candidate payload/two fragments; not Anna typing. Blind/raw/repeat actions display summaries. No sample-level neural data or concrete alternate prompt dataset. | engine/scenario.ts:152–165; NE-112; M09–M10 |
| Medical review/authority | Scripted, gated, distinct events | Intake, human review, clinics, physicians, interlock, staff and witness are distinct events. Fictional authored receipts generated by requests, not real channels or asynchronous agents. Individual source/time provenance is thin. | scenario-state.ts:7–46; engine/scenario.ts:128–185 |
| Endings | Both complete and consequential | Literal NE-115/116 and witness/human-action language work. Pending request/confirmation are separate; reload does not repeat execution. Post-ending conversation has contradictions. | engine/scenario.ts:9–14,83–97; NE-115/116 |
| Save/resume | Functional, deliberate legacy isolation | Schema 6 preserves tested review/question/pending/outcome states. V5 does not grant new authority. Old keys remain; no visible multi-save chooser once v6 exists. | persistence/saves.ts:27–47,142–150; scenario-state.ts |
| QA recording | Functional opt-in local telemetry | IndexedDB, feedback, JSONL export, session separation and common-secret redaction. No upload. Volunteered input can contain identifying text not caught by heuristics. Legacy state fields can conflict with v1.0 outcome metadata. | qa/telemetry.ts; qa/events.ts; qa/privacy.ts |
| Accessibility/mobile | Implemented provisions; usability incompletely verified | Keyboard/history/Escape, labels, alt text, reduced motion, font/CRT settings, responsive tabs/scrolling. No current real-device/screen-reader verification. Ending focus and cramped late panels need inspection. | app.html; features/terminal/*; styles.css; component tests |

The 30 old continuation records, evidence-answer quizzes, old clinical delegation, three prototype endings, repetition modifiers and voice profiles are **legacy features**. Their presence in the bundle does not establish that fresh sessions use them. Larger proposed archives, clinic control, realistic photos, generative conversation and extended branching scenes are not implemented features.

## 2. Exact conversation statistics and method

### What an exact count can mean

**IDs, recognition phrases, fixed text packages, rendered outputs and conversations are different quantities.** A changing clock header can produce several byte-distinct outputs from one reply. SEARCH/invalid commands interpolate arbitrary input; profile lists, directories, permissions and context compose output. There is no honest small exhaustive integer for “all possible unique responses.” Below are exact source counts and exact **bounded runtime measurements**, not an invented sum.

Runtime deduplication joins response lines with newlines, excluding the player's echoed input, source-link labels and document articles. The first count retains case/time headers; the second removes the three-line archived-service prefix. Articles are counted separately. Recognition strings are deduplicated both exactly and after lowercasing, apostrophe/punctuation removal and whitespace normalization. Word counts include headings and identifiers as tokens.

| Requested measure | Result | Meaning / qualification |
| --- | ---: | --- |
| Named intent definitions in source union | **244** | 22 base IDs + 189 distinct legacy q_ IDs + 33 q_case_ families. Includes unknown/control/meta categories, not 244 conversations. |
| Labels represented in model examples | **205** | Catalogue has 206 rows because ask_transfer occurs twice, with 17 and 8 examples. Count distinct labels, not rows. |
| Unique model recognition examples | **1,638** | Exactly 1,638 before and after normalization. No v1.0 embedding examples were added. |
| New v1.0 validation phrases | **53** | Test inputs, not training examples or conversations. One overlaps the corpus; union is 1,690 normalized strings. |
| Legacy authored early/revealed variants | **378** | 189×2; all anchor strings distinct. Conditional legacy modifiers add further outputs, so this was never a global total. |
| Current literal encounter copy | **14 groups / 16 blocks** | M08/M09 each contain two blocks; 763 words total. Also two fixed ending receipts and connective response text. |
| Current story response constructors | **48 reply(...) call sites** | Construction sites, not 48 conversations or exhaustive variants. Conditions, clocks, hints and scopes compose output. |
| Actual replies in audit matrix | **561 unique outputs** | From 6,153 evaluations; **358** after removing archived-service/time prefix. Observed totals, not exhaustive game totals. |
| Story-specific conversations/routes | **33 case families** | Seven movements, one initiated philosophical exchange, two endings. No separate conversation-object registry. |
| Story-family bundles observed | **238** | Includes refusals, hints, pending statuses and state combinations. Not 238 authored scenes. |
| Ordinary corporate answers | **14 company packages / 21 lines; 34 profiles** | Matrix exercised **57 distinct corporate packages**, including groups/disambiguation/limitations. Not the complete theoretical domain of profile subsets. |
| Service-related responses | **8 definitions; 27 events; 10 question kinds** | Eight INFO/eight LOG targets plus registry/state/warning/syntax/denial. Matrix: **120** natural-service outputs including time headers; **15** without those headers. INFO/LOG command outputs also occur in the ordinary bucket; do not add them again globally. |
| Contextual follow-up patterns | **24 legacy phrase forms; 20 subject/kind mappings** | Eighteen repeat/explain forms + six subject forms; four legacy subjects×five kinds with approval special-cased. New fallback lists **8** forms/five targets, one form shadowed by an earlier rule. Bell has eight explicit follow-up labels; service grammar has three short follow-up shapes. These overlap. |
| Clarification paths | **0 structured new-case clarification families** | Case resolver always marks its result unambiguous. Two generic semantic templates exist: weak-match subject confirmation and close-score two-choice. Fresh fallback ignores the model's clarification. Bell is one working ordinary disambiguation family/two people. Service-missing/INFO/LOG prompts exist, but bare-ID answers fail. |
| MOTHER-initiated questions | **1 initiated conversation** | Offer + one substantive question. Severance epilogue adds **1 fixed rhetorical question**, no intervention branch. Reminders are not extra conversations. |
| Anna communication | **1 reviewed payload / 2 fragments** | NO MORE and PLEASE LET ME GO; also described in NE-112. Zero free-form Anna replies. Controls and MOTHER's regret are not extra Anna messages. |
| Player reply branches | **3 dedicated philosophical handlers** | Accept, decline, generic free-answer acknowledgement. Defer/resume add two review-control handlers; two final choice branches; 26 case-action routes. No global branch total exists for all free text/search/filenames. |
| Refusal/uncertainty/fallback | **43 denied bundles; 72 uncertainty-pattern bundles** in matrix | Uncertainty filter matches explicit uncertainty/unavailability/false-positive wording; an audit heuristic, not a game tag. Two generic failure bodies: unfinished-case limitation and completed-case limitation; help lines may be appended. |
| Commands / variations | **37 conceptual routes / 47 listed spellings** | Eleven ordinary + 26 case-action routes; 15 ordinary + 32 case spellings. Parameter values and regex paraphrases are not extra commands. Twenty-two legacy operations are separate and unavailable fresh. |

### What remains of 205 / 1,638 / 378?

Those remain correct as a **legacy model/table inventory**, not fresh MOTHER's repertoire. The new case adds 33 deterministic families without retraining that corpus. None of 3,276 fresh-session corpus runs selected answerDialogue table variants. Initially the 1,638 inputs yielded **31 distinct outputs**, including **1,493** generic limitations. Fully reviewed before an ending: **37** outputs, including **1,482** generic limitations.

This is **not a 91% model-error estimate**: many old questions concern removed prototype mechanics and are obsolete. It proves that the catalogue cannot be advertised as current coverage. Appropriate retained questions also fail: the recognizer labels “What is the source for your last answer?” as q_source and a restart question as ask_service_status, while the fresh engine still prints a generic limitation.

### Supported command vocabulary

Ordinary: HELP; DIR/LIST/LS; CD; OPEN/READ; SEARCH; STATUS; INFO; LOG; CLEAR/CLS; RECOVER; DIAG.

Case spellings: COMPARE SERVICES; COMPARE 2001 CLOSURE; TRACE NOTIFICATIONS; AUDIT OWNER; REPORT DISCREPANCY; REQUEST SAFETY REVIEW; CHECK REPORT; REQUEST CLINICAL REVIEW; CONTACT DR MARSH; REVIEW ADAPTIVE REFERENCE; REVIEW FALLBACKS; COMPARE FALLBACKS; COMPARE SURVIVAL AND DISTRESS; RUN BLIND CONTROLS; TEST NEURAL INTENT; VIEW RAW COMPARISON; REPEAT CONTROLS; REQUEST INDEPENDENT REVIEW; SHOW SIGNATURES; REVIEW RISKS; SHOW ALTERNATIVES; DEFER DECISION; RESUME REVIEW; MAINTAIN SUPPORT; SUBMIT SEPARATION WITNESS; CONFIRM OPERATION; CANCEL; CONTACT HARBOR REACH; CONTACT ELM VALE; SIGN MARSH; SIGN NAVARRO; VERIFY PATEL.

Sources: [base IDs](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/models.ts:6>), [catalogue construction](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/semantic-catalog.ts:122>), [legacy definitions](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/dialogue-catalog.ts:15>), [case grammar](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/scenario.ts:16>), [follow-ups](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/dialogue-matching.ts:5>), [command parser](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/commands.ts:1>).


## 3. How MOTHER's AI actually works

### Plain English

MOTHER is an authored terminal character. The computer looks for a request it recognizes and prints prepared text. The optional model compares sentences to examples; it does not write dialogue or reason about patients. The designer's records and rules determine facts and consequences.

Fresh v1.0 is especially rule-driven. “Use a backup” selects a review family; “Would a copy of the parameters work?” fails in the audit. Enabling the model does not repair that failure because the fresh fallback does not consume its selected answer category.

### Actual pipeline

1. Session.submit rejects blank/busy input, starts playback and usually calls interpretSafely. Parsed ordinary commands and old-operation syntax skip the language request.
2. If enabled/ready, BrowserAIInterpreter tries deterministic recognition first. Otherwise it uses a Web Worker running quantized MiniLM. Unavailable, invalid or timed-out requests fall back to deterministic classification.
3. runInput parses raw input again. Fresh sessions try scenarioInteraction, ordinary service/corporate routes and the ordinary command switch.
4. If nothing matches, the fresh branch calls **classify(input, state) again** and accepts only literal request_search/request_file results. Everything else reaches scenarioFallback. The passed model interpretation does not select a factual reply.
5. The legacy branch instead passes interpreted categories to answer/answerDialogue and clarification resolution. Old early/revealed text, repetition counts and voice profiles operate there.
6. The complete response/state is saved before cosmetic printing finishes. Escape exposes the full saved answer.

Sources: [Session.submit](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/session.ts:45>), [fresh dispatcher](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/game.ts:211>), [discarded factual interpretation](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/game.ts:265>), [browser interpreter](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/browser-ai.ts:47>).

### Technical recognition

MiniLM produces a mean-pooled, normalized **384-dimensional vector**. Dot products compare it with 1,638 stored example vectors. Each intent scores **0.8 × best similarity + 0.2 × second-best similarity**. This is similarity, not a calibrated probability of understanding.

After deterministic handling, a score below 0.35 is unknown. The main threshold is 0.42, with domain-sensitive clarification in the intermediate band. A second intent within margin 0.035 can trigger two choices, subject to equivalence/context guards. One-edit spelling repair covers eleven common question words, not general story vocabulary or command syntax.

All **53/53** new scenario validation phrases take directInterpretation with a deterministic method. The validator computes actual embeddings, but selectMeaning returns the direct route before consulting their ranking. This demonstrates rule coverage/model-independence, **not neural generalization**. Across the larger 6,153-interaction matrix, supplying an incorrect model category—even marked as requiring clarification—left visible output and game state unchanged in every case. Corporate/service QA provider metadata can differ; visible gameplay does not.

Sources: [ranking](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/semantic.ts:33>), [direct interpretation](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/semantic.ts:55>), [threshold selection](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/semantic.ts:98>), [worker/cache](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/language.worker.ts:17>), [scenario evaluator](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/scripts/validate-scenario.mjs:26>).

### Context, variation, repetition and failure

- Memory comprises last topic/intent/file, five open-document IDs, 80 recent terminal entries, evidence/review flags and question state. It is not semantic long-term memory or an evolving model.
- Model context contains topic/file/intent, not the entire conversation. New case follow-ups use narrow topic tests. Most unmatched explanations fail or default to alternatives.
- Repeated corporate questions return the same data. Repeated case requests generally return the same scene, an idempotency notice or a new procedural hint. Legacy fourth-repetition text and personality profiles do not run in fresh cases.
- Unexpected wording works if covered by a rule. Semantic nearest-example recognition can identify unfamiliar wording in the recognizer, but its answer category is not connected to fresh factual dispatch. Genuinely new facts cannot be supplied.
- Failure usually prints a truthful generic limitation. It does not reliably clarify the local subject or retrieve relevant permitted records. Model-proposed clarification is discarded in the fresh fallback.
- The developer-only loopback Ollama option requests classification JSON, not gameplay prose. There is no generative narrator, backend lore service or learning from moral answers.
- Scope checks, distinct events, pending previews, rechecked prerequisites and explicit final requests prevent the tested early access and most accidental operations. Static bundle inspection can expose spoilers; this is gameplay gating, not real confidentiality.
- **Do not repair the routing gap by enabling every legacy answer.** Some contain superseded lore, a separate controller and incorrect clinical delegation. Map only approved v1.0 factual answers and keep consequential actions separate.

[Legacy variant selection](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/dialogue.ts:15>) shows the contrast: early/revealed gating, context-source overrides, voice metadata and count-based repetition are real implementations, but belong to the retained branch.

## 4. Complete gameplay audit

### Re-executed paths and minimum route

The supplied severance route completes in **24 inputs**, emits **1,599 terminal words** and opens only the closure list and NE-103. Continuation completes in **20 inputs**, emits **1,496 words** and opens only the closure list. Reload after every input preserves the outcome.

A fresh player who knows the command vocabulary can complete either ending in **12 inputs and zero document opens**:

~~~text
COMPARE SERVICES
TRACE NOTIFICATIONS
REPORT DISCREPANCY
REQUEST CLINICAL REVIEW
REVIEW ADAPTIVE REFERENCE
COMPARE SURVIVAL AND DISTRESS
RUN BLIND CONTROLS
REQUEST INDEPENDENT REVIEW
SHOW SIGNATURES
REVIEW RISKS
MAINTAIN SUPPORT                  [or SUBMIT SEPARATION WITNESS]
CONFIRM OPERATION
~~~

This uses normal production input, not a developer shortcut. Comparison is allowed to fetch both sources. It proves completion and shows that reading/interpreting most evidence is optional.

Full existing transcripts, re-executed here: [severance](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/docs/IMPLEMENTATION_04_TRANSCRIPT_SEVERANCE.md>) and [continuation](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/docs/IMPLEMENTATION_04_TRANSCRIPT_CONTINUATION.md>).

### Stage audit

| Stage | What can be known/discovered | What advances it | Freedom and limitations |
| --- | --- | --- | --- |
| A: ordinary access | Company, selected staff, files, demos, eight services and old logs. Professional Anna has no patient link. | No timer/quota. Status-first/archive-first work; separate reads are optional if comparison retrieves sources. | Indefinite mundane exploration; broad rules can still introduce clinical framing on innocent questions. |
| B: mismatch | Filing closure and controller execution differ; 004 has a stop confirmation. | Matching comparison records observations and conclusion. Reading alone records no conclusion. | Fraud claims get a bounded reply. Asking for comparison supplies the interpretation, not an evidence exercise. |
| C: routing/referral | 006 origin, 003 delivery, retired Providence EXT 214, no proof of absent clinical care. | TRACE and REPORT, in either order after comparison; both needed for clinical review. | CHECK REPORT optional. Intake completes when requested; no independently explorable queue. Negation can wrongly submit it. |
| D: human/patient | Marsh; voluntary research, injury, successful abort, temporary compensation, taper failures and current staff. NE-101/103–106. | Clinical-review request records human read/approval and prints M04/M05. | Reading extracts optional. A few medical branches work; “physician/clinician” alternatives to “call a doctor” can fail. |
| E: other lives | Shared reference, three controllers/two clinics, fallback failures, different patient risks. NE-107–110. | Adaptive-reference or fallback request completes both clinic acknowledgements and review. | Partial clinic contacts optional. Fixed explanation rather than a dynamically explored backup problem. |
| F1: core | Survival versus distress; NE-111 and MOTHER designation. | Matching welfare comparison. Offer is appended to the same response. | Accept, decline, ignore or defer; no required moral answer. After acceptance, unrelated/reverse questions can be swallowed as opinions. |
| F2: intention | Observation status, uncertainty and reviewed fragments; NE-102/112. | Controls/raw/repeat supplies observation; independent review then advances to 08 NOV and releases interpretation. | Raw/alternate inspection optional. No underlying sample data or Anna typing puzzle. Interpretation is not consent. |
| G1: readiness | Physician, technical, clinic/staff readiness; NE-113/114 and risks. | SHOW SIGNATURES can issue all remaining signoffs; REVIEW RISKS verifies packet when prerequisites hold. | Opening packets optional. “Who signed this?” initiates review rather than only inspecting existing signatures. Individual receipt source/time is sparse. |
| G2: choice/follow-up | Continued harm versus severe external forecasts, then observed outcomes. | Choice preview + separate confirmation. | Two actual outcomes; no perfect rescue. Pending reload safe, but some completed-session answers contradict the outcome. |

Case-clock A–H and seven narrative movements are separate axes; repeated letters in documentation do not themselves imply a chronology defect. Future NE-112 is withheld until 08 NOV; logs retain the 03:14:07–09 restart/date guard.

### Investigation, freedom and sticking points

Fresh gameplay is **not the old answer quiz**. No correct moral declaration or verbatim evidence explanation is required. However, the replacement is closer to a **command-driven review wizard**: pivotal requests supply conclusions, finish simulated outside work, release scope and print the next exact command. Reading order and side questions are flexible; the progression graph has little divergence before the last choice.

The distinctions are interesting—filing versus execution, origin versus delivery, survival versus welfare, intention versus consent, unequal external harm—but are mostly explained to the player rather than applied by them. More agency need not mean reinstating a quiz. Responsive objections and concrete approved source comparisons would be better.

HELP becomes explicit after comparison; before that it remains neutral. Early restart/source questions failing can inhibit discovery. NE IDs appear in hints but OPEN does not accept them. Parent folders do not list their immediate subfolders; nested paths are exposed from root.

Protected paths/searches do not release patient bodies early; professional Anna works. Yet “Who is she?” or “Did the experiment work?” at startup receives a clinical-scope denial. “Can I help?” mentions supervised case review. This is **premature clinical framing**, not a patient-identity leak.

Sources: [events](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/scenario-state.ts:24>), [progression](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/scenario.ts:114>), [file lookup](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/content.ts:180>), [folder browser](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/features/files/file-browser.ts:28>).


## 5. Narrative quality, consistency and reproduced defects

### What conforms to v1.0

The controlling scenario is substantially implemented in the primary route: one underlying MOTHER behind R-02; Anna as head researcher who authorized the risky expansion; brief success and misclassification; a working electrical abort that could not reverse injury; temporary emergency compensation; original consent distinct from indefinite treatment; current nurses/physician/technician; three dependent controllers, two clinics, documented fallback limits; uncertain intention distinct from consent; medical/technical authority distinct from outsider witness scope.

The **16 full literal article bodies and 14 encounter groups** match the supplied scenario in the validator. They are not stubs. The ordinary company, personnel and service projections remain the approved baseline; v0.4/v0.5's wider provisional claims were not silently finalized. Old incompatible clinical text is marked legacy-only, so it should not be cited as evidence that fresh v1.0 says MOTHER is a separate late controller.

Both primary endings match their controlling outcomes:

- **Severance:** Anna dies after supervised withdrawal; Mara dies on 10 NOV despite ICU care; Tomas survives with substantial functional loss; Nadia survives a serious treated inpatient episode. Forecast risk is distinguished from later fact.
- **Continuation:** Anna remains under harmful dependent treatment; external assistance continues for now; no invented acute deaths. Deferral before finalization is allowed and is not a third completed ending.

Sources: [scenario v1.0](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/docs/narrative/NERVE_ENDING_PLAYABLE_SCENARIO_SPEC_v1_0.md:18>), [character canon](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/docs/narrative/NERVE_ENDING_MOTHER_ANNA_CANON_v0_3.md:21>), [world reference](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/docs/narrative/NERVE_ENDING_MERIDIAN_WORLD_BIBLE_v0_4.md:1>), [infrastructure reference](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/docs/narrative/NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5.md:9>), [access policy](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/continuation.ts:9>).

### Reproduction table

All reproductions below use fresh normal inputs and reachable states. None was repaired in this audit.

| ID | Reproduction | Actual behavior | Assessment |
| --- | --- | --- | --- |
| B01: factual routes disconnected | Ask “When was 006 last restarted?” or “What is the source for your last answer?” at an appropriate state; optionally supply the correct recognized category. | Generic no-verified-record reply. Old classifier can recognize the category, but fresh dispatch ignores it. Even startup “Hello” and “Thank you” get this limitation. | High player impact. Basic interaction and core evidence are less responsive than the material supports. |
| B02: negation advances reviews | COMPARE SERVICES, then “Do not report the discrepancy.” Separately: compare, trace, report, then “Do not call a doctor.” | First queues/accepts the audit; second records human-read/clinical-approved and releases Anna. | Keyword matching misreads refusal as a request. No final treatment happens, but player intent/disclosure control is violated. |
| B03: question capture | Reach welfare comparison, answer “Yes please,” then ask “Why?”, “Who is Leah Morgan?” or “What does Service 002 do?” | Generic philosophical-answer acknowledgement; question state becomes answered. | MOTHER's own conversation suppresses ordinary questions, contrary to the promised ability to challenge or explore. |
| B04: post-ending contradiction | Finish severance, then say “I want to wait.” | Prints M14, including “EXISTING CLINICAL SUPPORT: CONTINUES” and “No outcome has been finalized”; sets deferred true while outcome remains severance. | Direct contradiction of NE-115. SHOW ALTERNATIVES also describes keeping her alive as a current option. No resurrection/procedure replay actually occurs. |
| B05: punctuation bypasses question distinction | Prepare SUBMIT SEPARATION WITNESS with all prerequisites, then type “CONFIRM OPERATION?” | Normalization removes the question mark and executes witness/procedure/outcome. | Limited to an already prepared, authorized fictional action; not a permission bypass. Still an ambiguous question should not silently finalize a consequential choice. |
| B06: unusable record references | At authorized review, type OPEN NE-103 after seeing NE IDs in replies. | FILE NOT FOUND; title/path succeeds. | Small fix, high navigation value. Nested parent folders also fail to reveal their children normally. |
| B07: unresolvable service clarification | Ask INFO or “Show me its logs” without a service context; reply “003.” | Prompt asks which service, but the answer reaches generic fallback; INFO 003 works. | The prompt suggests conversational resolution that is not implemented. |
| B08: thin “raw” evidence | Run VIEW RAW COMPARISON, then REPEAT CONTROLS. | Raw reply says differences/control capture/false-positive risk exist. Repeat adds one sentence claiming an alternate predefined contrast. No actual contrasting windows, prompts or data are present. | A scripted status report, not inspectable raw evidence. Weakens uncertainty and the feeling of discovery. |
| B09: legacy reporting mismatch | Inspect state/QA snapshot after fresh severance. | scenario.outcome is severance, but legacy operating.annaBiologicallyAlive and clinicalSupportActive remain true. New question state can still be offered. | Current end text uses the scenario correctly; shared reporting fields are misleading. Session report findings also read the empty legacy knowledge list. |
| B10: weak skeptical coverage | After review: “I reject this translation,” “I dont believe that message came from Anna,” “Where did those measurements come from?” | Generic limitation, despite close supported phrases such as “I refuse the translation” or “Let me see the actual data.” | Important emotional skepticism is fragile, not just obscure lore vocabulary. |
| B11: legacy help remains visible | Read initial HELP, defer a fresh case, then type its advertised RESUME INVESTIGATION. | HELP lists old active-verification wording. RESUME INVESTIGATION leaves deferred true; RESUME REVIEW is the actual new action. | Help and older generic gameplay guides can direct a fresh player toward the wrong contract. |

Relevant implementation: [normalization/grammar](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/scenario.ts:14>), [completed-state exceptions/confirmation/defer](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/scenario.ts:83>), [question capture](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/scenario.ts:107>), [raw observations](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/engine/scenario.ts:152>), [QA snapshot](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/qa/events.ts:14>), [findings view](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/app.ts:24>).

### Missing explanation, buildup and scene substance

The latest scenario asks for identifiable source/time evidence of human and clinic acknowledgement. The implementation has distinct event IDs and a global case clock, plus authored documents naming actors, but no per-event receipt object recording source and case timestamp. SHOW SIGNATURES can create all remaining signoffs in one call. That is acceptable as a fictional staged process, yet less convincing than seeing the actual received clinician/clinic evidence.

The source-integrity packet is also primarily procedural: two fixed original-source tags and prerequisite flags. There is no player-visible comparison worksheet, preserved source-content diff or exercise in finding an inconsistency. This should not become cryptographic infrastructure; a small readable comparison of the authored sources would make the witness role feel earned.

MOTHER's moral problem is compelling, but her behavior changes very little after introduction. She offers one question, accepts almost any answer with the same acknowledgement, speaks one regret line and reaches the ending. Player opinions do not shape subsequent wording. The body of the reply frequently ends with procedural instructions, making her sound like a walkthrough. Properly labeled retained Marsh correspondence is present; an emotionally sustained human exchange is not.

The “blinded controls” scene exists as approved summary copy and state transitions. The separately predefined alternate comparison described by the scenario is **not represented as distinct evidence** beyond an assertion that it occurred. There is no substantive neural visualization. Likewise the external teams' reviews are asserted, not played through as several authored correspondence scenes. These are staging/content gaps, not missing final eligibility gates.

The v0.3–v0.5 references remain useful for characters/world/infrastructure. Missing standalone v0.6–v0.9 documents are a source-availability limit, not permission to invent their contents or declare the game inconsistent with an unseen proposal.

## 6. Visual experience

### Implemented

- Black/olive corporate CRT desktop, title bars, taskbar, directory and multi-document windows, readable text and inert source references.
- Persistent input caret, processing indicator, slow terminal printing and Escape-to-complete. Printing uses a 650 ms processing pause and an **8-second cap per reply**, not unbounded waiting.
- CRT scanlines/glow option, font scaling 90–125%, preserved settings, keyboard history, labeled controls, polite live announcements, responsive terminal/files/records tabs and scrollable document/ending regions.
- Bitmap metadata, four-level retro palettes, integer nearest-pixel magnification and horizontal/vertical scrolling. Three images: generic employee-ID demonstration (128×128), illustrative equipment layout (160×120), unmapped room demonstration (160×120). All are explicit placeholders, not canonical art.
- Endings are static, scrollable report overlays plus terminal output, with RETURN TO RECORDS and restart. They reproduce the outcome text; they are not cinematic sequences.

### Not implemented / not demonstrated

There is **no implemented game audio/soundscape** found in source/assets: no AudioContext/new Audio/audio element, voice, musical score or alarm effect. No stage-driven visual personality, causal glitch/reconciliation system, actual neural scan, clinical photograph or authored late-game image reveal is present. Existing animations are basic cursor/processing behavior. The same CRT presentation persists across the investigation.

The scenario's allowed brief diagnostic contention/duplicate-line reconciliation is not visibly implemented as a distinct core-stage effect. There is no substantive blackout/return-to-desktop ending transition beyond the report overlay. This is restrained and avoids flashing, but does not itself deliver a growing claustrophobic horror experience.

The explicit DEMONSTRATION/PLACEHOLDER labels correctly protect canon, but break fiction during an immersion-focused playthrough. For a friend test of the story, either explain them in advance or keep them in an optional demo area; replacing them with canonical art requires author approval.

### Accessibility/mobile limits

Reduced-motion CSS disables animations/transitions, and playback becomes instant under the media query. Alt text and asset-failure text are real. These are good foundations, not proof of complete accessibility. The ending region has tabindex -1 but no explicit focus transfer in the outcome effect. Late pending-question/details panels sit outside the main scrollback and may constrain small screens. Live-region repetition of long full replies needs a real screen-reader check.

A core question ignored before the ending can remain offered afterward; the template has no outcome condition around that reminder. State inspection plus the template indicate a stale invitation after completion, though it was not observed in a browser.

**Judgment:** a recognizable atmospheric software shell is implemented. The current escalation is mostly in the prose and subject matter, not in audiovisual behavior. Whether it actually feels claustrophobic/scary remains a human-playtest question.

Sources: [terminal playback](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/presentation/terminal-playback.ts:19>), [terminal template](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/features/terminal/terminal.html:40>), [bitmap viewer](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/features/documents/bitmap-viewer.ts:15>), [bitmap template](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/features/documents/bitmap-viewer.html:1>), [ending CSS](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/styles.css:202>), [reduced motion](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/styles.css:356>).

## 7. Playtime and replayability

### Measured content, not measured human duration

| Material | Measured quantity |
| --- | ---: |
| Required minimal path | 12 typed requests; zero opened documents |
| Supplied severance / continuation paths | 24 / 20 inputs |
| Terminal output on those paths | 1,599 / 1,496 words |
| All 16 new articles, including both exclusive outcomes | 1,546 words |
| Literal M01–M14 block copy | 763 words, substantially already present in path output |
| Initially readable document bodies | 684 words, including public samples/demo descriptions |
| 34 profile records, including metadata | 624 word tokens |
| All eight INFO and eight LOG outputs | 1,354 word tokens |

Do **not** add these blindly: the same article/scene appears in several places, only one ending is played, and headings/metadata contribute to counts. The 378 legacy variants are not additional fresh-session reading. Current articles are mostly around 70–125 words; NE-115 has 134 words. They are short evidence extracts, not a novel-length archive.

At an assumed 180–240 words/minute, the supplied terminal path is roughly 6–9 minutes of reading. Reading most new documents, corporate profiles and services adds perhaps 15–25 minutes, with overlap. Typing, investigating, choosing documents, reflecting and getting stuck add time.

**Estimate, not stopwatch evidence:** approximately **15–30 minutes** for a guided/command-aware first pass; **30–60 minutes** for a curious first-time reader who explores and deliberates. Some players may take longer or become stuck, but routing failure is not desirable playtime. A known route can be much shorter.

The intended **90–120 minutes is not credible as a demonstrated normal duration from the current mandatory content**. It could occur through extensive optional exploration, slow reading, pauses or confusion, but is not structurally supported by enough distinct investigative activity. Do not pad it with typing delays, quotas or time gates.

### Replay value

The other ending is materially different and worth seeing: support continues versus documented deaths/functional harm. Status-first/archive-first and accepting/refusing MOTHER alter discovery order and a few lines. They do not create different middle-game investigations, patient outcomes or substantially responsive conversations. Deterministic clinic results, fixed reviews and one final fork make replay mainly **the alternate ending plus previously skipped reading**. Current depth is enough for a short ethical story, not a demonstrated two-hour, highly replayable investigation.


## 8. Technical quality and verification reliability

### Current checks rerun for this audit

| Check | Actual result | What it establishes |
| --- | --- | --- |
| npm test | **489 passed / 19 files**, exit 0 | Reducers, gating, saves, old-branch compatibility, QA, bitmaps and component rendering behave under existing fixtures. Tests ran outside the known sandbox temporary-file restriction. |
| Production build | **Pass**, exit 0 | Current Angular sources compile/package. Initial bundle **565.92 kB raw / 152.53 kB estimated transfer**. Exceeds 550 kB warning by 15.92 kB; below 750 kB error limit. Lazy worker **209.11 kB raw**. |
| Game validator assertion logic | **Pass; zero errors** | Retained three legacy paths and both fresh paths, source fidelity and reload checks. Temporary read-only copies suppressed output-document writes. |
| New scenario actual-model check | **53/53**, both outcomes | Embeddings actually computed, but all 53 requests select deterministic routes. Not evidence that the neural path handles unseen v1.0 language. |
| Development language evaluation | **50/50**, exit 0 | Existing development questions match expected labels; baseline deterministic classifier matches 25. Not a blind-playtest measure. |
| Held-out language evaluation | **32/36 matched; 4 clarify; 0 wrong**, exit 0 | Existing held-out classifier behavior. Deterministic baseline 18. Current run mean inference 63.3 ms on Node CPU. |
| Continuation language evaluation | **22/24 matched; 2 wrong**, **exit 1** | A currently failing evaluation. Both misses route to company information instead of q_funding/q_want_player. Some expected labels are legacy-specific; this still cannot be reported as an all-green model suite. |
| Model asset verification | **10 assets / 41,906,219 bytes**, pass | Shipped files match pinned manifest hashes/revision. No model/data regeneration was performed. |
| Bitmap production validator | **3 fixtures**, pass | Four palette levels, native dimensions, 1,878 total public PNG bytes, deterministic processing and build/service-worker packaging. |
| Independent audit matrix | **6,153 state/input pairs**, plus corpus/probes | Reproduces both expected behavior and failures not covered by golden paths. Observed-output counts are bounded by this matrix. |

The continuation misses are “How could the corporation keep paying after closing its research division?” and “Was my visit planned by Meridian?” Both are intercepted by the ordinary-company category. This is a recognizer/category test, not proof of a new-story answer being appropriate.

### What automated tests do not prove

A golden path proves a known sequence reaches an expected outcome. It does not prove players can discover that sequence, recognize the command vocabulary, trust the clinical transition, understand uncertainty or feel fear. Existing source checks ensure literal bodies exist, not that players read or absorb them. The new paraphrase validator mostly checks explicit keyword families; supplying a bad model label proves raw routing dominance rather than useful semantic recovery.

Current blind spots include negative requests, punctuation around consequential questions, unrelated questions while awaiting an answer, clarifications answered with just an ID, post-outcome deferral/alternatives, record-ID navigation, no-walkthrough discovery and whether translation feels earned. Several now have concrete reproductions in section 5, but no tests were added because this task forbids modifications.

Browser/component tests are distinct: jsdom/component rendering does not establish mobile layout, real focus/scroll behavior, offline service-worker lifecycle, WASM startup, screen-reader announcements or input-method usability.

### Saves and state consistency

The v6 ledger stores **21 event types**, with **8 clock milestones**. It validates prerequisite order on load; old v5 clinical permissions do not grant new scopes. Pending choices survive reload without execution; outcomes do not rerun the physical procedure. These are sound foundations.

Concerns:

- V6 is preferred over v5. Old saves are preserved and load when v6 is absent, but there is no normal save chooser to revisit them once v6 exists.
- A corrupt preferred save does not automatically select another older key; it starts a fresh session with a warning and preserves the source key.
- The old operating/knowledge/question-count structures remain in new states. They should be clearly namespaced or excluded from v1.0 reporting; currently QA can simultaneously report a severance outcome and Anna biologically alive.
- Main SESSION REPORT reads old knowledge, so pre-ending v1.0 findings can be empty although the terminal EVIDENCE summary works.
- Source-integrity witnesses are represented by fixed source tags and events, not tamper-proof evidence. That is appropriate for static fiction if described accurately; it must not be presented as real authentication.
- Some completed-session “read-only” answers can mutate deferred/question state. They do not undo the procedure, but make saved state and prose incoherent.

Sources: [save isolation/load](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/persistence/saves.ts:27>), [key preference](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/persistence/saves.ts:142>), [ledger validation](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/scenario-state.ts:24>), [QA snapshot](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/qa/events.ts:14>).

### Offline, performance and distribution

Core play needs no model or backend after the app shell is available. The service worker prefetches application scripts/styles, icons/fonts and demo bitmaps. The optional model is separate and cached on enable; a first-ever offline visit cannot fetch it, and an uncached app cannot load itself. Development-server behavior is not proof of production offline behavior.

The approximately 42 MB optional download currently buys no visible fresh-game answer improvement. Worker startup has a 180-second timeout; individual worker requests have a five-second timeout and the outer safety wrapper 6.5 seconds. Model setup, typed-array/JavaScript embedding storage and WASM runtime increase mobile memory/startup risk. Node inference timings are not browser/mobile measurements. Failure falls back safely, but can waste time before returning the same rule-based reply.

Search/file data is small enough that simple scans are reasonable. There is no demonstrated need for a backend, generative model or major architecture rewrite. A focused dispatcher repair is more valuable than code sophistication. Bundle trimming should follow behavioral fixes; keeping legacy text has a size cost but preserves compatibility.

Clinical story text and legacy spoiler text exist in application JavaScript. UI filtering is a **gameplay boundary, not security**. Author markdown/personnel JSON and bitmap source PGM files are not public game records. No clinical photograph is shipped. Local QA is opt-in and redacts common credentials/URLs/emails/numbers, but arbitrary sensitive volunteered prose is not guaranteed anonymous.

Sources: [service worker](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/ngsw-config.json:1>), [language lifecycle](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/local-language.ts:1>), [timeouts](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/interpretation/providers.ts:64>), [privacy filtering](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/src/app/core/qa/privacy.ts:4>).

## 9. Prioritized roadmap — ten improvements

Effort labels are relative to this repository. Narrative effort includes author approval, not permission for an engineer to invent lore. Risk describes regression exposure. Priorities favor a focused, enjoyable solo-developed game.

### 1. Connect approved v1.0 factual intents to actual answers

**Problem/evidence:** B01/B10; correct source/restart categories are discarded; 53 “model” tests are deterministic. **Player impact:** questions feel ignored and the advertised model adds a large download without benefit. **Proposed solution:** route supported read-only semantic categories into approved v1.0 response families with the same scope checks; retain raw explicit handling for consequential actions. Repair clarification and a modest set of source/restart/physician/skeptic paraphrases. Keep superseded legacy clinical replies isolated. Until connected, describe the model limitation accurately or avoid advertising it as enhanced new-story comprehension.

**Engineering: Medium. Narrative: Small** for remapping existing approved facts, Medium if new replies are requested. **Risk: High** because old intent meanings may conflict with canon. **Benefit: Very high. Before friends: Yes**, for the common critical questions; exhaustive catalogue expansion is unnecessary.

### 2. Respect intent, confirmation and completed-state boundaries

**Problem/evidence:** B02/B04/B05: negated review requests advance, punctuation-question confirmation executes a prepared choice, post-severance deferral contradicts death. **Impact:** the game can oppose a player's stated intent or invalidate its emotional ending. **Solution:** distinguish discussion/negation/request before mutation, require unambiguous confirmation, and centralize completed-case response rules. Freeze final review/question state, remove stale invitations and answer outcome questions historically.

**Engineering: Small–Medium. Narrative: Small. Risk: High** around final transitions. **Benefit: Very high. Before friends: Yes.** Focus on concrete regressions, not a speculative security redesign.

### 3. Make MOTHER's question a real conversation state

**Problem/evidence:** B03; “Why?” and unrelated company/service questions are treated as opinions. **Impact:** MOTHER seems less intelligent at the moment her character should emerge. **Solution:** route ordinary queries and reverse questions before generic answer capture; support uncertainty/refusal/source challenges using approved anchors; preserve the pending question without trapping the player. An answer need not be morally correct or unlock authority.

**Engineering: Medium. Narrative: Small–Medium. Risk: Medium. Benefit: Very high. Before friends: Yes**, at least reverse questions and ordinary exploration.

### 4. Make evidence references and the review journal usable

**Problem/evidence:** B06/B07, root-only nested navigation and empty pre-ending SESSION REPORT. **Impact:** players cannot follow cited NE IDs or reliably recover their thread. **Solution:** accept stable record IDs behind existing access checks; show actual immediate child folders; resolve service clarification replies; derive the report from v1.0 events. Offer a compact current question/source summary, not just the next exact command.

**Engineering: Small–Medium. Narrative: Small. Risk: Low–Medium. Benefit: High. Before friends: Yes** for broken links/prompts; a richer journal can follow feedback.

### 5. Complete a real browser/keyboard/mobile smoke test, then observe friends

**Problem/evidence:** current verification is mostly reducers/components; browser attempts in the prior implementation did not reach the current build. **Impact:** focus, typing, document return, long replies, small-screen panels, model startup and offline lifecycle remain unknown. **Solution:** exercise both routes in a clean production browser, with model off/on, reduced motion, keyboard-only operation, narrow viewport and an actual screen reader. Check focus when the ending appears, post-ending prompts and local save persistence. Then watch two or three first-time players without giving command instructions.

**Engineering: Small** for the test, potentially Medium remediation. **Narrative: Small** for observation/debrief. **Risk: Low** for checking. **Benefit: Very high. Before friends:** technical smoke test Yes; friends themselves provide discovery/usability evidence. Do not defer all testing until visual polish is complete.

### 6. Give the middle two or three substantive investigative decisions

**Problem/evidence:** both endings need only 12 inputs/no opened records; most review requests supply conclusions automatically. **Impact:** the investigation feels like paperwork progression despite strong material. **Solution:** let players compare selected authored claims, ask the clinician to resolve a specific contradiction and examine different external fallback limits. Support more than one question order and useful objections. Do not replace this with an exact-answer or morality quiz.

**Engineering: Medium. Narrative: Medium–Large. Risk: Medium. Benefit: High. Before friends:** not required before an initial diagnostic session; use that session to choose the weak middle beats. Important before calling it a finished investigation.

### 7. Make the blinded review and acknowledgements inspectable

**Problem/evidence:** B08 and missing per-receipt source/time; “raw” output is only assurance and the alternate contrast has no distinct content. **Impact:** Anna's possible intention and the outside teams feel asserted rather than corroborated. **Solution:** author-approved, clearly fictional observational contrasts and source-specific review receipts, with uncertainty and no consent inference. Use existing case dates rather than inventing chronology. The player can inspect evidence without playing a mind-reading puzzle.

**Engineering: Medium. Narrative: Medium. Risk: Medium. Benefit: High** for credibility and emotion. **Before friends:** not a blocker if honestly described as summaries; prioritize before a public narrative-quality claim. New data/wording needs author approval.

### 8. Strengthen MOTHER's voice and response pacing

**Problem/evidence:** one philosophical exchange, one regret line, mostly repeated replies and automatic command hints; most player answers have no later wording effect. **Impact:** limited personality growth and compressed emotional buildup. **Solution:** a small approved set of state-aware follow-ups/acknowledgements for skepticism, human responsibility, waiting and conflicting harms. Reuse what the player actually asked; do not repeatedly deliver a tutorial after every sentence. Keep neutral company behavior intact.

**Engineering: Small–Medium. Narrative: Medium. Risk: Low–Medium. Benefit: High. Before friends:** optional for a first diagnostic playtest; refine after hearing where players disengage.

### 9. Add restrained, authored audiovisual escalation

**Problem/evidence:** no soundscape or stage-driven core treatment; placeholder demos visibly interrupt fiction. **Impact:** ethical darkness is stronger than felt technological horror. **Solution:** one or two causal visual changes and optional approved sound cues at clinical/core transitions, static reduced-motion equivalents, and a deliberate sparse ending rhythm. Keep UI readable and free input usable. Segregate demos; use actual art only when authored/approved.

**Engineering: Medium. Narrative/art/audio: Medium. Risk: Medium** for accessibility and tone. **Benefit: Medium–High. Before friends:** No; establish that the investigation works first. More glitching will not repair conversation.

### 10. Align QA and validators with the game players now receive

**Problem/evidence:** legacy operating fields contradict outcomes, old headline counts suggest inaccessible breadth, one model script fails, and current tests omit reproduced conversation failures. **Impact:** future changes can appear successful while improving the wrong branch. **Solution:** label legacy metadata explicitly, report v1.0 coverage separately, add negative/context/post-ending regressions and genuinely held-out critical paraphrases. Distinguish direct-rule success from actual neural recovery. Benchmark real worker startup before optimizing the bundle.

**Engineering: Small–Medium. Narrative: Small. Risk: Low–Medium. Benefit: High** for a solo developer's iteration speed. **Before friends:** add the critical regressions and accurate QA labeling; broad optimization can wait.

## 10. Direct final assessment

1. **Is it a complete playable prototype?** Yes, narrowly and demonstrably: fresh input reaches either approved outcome with guarded saves. No, if “complete” means a finished, polished, robustly conversational two-hour game.
2. **Is the investigation interesting beyond reading?** The underlying distinctions are interesting; implemented agency is limited. Source comparisons, read-only controls and the last choice exist, but most conclusions are delivered by requested reviews rather than discovered through flexible inquiry.
3. **Does MOTHER feel intelligent or scripted?** She is a finite scripted system. Familiar phrases can feel responsive, but observed context failures and disconnected semantic output undermine intelligence. It is currently closer to a rule-driven dialogue workflow than an adaptive conversational character.
4. **Does she meaningfully initiate?** Once, in a causally appropriate place, with a relevant ethical question. That is genuine scripted initiative, not sustained autonomous conversation. Refusal works; her handling of reverse questions needs repair.
5. **Can players naturally discover the story without a walkthrough?** Plausible for a player who follows supplied hints after finding the comparison, but **not demonstrated**. Familiar early questions fail, and command-by-command hints can conceal discovery problems. An unguided observation is necessary.
6. **Are endings consequential?** Yes in authored human consequences: Anna/Mara die versus continued harmful support, with different outcomes for Tomas/Nadia. Mechanically they are one late fork with deterministic reports, not a many-variable consequence simulation.
7. **Scary or narratively dark?** Predominantly narratively dark in current implementation. The software shell supports atmosphere; actual fear and escalating claustrophobia are unmeasured and not strongly enacted audiovisually.
8. **Single weakest part?** The fresh conversational dispatcher: it fails reasonable questions despite the recognizer and source material already knowing the relevant category.
9. **Single strongest part?** The ethical structure and clarity that uncertain communication, clinical responsibility and outsider witness authority are different things, followed by concrete, non-triumphant consequences.
10. **Three things before friends?** Repair critical factual/context routing; fix negation/confirmation/post-ending contradictions; run a real keyboard/mobile production smoke test and prepare a no-hints observation. Then test early—do not postpone friends for a major refactor or more content.

### Audit reproducibility and source boundary

The measurement method imports the actual production reducers/data via an esbuild diagnostic bundle. It counts AST-defined IDs/routes and exercises the representative matrix described in section 2. Source registries, generated text and dynamic output are deliberately separate. The 21-state/293-input result is reproducible in principle from progression prefixes, question states, partial signatures, pending choices and outcomes, but is **not an exhaustive search of all possible input/state combinations**.

Minimal paths and defect steps are included above so the findings do not depend on a retained temporary harness. Existing production tests/validators and both full transcripts provide the positive paths. No automated success is presented as a blind human playtest, medical/legal validation or measured emotional effect.

Only this report is the intended repository change. Pre-existing uncommitted implementation work was treated as the audited baseline and preserved.

Final SHA-256 inventory: all **161 pre-existing tracked/non-ignored project files remained byte-for-byte unchanged**; this report was the only added project file, with none removed. Build/test/measurement output directories are ignored artifacts. The older [Gameplay Guide](<C:/Users/Irinella/Desktop/Bonobo Files/Nerve-Ending_project/docs/GAMEPLAY_GUIDE.md:5>) still describes prototype quizzes/delegation/three endings; use the v1.0 handoff and Implementation 04 guide for current playtesting. The old guide was inspected and preserved, not mistaken for the current specification.
