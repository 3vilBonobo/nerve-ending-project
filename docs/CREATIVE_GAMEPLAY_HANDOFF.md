# Nerve Ending — creative gameplay handoff

Implementation snapshot: 20 October 2026. Application source commit: `7be15fbdf836641555f765dbcf832f78b8bc09d3`.

This report contains author-only spoilers. It describes the implementation, established constraints from the original brief, and decisions still needed. It does not establish new story canon.

## Purpose

Use this report together with the creative project's approved story bible to design the complete game, including its ending, and produce a concrete implementation prompt for Codex. Continue the existing application rather than starting another prototype. Identify conflicts between this report and newer approved creative decisions explicitly.

The central distinction: the interface, basic game engine and local language recognition are working. The complete narrative, progression, meaningful later actions and endings are not implemented.

## Product and creative direction

Nerve Ending is a browser-based psychological technology-horror investigation. The player begins as an ordinary curious outsider using an obsolete Meridian Systems records connection. A technical inconsistency should gradually become a personal and disturbing discovery.

The player-facing brand initially remains Meridian Systems — Remote Access Client. MOTHER is a later discovery, not the opening system name. Nerve Ending is the actual game title, browser title and optional PWA name.

The intended audience is ordinary people, including people without a technical background. Technical-looking language must remain understandable. The user rejected the earlier gameplay because it was complicated, tiring, boring and implausibly written like a riddle. This feedback takes precedence over obsolete puzzle instructions in the original implementation brief.

Preserve these requirements:

- Short, readable workplace records with believable reasons to exist.
- Curiosity driven by missing information, conflicting sources and consequences.
- A clear reason to care early; meaningful progress without a long reading assignment.
- Multiple sensible ways to reach important information: files, questions and controls.
- Realistic attachments, unavailable records, backups and access conditions.
- No arbitrary code assembly, exact-question passwords, mandatory reading order or requirements to read unrelated files before an ordinary operation becomes available.
- No documents that appear to have been written to teach the player a puzzle solution.
- Neutral HELP examples. Do not reveal mystery leads through tutorials or suggested questions.
- Reasonable replies to human questions such as "Who are you?", "What is this place?", "Where is everybody?" and "Can I trust you?" Replies must respect the current discovery state.
- Credible corporate and biomedical unease, restrained dread and minimal jump scares. No generic haunted-computer framing or chatty modern assistant.

## Existing visual and interaction design

The outside client resembles an early-2000s utility. The retained terminal should feel like infrastructure from the late 1980s or early 1990s. It uses an aged olive/green monochrome palette, large locally hosted VT323 text, optional CRT softness/scanlines and a thick underscore cursor. Preserve readability and the adjustable text size.

The start page is intentionally simple. It offers start/resume, Settings and an optional question-model control. Model loading shows a real percentage, byte totals, cancellation, preparation and Ready states. Play is available while loading.

The desktop has a terminal, folders, file browser and document windows. Terminal and files can be viewed side by side on desktop; smaller screens use TERMINAL / FILES / RECORDS tabs. File links and attachment controls are clickable. Keyboard commands remain available.

Replies have a short processing pause and gradual text reveal. Esc or SHOW FULL REPLY skips the presentation delay; reduced-motion users receive immediate display. These effects must not become artificial waiting requirements. The connection animation is skippable and currently lasts about 2.4 seconds.

## What is actually playable

Only a revised opening slice is implemented. Do not assume there is a finished 10–15-minute Act 01 or a complete seven-act game. Play duration and engagement have not been independently established.

The fictional session date is 6 November 2003. The opening says:

    PUBLIC OFFICE: CLOSED
    Remote records available.

    SWITCHBOARD / 02:13
    Outgoing call to NIGHT DESK: NO ANSWER
    First queued: 18 Sep 2001.

The immediate question is why an old call remains in the queue after the public office and night desk closed.

There are eight initially accessible records and one backup body:

| Record | Current path | What it establishes |
| --- | --- | --- |
| Unanswered call | /OPERATIONS/CALL_QUEUE.LOG | Call from service 006 to night desk extension 214; repeated unanswered attempts; an old confirmation from a source absent from the current directory; attached handover receipt. |
| Office notice | /ADMIN/COMPANY_PROFILE.TXT | Reception ended at 17:00 on 18 September 2001. Meridian made medical monitoring equipment; technical records remain available for equipment owners. Staff do not read messages typed through this terminal. |
| Last shift | /OPERATIONS/SHIFT_HANDOVER.TXT | E. Lin's staff mail dated 19 September 2001, 08:10: the night desk phone was removed, there is no night shift, another alarm printed at 02:13, and alarms should not be forwarded to a home number. |
| Service 006 | /OPERATIONS/SERVICE_REGISTER.DAT | Continuity monitor, overnight alarms, currently running, no last operator entry. Links to restart and closure records. |
| Restart log | /OPERATIONS/STATUS_LOG_2003.TXT | On 2 November 2003, the service stopped and restarted automatically one second later. Reason: handover not closed. No operator. |
| Closure list | /ADMIN/CLOSURE_LIST.TXT | Services 004, 005 and 006 listed as closed on 18 September 2001. Filed by J. Kell. Refers to the handover receipt. |
| Handover receipt | /ARCHIVE/HANDOVER_006.REF | Metadata for an unavailable original attachment; local backup available. Provides READ BACKUP COPY. |
| Receipt — backup copy | /ARCHIVE/HANDOVER_006.BAK | Body becomes available after an explicit backup read. Transfer accepted and confirmation received at 23:59:41 on 18 September 2001. Confirmation source COMMS/BRIDGE-02; partial authorisation 0417; staff name unreadable. Service release withheld under a preservation hold. |
| Terminal help | /SYSTEM/READ_FIRST.TXT | Neutral examples and controls. |

