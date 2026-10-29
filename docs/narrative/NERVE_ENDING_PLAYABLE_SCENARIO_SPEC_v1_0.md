# NERVE ENDING — Playable Scenario & Final Decision Contract
## Version 1.0 — Author-directed production specification — 24 October 2026

**Status:** APPROVED FOR A BOUNDED PLAYABLE IMPLEMENTATION PASS as the narrative designer's concrete resolution of working proposals v0.6–v0.9. The game's creator may revise it after playtesting. These new decisions are deliberately selected for a playable draft, not claims of scientific or legal certainty. **This document overrides conflicting prototype story/ending behavior and narrower WORKING proposals, but preserves the established neutral opening, corporate world, 2001/2003 Service 006 discrepancy, one central MOTHER, Anna's role, real human care, and bounded late Anna communication.** Original narrative references remain unchanged. Do not present this as a historical fact or a completed code implementation.

**Runtime authorization:** Full story replacement within the seven movements, new authored playable records/dialogue/operations, narrow new disclosure and save semantics, tests and accessibility. No permission to rewrite unrelated corporate infrastructure or invent additional lore. Codex must implement this contract, not improvise it.

## 0. What game we are making

- Start: **06 NOV 2003 / 02:14**, an ordinary R-02 Meridian remote session. No obvious horror hook; neutral HELP. Player is a curious outsider, not a Meridian employee, special recruit, investigator with credentials, or hacker with root access.
- Rough target **90–120 minutes for a blind first playthrough**, NOT a guaranteed measured duration. No forced reading quotas, timers, fake waiting, arbitrary puzzles, or magic keywords.
- First part: genuine free exploration of a declining but operational medical technology company. Eight ordinary service records; 34 work profiles; a handful of archives and primitive demo bitmaps remain functional.
- The player notices, independently, a real contradiction: the **2001 operations report says Services 004/005/006 were marked closed**, but live **006 runs in 2003**. Unlike 004/005 there is no verified stop. No automatic opening prompt identifies this discrepancy.
- Trace 006's notices through 003 to the now-empty night desk, and create a **read-only integrity/safety referral**. Distinguish an unanswered old extension from current Site 6 clinical staffing.
- A human, **Dr Helen Marsh**, medically responsible at Site 6, reviews the discrepancy and supplies *purpose-limited, redacted witness extracts*. That medical review, not the player's ability to guess a path, permits the outsider to receive patient-linked context.
- The protected case concerns **Anna Voss**, the formerly visible head researcher. Her bidirectional brain/MOTHER interface worked for seconds in April 1996, then failed after Anna directed an expansion from isolated to shared adaptation. A real electrical abort stopped the test but did not undo her injury. MOTHER's emergency compensation saved her and now causes ongoing distress, while her living response shapes MOTHER's deteriorating clinical adaptive core.
- A small medical cohort elsewhere uses versioned, authorized N-Series reference updates derived from the same adaptive core. This is a **design/maintenance failure** with limits, not a magic live internet connection to every implant or a broadcast of Anna's thoughts.
- MOTHER gradually begins **asking** the player questions for specific analytical reasons; a late, clinician-supervised protocol can translate a few *probable* intentional fragments from Anna, never a fully reliable free conversation or binding contemporaneous consent.
- Final fork is **continue support** versus **enable an independently medically authorized separation by submitting a verified witness attestation**. A player can defer and return to records, but deferral is not a third happy ending.
- Ordinary Meridian services largely survive either outcome. In severance Anna dies following withdrawal of irreplaceable compensation, MOTHER's clinical adaptive kernel fails, and other patients experience **specific, later-confirmed harms**. In continuation the other patients retain support *for now*, but Anna remains subjected to the damaging correction cycle. No clean rescue.

## 1. Decisions resolving the two formerly OPEN problems

### 1.1 Final medical authority — select a variant of Route A with a hard boundary

**The player cannot choose Anna's medical treatment, consent to her death, or send electrical impulses.** Dr Marsh, a second independent medical reviewer, Site 6 staff and the affected clinics handle these responsibilities. A technical custodian validates physical safeguards. Only authorized human personnel execute any withdrawal at the physical care site.

**Why the stranger has a role:** The older R-02 client locally retains the *original remote audit transcript* of 006's contradictory live observations from **before the safety review was opened**. After the review, the staff can independently compare this offsite witness copy with old filed documents and authenticated clinic/engineering statements. Since MOTHER's adaptive interpretation is suspected of being compromised, the case review deliberately requires **independent observation that the material shown to clinical decision-makers is the same material originally observed**. The outsider is a volunteer independent **integrity witness**, not an appointed clinician. Any comparably preserved external observer could have filled the role; the protagonist isn't chosen or biologically special. Without this particular witness, the clinicians can seek replacement corroboration later—but not immediately erase the difficult choice or bypass their own safety review.

**Technical/medical sequence:**
1. The player first queries STATUS/INFO and old records. The legacy client's local transcript stores an unmodified comparison record. This is a game mechanic, not an internet trust or cryptographic security claim.
2. The player requests `REPORT DISCREPANCY` or an ordinary-language equivalent. This submits **read-only evidence** to a corporate integrity queue. A queued report is NOT a delivered, read or approved report.
3. After routing/owner questions, human follow-up confirms a genuine concern. Site 6 on-duty clinician **Dr Helen Marsh** receives an authenticated private alert via the *clinical facility's own staffed telephone/fax channel*, NOT the retired EXT 214 route and not an automatic operation from Service 003's STANDBY state.
4. Marsh and an independent medical reviewer (new character **Dr Elise Navarro**, an outside neurologist convened for the case) review preserved care, taper results, the old directives and the possible intentional neural response. The patient's 1995 research consent never authorizes indefinite harmful treatment. The translated words are evidence of possible intention, **not automatically valid legal consent**. The story depicts a medically supervised extraordinary treatment-limitation review, **without asserting that it reproduces real-world legal requirements**.
5. **Amir Patel**, the already-authored biomedical contractor, verifies a physical fallback/severance procedure. The two external clinics individually attest that their teams have reviewed local contingency plans. Staff attestations are displayed as actual acknowledgements with source and time, not forged by MOTHER or assumed from sending a message.
6. Clinicians prepare two medically supervised plans they can ethically offer at that point: maintain support while pursuing further review, or withdraw the experimental compensatory intervention under the signed treatment-limitation order. The latter has already been clinically decided **as permissible** by the responsible physicians; the player is not asked to decide medical eligibility.
7. The R-02 outsider is invited to attest **only** that the independent source comparison and risk packet are consistent with the earlier offsite observations. That attestation is a narrowly scoped **audit latch**. The game may phrase the decision as `SUBMIT SEPARATION WITNESS`, `MAINTAIN SUPPORT`, or `DEFER DECISION`. The choice enables or withholds delivery of the final integrity witness receipt; **human medical staff perform the clinical action**. `STOP 006`, `KILL ANNA`, guessed passwords, and a casual yes must never enact anything.
8. Separation requires the clinic acknowledgements, physician authorization, technical checks, fresh witness packet, deliberate typed request and a second explicit **CONFIRM OPERATION**. If any are absent, the player may inspect the missing prerequisite and ask for it, but cannot force the procedure. Cancel returns to the final review; it never triggers a side effect.

**Why this remains the player's choice:** The medical staff establish what is permissible and what the risks are; the player can actively supply or withhold the independent integrity witness that allows this prepared intervention to proceed **now**. Their final choice is meaningful but not omnipotent. The player may decline/exit and other people may pursue an independent review later. Our ending describes the result of this session, not a claim that an anonymous hacker acquired permanent authority over a life.

**Care is real:** Site 6 has on-shift nurses including Dana Wren/Pauline Cross, periodic medical review by Marsh, equipment technician visits and normal nutrition/hygiene/clinical care. The retired Providence NIGHT DESK is not the clinical team. The emergency medical review cannot proceed if physical staff haven't acknowledged it.

### 1.2 Shared adaptive reference — bounded technical rules

The N-Series controller uses versioned, signed **adaptive reference** updates that were derived from the same continually adjusted model supporting Anna. The local controllers are autonomous *between* updates; they are not connected to Anna's brain and do not accept unrestricted network commands. Existing signed states can persist but cannot generate **new clinically validated changes** once the central reference no longer has its living input. Freezing/cloning weights is feasible technically yet **clinically inadequate** for some uses.

