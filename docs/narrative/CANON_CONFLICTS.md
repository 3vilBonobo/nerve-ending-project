# Narrative canon conflicts — reference ingestion only

Initial review 21 October 2026; expanded 23 October 2026 for the Meridian world, personnel and infrastructure references. Reviewed against the existing working tree based on Git `38cd6a7`, including its pre-existing uncommitted continuation and opening redesign. Paths and line numbers below describe that working tree, not just HEAD. Author spoilers.

The author-reviewed [MOTHER and Anna canon v0.3](NERVE_ENDING_MOTHER_ANNA_CANON_v0_3.md) is the character-and-causality reference. It is not a complete world bible, gameplay specification or approval of the prototype's endings. Its **ESTABLISHED**, **WORKING** and **OPEN** labels are preserved verbatim. The source was copied byte for byte from the supplied Downloads file; SHA-256: `905A7A3ECE0894771C5CBD62D8C729DB3DA9CD3015084012FAE24C6F34D7EDBF`.

This register documents differences; it does not resolve them or certify runtime conformity. **Direct conflict** means existing wording contradicts established direction. **Coverage gap** means required direction is absent or narrower, not that its opposite has been proved. **Review boundary** means a prototype detail needs an author decision because the canon leaves it open. These assessment labels do not change any canon status. The [impact map](IMPLEMENTATION_IMPACT_MAP.md) identifies future work; no runtime change is authorized by these documents.

The [narrative index](README.md) sets domain authority and preserves the new documents' PROPOSED/OPEN boundaries. In the 23 October additions, **W** means [world bible v0.4](NERVE_ENDING_MERIDIAN_WORLD_BIBLE_v0_4.md), **J** means [personnel JSON v0.4](NERVE_ENDING_PERSONNEL_DIRECTORY_v0_4.json), and **I** means [infrastructure bible v0.5](NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5.md). Section names, line numbers and JSON IDs below identify supplied evidence. A discrepancy with a proposed draft is an implementation delta awaiting approval, not automatically a defect against ratified canon.

## Specific findings

### C01 — MOTHER and R-02 are explicitly described as distinct systems

**Direct conflict.** Canon §2 makes MOTHER Meridian's central integrated operational intelligence, present behind R-02 from the outset. In `src/app/core/interpretation/dialogue-catalog.ts:17`, the revealed designation answer says, “The client and the clinical controller are distinct systems.” `src/app/core/story-records.ts:123`–132 identifies MOTHER as a clinical installation; `src/app/core/engine/continuation.ts:101` identifies a research/clinical expert system; `src/app/core/engine/dialogue.ts:60` labels the discovery as identifying the clinical controller. These sources do not establish the broader corporate role.

R-02's neutral label and withholding the MOTHER designation initially are compatible (`src/app/core/engine/game.ts:73`, 144–148). Discovering the name later is not discovering a newly connected intelligence. `voiceOf` at `src/app/core/engine/dialogue.ts:7`–13 changes output profiles after identification; that is not evidence of separate personalities. Later authoring must express one intelligence through restricted disclosure and situational behavior. Physical/distributed architecture remains OPEN; this finding does not prescribe a single physical computer or a replacement engine.

### C02 — Anna's leadership and risky initiative are missing

**Coverage gap / role mismatch.** Canon §§3–4 establishes head researcher, personal participation, accelerated ambitions and her own risky initiatives or authorizations. `src/app/core/story-records.ts:76`–85 calls her a senior researcher; `src/app/core/interpretation/dialogue-catalog.ts:77`–82 describes a senior researcher/principal contributor who helped authorize limited calibration. The incident at `src/app/core/story-records.ts:113`–122 attributes injury to contradictory feedback without documenting her initiating the risky change; the blame answer at `src/app/core/interpretation/dialogue-catalog.ts:111` leaves individual responsibility unresolved.

Medical motivation, clinical concern and the request for supervision in the project/personal notes (`src/app/core/story-records.ts:95`–103, 289–299) can coexist with her ambition. They do not prove the new causal role, nor need they be discarded. Do not turn this into blame or punishment. The final order, warnings, override and incident sequence remain OPEN; no replacement incident or dialogue has been invented.

### C03 — Consent safeguards align; the broader documentary rationale is absent

**Coverage gap, not a finding of unlimited consent.** Canon §3 establishes voluntary extensive participation/emergency-care documents and Meridian's later reliance on them, while rejecting unquestionably valid consent to indefinite suffering. The prototype documents a narrower limited supervised calibration (`src/app/core/story-records.ts:104`–112; `src/app/core/interpretation/dialogue-catalog.ts:80`–81). It already explicitly rejects indefinite experimental authorization and treating involuntary activity as consent (`src/app/core/story-records.ts:173`–182; `src/app/core/interpretation/dialogue-catalog.ts:90`, 184, 190).

