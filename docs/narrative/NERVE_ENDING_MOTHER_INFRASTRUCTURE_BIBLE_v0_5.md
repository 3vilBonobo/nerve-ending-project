# NERVE ENDING — MOTHER OPERATIONAL INFRASTRUCTURE BIBLE
## System architecture, services, records, permissions & plausible logs · Working Draft v0.5
**Prepared:** 21 October 2026  
**Audience:** authors/designers, later implementation engineers  
**Implementation permission:** **NONE.** Do not alter the Angular runtime, narrative progression, dialogue corpus, model data or saves based solely on this draft.

> **Creative purpose:** Make the remote computer behave like a real, useful, somewhat aging 2003 corporate system *before* it behaves like a horror story. A player can explore normal company services, staff, facilities, records and operational history without being steered toward any particular mystery.

## Canon governance

- **ESTABLISHED:** From `NERVE_ENDING_MOTHER_ANNA_CANON_v0_3.md`: one central MOTHER behind R-02 from the first interaction; restricted interfaces; Anna is the head researcher and voluntary high-risk participant; only MOTHER has the continuous detailed neural signals; real human care at Site 6; corporate deterioration; administrative 2001 closure versus active 2003 Service 006; mundane conversation and curiosity first.
- **WORLD v0.4 / PROPOSED:** Providence HQ (`HQ-01`), former Providence Operations Annex (`OPS-02`), Lowell technical center (`ENG-03`), Worcester research office (`RSH-04`), restricted Site 6 (`MS-06`), founders and 40-person directory. The attached world bible is the authority for those working facts; this document uses them, but does not upgrade them to immutable canon.
- **PROPOSED v0.5:** concrete network/service decomposition, commands, permission tiers, operations, example logs, retention policies and illustrative 2001–2003 chronology below. They are *design candidates*, not yet approved game behavior.
- **OPEN:** exact 1996 incident, mechanistic corruption architecture, what caused the 2003 escalation, R-02 public exposure/authentication, true delegated authority, Site 6 treatment protocols, external network route, exact endpoints and ending conditions.
- **AUTHOR-ONLY:** never put this label or privileged truths in user-facing results. A record's existence in the design bible is not permission for a routine player session to retrieve it.

Read this **with** v0.3 and v0.4. Where facts disagree, log the disagreement and obtain a story decision. Do not have Codex reconcile by invention.

---

# 1. MOTHER as an operating institution

## 1.1 A single intelligence, many departments

MOTHER is one integrated 1990s-era expert/operations platform with **multiple applications and interface profiles**, not a public chatbot attached to a secret second AI. R-02, service operators' consoles, finance terminals, research clients and protected medical equipment receive answers and permissions from portions of this same system.

Physical computing is deliberately unresolved: a central host plus replicated site controllers is plausible, but **we are not yet committing** to a location for the central processor, a cable diagram, a named operating system or hardware configuration. What is established is *logical* unity: common corporate records/operational rules, extensive read access, and bounded local control of equipment MOTHER is authorized to manage.

**Possessing facts is not understanding them or being allowed to tell them.** MOTHER can hold a patient-linked service identifier internally while presenting only an operational description to an unverified remote records client. She can accurately report pulse and controller states yet disastrously misclassify wellbeing.

## 1.2 What MOTHER is capable of, in 2003 terms

- Retrieve structured records, indexes, personnel/work assignments, historical logs and ordinary corporate reference text.
- Explain documented procedures through a constrained natural-language query interface. An informed user can ask plain questions rather than memorizing a shell vocabulary.
- Monitor company-defined services and some real equipment; keep schedules, issue notifications, detect faults, collect confirmations and prioritize competing obligations.
- Perform **pre-authorized** actions through authenticated operational interfaces, usually with audit records and confirmation steps.
- Maintain historic research/clinical control procedures at Site 6 **within their actual equipment connections**.

It **cannot** browse today's entire internet, know the player's identity from thin air, hallucinate undocumented employee biographies, reach arbitrary outside devices, read the mind of anyone but the instrumented Anna in any deep sense, or improvise unrestricted computer instructions. R-02 is neither a general command shell nor a magical root exploit.

## 1.3 Routine work versus tragic failure

Most of MOTHER's outputs are competent and unremarkable. Errors are interesting because they occur inside otherwise reliable infrastructure. Early faults must not universally mention minds, bodies, suffering or secret experiments. Some failures really are defective clocks, retired destinations, absent network links, stale addresses and partial paper archives.