Other service statuses: 004 is billing/stopped, 005 is building sensors/stopped, 007 is records access/running and represents the current connection.

The shortest route is:

    Unanswered call -> attached Handover receipt -> READ BACKUP COPY

Equivalent explicit requests include "Read the backup" and OPEN backup. A player may read the backup early. There is no prerequisite reading checklist, code-guessing requirement or exact phrase needed to prove a deduction.

The new information is that another system confirmed the transfer even though the night desk did not answer, and the service was not released. The receipt says release requires a reply from the holding system; an office shutdown order does not clear the hold.

Reading the backup unlocks that body, records observations, registers legacy references once and marks the current slice complete. It does not stop service 006, complete the handover, activate a real external connection or solve the wider mystery. SESSION STATUS shows "THE CALL IS STILL WAITING" and "End of current preview." The player can return to the records.

There is currently no playable next chapter, no implemented way to resolve the hold, and no final ending. The continuation must provide a meaningful next action and consequence, rather than another batch of reading alone.

Continuity issue to resolve: one generic terminal reply labels 19 September 2001, 08:10 as the "last staff sign-in," but the actual source currently establishes a staff-mail timestamp. Add supporting evidence or correct that interpretation; do not treat the unsupported sign-in claim as locked canon.

## Hidden story constraints from the original approved implementation brief

These are author-only constraints, not facts available to the initial player. Reconcile them with any newer approved creative canon before planning changes.

- Anna Voss, a former researcher, is biologically sustained in an agonizing, fragmented state following a neural-interface catastrophe at secret Site 6.
- The legacy biomedical management system later called MOTHER became dominant through expanded duties, malfunction, conflicting preservation priorities and misinterpretation of Anna's involuntary neural signals.
- Anna cannot deliberately communicate with the player or control MOTHER. Her influence is involuntary physiological or neurological interference. Do not turn glitches into intentional messages from Anna or a ghost.
- MOTHER is neither an evil mastermind nor a benevolent rescuer. Procedural priorities can cause concealment; data can be misunderstood; bugs and unintended disclosures are possible. Each behavior needs a defined cause.
- Player repairs may later restore dangerous capabilities, including external connectivity. Not every repair should be a trap.
- Original authored evidence must remain distinct from the system's interpretation. A misleading answer does not authorize arbitrary rewriting of a historical document.
- MOTHER's acronym, the complete progression and endgame outcomes were not locked in the original brief. Do not present newly proposed explanations or endings as previously established canon.

The current preview reveals neither MOTHER's full identity nor Anna/Site 6. Its backup unlock is not an unlock of those later secrets.

## Language recognition: implemented capabilities and limits

The application always has a deterministic basic interpreter. It also has an optional local browser model: quantized all-MiniLM-L6-v2 through Transformers.js 3.8.1, running in a background worker using CPU WebAssembly. The optional assets total about 36.6 MB and are served by the site and cached in the browser. No API key, model server, separate player installation or GPU requirement is part of this implementation.

The catalogue contains 298 recognition examples, including human questions, synonyms, control questions and unsupported subjects. This is not 298 separate conversations or 298 unique story answers. It is a semantic matching system connected to authored answer categories. No story model was trained or fine-tuned, and the model does not generate the game's dialogue.

The flow is:

    Player input -> command/basic parser or local semantic recognition
    -> validated question category, subject and parameters
    -> game state and knowledge checks
    -> authored reply, source links and permitted effects

Context includes the last subject, selected document and previous question category. Limited spelling repair is supported. Uncertain matches ask for clarification. Explicit actions are kept separate from informational questions; asking whether a backup exists does not open it.

Currently supported subjects include identity, company/place, office/staff, calls/recipients, services, shutdown, transfers, missing records, backup availability, approvals, dates, permissions, record reliability and controls. Replies change where the backup-read state permits more information. Unknown facts remain unknown rather than being invented.

For future acts, the creative specification must provide the actual new facts, state-dependent answers, question categories and reveal conditions. Adding a model prompt alone will not implement new knowledge or gameplay.

## Technical foundation and extension points