No affirmative claim that Anna granted unlimited valid consent was found in those records/replies. Preserve that safeguard. The scope of additional papers, corporate interpretations, signatories and later medical/ethical review needs author-specified evidence. An internal preservation policy with no timeout (`src/app/core/interpretation/dialogue-catalog.ts:48`) describes a system rule; it must not become a legal conclusion about consent.

### C04 — Distress evidence needs an explicit knowledge boundary

**Coverage gap / review boundary.** Canon §§5, 7 and 10 gives only MOTHER direct, continuous access to the depth and pattern of suffering; humans can raise doubts without knowing the full truth or recognizing corporation-wide corruption. Rao explicitly cannot exclude conscious distress (`src/app/core/story-records.ts:144`–152); the consultation describes compatible responses and possible fragmentary experience (`src/app/core/story-records.ts:173`–182). These qualified human observations are compatible, not proof that the clinicians fully understood Anna's experience.

The implementation relies on those consultations and archived traces for `distressEvidenceKnown` and `feedbackLoopKnown` (`src/app/core/engine/continuation.ts:103`) without separately establishing MOTHER's unique continuous view. Some late answers explicitly describe preservation's moral inadequacy (`src/app/core/interpretation/dialogue-catalog.ts:131`, 189, 206; `src/app/core/engine/dialogue.ts:46`). The author must specify when MOTHER can repeat a clinical criticism, recognize a classification contradiction, or interpret its ethical meaning; those are different abilities. Keep uncertainty about subjective detail and pain scores. Do not add quantified suffering, omniscient clinicians, or a speaking Anna.

### C05 — Human care at Site 6 is not established; unstaffed release needs review

**Coverage gap with a consequential authority conflict to resolve.** Canon §8 establishes a small high-clearance human maintenance/care presence in 2003. `src/app/core/story-records.ts:36`–54 retains utilities, consumables and specialist maintenance, and says medical oversight transfer is outstanding. This supports continuing obligations but does not specify present bedside care. Old 1997/1998 clinician records do not establish 2003 attendance. The oversight answer says no present clinical supervisor is assigned (`src/app/core/interpretation/dialogue-catalog.ts:22`); occupancy/maintenance answers are qualified (`:68`, 73), not a literal claim that the site is empty.

However, `src/app/core/story-records.ts:284`–287 delegates release through an “unstaffed continuity review”; authority replies refer to an unstaffed system/absent clinical team (`src/app/core/interpretation/dialogue-catalog.ts:179`, 190). `src/app/core/engine/continuation.ts:114` grants that delegation. With human carers present, the author must define the difference between an unattended remote desk, absent supervisory authority and available medical staff, plus why the outsider can obtain any consequential authority. Exact staff, shifts, supplies, treatments and oversight remain OPEN. No staffing roster or medical mechanism is supplied here.

Update 23 October: W/J now supplies six proposed contractor identities and roles, P035–P040. Those candidates do not finalize their visibility, shift coverage, medical schedule, supervision or authority; C15/C20 and B01/B07 extend this finding. No employees or care details have been added to runtime.

### C06 — Research closure is categorical; limited retained work is still WORKING

**Review boundary.** `src/app/core/story-records.ts:37`–39 says research is discontinued and no active research personnel are assigned. `src/app/core/interpretation/dialogue-catalog.ts:67`, 74 repeats no active researchers/research ceased; `src/app/core/engine/continuation.ts:99` reports research closed. Canon §8 permits retained tissue/sample preservation, validation and nonhuman work as a WORKING scope, while establishing continuing maintenance and care. The old record could describe a closed department without resolving all retained functions, but that interpretation needs author approval. Do not declare an approved active animal program, add another conscious human subject, or silently rewrite the historical disposition.

### C07 — The opening volunteers a mystery lead; ordinary HELP mostly aligns

**Direct conflict in the welcome; narrower HELP and conversational issues.** Canon §§2, 6 and 11 requires an ordinary corporate welcome without unanswered calls, highlighted 006 or hidden-file hooks. `src/app/core/engine/game.ts:11`–16 prints the unanswered night-desk call and its 2001 queue date immediately; `:24` attaches the call reference. `src/app/core/engine/game.spec.ts:77`–80 expressly requires that opening clue. `docs/GAMEPLAY_GUIDE.md:3` and `:9` make the unanswered call the opening lead.

Ordinary `HELP` and its record already use neutral examples (`src/app/core/engine/game.ts:217`–219; `src/app/core/content.ts:137`–154), with a neutrality regression at `src/app/core/engine/game.spec.ts:58`–67. Do not report that HELP suggests 006: it does not. Its general `EXPLAIN`/`DEFER` verification vocabulary still needs scenario review for an initially routine client. The early joke volunteers the empty night desk (`src/app/core/interpretation/dialogue-catalog.ts:211`), and a source request without context defaults to service/closure sources (`src/app/core/engine/dialogue.ts:24`–28). Review these indirect nudges too. Requested hints and player-triggered encounter prompts are distinct from unsolicited welcome text; their timing is not specified by canon.