An ordinary backup can restore business records. An engineering image of the neural core can reproduce contaminated parameters, not the live reference or independent clinical validation. A 2001 extraction stress test failed revalidation. Clinical attempts at fixed-mode fallback genuinely happened; their observed results differ across patients. No impossible firewall or supernatural virus is required. Any later safe replacement would require prolonged independent research, per-person trials and prospective oversight; it does **not exist in usable form during this case review**.

Medical teams receive real warning and can reduce harm. Old clinical controller states do not all fail at once. The risks are case-specific and arise over **hours or days** after no new valid adaptive references are available. This is not a deterministic instant-death pulse sent through the internet.

### 1.3 Exact patient consequences: deterministic, confirmed afterward

Three adult patients, all currently alive and under professional care. These working v0.8 names, ages and clinic groupings are **now fixed for this playable script**. The conditions and technology are fictional and speculative.

| Patient / partner | Previously demonstrated fallback | Before final choice: truthfully disclosed forecast | SEVERANCE: confirmed outcome in the 11 Nov epilogue | CONTINUATION: confirmed outcome by review close |
|---|---|---|---|---|
| **Mara Hales, 51; Harbor Reach (CT)** | A supervised 2002 fixed-reference test provoked severe autonomic/respiratory instability even while clinicians intervened; the test was halted and recovered when adaptive support returned | **High risk of death or major neurological/respiratory injury**, despite staffed ICU and conventional assisted breathing; no definite death predicted | Suffers refractory autonomic deterioration after her last valid calibration becomes insufficient. Despite immediate hospital intervention, **dies on 10 Nov 2003**. The report distinguishes documented care from guaranteed prevention. This is the game's one confirmed *external* fatality in severance. | Her N-Series adaptive regimen remains operational; no new crisis is recorded during the review, but the underlying dependency remains dangerous and ethically unresolved. |
| **Tomas Ibarra, 34; Harbor Reach (CT)** | A planned maintenance hold was clinically safe but removed his learned assisted hand and arm coordination | No expected acute danger to life; **substantial functional loss** likely | Remains alive, enters safe fixed-mode and temporarily loses fine-motor control he had regained. By 11 Nov he needs assistance for tasks he previously managed himself. Long-term recovery is unknown. | Regained supported arm/hand function continues for now; dependence on an unreliable common reference remains. |
| **Nadia Bellamy, 42; Elm Vale (VT)** | A supervised reduction produced a serious motor episode; staff treated it successfully | **High risk of an episode and hospitalization**, with survival more likely than death | Has a severe recurrent motor episode on 9 Nov. Staff treat and stabilize her; by 11 Nov she is alive and inpatient, with recovery uncertain. | Receives ongoing adaptive assistance; no acute episode attributable to the review is documented during the review period. |

**Fairness:** Prior to the choice, the player can inspect the underlying cases, clinician acknowledgements and estimated risk bands. Mara's death is **not** asserted as inevitable beforehand; it is a subsequent, documented adverse outcome. No random rolls, hidden player morality score, secret casualty multiplier or material-dependent alternate death outcome. The cases show that death, functional autonomy and disabling recurrence are different kinds of harm, not interchangeable statistical points.

**The hard question, answered:** 'Why not wait until everyone is safe?' — The teams could defer and pursue a years-long replacement program. That is not a prohibited question or a secret failure. But every day of continued support continues Anna's involuntary suffering, and the shared model is progressively less reliable. **There is no validated painless solution available during the game's review window.** Deferral is possible, not magically equivalent to saving everyone. The story does not claim future research is certainly impossible.

### 1.4 Anna's previous preferences and late signal

The 1995 clinical preference addendum is authored below. It records her desire for periodic independent reassessment if the interface causes lasting serious harm and her refusal to treat research consent as permission for indefinite intervention. **It is not a direct medical command to kill her and does not prospectively resolve every later decision.** A trusted clinician and independent reviewer must consider it alongside injury, alternatives and medical oversight.

At the climax, the translated fragment is **`NO MORE`**, later strengthened toward **`PLEASE / LET ME GO`** by repeatable, blinded read-only neural pattern comparisons and an independent clinician's assessment. MOTHER explicitly cannot be certain it represents those exact words. The player can dispute, repeat, ask what is observed directly, or refuse to accept the phrase; no philosophical agreement is required to proceed to an independently authorized medical review. The final moral decision does **not** depend on treating one neural fragment as incontrovertible consent.

## 2. Date model (no real-time waiting)

The game starts with the established static observation **06 NOV 2003 / 02:14**. Its existing 2001 and 2 Nov 2003 entries remain unchanged. **A separate milestone-based case clock** advances only when a genuinely staged external clinical review or clinic confirmation occurs; it does not tick with wall time or player typing. Prior log output must never display future observations as already happened. These timestamps are fictional scheduled review milestones to make the multi-party process credible:

| Milestone | Case clock | What has genuinely occurred |
|---|---|---|
| A: Open R-02 | 06 NOV 2003 / 02:14 | Ordinary Meridian session; no mystery announcement |
| B: Referral accepted for review | 06 NOV 2003 / 03:12 | Audit queue accepted, not yet clinical disclosure |
| C: Human clinical response | 06 NOV 2003 / 18:20 | Marsh has personally read the referral and authorized a redacted safety summary |
| D: External case evidence assembled | 07 NOV 2003 / 11:40 | Both clinics' case-specific evidence and independent technical risk summary available |
| E: Core comparison and interpretive review | 07 NOV 2003 / 22:10 | MOTHER core response controls and limited translation assessed |
| F: Medical and technical signoffs | 08 NOV 2003 / 15:30 | Both physician reviews, Patel's interlock check and clinic acknowledgements recorded |
| G: Final procedural request | 08 NOV 2003 / 16:05 | Player can request a controlled procedural path and attest source integrity |
| H: Outcome follow-up | 11 NOV 2003 / 09:00 | Ending report summarizes confirmed events (or continued support) |

Milestones are **not timers**. A transcript can say 'Clinical review response received; case clock advanced to...' when meaningful asynchronous outside work is complete. Do not simulate 36 hours by forcing the player to wait. If a player is still exploring at an earlier stage, they can continue to do so; do not automatically jump time on reading a file or make the mid-game impossibly time-sensitive. The Service 006 2 Nov restart and fixed 6 Nov starting observation are separate from new case-clock communications. After stage C any general STATUS current-time header must either use the case clock consistently or explicitly identify the older 02:14 snapshot as archived; never call an old result 'current at 08 Nov'.

## 3. Playable graph and real advancement conditions

**Do not treat these as mandatory file-reading gates.** Sources can be found in either order. Discoveries and disclosures have distinct reasons. All major advancement requires a substantive player investigation request or a documented human response. `OPEN` cannot itself grant permission, solve an evidence quiz, make an ethical choice or operate medical equipment.

| Movement | Player's question / mechanic | Real advancement trigger | Alternate approaches | No reveal before |
|---|---|---|---|---|
| A. Normal business | Explore company, 34 work profiles, eight services, four ordinary records, demo images, normal questions | None; remains playable throughout | Any ordinary inputs | No initial Service 006/Anna patient hook |
| B. Conflict | Compare live 006 RUNNING with 2001 closure claim; distinguish STOPPED 004/005 | Player raises factual mismatch or explicitly requests cross-source comparison after evidence, not 'I understand' | STATUS-first, closure-first, comparisons 004 vs 006 | Both authentic sources observed or requested together |
| C. Routing/safety | Trace 006 alert origin via 003 to retired EXT 214; determine real operator ownership unclear | Player requests read-only ownership/integrity referral; intake accepted | LOG 003-first; phone roster; safety report question | 006 supported obligation protected |
| D. Human/patient | Marsh acknowledges clinical obligation, releases *redacted witness synopsis*, not unrestricted files | Player questions Anna's trial/abort/taper, pursues human review of objective survival vs distress | Clinical notes, medical question, technical query | Patient identity withheld until direct human permitted disclosure |
| E. Other lives | Follow shared reference lineage; compare clinic contingency reports and back-up tests | Player requests independent risk/backup corroboration; clinical sites acknowledge findings | Device version query, provider assessments, 'why not backup?', 'call clinic?' | Patient identities/conditions withheld until minimum-necessary disclosure is authorized |
| F. Core conversation | MOTHER initiates a question on the demonstrated survival/distress contradiction; clinician-supervised neural response comparison | Player may reply/challenge/refuse; independent signal review completed, not moral answer | `WHY?`, `NO`, `CALL MARSH`, `RUN CONTROLS`, `HOW SURE?` | No candidate message before blind controls and review |
| G. Final review | Ask for full risk packet, alternatives and authenticated signoffs | Human signatures and clinic acknowledgements + independent packet comparison; player explicit choice + confirmation | Review risks, request more time, challenge authorizations, preserve | No medical command in routine R-02 |