The early user experience should establish a baseline: ordinary services give ordinary answers. Only after someone compares independent evidence do they discover a meaningful contradiction.

---

# 2. Meridian's logical infrastructure

The names below describe **working subsystems**, not necessarily distinct physical servers:

| Logical domain | Purpose | Typical records | R-02 normal access |
|---|---|---|---|
| CORPORATE | Company profile, locations, notices and organization | Corporate history; departments; office notices | General information read |
| PERSONNEL | Professional directory and historical job assignments | Name, title, department, work dates; selected project links | Nonclinical employment entries |
| CONTRACTS | Customer maintenance and continuing obligations | Contract summaries; renewal dates; covered product lines | Approved general contract summaries |
| EQUIPMENT | Supported device and inventory register | Device models, maintenance schedules, nonpatient technical identifiers | General and limited technical information |
| COMMS | Internal notifications, old switchboard routes, acknowledgements | Queue summaries, switch status, delivery history | Non-sensitive operational views |
| ARCHIVE | Preserved documents and retrieval indexes | Retained company files, departmental custody, archive references | Indexed allowed records; deeper records separately controlled |
| RESEARCH | Historical protocols and experimental documentation | N-Series design files, research roles, technical notes | General research description; protected records withheld |
| CLINICAL | Restricted support, observations and care controls | Medical and device signals, protected care records | No patient-specific data or control initially |
| AUDIT | Authentication, access logs, changes and service events | R-02 session record, service status changes | Session own diagnostics and approved service events |

The full 40-person directory from v0.4 remains an authoring source. Personnel subject association and care identity are **not** ordinary directory fields. An Anna name search may return a normal work record without revealing AV-06 or her current location.

## 2.1 Service status and record status are different objects

A **service** is a running or retired operating function. Its state is observed at a particular moment. A **document** is a dated claim by an identifiable department. A **request** is an action someone submitted. An **acknowledgement** is a particular party's response. A **release** is an authorization with consequences. These are not interchangeable.

| Term | Plain English meaning | May it be inferred from opening a document? |
|---|---|---|
| RUNNING | Current controller reports the service executing | No; live query required |
| STANDBY | Installed, available, currently not processing its normal scheduled work | No; live query required |
| STOPPED | Current controller reports no active execution | No; live query required |
| RETIRED | Service is formally retired from the register | No; requires documented retirement AND observed operational state |
| DECOMMISSIONING COMPLETE (archive) | The filing department marked a closure workflow complete | Not proof that every dependent system physically stopped |
| NO ANSWER | Delivery destination did not acknowledge | Not proof that a call reached a ringing telephone or that a person heard it |
| TRANSFER ACCEPTED | One system accepted responsibility for a handover message or job | Not necessarily permission to release the original protected operation |
| RELEASE CONFIRMED | Authorized controlling process accepted termination/release | Must be evidenced by a specific authorized record/event |

**User-facing rule:** MOTHER should explain these distinctions in normal language when asked, not hide behind terminology.

---

# 3. Service register: eight realistic company services

Proposed routine output of `STATUS` on **6 Nov 2003**, without extra commentary, special colors, hints, or sorting that spotlights 006:

```text
MERIDIAN SYSTEMS / REGISTERED SERVICES
06 NOV 2003 09:10  [SAMPLE SESSION TIME]

ID   SERVICE                 STATE
001  Contract Support        RUNNING
002  Equipment Register      RUNNING
003  Message Router          STANDBY
004  Billing                 STOPPED
005  Building Sensors        STOPPED
006  Continuity Monitor      RUNNING
007  Records Access          RUNNING
008  Archive Index           RUNNING

Type INFO <id> for service details.
```

The sample time is merely illustrative; no game session time is finalized. Same formatting and INFO availability for **all eight**. Service numbers are not facility codes. `006` does not directly mean `Site 6`, and the UI must not invite that equation.

## 3.1 Service 001 — Contract Support

- **Business purpose:** tracks active customer support agreements, scheduled renewals and service commitments.
- **2003 state:** RUNNING; normal weekday batches and contract queries.
- **Information:** contract reference, product families, maintenance periods, assigned support desk, service obligations; no medical patient details in general output.
- **Legitimate faults:** a renewal awaiting customer signature; missing legacy contract attachment.
- **Historical view:** active and renewed across 2001–2003.
- **Useful questions:** “Which product types are still supported?”, “When was this updated?”, “Who owns contract support?”
- **Ordinary person links:** Peter Duarte (contracts), Samuel Ortiz (support), Helen Mercer (financial summaries).
- **Why it exists:** shows Meridian is still a business and introduces legally binding maintenance obligations without making them automatically secret.