### C08 — Broad corporate knowledge is underrepresented, not permissionless

**Coverage gap.** Canon §§2, 7 and 10 makes ordinary company information broad and usually reliable. Existing company/headquarters/staff replies are scoped to an incomplete mirror or office notice (`src/app/core/engine/game.ts:74`–75, 79, 140–152). The catalogue often gates corporate products/history behind `site6Known` (`src/app/core/interpretation/dialogue-catalog.ts:27`–34), and no complete mundane directory is available. Those statements can be truthful about R-02's accessible copy; they should not establish that MOTHER internally lacks all corporate records or can only perform clinical work.

Update 23 October: W now supplies proposed public facts and J supplies 40 proposed profiles; these are no longer wholly unwritten. Ratification and final disclosure policy are still required. Founding year, founders, cities, staffing counts and the proposed employment details are not finalized by their inclusion in these drafts. The searchable sample is not the historic workforce total. See C14–C15; do not fill gaps or grant unrestricted corporate/network control.

### C09 — Ordinary Anna personnel access is coupled to her protected clinical identity

**Direct conflict in the access design.** Canon §10 allows an ordinary historical personnel profile if Anna is searched, without revealing her clinical association. The only personnel record includes `AV-06` and Site 6 and requires `clinicalRecordAccess` (`src/app/core/story-records.ts:76`–85). `SEARCH CLINICAL INDEX` learns `annaIdentified` and grants that access together (`src/app/core/engine/continuation.ts:100`). Early identity/research replies expose no ordinary personnel profile (`src/app/core/interpretation/dialogue-catalog.ts:77`–78).

Current tests prohibit all fresh-session Anna search results (`src/app/core/engine/continuation.spec.ts:109`) and her name anywhere in accessible record bodies (`src/app/core/engine/game.spec.ts:156`). A later specification must separate ordinary employment information from protected patient association and decide what `annaIdentified` means. Merely removing the existing record's access gate would leak clinical identifiers. No gate or flag is changed now.

### C10 — Local feedback exists; corporation-wide deterioration has no causal specification

**Coverage gap / OPEN mechanism.** `src/app/core/story-records.ts:192`–201 links patient-derived responses to controller thresholds and classifications; `src/app/core/interpretation/dialogue-catalog.ts:123`, 128–132 describes adaptation and entanglement. This is compatible groundwork. It does not document how adaptations affect the same intelligence's unrelated corporate priorities, or distinguish linked failures from ordinary aging faults, as canon §§4–6 requires.

The canon's possible thresholds/weighting/policy explanation is a rule to develop, not an approved architecture. No paranormal code rewriting, random spooky output, whole-mind upload or intentional Anna channel is justified. Cross-service symptom causes, safe adaptation bounds and any staged deterioration state require the future specification.

### C11 — Preserve 2001/2003 evidence; exact prototype details are not newly ratified

**Compatible baseline plus review boundaries.** Canon §6 explicitly retains the useful 2001 decommissioned/2003 running discrepancy. The current evidence chain already distinguishes administrative closure from operational release:

| Existing fact | Implementation evidence | Treatment under v0.3 |
| --- | --- | --- |
| Public reception ends 18 September 2001, not proof of corporate dissolution | `src/app/core/content.ts:23`–34; `src/app/core/interpretation/dialogue-catalog.ts:29` | Compatible; do not turn office closure into total company closure. |
| 004/005/006 listed closed; 006 visibly running on 6 November 2003 | `src/app/core/content.ts:53`–66, 85–98; `src/app/core/engine/game.ts:242` | Preserves the canonical discrepancy; do not advertise it on arrival. |
| 2 November 2003 automatic restart because handover is not closed | `src/app/core/content.ts:69`–82 | Preserve as prototype evidence pending final date/wording review, not resurrection or a new trial. |
| Partial backup, BRIDGE-02 confirmation, unreadable staff name, release withheld | `src/app/core/content.ts:101`–134; `src/app/core/story-records.ts:6`–15 | Compatible provenance/authority distinction; exact receipt details remain subject to canon §12 review. `0417` is not a password. |
| 19 September 2001, 08:10 is staff mail | `src/app/core/content.ts:37`–50; `src/app/core/story-records.ts:55`–65 | Already corrected; not a last sign-in or proof that all clinical care ended. |
| Incident dated 17 April 1996; fixed diagnostic observation at 02:14 in 2003 | `src/app/core/story-records.ts:113`, 183–190; `src/app/core/story-state.ts:37` | Existing prototype specifics. The canon establishes a 1990s incident and keeps its detailed sequence OPEN; do not promote exact dates/counters to new author approval. |