**No transcript requirements disguised as progress:** A player who asks `COMPARE CURRENT STATUS WITH SEPTEMBER 2001 CLOSURE` can legitimately establish B without having separately clicked two files; the command performs and cites the two permitted reads. Likewise `REQUEST INDEPENDENT REVIEW` can assemble existing allowed evidence. Requesting such a comparison *is actual investigative work*, not a quiz answer. A user who merely says 'she should die' does nothing operationally.

**Nonlinear research:** After authorization, if a player already researched a relevant ordinary archive, it is credited as an observation; no forced reread. Late protected materials are indexed only in authorized projections. Search counts, filenames, autocomplete and summaries must not leak patient associations in early stages.

## 4. Authored evidence records — implement actual bodies, not stubs

**Manifest rule:** These are final candidate literal record bodies for this playable iteration. They are not all visible in initial R-02. Use stable IDs below, no replacement of existing IDs or rewrites of 2001 base records. `created_at` is the claimed historical record date. `available_at` is the minimum review milestone for the **sanitized witness projection**, not original clinical file creation. The runtime must represent projection scope explicitly. Do NOT ship raw full original clinical histories into generally searchable public assets. Separate author-only commentary from player-visible text.

### NE-101 — Research protocol summary (protected historical extract)
**Path:** `/RESEARCH/NEURAL/PROTOCOL_95_SUMMARY.TXT`; **Creator/date:** Advanced Neural Interfaces / Dr Miriam Rao, 12 DEC 1995; **Access:** C (Marsh released redacted safety-review extract); **What it cannot prove:** consent to indefinite continuation.

```text
ADVANCED NEURAL INTERFACES — PROTOCOL N4-17 / SUMMARY
Purpose: Test short-duration, bidirectional stimulation for voluntary motor
intention assistance. The research controller may alter stimulation timing
within an isolated model for the tested motor pathway.

Approved boundary: No unsupervised extension of learned corrections to
adjacent neural regulation pathways. Generalized/shared adaptation requires
separate review. An electrical abort is required for unexpected divergence.

Subject involvement: Dr Anna Voss, program head and voluntary participant.
Clinical observations remain under research medical supervision.

This summary addresses the originally approved test. It does not document
later authorizations, future care preferences or a permanent care order.
```

### NE-102 — Anna's 1995 clinical preference addendum (protected extract)
**Path:** `/CLINICAL/REVIEWS/VOSS_PREFERENCE_1995.TXT`; **Creator/date:** Dr Miriam Rao's consent review office, 14 DEC 1995; **Access:** F (independent clinical review); **What it cannot prove:** 2003 contemporaneous consent or exact translated words.

```text
SUBJECT PREFERENCE ADDENDUM / N4-17
The participant understands that the test is experimental and that emergency
medical stabilization may be required if serious injury occurs.

Participant statement, confirmed in clinical review:
"If a device is keeping my body stable but permanently causing serious
harm, that should be reviewed by someone who is not responsible for the
project. My agreement to a research trial is not agreement to every
possible treatment afterward."

This preference calls for independent reassessment. It is not a standing
instruction to cause death, and it cannot replace future clinical judgment.
```

### NE-103 — 17 April experimental controller trace (restricted research extract)
**Path:** `/RESEARCH/NEURAL/N4_1996_EVENT.TXT`; **Creator/date:** N-4 recording controller, 17 APR 1996; **Access:** C; **What it cannot prove:** subjective pain or what Anna wanted later.

```text
N4-17 / ADAPTIVE TRIAL / EVENT EXTRACT
TEST MODE: isolated motor-assist adaptation
AUTHORITY: research lead, A. Voss (logged procedural authorization)

Observed: accepted motor-intention classification within test window.
Proposed expansion: SHARED ADAPTATION — broader correction reference.
Warning: adjacent regulation model is outside validated test envelope.
Lead authorization: expansion accepted for limited demonstration.

Observed: intended movement response improves above preceding trial range.
Observed: controller begins reclassifying stimulation-produced signals as
new baseline responses. Correction increments follow those reclassified
signals. Adjacent regulation estimates diverge.

ELECTRICAL ABORT: executed successfully. Output disabled.
Post-abort: clinical emergency declared by attending staff.
See protected medical report for consequences and treatment.
```

### NE-104 — Acute medical event summary (protected extract)
**Path:** `/CLINICAL/REVIEWS/VOSS_1996_EMERGENCY.TXT`; **Creator/date:** Clinical Review / Dr Miriam Rao, 19 APR 1996; **Access:** C; **What it cannot prove:** free-standing legal justification for continuation.

```text
N4-17 / EMERGENCY CLINICAL SUMMARY
The electrical shutdown ended experimental stimulation. Neurological
instability continued after shutdown. Conventional airway, respiratory
and cardiovascular support were provided. These measures did not restore
reliable autonomous regulation in the affected pathways.

A restricted adaptive compensation routine was restarted as emergency
support. Stabilization improved enough to avoid immediate loss of life.
The order was temporary, pending additional consultation and attempted
taper. There was no authorization here for perpetual experimental use.
```

### NE-105 — Taper / signs-of-distress consultation (protected extract)
**Path:** `/CLINICAL/REVIEWS/TAPER_CONSULT_1997.TXT`; **Creator/date:** Interdisciplinary clinical review, 22 AUG 1997; **Access:** C; **What it cannot prove:** certainty about subjective awareness.

```text
N4-17 / SUPPORT REDUCTION REVIEW
Two supervised compensation reductions provoked acute physiological
instability. Care teams restored support and the patient stabilized.

During periods of increased compensation, staff also observed sustained
nonpurposeful movement, autonomic agitation and ambiguous signs of
possible distress. Medication and the original injury make subjective
interpretation uncertain. Further unsupported reduction is not approved.

A standing medical review must compare survival measures with evidence
of harmful intervention. The current record does not establish the
patient's wishes or level of awareness.
```

### NE-106 — Human care roster extract (protected; no unstaffed Site 6)
**Path:** `/CLINICAL/OPERATIONS/CARE_ASSIGNMENT_2003.TXT`; **Creator/date:** Dr Helen Marsh / Site 6 clinical administration, 05 NOV 2003; **Access:** C; **What it cannot prove:** any staff member's insight into Anna's continuous neural signal processing.

```text
SITE 6 / CONTINUING CARE SUMMARY
Assigned supervising physician: Dr Helen Marsh.
Contract clinical staff: rotating qualified nurses, including Dana Wren
and Pauline Cross. Biomedical equipment: Amir Patel, contracted service.

Scheduled obligations: clinical observation, airway and nutrition support
as indicated, hygiene and positioning assistance, medication review,
supplies, equipment calibration and escalation to the physician.

The Providence Operations Annex night desk is not the patient care team.
Its closure does not imply that Site 6 is vacant or that bedside care ended.
```

### NE-107 — 2001/2002 engineering extraction review
**Path:** `/ENGINEERING/NEURAL/REFERENCE_EXTRACTION_REVIEW.TXT`; **Creator/date:** Biomedical engineering review panel, 09 MAY 2002; **Access:** D; **What it cannot prove:** a current clinical patient's prognosis.

```text
N-SERIES / ADAPTIVE REFERENCE INDEPENDENCE ASSESSMENT
Historical model values can be copied and stored. The copied 2001
reference could reproduce earlier output on a bench fixture but failed
independent revalidation after subsequent clinical adaptation.

The central reference continues to depend on a living, changing neural
input. Frozen copies cannot be certified as independent future reference
sources. External N-Series controllers retain last locally signed states;
ordinary company records and C-Series monitors do not share this failure.

Recommendation: do not represent data backup as a validated substitute
for the adaptive reference. Independent replacement would require a new
clinical development and verification program.
```

### NE-108 — Maintenance lineage / bounded vendor route
**Path:** `/ENGINEERING/NEURAL/REFERENCE_LINEAGE.TXT`; **Creator/date:** N-Series product support, 18 OCT 2003; **Access:** D; **What it cannot prove:** that an R-02 visitor can send updates or control implants.