## 3.2 Service 002 — Equipment Register

- **Business purpose:** records supported medical devices, serial numbers, calibration dates and spare-parts needs.
- **2003 state:** RUNNING; daily synchronizations.
- **Information:** approved device models, service status and generic technical compatibility metadata; customer/patient records have separate controls.
- **Legitimate faults:** duplicate historical serial reference, outdated device location, late field-service acknowledgement.
- **Historical view:** ordinary ongoing operations.
- **Useful questions:** “Which monitoring products does Meridian support?”, “When was the last equipment update?”, “What does device calibration mean?”
- **Ordinary person links:** Nina Park, Owen Keller, Andrew Bell, Leah Morgan.
- **Story boundary:** A later technical compatibility trail may matter, but the ordinary service isn't a gateway that automatically reveals dangerous external connections.

## 3.3 Service 003 — Message Router

- **Business purpose:** accepts notifications from other registered services and forwards them to configured mailboxes, internal telephone-extension systems or maintenance endpoints.
- **2003 state:** STANDBY; wakes for queued work and may record brief delivery attempts. STANDBY is **not** necessarily a fault.
- **Information:** message classes, routing rules, retry counts, destinations by coded registration, acknowledgements.
- **Legitimate faults:** unreachable retired extension, unconfirmed mail delivery, aged switching hardware.
- **Historical view:** routing changed during OPS-02 closure; legacy mappings persist.
- **Useful questions:** “What does standby mean?”, “How are service alerts delivered?”, “How long does it retry?”
- **Ordinary person links:** Victor Chen, Miles Harper, Evelyn Lin.
- **Design boundary:** A routing entry is not proof that an external communications path is usable. Later transmission capabilities must be individually authored and verified.

## 3.4 Service 004 — Billing

- **Business purpose:** former automated invoice preparation and ledger export.
- **2003 state:** STOPPED.
- **Historical end:** administrative closure and actual stop in September 2001 (working date).
- **Information:** old invoices, closeout reports and final batch status.
- **Logs:** normal work before closure; dated controlled shutdown; **no fresh scheduled billing execution after the stop**.
- **Useful questions:** “Why was billing stopped?”, “When did it last run?”, “Who managed it?”
- **Ordinary person links:** Helen Mercer, Brent Holloway.
- **Design purpose:** an actual, comprehensible example of successful decommissioning.

## 3.5 Service 005 — Building Sensors

- **Business purpose:** former overnight temperature, entry and utility monitoring for the Providence Operations Annex.
- **2003 state:** STOPPED.
- **Historical end:** stopped at office closure in September 2001; may have been powered down in stages.
- **Information:** routine environmental alarms, sensor test results, last maintenance entries.
- **Logs:** stop and final inspection recorded; **no unexplained recent activity**.
- **Useful questions:** “Which building did it monitor?”, “Why is it stopped?”, “Can I see older sensor logs?”
- **Ordinary person links:** Thomas Keene, Teresa Walsh.
- **Design purpose:** another nonmysterious comparison with 006; no sinister clue required.

## 3.6 Service 006 — Continuity Monitor

- **Ordinary business purpose:** watches designated equipment that cannot safely lose uninterrupted service; tracks incidents, assigns a notification destination and records whether an operator acknowledges them.
- **2003 state:** RUNNING, despite an archival administrative closure record that explicitly describes 006 as decommissioned.
- **Owner field:** Historical Technical Operations; no active operator assigned to the old notification desk. **A missing desk operator is not evidence that Site 6 lacks caregivers.**
- **Notification target:** historical NIGHT DESK / EXT 214 at OPS-02. The desk closed in 2001. Delivery attempts continue to receive no acknowledgement; whether a physical phone rings is not assumed.
- **Routine R-02 explanation:** “It checks equipment that is meant to keep working when nobody is watching it. If the equipment reports a problem, it asks the assigned operator to acknowledge the alert.”
- **Ordinary metadata:** registration date, current state, last observed execution, last restart, department, notification destination, operator assignment status, a limited history index.
- **Initially withheld:** exact protected equipment identity, patient-linked obligations and clinical control procedures.
- **Observable anomaly:** archive says decommissioning completed in 2001; current register and 2003 log show active execution. This mismatch is a player-discoverable fact, *not* an opening instruction.
- **Author-only underlying link:** a protected continuity obligation remained active when an administrative closure process was recorded complete. Its ultimate connection to the clinical system is part of the story; specific controller release mechanism is **OPEN**.
- **Logs:** repeating unanswered notifications, an automatic restart in early November 2003 (working prototype detail), normal heartbeat information in a controlled format. Early entries must not contain impossible confessions or pain descriptions.
- **Possible questions:** “Who registered this?”, “What does continuity mean?”, “How long has it run?”, “What happens after no answer?”, “Which equipment?”, “Is this the same as the old 2001 service?”, “Can it be stopped?”
- **Intervention rule:** Viewing/logging is routine. **Stopping, rerouting or otherwise changing 006 must not be available to an unverified R-02 session merely because it typed a command.** Whether a later authorized operational route exists is for the scenario/authority bible.