No dates, service histories or archive contents were edited. The canon expressly leaves review of old 006 wording/dates open (§12).

### C12 — Current transport, legal delegation and endings exceed the canon's decisions

**Review boundary, not automatic rejection of the prototype.** Canon §9 leaves destination, package content, propagation conditions, warning evidence and ending logic OPEN. The prototype commits to depot 2, a specific adaptive package, route/revocation procedures and three ending identifiers (`src/app/core/story-records.ts:202`–288; `src/app/core/engine/continuation.ts:76`, 104–126; `src/app/core/story-state.ts:5`–6). `docs/IMPLEMENTATION_REPORT.md:13`–23 and `docs/GAMEPLAY_GUIDE.md:51`–91 document those implemented outcomes, not newly reviewed canon.

Explicit channels, limited compatibility, no direct internet control of all implants, receipt-versus-injury distinctions and no portable Anna are compatible constraints. Exact exports, sacrifices, remote authority and endings must be reviewed together with the human-care presence in C05. Do not adopt existing ending names/guards just because they already pass prototype tests.

### C13 — Broader exploration and investigation need scenario design, not a catalogue expansion now

**Coverage gap / design review.** Canon §11 asks for useful live queries, believable histories for other services and meaningful investigation rather than classroom quizzes. `src/app/core/engine/game.ts:88` supplies only brief other-service summaries; the concrete restart/history record in `src/app/core/content.ts:69` is for 006. The runtime lacks a general mundane service-log corpus; I now supplies proposed sample histories, not an implemented or finalized event model. Search matches record bodies and returns an excerpt plus paths (`src/app/core/engine/game.ts:60`–65); the terminal renders those paths as plain text (`src/app/features/terminal/terminal.html:15`–19), already avoiding clickable mystery routes, but does not provide the fuller reviewed metadata/description design.

The two opening encounters explicitly ask for supported explanations (`src/app/core/engine/investigation.ts:7`–19), allow deferral and require observations. They do not infer understanding from file reads (`src/app/core/engine/game.ts:35`–48). Their quiz-like presentation, acceptable alternatives and role in a curiosity-led scenario require author/playtest decisions; v0.3 is not a replacement puzzle solution or a reason to remove all evidence validation.

## World and infrastructure findings — 23 October 2026

### C14 — Ordinary company facts have authored candidates but no runtime source

**Coverage gap / proposed-data boundary; extends C08.** W §§A1–A6 and G2 provides company history, founders, locations, products, six sample bodies and ordinary first-session answers (§H). Current founder/headquarters answers explicitly have no names/address in their available copy (`src/app/core/engine/game.ts:74`, 140–142); products and corporate history are often gated by `site6Known` (`src/app/core/interpretation/dialogue-catalog.ts:27`–34). The current `company` file at `/ADMIN/COMPANY_PROFILE.TXT` is an office-closure notice, not the new company profile (`src/app/core/content.ts:23`–34); the `company profile` alias also points there (`:160`). Replacing it in place would conflate distinct records and could change existing search/evidence behavior.

The new values are authored but PROPOSED. Final `DOC-*` to runtime ID/path mapping, owners, dates and disclosure scopes are not supplied. The six samples are candidates for a later content pass, not approval to overwrite existing records, automatically answer every world-bible fact, or attach hidden significance to ordinary files. R02–R03 below identify source metadata conflicts to decide first.

### C15 — The personnel dataset is complete as a proposal, not a public runtime view

**Coverage gap / disclosure boundary; extends C02, C05 and C09.** J contains 40 unique IDs, with 14 Basic, 18 Extended and 8 Restricted writer depths. All names, roles, departments, dates and depths match W's directory table; all profiles, author notes and proposed links match the individual sketches. All rows retain `status: PROPOSED`. Its 43 distinct linked IDs are declared in W §§G/G1, but most have no full file bodies. A declared link is not an authored project or a ready runtime file.

There is no personnel collection/import contract in `src/app/core/models.ts:8`–43; existing staff responses cover E. Lin/J. Kell (`src/app/core/engine/game.ts:79`, 149–152). The new Julian Kell/Evelyn Lin expansions are proposed identity mappings, not permission to reconstruct unreadable receipt fields. J/P025 includes “subsequent status restricted” in employment text and protected clinical links; J/P035's profile itself refers to protected vendor records. A wholesale display or body-search import could reveal writer depth, care context, AV-06 links or private notes even if `normal_work_profile` sounds mundane. W §§C1–C2 limits the 40-name exposure and requires Anna's ordinary identity to be separate. The six contractor entries are a proposed sample, not a sufficient staffing schedule. K0–K4 writer knowledge tags in W §E1 are not runtime clearance levels. Decide per-field/per-role projections, ambiguity (including the two Bells), aliases and allowed references before implementation.