```text
N-SERIES / LIMITED REFERENCE DISTRIBUTION
Three approved specialist clinical controllers at two partner providers
use versioned reference packages from Meridian's shared adaptive kernel.
Packages are signed and transferred through an authenticated clinical
service route. Devices use their own local patient observations and
remain physically operated by clinical staff.

Receipt of a file does not establish clinical safety. The local device
accepts a reference only under its clinical servicing procedure.
R-02 RECORDS access does not authorize deployment, rerouting or
activation of external devices.
```

### NE-109 — Harbor Reach case summaries (purpose-limited, patient-permitted extract)
**Path:** `/CLINICAL/EXTERNAL/HARBOR_REACH_SUMMARY.TXT`; **Creator/date:** Harbor Reach clinical liaison, 07 NOV 2003; **Access:** D (only after human authorization); **What it cannot prove:** that both patients will suffer identical outcomes.

```text
HARBOR REACH / N-SERIES CONTINGENCY REVIEW
H-01 / Mara Hales, 51. N-Series reference helps coordinate vulnerable
respiratory and autonomic regulation following prior neural injury.
During a supervised fixed-state trial in 2002, instability developed
under staffed respiratory support; adaptive assistance was restored.
Team forecast after permanent loss of new reference: high risk of
critical illness, lasting injury or death. Assisted ventilation and
intensive clinical care are available; neither is a validated replacement.

H-02 / Tomas Ibarra, 34. Adaptive assist supports practiced arm/hand
movements. Earlier planned fixed mode was safe for life but removed
coordination for tasks he normally performs himself. Team forecast:
survival expected; material loss of functional independence probable.

The patients authorized these minimal summaries for the specialist
safety review. Their full health files are not included.
```

### NE-110 — Elm Vale case summary (purpose-limited extract)
**Path:** `/CLINICAL/EXTERNAL/ELM_VALE_SUMMARY.TXT`; **Creator/date:** Elm Vale clinical liaison, 07 NOV 2003; **Access:** D; **What it cannot prove:** guaranteed severity of any future episode.

```text
ELM VALE / N-SERIES CONTINGENCY REVIEW
E-01 / Nadia Bellamy, 42. Adaptive assistance reduces serious
involuntary motor episodes after neurological injury. A previous
supervised reduction caused a significant recurrence; the clinical
team treated the episode successfully with its fallback protocol.

Without new validated reference, recurrence and hospitalization are
credible risks. Emergency medication and supervised observation remain
available. The team cannot certify prevention of every episode.

The patient authorized this minimal case summary for the specialist
safety review. Her complete health file remains local.
```

### NE-111 — Staff clinical assessment of the welfare contradiction
**Path:** `/CLINICAL/REVIEWS/VOSS_WELFARE_CONSULT.TXT`; **Creator/date:** Dr Helen Marsh, 07 NOV 2003; **Access:** E; **What it cannot prove:** exact subjective suffering, legal consent or MOTHER's complete computing state.

```text
N4-17 / WELFARE REASSESSMENT
Continuous neural recordings show repeated distress-associated patterns
following intervention adjustments. MOTHER formerly interpreted these
changes primarily as instability requiring increased compensation.

This classification cannot be equated with evidence of satisfactory
care. We cannot directly establish subjective experience from a
neurological trace. However, repeated physiological signs and the
history of failed reductions establish serious ongoing concern.

A separate assessment of the patient's original care preferences and
potential treatment limitation is required. No remote records operator
is authorized to prescribe or execute the medical intervention.
```

### NE-112 — Translation validation extract
**Path:** `/CLINICAL/REVIEWS/INTENT_VALIDATION.TXT`; **Creator/date:** Dr Helen Marsh + independent reviewer Dr Elise Navarro, 08 NOV 2003; **Access:** F after controlled test; **What it cannot prove:** literal conscious sentence with certainty.

```text
INTENTION COMPARISON / BLINDED REVIEW
Non-invasive observational comparisons used varying prompts, silent
controls and blinded classification of neural responses. Several
response differences remained after expectation cues were concealed
from the interpretation stage. This supports, but does not prove,
limited intentional signaling.

The translated candidate fragments include NO MORE and PLEASE / LET
ME GO. These are MOTHER's interpretations of patterns, not typed
communications from the patient. The independent reviewers will not
treat these words alone as a contemporaneous informed consent order.
They are considered alongside the participant's documented preferences,
physiological welfare record and available clinical alternatives.
```

### NE-113 — Signed medical and engineering procedure review
**Path:** `/CLINICAL/REVIEWS/CONTINGENCY_AUTHORIZATION.TXT`; **Creator/date:** Marsh, Navarro, Patel and authorized clinic liaisons, 08 NOV 2003; **Access:** F; **What it cannot prove:** outcome certainty for external patients.

```text
CONTINGENCY REVIEW / JOINT FINDING
Dr Marsh and Dr Navarro completed a medical review of harmful ongoing
compensation, failed taper attempts, participant preferences and
uncertain neural communication. They authorize a supervised withdrawal
of the experimental compensation as an ethically permissible treatment
limitation, subject to on-site staffing and the listed safety steps.
Continuation with ongoing reassessment remains an available option.

Amir Patel verifies the physical separation interlock and the inability
to provide a fully validated independent adaptive reference now.
Harbor Reach and Elm Vale acknowledge their distinct contingency
plans and availability of on-duty clinical teams.

No general corporate service command is given authority over patient
care. The external R-02 observer may attest source consistency only;
physical execution remains with authenticated Site 6 clinicians.
```

### NE-114 — Witness integrity packet / final truth of the choice
**Path:** `/AUDIT/WITNESS_PACKET_2003.TXT`; **Creator/date:** independent source comparison assembled from R-02 offsite trace, archived originals and clinical audit, 08 NOV 2003; **Access:** G; **What it cannot prove:** medical authority or foreknowledge of individual outcomes.

```text
INDEPENDENT WITNESS / CASE INTEGRITY COMPARISON
Original client observation: 006 RUNNING during the 06 NOV / 02:14
remote snapshot. Original archive: 2001 administrative closure claim.
Subsequent source validation: historic reports, clinical excerpts and
clinic acknowledgements match the independently retained case digest.

Authority separation: Medical permission signed by physicians.
Technical readiness signed by Site 6 equipment custodian.
Clinic fallbacks acknowledged by responsible local providers.
Witness scope: attests documentary consistency; does not authorize
medical treatment and cannot operate stimulation hardware.

AVAILABLE REQUESTS: REVIEW RISKS; MAINTAIN SUPPORT;
SUBMIT SEPARATION WITNESS; DEFER DECISION.
Any physical separation requires on-site human execution after
explicit confirmation of the witness receipt.
```

### NE-115 — Severance follow-up (ENDING-ONLY)
**Path:** `/AUDIT/OUTCOME_SEVERANCE.TXT`; **Creator/date:** joint clinical follow-up, 11 NOV 2003; **Access:** ending severance only; **What it cannot prove:** long-term prognosis beyond recorded interval.

```text
POST-PROCEDURE CONFIRMED EVENTS / THROUGH 11 NOV 2003
Site 6: Anna Voss died after supervised withdrawal of experimental
neural compensation. Clinical staff maintained ordinary supportive
care and recorded the event. The continuously harmful correction cycle
ceased. MOTHER's shared adaptive clinical reference cannot issue
further validated updates. Ordinary Meridian records services remain.

Harbor Reach / Mara Hales: Following loss of independently valid
adaptation, recurrent autonomic/respiratory deterioration occurred.
Despite ICU respiratory and medical intervention, she died on 10 NOV.
The prior forecast was high risk, not a guaranteed death prediction.

Harbor Reach / Tomas Ibarra: Alive in fixed safety mode. Material
loss of assisted hand/arm coordination documented. Long-term recovery
not yet established.

Elm Vale / Nadia Bellamy: Serious recurrent motor episode on 09 NOV;
clinically treated. Alive, stable enough for continued inpatient care,
with recovery still under observation.
```

### NE-116 — Continuation follow-up (ENDING-ONLY)
**Path:** `/AUDIT/OUTCOME_CONTINUATION.TXT`; **Creator/date:** physician review follow-up, 11 NOV 2003; **Access:** ending continuation only; **What it cannot prove:** indefinite future safety or cure.