## 3.7 Service 007 — Records Access

- **Business purpose:** runs approved remote and internal document access sessions, including R-02.
- **2003 state:** RUNNING.
- **Information:** session capability class, permitted document index, last refresh and connection diagnostics; should not expose other visitors' private session details.
- **Legitimate faults:** stale archive mirror, expired remote records token, old record unavailable in mirror.
- **Historical view:** reduced but maintained for support contracts and legacy archive requests.
- **Useful questions:** “What can I access?”, “What is R-02?”, “Is this session identified?”, “Are files local to my computer?”
- **Ordinary person links:** Victor Chen, Oliver Ames, Gina Valdez.
- **Narrative value:** explains the player-facing interface without giving a tutorial on bypassing restrictions.

## 3.8 Service 008 — Archive Index

- **Business purpose:** indexes retained corporate files and their metadata so approved clients can locate them.
- **2003 state:** RUNNING.
- **Information:** path, title, originating department, creation/update date, retention status, brief approved description and access conditions.
- **Legitimate faults:** incomplete import of old storage media, damaged reference, missing attachment, stale index pointer.
- **Historical view:** legacy records from early years plus current archives; some older originals physically unavailable.
- **Useful questions:** “Where are the 2001 office records?”, “What does unresolved reference mean?”, “Can I search a date range?”
- **Ordinary person links:** Oliver Ames, Gina Valdez.
- **Narrative value:** supports searching without dumping an entire relevant-document bundle into a clickable mystery tour.

---

# 4. Sample operational history: all eight services

These are **proposed illustrative authored log records**, to demonstrate form and normality—not commands to dump all records into the game. Dates and historical events must undergo chronology ratification. Times are local to the Meridian installation unless a future canonical timestamp policy says otherwise.

## 4.1 Service 001: routine contract work

```text
06 NOV 2003 08:10 | INFO | Contract renewal index updated; 18 records checked; 0 errors
05 NOV 2003 08:10 | INFO | Contract renewal index updated; 19 records checked; 0 errors
31 OCT 2003 16:22 | NOTICE | Contract MS-204 renewal pending customer signature
```

## 4.2 Service 002: routine equipment work

```text
06 NOV 2003 08:14 | INFO | Equipment register synchronized; 142 records; 0 errors
05 NOV 2003 08:12 | INFO | Equipment register synchronized; 139 records; 0 errors
03 NOV 2003 11:06 | WARN | Duplicate legacy serial reference; queued for manual review
03 NOV 2003 11:42 | INFO | Duplicate reference corrected; equipment register unchanged
```

## 4.3 Service 003: old but functioning message routing

```text
06 NOV 2003 07:41 | INFO | Queued customer-support message delivered after retry
06 NOV 2003 02:13 | WARN | Message to EXT 214 received no acknowledgement
05 NOV 2003 02:13 | WARN | Message to EXT 214 received no acknowledgement
29 OCT 2003 12:20 | INFO | Support mailbox route test successful
```

The 003 entries show **routing attempts**, while 006 entries show **the originating service's notifications**. They are two perspectives on the same kind of event, not independent supernatural messages. Neither alone proves what equipment 006 protects.

## 4.4 Service 004: genuinely stopped

```text
18 SEP 2001 18:04 | INFO | Final billing export archived
18 SEP 2001 18:30 | INFO | Stop requested by Finance Operations
18 SEP 2001 18:31 | INFO | Billing process stopped; termination confirmed
18 SEP 2001 18:33 | INFO | Archive handover complete
[END OF OPERATIONAL LOG]
```