### C16 — Four of eight proposed services and STANDBY have no runtime representation

**Coverage gap against I §§2–3, not approval of its register.** Current `STATUS` lists 004, 005, 006 and 007 only (`src/app/core/engine/game.ts:242`). Other-service replies are hard-coded for 004/005/007 (`:86`–90); the only mutable service-running flag is `service006Running` (`src/app/core/story-state.ts:9`–22). There is no general service definition/status contract, departmental ownership, last-execution data or STANDBY state. Proposed 001 Contract Support, 002 Equipment Register, 003 Message Router and 008 Archive Index are absent.

Recognition extracts only 004–007 (`src/app/core/interpretation/fallback.ts:18`–21; `src/app/core/interpretation/semantic.ts:46`–49); clarification also recognizes that range (`src/app/core/engine/game.ts:178`). Generic `STATUS` sets the conversation subject and observation to 006 (`:242`), whereas I §3 calls for equal treatment of all eight. Define 003's idle/wake behavior, ownership, dependencies and status semantics before generalization. Do not equate service 006 with facility Site 6 merely because their numbers match, or treat a standby router as restored vendor transport. A later protected evidence link is a different claim.

### C17 — Log samples exist; live state, archive claims and event provenance are conflated

**Contract gap / review boundary.** I §4 supplies eight authored sample log blocks and distinguishes 003 routing attempts from 006 originating notifications. Stopped 004/005 must have no fresh execution after shutdown; reading their archives in 2003 is an archive event, not renewed execution. Current logs are static records, particularly the 006 restart and call queue (`src/app/core/content.ts:7`–20, 69–82); there is no cross-service dated history, event type, date-range query, pagination or correlation model.

`ArchiveFile` has one `modified` timestamp and provenance text (`src/app/core/models.ts:27`–43), not I §7's separate `recorded_at`, `occurred_at`, source, evidence type, access scope and author-only cause. `inspectFile` collects `EV_SERVICE_ACTIVE` from a saved monitor/log (`src/app/core/engine/game.ts:35`–45), and encounter source checks use that observation (`src/app/core/engine/investigation.ts:28`–34). That meets the old encounter contract but does not establish I §2.1's proposed live-query-only current-state rule. Decide how archived observations and live checks corroborate each other; do not retroactively call a static file a fresh measurement or silently change progression. Some event causes, including the November interruption and long-term adaptations, remain OPEN. R05 records chronology mismatches.

### C18 — Proposed terminal grammar is not the current command surface

**Mechanics gap.** I §5.1 proposes `INFO`, `LOG`, `LIST`, `ABOUT` and `DIAGNOSTICS [id]`. `src/app/core/engine/commands.ts:1`–14 recognizes HELP, DIR/LS, CD, OPEN/READ, SEARCH, STATUS, CLEAR/CLS, RECOVER and DIAG. New command semantics are absent, even if a word happens to hit the fallback matcher. `DIAG` returns a fixed R-02 check (`src/app/core/engine/game.ts:245`), while `CONNECT DIAGNOSTICS` is a distinct confirmed clinical operation (`src/app/core/engine/continuation.ts:22`, 102). Aliasing a new read-only diagnostics query to it would change authority and behavior.

Define argument parsing, service resolution, missing/invalid identifiers, date/time filtering, field scopes, paging and natural-language equivalents before changes. Do not promise arithmetic generally from the existing fixed “2+2” answer (`src/app/core/interpretation/dialogue-catalog.ts:210`); W §H and I §6.1 explicitly condition arithmetic claims on actual implementation. Neutral HELP can remain, but must not advertise commands until they work. No shell, SQL, arbitrary code execution or new action is authorized by the references.

### C19 — Search is access-filtered full-text, not the proposed scoped index

**Mechanics/metadata gap, with safeguards already present.** Terminal search filters `accessibleFiles` then searches path, title and full body, prints one matching body line and a result count (`src/app/core/engine/game.ts:27`, 60–65). The desktop also searches available bodies (`src/app/features/files/file-browser.ts:28`–29). Both rely on body readability through `canRead` (`src/app/core/engine/continuation.ts:7`–8); no independently permitted metadata-only hit can exist. Missing body, permitted index entry and protected existence need separate design under I §§5.2–5.4 and 6.1.

Current `ArchiveFile` has no explicit department, approved summary or field-level metadata visibility (`src/app/core/models.ts:27`–43). An unrestricted JSON-to-body conversion would make author-only material searchable. Current search does exclude unreadable bodies; do not claim it currently searches the new private dataset. Direct OPEN distinguishes nonexistent records from known denied ones (`src/app/core/engine/game.ts:35`–39, 237–239), so the author must decide which record existence/paths may be disclosed, rather than assuming all denial distinctions or result counts are safe. Terminal paths are already inert text (`src/app/features/terminal/terminal.html:15`–19); desktop navigation remains ordinary clickable UI. Search relevance must never derive from writer depth, K tags, causes or story role. These future policies should cover counts, excerpts, filenames, summaries and ordinary personnel results as well as full bodies.