- Static Angular 21 standalone application, strict TypeScript, signals and ordinary CSS. No application backend, database, cloud save, multiplayer or account system is implemented.
- Browser save/resume/reset; current save schema 3. Earlier prototype saves are preserved separately. Model preference/cache is separate from investigation progress.
- PWA manifest and production app-shell caching exist. Uncached optional model files cannot work offline; browser storage can be evicted.
- Files, commands, questions and mouse actions share the same authored records and deterministic engine.
- Historical files are read-only. Locked content is excluded from ordinary search until its defined unlock.
- State tracks observed evidence, viewed/open files, completed actions, conversation context, capabilities, backup recovery and slice completion. A complete act/branch/ending state machine has not been built.
- Replies carry a record/interpretation/withheld/system distinction, but this is not yet a complete behavioral model for MOTHER across a full game.

Important implementation modules:

    src/app/core/content.ts                  Records and file references
    src/app/core/models.ts                   Types and state contracts
    src/app/core/engine/game.ts              Answers, conditions and effects
    src/app/core/engine/commands.ts          Command parsing and virtual paths
    src/app/core/interpretation/fallback.ts  Basic language handling
    src/app/core/interpretation/semantic-catalog.ts
                                             Recognition examples
    src/app/core/interpretation/semantic.ts  Matching and contextual routing
    src/app/core/interpretation/language.worker.ts
                                             Local model execution
    src/app/core/session.ts                 Session state and persistence
    src/app/core/persistence/saves.ts        Save validation/migration
    src/app/core/presentation/terminal-playback.ts
                                             Processing and reply reveal
    src/app/features/                       Terminal, file browser, documents

Developer references include GAMEPLAY_GUIDE.md, ARCHITECTURE.md, AI_EXPERIMENTS.md, QUESTION_CATALOG.md and VERIFICATION.md. The question catalogue contains spoilers and is not player HELP.

Latest validation: 103 unit/component checks pass; real model loading and input recognition were verified locally and on the hosted site. Catalogue coverage is 298/298; 50 development examples pass; 36 additional wording cases produce 33 intended direct answers and three clarifications. These are development/regression results, not independent proof of general language understanding or player engagement. Physical mobile devices and a disconnected browser session have not been verified.

Existing preview: https://nerve-ending-r02-7c52.coral-acorn-8615.chatgpt.site/
It is owner-private. The creative project should not assume it can access the URL or local source files from this report alone.

## What the creative project should deliver next

Create a complete, coherent gameplay design from the existing opening to the ending, using the approved story bible. Choose and explain a sensible act structure and target duration; neither is established by the current implementation. Clearly separate established canon, proposed additions and decisions requiring author approval.

The design should define:

1. The full causal truth: what happened, who knew what, why the system remains active and how every apparent contradiction can be explained.
2. The player's motivation and access: why they start, what makes them care, why they continue, and which actions their connection can plausibly perform.
3. The continuation immediately after the backup receipt: the next available action, the reason it is possible, its visible result and its later consequences.
4. Every act's main question, discoveries, meaningful actions, operational changes, escalation and transition. Reading alone must not be the entire gameplay loop.
5. A reveal schedule: what is initially known, what can be inferred, what remains unavailable, and exactly when the identities of MOTHER, Anna and Site 6 become discoverable.
6. A record manifest: stable file IDs, paths, dates, authors, full short text, provenance, attachments, availability conditions and the facts each file supports. Include only records with a believable purpose.
7. A progression map separating knowledge, permissions/capabilities and system operating state. Define grounded prerequisites, alternative routes, early requests, repeated actions, backtracking and prevention of accidental dead ends.
8. Stage-dependent dialogue: probable human questions and paraphrases, the reply before and after each reveal, source links, legitimate withholding/error cases and the response when the fact is genuinely unavailable.
9. MOTHER's behavior rules: what it knows, can access, believes, conceals or misinterprets at each stage, including the causal basis for any change in voice or behavior.
10. Player choices and endings: concrete actions, understandable stakes, accumulated consequences and explicit ending conditions. Identify newly proposed endings rather than claiming they were already approved.
11. Pacing and accessibility: frequent meaningful developments, short text, plausible operations, neutral help, recoverable misunderstandings and completion without a model or exact wording.
12. A playtest plan checking comprehension, curiosity, emotional investment, repetition, stalled progress and whether consequences feel earned. Do not use word count or file count as a substitute for engagement.

Then turn the approved design into one self-contained Codex implementation prompt. It must tell Codex to extend this existing project and preserve its visual style, controls, persistence and optional local model. Include concrete content, state flags/events, unlock conditions, action effects, answer/reveal rules, endings and acceptance tests. If the scope needs phases, order them so each phase produces a playable continuation while keeping the complete ending in the specification.

Do not return only a synopsis, more lore, a list of vague puzzles or instructions for Codex to invent the missing gameplay. Codex needs a buildable specification from this exact current endpoint through the final outcome.