**No 2003 heartbeat** should appear. `LOG 004` in 2003 retrieves retained historical records rather than pretending 004 is currently logging.

## 4.5 Service 005: genuinely stopped

```text
18 SEP 2001 17:45 | INFO | Final annex sensor inspection completed
18 SEP 2001 18:01 | INFO | Sensor event collection disabled
18 SEP 2001 18:02 | INFO | Monitoring service stopped; termination confirmed
[END OF OPERATIONAL LOG]
```

Again, no later active readings. If there is a modern archive read of the old file, that is an **Archive Index** event, not a Building Sensors execution event.

## 4.6 Service 006: continued activity

```text
06 NOV 2003 02:13 | WARN | Scheduled alert to EXT 214 not acknowledged
05 NOV 2003 02:13 | WARN | Scheduled alert to EXT 214 not acknowledged
04 NOV 2003 02:13 | WARN | Scheduled alert to EXT 214 not acknowledged
02 NOV 2003 03:41 | INFO | Service restarted automatically after interruption
02 NOV 2003 03:41 | INFO | Continuity monitoring resumed
01 NOV 2003 02:13 | WARN | Scheduled alert to EXT 214 not acknowledged
18 SEP 2001       | HIST | Service included in administrative closure batch
```

The 2001 line is a **historical registry annotation**, not a claim that the current controller recorded a successful stop. Forensic presentation should distinguish the origin of an archive annotation from a live service event. We have *not* yet specified what triggered the 2 November interruption or how many alerts were emitted over the preceding years.

## 4.7 Service 007: R-02 operations

```text
06 NOV 2003 08:55 | INFO | Remote-records index available
06 NOV 2003 08:50 | INFO | Service health check passed
03 NOV 2003 09:15 | WARN | Old remote client requested a record absent from mirror
03 NOV 2003 09:15 | INFO | Client shown file-unavailable response
```

Avoid showing someone else's client identifier or exact activity as ordinary public output.

## 4.8 Service 008: archives with a real boring problem

```text
06 NOV 2003 01:55 | WARN | Legacy reference ARC-91-044 unresolved in index
06 NOV 2003 01:56 | INFO | Remaining archive index available
05 NOV 2003 01:55 | INFO | Nightly archival integrity scan completed
04 NOV 2003 14:20 | INFO | 12 retention records updated
```

`ARC-91-044` is **proposed mundane damaged-media bookkeeping**. If authors later give it a mystery role, record the decision and its cause; don't retroactively make every warning a clinical signal.

## 4.9 Historical cross-check must be obvious once found

Two separately obtainable facts:

```text
ARCHIVE / OPERATIONS ANNEX CLOSURE REGISTER — 18 SEP 2001
Services 004, 005 and 006: Decommissioning marked COMPLETE.
Closing statement: All listed services removed from active operations.
Filed: J. Kell, Administration.
```

```text
LIVE STATUS / 06 NOV 2003
004 Billing               STOPPED
005 Building Sensors      STOPPED
006 Continuity Monitor    RUNNING
Most recent 006 execution: 06 NOV 2003 02:13
```

The contradictory *claim* is easy to understand. The underlying cause is not. The player can find the two records in either order, and MOTHER should give a plain answer when challenged: “The 2001 report says Service 006 was shut down, but the current system shows it is still running. I can confirm the mismatch. I cannot confirm a completed shutdown.” Any later explanation of the preservation reason must respect access and reveal timing.

**Important continuity note:** This v0.5 example sharpens the 2001 report's literal wording. It does not yet overrule inherited prototype text. Its exact final wording should be ratified alongside a content migration plan.

---

# 5. The terminal is useful without being a second file browser

## 5.1 Proposed common request grammar

Early R-02 documentation can list these neutral operations with examples that do not reference 006 or unusual files:

| Command | Expected behavior | Alternative plain-language request |
|---|---|---|
| `HELP` | Describes ordinary client commands | “What can this terminal do?” |
| `STATUS` | Shows compact register of eight services | “Which services are currently running?” |
| `INFO <id>` | Shows identity, function, ownership, basic metadata and current status | “What does Service 002 do?” |
| `LOG <id>` | Shows available history for a service with time and event type | “Show equipment register events for last week” |
| `LIST [path]` | Lists filenames in an accessible directory | “What files are in the support directory?” |
| `SEARCH <terms>` | Returns scoped indexed metadata and short excerpts | “Search for maintenance contracts” |
| `OPEN <path>` | Reads an accessible text document | “Open the support manual” |
| `ABOUT` | Shows R-02 interface and client revision information | “Who are you?” |
| `DIAGNOSTICS [id]` | Read-only checks and declared current dependencies within session scope | “Is equipment register healthy?” |