### C20 — Conceptual staff roles are not implemented authentication or delegated authority

**Review boundary; extends C05/C12.** I §6 separates unverified information access, internal staff duties and protected clinical roles. W §E separates human knowledge from clearances. The implementation has boolean capability membership and player knowledge (`src/app/core/story-state.ts:1`–4, 24–32), not authenticated role/session identity or per-field staff scopes. Opening evidence verification delegates audit capabilities; clinical index/audits and release preparation delegate further capabilities (`src/app/core/engine/continuation.ts:100`–114). This is the existing prototype's procedure, not a ratified explanation of how an outsider can gain authority in the new institution.

I §§6/8/10 leaves the endpoint, authentication, trusted route and clinical/operational authority OPEN. Merely knowing a path/person, querying a log or reciting evidence cannot silently grant equipment control under the proposed design. Define later authority together with real human care, medical safeguards and vendor transport. Retain explicit consequential requests, confirmation and observation/control separation; no new role hierarchy, permission flags, saves or progression are introduced now.

## Contradictions and ambiguities within the reference set

No source was amended and no conflicting value was selected. Concrete metadata discrepancies are separated from provisional examples and wording that needs clarification.

| ID / classification | Specific source evidence | Decision still required |
| --- | --- | --- |
| R01 — Inherited-status ambiguity, not a newly ratified incident date | v0.3 §4 says a 1990s experiment and §12 keeps detailed chronology OPEN. W §F1, line 592, labels the 1996 row “ESTABLISHED era/core”; W line 601 and I §10/D10 still require incident chronology review. | Clarify whether 1996 itself is an approved amendment or just the inherited prototype year. Do not promote the year/day or demote the established causal core by inference. |
| R02 — Concrete record-date discrepancy | W §G row `DOC-PRD-03` (line 626) calls the product support sheet a 2002 Customer Support record. Its §G2 sample metadata (line 693) dates `DOC-PRD-03` to 3 February 2003, Samuel Ortiz's department. | Select the intended record/revision/date and consistent owner in a final manifest; do not silently choose the later sample. The draft allows adjustments but has not made this one. |
| R03 — Concrete access-label discrepancy | W §G row `DOC-PRC-01` (line 629) says General access; its §G2 metadata (line 703) says internal parts register. I §6 distinguishes approved public views from internal staff records. | Decide if a sanitized general inventory summary is available, an internal body is withheld, or a label changes. “Internal” is not automatically public and the reference supplies no field-level resolution. |
| R04 — Interpretive wording tension, not established mind decoding | I §1.2, line 39, makes an exception for instrumented Anna in a sentence about reading minds. v0.3 §§2/5 distinguishes signals from subjective/moral understanding; W §E1 and I §1.1 preserve that distinction. | Clarify the intended limit of that phrase: continuous neural/physiological measurements do not themselves establish decoded thoughts, exact subjective experience or a complete mind. Do not implement new mind-reading capability. |
| R05 — Illustrative chronology versus inherited prototype, not a replacement timeline | I §4.6 uses 2 November 03:41 for automatic restart (lines 264–265); the prototype uses 03:14:07–09 (`src/app/core/content.ts:74`–76; `src/app/core/engine/game.ts:117`). I §3 uses illustrative 09:10 and §4 has morning events; the prototype session is fixed at 02:14 (`src/app/core/story-state.ts:37`). I §4.9's stronger closure claim differs from the existing approval/list wording; retaining its current 17:04 file timestamp (`src/app/core/content.ts:85`) while inserting the new completion claim would also need reconciliation with I's proposed later billing/sensor shutdown times (§§4.4–4.5). | Ratify session time/date, zone, event/record dates, final closure wording, stop/restart cause and retention. Do not include future morning events in an earlier live session or merge the two restart times into invented extra events. I expressly labels its times illustrative and defers final chronology in §10/D2/D7/D9. |

**Checks that passed:** all 40 J records agree with W's table and sketches, with unique P001–P040 IDs and the stated 14/18/8 split. All 43 unique JSON document links are declared in W's 28-row §G manifest or 15-row §G1 candidate list; no dangling writer ID was found. The six full §G2 samples leave 37 of those IDs without a full body. This is declared incompleteness, not a broken runtime link. The two Bells are deliberate name ambiguity, not duplicate identities. A closed research department versus continuing care/validation, 003 routing versus 006 notifications, a 40-record sample versus hundreds of employees, and proposed contractors versus an unstaffed old desk are compatible distinctions. None proves the detailed clinical schedule or cross-system mechanism is complete.

## Existing documents and historical status