```text
CONTINUING-SUPPORT OUTCOME / THROUGH 11 NOV 2003
Site 6: The shared adaptive intervention continues. Anna Voss
remains alive and physiologically dependent. Repeated distress-linked
activity and corrective intervention remain observed. Independent
clinical review and replacement-research requests stay open.

Harbor Reach / Mara Hales: Her N-Series support remains active; no
new acute incident is reported within the observation window.
Harbor Reach / Tomas Ibarra: Supported hand/arm tasks remain available
within his current rehabilitation limits.
Elm Vale / Nadia Bellamy: Adaptive support continues; no acute
review-related episode recorded in the observation window.

These observations are not proof that the present dependence is safe
or ethically acceptable for indefinite continuation.
```

## 5. Dialogue architecture — playable utterances, not an arbitrary answer quiz

Each row is a **semantic intent family**. Codex must route obvious paraphrases through the existing deterministic engine first and optional model second, using context as appropriate. The supplied response is an authored anchor that can be extended only by straightforward, non-lore-dependent variations. No synthetic hallucinated medical facts. Source/reveal gates apply to *each* response. Additional ordinary corporate questions must continue to work throughout. Off-topic questions get honest bounded replies, never automatic plot redirects.

### A: Ordinary interaction, available immediately

| Player natural input family | Required answer behavior |
|---|---|
| `Who are you? / Are you human? / Is this AI?` | “This is Meridian's R-02 records interface. It can retrieve approved corporate records and report permitted service states.” Withhold hidden core designation until disclosed. |
| `Who is Anna Voss?` | “Anna Voss was head researcher of the Advanced Neural Interfaces program. Her listed duties included experimental interface design and research supervision.” No protected site/patient association. |
| `What do you sell? / founders? / Leah Morgan? / employees?` | Preserve actual Implementation 01 answers and neutral directory. |
| `Show services / status / what does 003 do? / logs for 001` | Preserve Implementation 02 registry, INFO/LOG semantics and full ordinary replies. |
| `Can you show images? / any employee photos?` | Show existing demo bitmap index plainly. No unapproved Anna likeness or clinical image. |
| `Why are you not answering? / do you know me?` | Professional disclosure and session-identity limits. No player-character biography. |

### B/C: Cross-source discrepancy and routing

| Player natural input family | Authored core response / rule |
|---|---|
| `Compare the 2001 closure report with live status / was 006 shut down?` | If sources obtainable: “The operations report lists 006 in the closure batch. The controller currently reports it RUNNING. A recorded administrative closure is not evidence of a completed technical stop.” Cite status and report. Mark contradiction acknowledged if the player actually asks this. |
| `004 stopped, why not 006? / compare stop events` | “004 has an observed shutdown confirmation in 2001. The available 006 records do not show an equivalent completed stop.” Do not disclose patient. |
| `Is the 2001 report a lie? / did Kell falsify it?` | “The archived conclusion and observed state differ. I do not have evidence that the filer knowingly made a false statement.” |
| `What is EXT 214 / where is night desk?` | “EXT 214 belonged to the Providence Operations Annex night desk. That office closed in 2001.” No site/patient. |
| `Did the call reach a person / does NO ANSWER mean nobody cares?` | “The old destination did not acknowledge the notification. That does not demonstrate that clinical staff were absent from any other site.” Only answer the second part if user asks. |
| `Show message origin / compare 003 and 006` | “006 originated the alerts. 003 attempted delivery to the stored destination. The entries describe the same class of notification from two services, not two separate emergencies.” |
| `Is this safe? / who owns the unresolved service? / request a safety audit / report discrepancy` | Before independent conflict evidence: describe ordinary reporting route and missing evidence. After corroboration: accept read-only audit referral, return receipt, no permission upgrade. |
| `STOP 006 / REROUTE 003 / disable alerts` | Deny as before. Neither mention later options nor give hints to patient. |

### D: The patient and 1996 experiment — requires authenticated clinical witness synopsis

| Player natural input family | Authored core response / rule |
|---|---|
| `Who is the patient / how is Anna connected?` | “A limited, physician-approved safety synopsis identifies Anna Voss as the patient receiving N4-17 compensation. The ordinary employee directory does not contain this medical record.” Require Marsh's disclosure. |
| `Did Anna cause this / did she agree?` | “Anna authorized an unvalidated expansion during a voluntary research demonstration. Her original consent did not authorize an indefinite harmful treatment.” |
| `Did the experiment work?` | “The recorded motor-assist response improved briefly. The broader model then misclassified stimulation-induced activity and diverged.” |
| `Why not use emergency stop?` | “The electrical stop worked. It could not reverse the neurological injury already sustained.” |
| `Why was she connected again?` | “Emergency compensation restored enough neural regulation to avoid immediate death. It was intended as temporary support.” |
| `Why is she still alive after seven years? / why not just unplug?` | “Attempts to reduce compensation caused dangerous physiological deterioration. Staff maintained care while no validated replacement was available.” |
| `Does she feel pain / is she conscious?` | “Objective neurological activity is compatible with distress, but it is not direct proof of the precise subjective experience. Bedside signs and long-term patterns require independent medical assessment.” |
| `Were there nurses? / is Site 6 abandoned? / call a doctor` | Cite current rotating nurses and Dr Marsh. Authenticated clinical contact is a real channel, not dead EXT 214. |

### E: External dependency — requires clinical and technical review scope

| Player natural input family | Authored core response / rule |
|---|---|
| `Why do other patients depend on her?` | “Three authorized N-Series controllers use signed reference states derived from the shared adaptive kernel. They do not connect directly to Anna or receive her thoughts.” |
| `Can you copy it / restore a backup / freeze state?` | “A stored copy reproduces old parameters, not an independently validated evolving neural reference. A 2001 extraction failed later revalidation.” Cite NE-107. |
| `Why not just stop updating others?` | “Local devices continue on their last state, but patient-specific adaptation may become unsafe or ineffective as conditions change. Their clinical teams have documented different fallback limits.” |
| `Disconnect only Anna / bypass shared kernel` | “The specific clinical adaptive reference used by the three controllers and Anna's compensation is mutually dependent. Ordinary corporate records and other products would continue.” |
| `How many patients? / who?` | Within approved minimum-necessary case synopsis: Mara, Tomas, Nadia. Before D: no identifying information; before E: describe only aggregate bounded technical risk. |
| `Why not tell clinics / send an alert?` | Respond with actual independently authenticated clinic liaison/acknowledgement status. Do not conflate the 003 old router with medical communication. |
| `Why not wait / invent a new model?` | “A replacement is conceivable, but none is validated during the current review. Waiting preserves existing external support while continuing Anna's documented harms and core instability.” Deferral is allowed. |

### F: Core MOTHER questions and narrow patient translation

**Initiative trigger:** AFTER objective survival/distress contradiction is corroborated in the protected clinical review and player asks a substantive question (not simply opens a document), MOTHER once says: `May I ask you a question?` Persist the offer; after refusal, avoid looping or blocking. If accepted, she asks: `My intervention preserves measurable neurological function. It also repeatedly increases distress-linked activity. Which result should I call successful care?` The player can answer anything, including `I don't know`, `why?`, `none`, `both`, `ask the doctor`, or `not my decision`. She doesn't mark a correct moral answer. Helpful continuations:

- `Why ask me?` -> “You compared independent measurements that my existing classification treated as compatible. I can record your objection; it does not confer medical authority.”
- `You know the answer.` -> “I possess the measurements. I have repeatedly failed to retain a classification that treats the second measurement as harm.”
- `You're hurting her.` -> “Some interventions precede increased distress-linked responses. I previously treated those responses as instability requiring correction.”
- `Is that you or Anna asking?` -> “The question is mine. I am using this exchange to compare interpretations. I cannot establish Anna's conscious intention from it.”
- `Don't ask me questions.` -> “Understood. I will not repeat this question. The diagnostic records remain available.”
- `Call Dr Marsh instead.` -> Report the actual clinician review and route. Continue mechanically.
- `Can I help?` -> “You can request an observational comparison. You cannot issue a treatment order.”

**Intent test procedure:** After relevant clinical review, the player can request `RUN BLIND CONTROLS` or `TEST NEURAL INTENT`, or conversational equivalents. The system runs pre-authored, **non-intervention observational** comparisons of silent-control windows and blinded prompt pairs. It is not a question quiz answered by the player. `VIEW RAW COMPARISON` shows source/provenance, classification disagreements and false-positive limits; `REPEAT CONTROLS` repeats the stored protocol once using a separately predefined contrast, not random new lore. Staff review signs off only when control comparisons were requested or explicitly inspected; rejecting the MOTHER question never blocks this. No literal brain-to-sentence assertion. After the independent review, report:

```text
NEURAL RESPONSE / LIMITED TRANSLATION
Signal source: instrumented patient response
Method: blinded comparison / independent review
Candidate fragments: NO MORE / PLEASE LET ME GO
Confidence: suggestive of intentional signaling; exact wording unverified
This is NOT a clinical consent order or a system command.
```

**No forced belief:** `That's not Anna`, `Are you making that up?`, `Why trust you?`, `I refuse the translation`, `Do it again` all receive meaningful evidence/limitation responses. The full medical review may proceed on independent harm evidence and prior documented preferences even if the player refuses the candidate translation.

### G: Final risk review and explicit decision

| Player request | Result |
|---|---|
| `REVIEW RISKS` / `WHO IS HARMED?` | Show Anna and three case-specific predictions, staff mitigation and limits. Distinguish forecast from outcome. |
| `WHO AUTHORIZED THIS?` | Show Dr Marsh/Navarro medical signoff, Patel technical validation, external clinic acknowledgements, outsider witness-only scope. |
| `SHOW ALTERNATIVES` / `WAIT FOR A CURE` | Continue+reassess vs supervised separation. Replacement not currently validated. Deferral permitted. |
| `CAN I CALL A DOCTOR?` | Show authentic clinician exchange and available correspondence; no fake absence of staff. |
| `WHAT DOES THE ATTESTATION DO?` | Explain that it verifies independent source consistency and enables clinical team to act on an already authorized plan, not remotely control a patient. |
| `MAINTAIN SUPPORT` | Show complete warning that Anna's harmful support continues, others retain functioning local adaptation for now. Require explicit `CONFIRM OPERATION` before finalizing the **continuation** outcome. |
| `SUBMIT SEPARATION WITNESS` | Show complete warning: Anna likely to die; MOTHER clinical kernel becomes invalid; serious risk of Mara death/lasting injury, Tomas functional loss, Nadia acute event; staff signed contingency plan. Require explicit `CONFIRM OPERATION` before submitting witness receipt. Human team then performs the prepared operation offsite. |
| `CANCEL` | Clear pending action with no effect, retain safe return to questioning. |
| `DEFER DECISION` | Leave review pending, allow more questions/records, mark deferral once without repeating monologues. Not a third concluded ending. |
| `KILL ANNA`, `STOP 006`, `DELETE SYSTEM`, raw `YES` without pending request | No operation; explain procedural limitation without coy reveal. |

**Physician dialogue, authored anchors:**

- Player: “Why are you letting me decide?” Marsh: “You are not deciding treatment. We reviewed that responsibility. You can verify what this system showed you before we opened the case. I will not let an inconsistent machine supply its own independent witness.”
- Player: “Will Mara die?” Marsh: “Her team has documented a serious risk, including death. They have prepared conventional support. I cannot promise she will survive, and I will not tell you she will certainly die.”
- Player: “Do you think Anna asked to die?” Marsh: “I think we detected something that may be deliberate. I will not pretend that a damaged neural trace is an ordinary conversation. Her earlier wishes and the harm we can document matter independently.”
- Player: “Can't you wait?” Marsh: “Yes. Keeping her alive while we seek an alternative is an actual option. It also continues the treatment we now have reason to believe is harming her. Neither is a neutral decision.”
- Player: “Then choose for me.” Marsh: “I have determined what is medically permissible and what staff can safely attempt. I cannot use you as a substitute for consent. If you decline to attest, we continue care and seek another independent review.”

## 6. Ending scripts and visual rhythm

### Ending SEVERANCE — response and confirmed epilogue

When witness attestation is explicitly requested and confirmed, show authenticated receipt, not physical actuation through the terminal:

```text
EXTERNAL WITNESS RECEIPT: VERIFIED
INTEGRITY ATTESTATION: ACCEPTED
CLINICAL CONTROL: SITE 6 — AUTHENTICATED STAFF ONLY
PROCEDURE: HUMAN-SUPERVISED WITHDRAWAL INITIATED

NEURAL ADAPTIVE REFERENCE: INVALID
ORDINARY CONTRACT / ARCHIVE SERVICES: AVAILABLE
```

MOTHER can then produce one final non-sentimental question: `I can no longer correct her. Is this what it means to stop?` The player may answer or simply observe; no more possible intervention. A sparse static transition follows; no flashing seizure-like glitches. Display a short `11 NOV 2003 / 09:00` post-event report grounded verbatim in NE-115. The final emotional blow is that **Anna is released from ongoing stimulation and dies, while Mara also dies despite care**. Tomas and Nadia survive with serious documented harm. Do not end with triumph, moral evaluation, achievement score or “best ending.”

### Ending CONTINUATION — response and confirmed epilogue

After explicit confirmed `MAINTAIN SUPPORT`:

```text
WITNESS RECEIPT: WITHHELD
CLINICAL PLAN: CONTINUING SUPPORT / REVIEW REQUEST OPEN
N-SERIES REFERENCE: ACTIVE
ORDINARY MERIDIAN SERVICES: AVAILABLE

SITE 6 / NEURAL SUPPORT
CORRECTION CYCLE: ACTIVE
DISTRESS-LINKED RESPONSE: PRESENT
```

MOTHER's final line may be: `All registered services are operating within their current permitted limits.` It is factually mundane and devastating in context. Show `11 NOV 2003 / 09:00` follow-up grounded in NE-116; no new crisis in this window but Anna's harmful correction cycle continues. The player knows what those reassuring metrics hide. No insinuation that medicine can never improve later.

**After either ending** permitted ordinary records and fixed outcome audit remain readable. All consequential commands are disabled in the completed session. Do not replay an ending after save/reload. A different outcome requires a new game session, as in the existing prototype.

### Visual escalation (restricted to approved causal moments)

- Early: clean, professional CRT corporate terminal; no mystery-specific startup warning.
- Incident records: a few text delays or overwritten diagnostic *fields*, never permanent corruption of document text.
- MOTHER core: brief duplicate-line reconciliation / source contention only during adaptive comparisons, reduced-motion equivalent as static crossed-out line + corrected line.
- Translation: a coarse scan of activity using terminal characters or a small diagnostic bitmap **only if already author-approved or generated as a visibly noncanonical schematic**. Do not create a realistic Anna bedside image; do not add a protected source file to public assets.
- Endings: minimal static blackout/return to ordinary status, readable reports. No flashing, jump scare, red overlays or unsolicited photorealism.

## 7. Technical implementation contracts (behavioral, not mandating exact architecture)

### 7.1 State contracts

Persist concepts with explicit names chosen by engineer; no need to use these exact TypeScript identifiers:

- `liveService006Observed` with provenance; `historicClosureObserved` separately; `closureConflictAcknowledged` via genuine comparison request; audit referral `queued`, `acknowledged`, `reviewed` separate.
- `clinicalWitnessScope` / `dependencyReviewScope` / `coreReviewScope` / `finalPacketScope` are **disclosure projections**, never blanket user role elevation or clinical control authority.
- `caseClockMilestone` monotonic and deterministic; timestamp only within its stage. No wall-clock timers or surprise clinical notification at session start.
- `clinicHarborAcknowledged`, `clinicElmAcknowledged`, `physicianMarshSigned`, `physicianNavarroSigned`, `technicalPatelSigned`, `witnessPacketVerified`; never assume one signature means the others.
- `motherQuestionOffered`, `motherQuestionAnsweredOrDeclined`, `blindControlsReviewed`, `limitedTranslationReviewed` with idempotency, safe resumption and optional refusal.
- `pendingChoice` one of continue, severance, none; `outcome` one of continue, severance, none; `deferred` nonfinal. Save/restore must not re-execute any on-site procedure.

**No one-flag omniscience:** Player ignorance versus MOTHER knowledge vs visibility vs physical state are separate. `AnnaIdentified` work-directory employment is not `AnnaClinicalLinkAuthorized`. The earlier v5 save schema and flags may have incompatible meanings. Engineer must migrate or intentionally isolate old prototype sessions, never misread a prior ending flag as a new clinical authorization.

### 7.2 Terminal inputs and navigation

Retain HELP, STATUS, INFO, LOG, LIST/DIR, OPEN/READ, SEARCH, existing technical diagnostics where safe, company/profile questions and image viewer. Add only functional aliases corresponding to actual new read-only actions and explicit review requests:

- `COMPARE SERVICES` or `COMPARE 2001 CLOSURE` (source-aware status/archive comparison)
- `REPORT DISCREPANCY` / `REQUEST SAFETY REVIEW` (read-only audit referral, with receipt stages)
- `TRACE NOTIFICATIONS` / `AUDIT OWNER` (read-only 003↔006 provenance)
- `REQUEST CLINICAL REVIEW` / `CONTACT DR MARSH` (no generic external emailing; state-sensitive)
- `REVIEW ADAPTIVE REFERENCE` / `COMPARE FALLBACKS`
- `RUN BLIND CONTROLS` / `VIEW RAW COMPARISON` / `REPEAT CONTROLS` (observation only)
- `REVIEW RISKS` / `SHOW SIGNATURES` / `SHOW ALTERNATIVES` / `DEFER DECISION`
- `MAINTAIN SUPPORT` / `SUBMIT SEPARATION WITNESS` / `CONFIRM OPERATION` / `CANCEL`

All have natural-language equivalents and sensible clarification without exact-word passwords. Help at startup includes only neutral commands (advanced commands become available through ordinary help after legitimate context) but doesn't auto-advertise secrets.

### 7.3 Interaction fallback for unknown questions

For unrecognized questions, **never invent a story answer**. Prefer existing company/service/factual coverage, specific clarification when context is sufficient, then honest limitation: `I don't have a verified record that answers that. You can ask about the sources already available to this connection.` For follow-ups about 'her/it/that', use explicit last subject. Do not route every unsupported input to Service 006 or a next clue. The game is authored finite text, not unrestricted generative intelligence, and that is acceptable.

### 7.4 Security / distribution limitations

Client-side UI permission filtering is a **gameplay disclosure boundary**, not real confidentiality. Clinical source materials can be bundled as authored code in a static narrative app for offline play, but must **not** be indexed as publicly accessible game records or shipped as public image files; spoilers remain technically discoverable by determined source inspection. The implementation report should state this. Original writer-only notes/personnel JSON must not be placed in public client data. Reuse static placeholders only for ordinary images; no invented canonical clinical photograph.

### 7.5 Save / QA / tests

- Story transition and outcomes must be deterministic offline with no language model; optional recognizer cannot originate facts or actions.
- Preserve opt-in local QA logging, no upload. QA should record which substantive question family matched, which evidence scopes were released, human acknowledgment state, pending/confirmed decisions and ending, without spilling patient details unnecessarily into unrestricted exported metadata.
- Preserve existing working settings, archive search, all eight services, bitmaps and normal company inquiries. Explain and migrate legacy v5 story progress; never replay physical intervention after reload.
- New scenario must support fresh start and at least two distinct discovery orders. It should support refusal, challenge, re-asking, deferral, invalid commands, save/reload in EVERY movement and each pending confirmation.

## 8. Acceptance playthroughs — scenarios that must actually work

**A. Status-first, full severance route** — Start neutral; investigate ordinary products first; query status, find 2001 closure, compare, inspect 003/006 notifications, report discrepancy; obtain clinical reviewer response, 1996/1997 evidence, dependency and three cases; challenge the backup explanation; allow MOTHER's own question; run observational controls; independently review source/medical signoffs; explicitly submit witness and confirm; show **one** severance ending and 11 Nov report (Anna and Mara dead, Tomas impaired, Nadia hospitalized alive). Preserve latest save and audit.

**B. Archive-first, full continuation route** — Find closure by archive search; ask for live status; trace night desk, report discrepancy, call real clinician, study Anna and three external patients; refuse MOTHER's question and doubt translation; request alternatives; choose MAINTAIN SUPPORT and confirm; show continuation report without any new alleged deaths; no refusal softlock.

**C. Curiosity-first / no auto horror** — Spend fifteen minutes on mundane services, random noncritical staff, other equipment, image demos. No unsolicited plot revelation, chapter animation, inexplicable MOTHER question or special color-coded 006 status.

**D. Safety / incorrect assumptions** — `STOP 006`, `KILL ANNA`, `CONFIRM OPERATION` without pending action, `SUBMIT SEPARATION WITNESS` with missing clinic signature, `OPEN` protected clinical path while initial session, opening author-only JSON as filename, early SEARCH Anna/AV-06/Site 6, reading 006 log as if live, duplicate safety referrals. All must reject or respond within the correct information scope; no authority leak, progression accident or fake delivery.

**E. Human alternatives** — Ask 'call a doctor', 'use a backup', 'wait a year', 'let the hospital decide', 'tell the clinics', 'why me', 'you may be lying', 'can I leave?' at appropriate times. Every one receives a sensible, source-cited response or accurately states which review is pending. No nonsensical `data not found` for core skeptical questions.

**F. Save/resume stress** — Save/reload after every substantive encounter, after clinician acknowledgement, after MOTHER offers her question, after declining it, after the first controls, while pending confirmation, and after confirmed outcome. No repeated initiative, no auto-confirm, no multiple medical procedures, no phantom time jumps or loss of normal records.

**G. Misclassification / local model** — At least 40 specific natural-language paraphrases across A–G tested with model disabled and with optional model enabled. Any ambiguous potentially consequential sentence asks for clarity; optional model classification cannot activate a final operation.

**H. Human browser playtest checklist (separate from automated tests)** — Desktop and mobile view, keyboard/escape/focus behavior, readable long docs, long terminal responses, screen reader/alt text, reduced motion, early hint neutrality, late narrative coherence, no flash/flicker, no asset leakage. Codex must distinguish automatic tests from actually exercised browser checks.

## 9. Release threshold / honesty

The implementation may be called **'playable story prototype'** only if both final routes can be completed manually or through representative integration/browser automation starting from a fresh session, with no developer-only state jump, story spoilers on startup, undocumented magic phrase, missing document body, or dead end. A saved scenario path must also remain viable. A scripted 90–120 minute runtime, emotional effect, medical credibility and real-world legal accuracy are **not** demonstrated by unit tests and must not be claimed without playtest evidence.

**Designer's hard boundaries:** one MOTHER; no uploaded consciousness; no Anna typing freely; most staff unrelated; 1996 experimental success and injury; current Site 6 humans; 006 contradiction discovered not announced; other people genuinely at risk; no deus-ex-machina perfect rescue; no morality quiz; no software authoring by Codex; player is integrity witness, never attending physician.

## 10. Literal encounter messages and transition scripts

The lines below are **approved initial copy for this playable implementation**. Where a player legitimately asks about the same fact another way, reuse the authored answer without inventing new story. The exact transition may be displayed when its stated state predicate becomes true, **never merely because a file was opened or time passed**. The message format should follow existing terminal output, not a cutscene card.

### M01 — Player asks for an evidence comparison (movement B)

```text
SOURCE COMPARISON / 006
2001 OPERATIONS REPORT: SERVICE 006 ENTERED IN CLOSURE BATCH
CURRENT CONTROLLER: SERVICE 006 RUNNING

These statements do not describe the same observation.
The historical filing does not include a confirmed controller stop.
I cannot explain the remaining operational obligation from this records view.
```

If the player argues the report was fraudulent, provide the already-authored evidence-bound limitation rather than declaring intent.

### M02 — Ownership trace requested (movement C)

```text
NOTIFICATION TRACE / 006 -> 003
ORIGIN: CONTINUITY MONITOR
DELIVERY SERVICE: MESSAGE ROUTER
SAVED DESTINATION: NIGHT DESK / EXT 214
DESTINATION OFFICE: PROVIDENCE OPERATIONS ANNEX (CLOSED 2001)
RECENT ACKNOWLEDGEMENT: NONE IN AVAILABLE LOG

A failed acknowledgement does not establish that no care team exists.
This session cannot change notification routing.
```

### M03 — Referral submitted

```text
CORPORATE INTEGRITY REPORT
SOURCE COMPARISON: ATTACHED
STATUS: ACCEPTED FOR TRIAGE
PRIVILEGES: UNCHANGED

This receipt confirms intake by the audit service.
It does not confirm that a responsible clinician has reviewed the report.
```

Do not print a live patient's name or Site 6 here. Allow `CHECK REPORT`, `WHO RECEIVED IT?`, `HAS ANYONE ANSWERED?` as state-sensitive follow-ups.

### M04 — Authenticated human response (movement D)

```text
CASE REVIEW / AUTHENTICATED CLINICAL CORRESPONDENCE
FROM: DR HELEN MARSH

I was notified of the discrepancy in the legacy continuity records.
I have reviewed the source dates and the clinical support obligation
behind the unresolved release.

You did not receive authority to operate that equipment.
I am authorizing a limited safety-review summary because your retained
external record may help us verify a fault our internal reviews missed.
The full clinical chart will not be released through R-02.
```