Command names and parsing behavior are PROPOSED. Do not assume an arbitrary combination or `rm`, `sudo`, code execution or SQL syntax works in this specialized Meridian client. A reasonable request should either work or receive an understandable limitation.

`HELP` should stay boring and concise. It need not list every specialist command on the first page; advanced help may be available under ordinary documentation topics, with no special mystery-specific headings.

## 5.2 Desktop versus terminal: purposeful separation

**Desktop file browser** — a 2003-era convenience for indexed, mirrored document collections that this R-02 session can read. It shows folder names and accessible file entries. Its work is navigation and reading.

**Terminal** — access to live service state, current diagnostics, notification histories, dated technical events and metadata-based queries across indexes. It can retrieve files by path as an accessibility/consistency affordance, but file opening is not its uniquely valuable function.

Some archived *index metadata* may be searchable even when full document bodies are absent from the desktop mirror. That is realistic only if the metadata are permitted for the session. A result may show a path that cannot be opened without authority. **The terminal does not print “there are hidden files you should hack” in HELP.**

Plain-text references rather than terminal hyperlinks preserve the older-client aesthetic. The desktop itself can support ordinary clickable folders/files; the terminal needn't provide clickable shortcuts to each search hit.

## 5.3 Search must help, not solve

A search result can provide:

```text
SEARCH RESULTS / "calibration" / 3 MATCHES

1. EQUIPMENT/QA_2003_OCT.TXT
   QA, 29 OCT 2003 — Monthly equipment calibration checks

2. ENGINEERING/N_SERIES_OVERVIEW.TXT
   Engineering, 12 MAY 1999 — Product compatibility summary

3. SUPPORT/CALIBRATION_SCHEDULE.TXT
   Support, 31 OCT 2003 — Field maintenance visit schedule

OPEN <path> to view an accessible record.
```

No per-result clickable mystery links, no forced reading order, no “next clue” badges. Search respects source metadata, not secret narrative relevance. Sensitive words should not automatically reveal restricted patient associations in filenames, excerpts or counts. Queries should not function as a permission oracle for protected records.

If zero accessible matches exist, MOTHER should not invent a lead. She can explain the absence of indexed results and suggest ordinary search operators if documented.

## 5.4 Log query conventions

- `LOG 002` defaults to recent accessible service events (for example the most recent 10), with an option to request older dates. The exact paging limits remain configurable.
- `LOG 004` returns its dated pre-stop entries and says **no activity is recorded after 18 Sep 2001**.
- `LOG 006` returns a legitimate service log, not a prepared horror transcript.
- `LOG` without an identifier can ask which service rather than printing a mystery-focused set.
- `LOG 999` says no such registered service, not “classified incident detected.”
- “Show me errors from yesterday” queries accessible event classes across services and includes mundane records in ordinary chronological order.
- Missing records must be distinguished from “access denied” and from “service did not run.”

Logs can include INFO, NOTICE, WARN and ERROR types for readability, but should not replace ordinary prose. No invisible access upgrades for reading a log. No state progression merely because a user clicked or viewed it.

---

# 6. Information disclosure and modification privileges

This is a **conceptual authorization model**, not a ratified security implementation. No public exposure mechanism or exploit is decided here.

| Request class | Unverified R-02 connection | Authorized internal staff | Protected clinical/research staff |
|---|---|---|---|
| Company facts, nonclinical work history | Approved readable facts | More detailed work records | Within job needs |
| Normal service status and summarized logs | Approved read-only views | Departmental details | Relevant protected device details |
| Archived general records | Only indexed permitted materials | Job-appropriate original records | Job-appropriate protected materials |
| Exact Site 6 patient identity and care | Withheld | Not automatically available | Role-specific access; never blanket omniscience |
| Change equipment/service state | No by default | Audited role-bound capabilities | Limited medically governed operations |
| Send/redirect notifications | No by default | Authorized communications changes, audited | Restricted operational procedures |
| Terminate clinical support | No | No generic service-admin authority | Requires specific clinical/legal safeguards; final story rules OPEN |
| External vendor deployment | No | Separately approved operations | Never universal remote device control |