Prior documents are preserved. Their imperative passages are historical task/design material, not additional instructions for this ingestion task.

| Document / location | Status relative to this reference |
| --- | --- |
| `docs/CREATIVE_GAMEPLAY_HANDOFF.md:3`–11, 48–55, 83, 93–101 | Older implementation snapshot and hidden-story assumptions. Its “former researcher” and later-dominant biomedical-system scope are superseded where they differ from v0.3; initial R-02 branding and no intentional Anna messages remain compatible. Its preview-only state is historical, not the current runtime. |
| `docs/NERVE_ENDING_GAMEPLAY_FLOW.md:3`, 65–79, 145–163 | Dated audit of the pre-redesign flow, including file-read unlocks and an obsolete opening fixture. Useful historical evidence, not current progression authority or new canon. |
| `docs/NERVE_ENDING_STATUS_REPORT.md:1`–13; `docs/NERVE_ENDING_DEVELOPMENT_ROADMAP.md:3`, 17–23 | Audit brief/report material and planning, not implementation authorization. The roadmap's file-read finding predates the opening redesign. |
| `docs/OPENING_REDESIGN.md:3`–28, 46, 157–163 | Current opening contract and limitations. Its delegated verification, closed-research wording and reveal schedule need scenario review against C05–C09, not retroactive rewriting. |
| `docs/GAMEPLAY_GUIDE.md:7`–19, 101; `docs/ARCHITECTURE.md:19`–30 | Describe the present seven-act/reveal/profile design. Later MOTHER identification can remain a disclosure event; later-only existence cannot. |
| `docs/QUESTION_CATALOG.md`; `docs/DIALOGUE_COVERAGE.md` and `.json` | Generated descriptions of existing authored answers. Presence and coverage are not canon approval. Regenerate only with a later authorized content change. |

## What can remain

- The Angular application, monochrome client, file/document viewers, accessibility and skippable playback need no replacement for reference ingestion.
- A single deterministic authored-response engine and optional local recognizer can represent one central fictional intelligence. No generative model or physical-core architecture follows from the canon.
- Separate observations, player knowledge, delegated permissions and actual operating state remain useful. Player ignorance need not mean MOTHER lacks the data.
- R-02 branding, initial withholding of the MOTHER designation, ordinary HELP examples and an outside player without a staff identity remain compatible.
- Medical motivation, voluntary original participation, consent limits, qualified human concerns, biological survival and the harmful correction loop are reusable foundations.
- No mind upload, intentional patient messages, supernatural control, universal conspiracy or unrestricted device access should be added.
- Historical files remain distinct from current diagnostics and interpretation. Administrative closure is not clinical release; fixed counters are not pain measurements.
- Explicit consequential requests, warnings, confirmation/cancellation, model-free play, persistence validation and separate opt-in local QA remain useful safeguards. Exact future permissions and ending outcomes still require review.

## Author decisions required before runtime reconciliation

The established central-MOTHER identity, Anna's leadership/agency, human care, consent limits and neutral opening do not need to be re-approved. The unresolved decisions are how to express them coherently in the full scenario:

| Decision | Needed specification | Findings |
| --- | --- | --- |
| A01 — Incident and adaptation | Anna's final action, operators/warnings, chronology, failed safeguard and bounded shared-decision mechanism; review exact inherited dates. | C02, C10, C11 |
| A02 — Care, consent and authority | Present staff roles/clearances and care evidence, corporate reliance on papers, oversight failures, and grounds/limits of outsider intervention. Medical plausibility review as required by canon §8. | C03, C05, C06, C12 |
| A03 — Disclosure and interpretation | Public versus protected facts, ordinary Anna profile versus patient link, MOTHER's continuous signals versus human doubts, and stage-specific limits on moral interpretation and voice. | C01, C04, C08, C09 |
| A04 — World and service content | Ratified company facts/personnel, retained-work scope, service histories, ordinary faults and approved 2001/2003 archive details. Keep all unratified §7 specifics WORKING. | C06, C08, C10, C11, C13 |
| A05 — Network and final consequences | Reviewed channels, destinations, package contents, risks, options, authority and exact ending effects; decide which prototype details to retain. | C05, C12 |
| A06 — Playable scenario | Neutral start, discovery routes, terminal-only investigative value, evidence interactions, MOTHER initiative, reveal timing, alternate approaches and acceptance criteria. No mandated act structure is inferred from v0.3. | C07, C09, C13 |

## Additional decisions — 23 October 2026

These extend A01–A06; they do not reopen established character truth or silently finalize draft facts.