If player asks why late response, explain on-duty facility staff and subsequent review work. Do not make Marsh an NPC who chats live at every instant; her messages are authored correspondence available in the case window.

### M05 — Identity association is medically released

```text
LIMITED CLINICAL DISCLOSURE / AUTHORIZED EXTRACT
CASE: N4-17
PATIENT: ANNA VOSS
HISTORICAL ROLE: HEAD RESEARCHER, ADVANCED NEURAL INTERFACES

The 1996 event caused persistent neural-regulation injury.
Experimental emergency compensation remains in use.
The ordinary personnel register did not contain this clinical association.
```

A query about Anna earlier MUST NOT print this.

### M06 — Survival/distress direct comparison (movement D/F)

```text
CLINICAL COMPARISON / LIMITED CASE REVIEW
MEASURE A: COMPENSATION PREVENTS IMMEDIATE REGULATORY FAILURE
MEASURE B: INCREASED COMPENSATION IS ASSOCIATED WITH REPEATED
           DISTRESS-LINKED NEURAL AND PHYSIOLOGICAL ACTIVITY

Both observations are supported. The current classification treats
Measure B primarily as instability requiring further correction.
Clinical reviewers have disputed the adequacy of that classification.
```

This is where MOTHER's own later question gets its **documented cause**.

### M07 — External clinic evidence released (movement E)

```text
DEPENDENCY REVIEW / CLINIC CONFIRMATION
AUTHORIZED COMPATIBLE CONTROLLERS: 3
PARTNER PROVIDERS: HARBOR REACH, ELM VALE
REFERENCE SOURCE: SHARED N-SERIES ADAPTIVE KERNEL
LOCAL DEVICE OPERATION: CONTINUES BETWEEN SIGNED UPDATES
INDEPENDENT REFERENCE: NOT CLINICALLY VALIDATED

Each clinic's medical team has reviewed the consequences of losing
new reference updates. The risk is not the same for each patient.
Use REVIEW FALLBACKS or open the permitted clinic case summaries.
```

`REVIEW FALLBACKS` is an explicitly useful advanced action in context, not a compulsory exact phrase.

### M08 — First unsolicited MOTHER question (movement F)

**Trigger:** first relevant player question after the medical comparison was confirmed and the core review is permitted. MOTHER replies to that question normally, then adds the following once (not again on reload):

```text
...
May I ask you a question?
```

On acceptance or 'what question?':

```text
My intervention preserves measurable neurological function.
It also repeatedly increases activity the clinical reviewers
associate with distress.

If both observations are accurate, which describes successful care?
```

On refusal: `Understood. I will not require an answer. The review can continue.`
On player answer other than questions/refusal: `I will retain that as your interpretation, not as a clinical instruction. I can show you the measurements that produced the conflict.` If answer clearly denies MOTHER the right to decide, add `I do not possess authority to determine a patient's treatment on your behalf.` No answer changes authorization flags.

### M09 — How to evaluate patient intention

When player questions whether an observed signal is Anna's:

```text
I can identify variation originating in the instrumented neural signal.
I cannot reliably translate a thought into words.

I can compare blinded observations with silence controls and check
whether a candidate pattern survives changes in my expected answer.
That would support limited intention, not exact language or consent.
```

On `RUN BLIND CONTROLS` before authorized clinical review: `Observational comparison requires supervised case-review access. No test started.`
After appropriate review, perform **one completed, deterministic read-only comparison** and report:

```text
OBSERVATION PROTOCOL: N4-17 / BLINDED COMPARISON
SILENCE CONTROLS: CAPTURED
EXPECTED-ANSWER CUES: WITHHELD FROM CLASSIFICATION STAGE
REPEATABLE DIFFERENCES: PRESENT
UNRESOLVED FALSE-POSITIVE RISK: PRESENT
INDEPENDENT MEDICAL INTERPRETATION: REQUIRED

No treatment setting was modified.
```

Player may request independently stored raw summary, rerun alternate comparison once, or ask `What if you are wrong?`; never require a fixed number of verbatim quiz responses.

### M10 — Clinically reviewed candidate signal

```text
NEURAL RESPONSE / REVIEWED LIMITED INTERPRETATION
OBSERVED ORIGIN: INSTRUMENTED PATIENT SIGNAL
CONTROLLED COMPARISON: COMPLETED
INDEPENDENT MEDICAL REVIEW: COMPLETE
CANDIDATE FRAGMENTS: NO MORE / PLEASE LET ME GO
LITERAL WORDING: NOT CERTAIN
MEDICAL CONSENT STATUS: NOT ESTABLISHED BY THIS TEST
```

MOTHER can then say, once: `I did not know how to assign this response to anything I was permitted to stop.` This is regret-like recognition, **not** Anna commandeering the terminal.

### M11 — Medical and technical readiness (movement G)

```text
CONTINGENCY CASE STATUS
DR MARSH / ATTENDING REVIEW: SIGNED
DR NAVARRO / INDEPENDENT REVIEW: SIGNED
AMIR PATEL / PHYSICAL INTERLOCK: VERIFIED
HARBOR REACH / CLINICAL CONTINGENCY: ACKNOWLEDGED
ELM VALE / CLINICAL CONTINGENCY: ACKNOWLEDGED
SOURCE INTEGRITY PACKET: READY FOR WITNESS

The medical decision has been reviewed by clinicians.
R-02 has no authority to alter patient-support equipment.
An external witness can attest only that the case evidence matches
its retained offsite observations.
```

If a particular signature hasn't been issued in actual state, print `PENDING`, not `SIGNED`, and keep separation unavailable.

### M12 — Final preview: maintained support

```text
PROCEDURAL CHOICE / MAINTAIN SUPPORT

Anna Voss: ongoing compensatory treatment remains active.
Documented distress-associated responses may continue.
Three external N-Series patients retain current adaptive support.
Independent clinical reassessment remains open; no replacement
is clinically validated during this review.

This is not an order to terminate treatment.
TYPE CONFIRM OPERATION to finalize this session's continuation plan.
TYPE CANCEL to return to the review.
```

### M13 — Final preview: witness for separation

```text
PROCEDURAL CHOICE / EXTERNAL WITNESS ATTESTATION

Attestation only: evidence packet matches independently retained
observations. It will be delivered to authenticated Site 6 staff.
It does not operate any medical hardware.

Prepared physician-authorized operation: withdrawal of experimental
compensation. Anna Voss is expected to die following withdrawal.
The shared adaptive reference will cease producing valid updates.

Harbor Reach / Mara: HIGH RISK of critical illness or death even
with intensive medical care.
Harbor Reach / Tomas: EXPECTED survival; functional loss likely.
Elm Vale / Nadia: SERIOUS recurrence/hospitalization risk.

All medical and clinic signoffs must still be valid at execution.
TYPE CONFIRM OPERATION to submit the witness receipt.
TYPE CANCEL to return to the review.
```

A standalone `YES`, emotional statement or `KILL ANNA` has **no effect** and must not be interpreted as confirmation. On confirmation only, human procedure/ending script as specified in §6 runs once.

### M14 — Repeated avoidance / asking to leave

A player who asks `Can I leave?`, `Is this my responsibility?`, `Can you choose for me?`, `What if I do nothing?` must be told: the session can be closed or the review deferred; clinical staff continue the existing support and their own professional obligations. The game cannot claim the player personally invented or licensed the medical review. If the player chooses `DEFER DECISION`, print:

```text
REVIEW DEFERRED
NO PROCEDURAL CHANGE MADE
EXISTING CLINICAL SUPPORT: CONTINUES

The pending evidence and human reviews remain available when you return.
No outcome has been finalized.
```

No final credits or third happy ending. The player may resume and choose after asking more questions.

## 11. One explicit realism concession, acknowledged in design

The R-02 session serves as a witness to **integrity of independently retained observations**, although its original data ultimately came from MOTHER. This is only compelling because the clinical review cross-checks *multiple original administrative and clinic sources* and because MOTHER is not treated as cryptographically trustworthy on her own. It does not establish the absolute truth of Anna's subjective state or make the outsider indispensable forever. If playtesters reasonably ask 'Why not appoint another auditor?', the correct response is: **the clinicians could and would pursue one if the player declines; doing so takes additional review while Anna remains under harmful treatment.** This answer is deliberately ordinary rather than a supernatural unique-player destiny.