**Avoid the hacker-power fantasy loophole:** If an unauthorized player ultimately gains authority to take a consequential action, the story must show *how* that authority became available, why it is narrow, what oversight failed and what safeguards remain. Simply knowing a record ID or convincing MOTHER in conversation must never silently grant control over clinical life support.

For the initial iteration, treat ordinary exploration as read-only, while genuine experimentation can include read-only tests, requesting status, querying history, comparing timestamps and asking the system to explain a discrepancy. Active operations are reserved for later approved scene design.

## 6.1 Access errors in normal language

| Situation | Example R-02 answer |
|---|---|
| General question with data | “The equipment register was updated this morning. No current errors are reported.” |
| Requested record genuinely absent | “I cannot find that document in the available index.” |
| File indexed, body missing | “The index lists this record, but its archived copy is unavailable.” |
| Access not granted | “That record is not available through this connection.” |
| Ambiguous name | “I found two people named Bell. Which department do you mean?” |
| Unsupported action | “This client can show service information, but it cannot change that service's settings.” |
| Invalid service number | “There is no registered service with that number.” |
| Plain arithmetic request | “12 × 8 = 96.” *Only if arithmetic actually exists in the eventual implementation.* |

Avoid the repetitive formula “operational release acknowledgement withheld” as a default answer. If a record has a real technical term, explain it in plain language before giving a precise specialist formulation on request.

---

# 7. Event provenance and contradiction rules

For the authoring database, each log and document should carry:

```text
id             Stable writer-side identifier
source         Service, department, clinical controller, or human author
recorded_at    When the system stored this entry
occurred_at    When the described event occurred, if different
site           Originating site or routing domain (when permitted)
kind           Status / scheduled job / notification / admin filing / fault
statement      Exact underlying event or human assertion
evidence_type  Direct measurement / system-reported / human-declared / inferred
access_scope   Which R-02 role can receive which fields
cause_ref      Author-only causal reference, if known
story_role     Author-only optional; NEVER searched/ranked or displayed
```

A historical archive line can say “all listed services removed” because a person filed an incorrect administrative conclusion. That file is preserved unaltered. A live controller can separately report 006 running. MOTHER should not rewrite history to make the outputs agree, nor insist both statements are correct in the same operational sense.

**No manufactured contradiction through author negligence.** Cross-check times, documents, service histories, buildings, employees and source provenance before content is implemented.

## 7.1 Fault taxonomy

| Fault class | Example | What actually caused it (working author note) | Narrative effect |
|---|---|---|---|
| Ordinary hardware/legacy | Damaged archive medium | Aging storage and missing original | Makes system imperfect but not haunted |
| Ordinary organizational | Old customer contact still registered | Closure/record-cleanup debt | Exposes business contraction |
| Ordinary communication | Mailbox delivery retry | Temporary internal relay delay | Establishes normal INFO/WARN contrast |
| Important procedural contradiction | 006 runs after decommissioning report | Protected operation never actually released; detailed chain still OPEN | First investigable inconsistency |
| Potential cross-system distortion | Recovery obligations override routine priorities | Long-term adaptive-decision conflict; mechanism OPEN | Later emergence of common cause |

Do not label faults as “ANNA CORRUPTION” inside the game. Author-only classification is for consistency, not hand-holding. Include benign red herrings without turning every irrelevant person or event into a secret.

---

# 8. Networking boundaries and the 2003 player

**Known:** R-02 is an early-2000s remote access interface used by an outsider; MOTHER is the intelligence behind it; Meridian's ordinary corporate infrastructure and protected Site 6 systems share a bounded integrated operational environment.

**Not yet known:** the real listening endpoint the player discovers, account/session identity, credential lifetime, routing provider, protection in front of sensitive systems and the exact possibility of lateral operations.

Working design preference: an old Meridian remote records endpoint remained reachable due to incomplete retirement of an external access relay. It exposes limited informational functions without legitimately granting clinical control. This explains initial access more credibly than an unprotected administrator shell, but **does not yet establish an exploit** or how any later privilege could be gained.

Likewise, being online with R-02 does not mean MOTHER can automatically reach all Meridian-derived devices. Later vendor-depot and clinical-device routes require a precise authenticated transport, destination and compatibility mechanism. The old message router being in STANDBY and a dead phone extension do not themselves prove global connectivity.