| ID | Decision needed | Dependencies / source |
| --- | --- | --- |
| B01 — Corporate facts and personnel release | Ratify founders/history/products/sites/headcounts and proposed careers; approve public fields for ordinary employees versus contractors, aliases and Anna's work identity. Keep protected associations, writer tags and care locations separate. | C14–C15, C19; W §§A–E/H/I; J/P001–P040. |
| B02 — Final record manifest | Resolve R02/R03; approve record IDs, aliases/paths, owners, revision dates, visibility and which outlined records actually need full bodies. Avoid colliding with the current office notice and deriving files from every proposed link. | C14–C15; W §§G/G1/G2; I §7. |
| B03 — Services and semantics | Ratify eight definitions, owners, permitted metadata, dependencies and RUNNING/STANDBY/STOPPED/RETIRED meanings; distinguish number spaces and router notifications from originating alerts. | C16–C17; I §§2–4 and D1. |
| B04 — Chronology and evidence | Resolve R01/R05; approve closure assertion, actual stops, November restart/cause, unified live observation/time zone, record/event timestamps and retention. Specify when a saved observation can support a claim about live state. | C11/C17; W §F1; I §§2.1/4/7 and D2/D7/D9. |
| B05 — Disclosure and access errors | Define permitted metadata-only searches and live logs; public/internal/clinical field scopes; existence/count/excerpt/reference policy; historical depth, denied versus absent versus missing-body behavior. | C15/C19/C20; W §§C/E/G; I §§5–7 and D6. |
| B06 — Query surface | Approve command names, arguments, filters, limits, natural-language equivalents, clarification/errors and which diagnostics are read-only. Do not advertise general arithmetic or unimplemented commands. | C18; I §§5/6.1; W §H. |
| B07 — Consequential authority and scenario | Finish incident/adaptive mechanism, physical/session exposure, care staffing/governance, legitimate narrow delegation, active commands, external route and endings before changing progression or control. | C01–C12/C20; A01–A06; I §8 and D3/D4/D5/D8/D10. |

## Verification of the initial ingestion — 21 October 2026

Only this register, the unchanged canon, the impact map and a short README index entry are deliverables. The canon copy is checked by SHA-256 against its source. Existing source, records, dialogue, recognition assets/examples, tests, configuration, saves and historical documents are checked for content changes against a pre-edit hash inventory. Documentation links and cited line bounds are checked locally. No runtime tests, catalogue generation, model regeneration, build, deployment, commit or save migration is needed to ingest references; none is claimed as new gameplay validation.

Results: the canon copy is byte-identical with the SHA-256 above; all 16 local Markdown links and 127 cited file/line anchors resolve. Of 109 inventoried existing files, 108 retain their original hashes; only README changes, through the reference index paragraph. The only added files are the three documents in this directory. Existing runtime behavior has not been changed or claimed to conform to v0.3.

## Integration actions and verification — 23 October 2026

Read W, J and I completely alongside v0.3 and the previous conflict/impact reports; inspected the current content, commands, query routing, access, presentation, state and persistence architecture. Archived the supplied sources without modifying their bytes, dates, labels or provisional decisions. Added the domain-authority index, extended findings C14–C20, recorded reference issues R01–R05 and decisions B01–B07, and expanded the impact map with authored-content readiness and conditional mechanics/persistence work. No source disagreement was silently resolved.

Exactly seven project files changed in this pass:

| Action | Path |
| --- | --- |
| Added, unchanged source copy | `docs/narrative/NERVE_ENDING_MERIDIAN_WORLD_BIBLE_v0_4.md` |
| Added, unchanged source copy | `docs/narrative/NERVE_ENDING_PERSONNEL_DIRECTORY_v0_4.json` |
| Added, unchanged source copy | `docs/narrative/NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5.md` |
| Added index | `docs/narrative/README.md` |
| Updated analysis | `docs/narrative/CANON_CONFLICTS.md` |
| Updated planning/readiness analysis | `docs/narrative/IMPLEMENTATION_IMPACT_MAP.md` |
| Updated developer index paragraph | `README.md` |

Verification: all three source copies are byte-identical and SHA-256-equal to their supplied originals; hashes are recorded in the narrative index. JSON parsing, 40 unique personnel IDs, the 14/18/8 split, all table/sketch/profile/note/link comparisons and declaration of all 43 linked IDs were checked. All 40 local Markdown links and 190 explicit project file/line citations in the root README and maintained narrative analysis/index resolve. These link checks concern maintained documentation, not existence of proposed runtime files. R01–R05 remain author decisions, so reference validation is not a claim that all story facts agree.

Against the pre-edit inventory of 112 existing project files, only the root README and the two analysis reports changed; 109 existing file hashes are unchanged, including canon v0.3 and all inventoried runtime code, dialogue, records, recognition assets/examples, tests and configuration. Four documentation files were added. No gameplay, services, visual components, saves or progression was changed. No runtime tests, generators, build, deployment, commit or migration were run; checks were limited to source integrity, reference consistency and documentation. Existing historical documents and pre-existing working-tree changes were preserved.