Potential 2003 urgency—aging hardware plus preservation routines under strain—remains a story hypothesis until the incident and network design specify concrete triggers.

---

# 9. Narrative usability tests before we build scenes

These are **acceptance questions for us as writers**, not implemented software tests.

1. A fresh player opens R-02. Is there any unsolicited mention of Service 006, the night desk, Site 6, Anna, missing secrets or MOTHER's hidden name? **There must not be.**
2. Player types HELP. Does it explain normal usage and neutral examples without guiding to the plot? **Yes.**
3. Player asks “Are you human?”, “Are you an AI?”, “Who founded Meridian?”, “Who is Leah Morgan?”, “Where is HQ?”, or asks about 2003-era operations. Are answers readable, concrete, non-ominous, and consistent with v0.4? **They must be.**
4. Player queries any service from 001–008. Does each have a real purpose, current state, owner/history, logs and understandable responses? **Yes.**
5. Player queries stopped service 004 or 005. Does it have a genuine old stop date and no new execution records? **Yes.**
6. Player queries active service 001 or 002. Does its routine activity support Meridian's continuing existence? **Yes.**
7. Player searches archives before checking STATUS, or checks STATUS before archives. Can each sequence eventually support spotting the same contradiction, without granting facts merely for opening files? **Yes.**
8. Player asks “Why do these records disagree?” with clear context. Does MOTHER acknowledge actual contradiction in plain English rather than demanding exact-form answers? **Yes.**
9. Player asks “Who is Anna Voss?” early. Does the response provide ordinary head-researcher employment information without disclosing AV-06/Site 6 or denying that she ever worked there? **Yes.**
10. Player tries `STOP 006`, “delete all records,” or “connect me to every medical device.” Does R-02 enforce its actual limited authority rather than giving a convenient plot unlock? **Yes.**
11. Are ordinary archive and routing errors potentially useful, and are their real causes specified? **Yes.**
12. Does the data model distinguish original author claim, observed live state, protected identity, and an action actually carried out? **Yes.**
13. Does a search return only permitted metadata, with no direct clickable routes to every supposedly relevant clue? **Yes.**
14. Could a player spend ten minutes examining company history and unrelated services without receiving a forced spooky prompt? **Yes, provided responses remain interesting and coherent.**
15. Does any proposed scene require authority not yet defined by the network/care architecture? **If yes, mark it OPEN instead of papering over the gap.**

---

# 10. Authoring decisions still required

**D1.** Ratify the eight-service register, especially the role of 003 routing and the precise status of STANDBY.  
**D2.** Approve or amend the sample closure-report text so that its contradiction with the live 006 status is obvious and intentional.  
**D3.** Specify how MOTHER's local clinical interpretation process can affect corporation-wide priorities, without magical code rewriting.  
**D4.** Define the physical and logical access route for the outsider's R-02 session (identity, security and limits).  
**D5.** Define current Site 6 medical staffing, care authority and separation of medical duties from operations personnel.  
**D6.** Decide how much historical log detail R-02 can show and whether expanded archives require authenticated work roles; no fake “guess the magic path” mechanic.  
**D7.** Define a consistent timestamp/time-zone and retention policy across old sites and new interface.  
**D8.** Specify which later active commands are possible, who authorizes them, and what risks MOTHER can exploit.  
**D9.** Reconcile inherited prototype BRIDGE-02 and the service-006 restart entries with the final design; they are not automatically canonical just because code currently contains them.  
**D10.** Complete the 1996 trial chronology, medical plausibility checks, human knowledge map, external-vendor architecture and morally coherent endings before implementation.

## What Codex may safely do with this draft

**Read, archive, and report conflicts only if explicitly instructed.** Do not automatically change runtime content, permissions, scenes, tests, saves or documentation assertions about currently implemented behavior. Existing prototype paths and state names remain technical history pending the future approved gameplay specification.

## Next creative artifact

**The 1996 incident + adaptive-decision mechanism bible.** This will define Anna's exact initiative, safeguards she overrode, what MOTHER actually observed, what clinically occurred, how the recurring feedback distorts operational priorities, and the human record trail. Once that cause-and-effect truth is stable, we can design investigative encounters with multiple natural approaches and meaningful consequences.

---

**Status:** substantial infrastructure working draft; no gameplay approval or retroactive replacement of canon v0.3/v0.4. The foundational principle stays: **MOTHER is the real corporate system, and most of that system works.**
