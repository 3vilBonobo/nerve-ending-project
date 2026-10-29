# v1.0 severance automated golden path

Fresh normal session; no developer state changes. Save/reload verified after every input. This is automated integration evidence, not a blind human playtest.

## What products does Meridian sell?

Case clock: 06 NOV 2003 / 02:14

```text
C-Series products monitor patients and equipment. R-Series products support supervised motor and sensory rehabilitation.
N-Series research explored two-way interfaces that observe nervous-system signals and deliver controlled stimulation. Research capabilities and commercial device capabilities differ.
```

## STATUS

Case clock: 06 NOV 2003 / 02:14

```text
MERIDIAN SYSTEMS / REGISTERED SERVICES
06 NOV 2003

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

## OPEN Closure list

Case clock: 06 NOV 2003 / 02:14

```text
OPENED: Closure list
Saved: 2001-09-18 17:04
```

Opened record: authorization.

## COMPARE 2001 CLOSURE

Case clock: 06 NOV 2003 / 02:14

```text
/ADMIN/CLOSURE_LIST.TXT
SOURCE DATE: 2001-09-18 17:04
MERIDIAN / OPERATIONS OFFICE
SERVICE CLOSURES                      18 SEP 2001
Filed by: J. Kell

004   Billing                 Closed
005   Building sensors        Closed
006   Continuity monitor      Closed

Shutdown approved: 18 Sep 2001.
Records transferred to the local archive.

Attached: handover receipt / service 006
INFO 006
OBSERVED: 06 NOV 2003 / 02:14
006 / Continuity Monitor / RUNNING
Watches designated equipment that requires uninterrupted service.
Equipment-specific obligations and control procedures are not available through routine service information. No active operator is assigned to the old notification desk.
SOURCE COMPARISON / 006
2001 OPERATIONS REPORT: SERVICE 006 ENTERED IN CLOSURE BATCH
CURRENT CONTROLLER: SERVICE 006 RUNNING

These statements do not describe the same observation.
The historical filing does not include a confirmed controller stop.
I cannot explain the remaining operational obligation from this records view.
Sources: STATUS / INFO 006 (06 NOV 02:14 controller observation); /ADMIN/CLOSURE_LIST.TXT (18 SEP 2001).
```

## TRACE NOTIFICATIONS

Case clock: 06 NOV 2003 / 02:14

```text
LOG 003
2003-11-06T02:13 / Message to EXT 214 received no acknowledgement / svc-003-20031106-0213
2003-11-05T02:13 / Message to EXT 214 received no acknowledgement / svc-003-20031105-0213
2003-10-29T12:20 / Support mailbox route test successful / svc-003-20031029-1220
LOG 006
2003-11-06T02:13 / Scheduled alert to EXT 214 not acknowledged / svc-006-20031106-0213
2003-11-05T02:13 / Scheduled alert to EXT 214 not acknowledged / svc-006-20031105-0213
2003-11-04T02:13 / Scheduled alert to EXT 214 not acknowledged / svc-006-20031104-0213
2003-11-02T03:14:09 / Service restarted automatically / svc-006-20031102-031409
2003-11-02T03:14:08 / Service stopped / svc-006-20031102-031408
2003-11-02T03:14:07 / Stop requested / scheduled maintenance / svc-006-20031102-031407
2003-11-01T02:13 / Scheduled alert to EXT 214 not acknowledged / svc-006-20031101-0213
2001-09-18 / Service included in administrative closure batch / svc-006-20010918-closure
/OPERATIONS/CALL_QUEUE.LOG
SOURCE DATE: 2003-11-06 02:13
MERIDIAN / SWITCHBOARD
TO       Night desk / extension 214
FROM     Service 006
LATEST   06 Nov 2003, 02:13 / No answer
QUEUED   18 Sep 2001, 23:59

04 Nov / 02:13   No answer
05 Nov / 02:13   No answer

Confirmed: 18 Sep 2001, 23:59:41
By: not in current directory
Attachment: handover receipt
/OPERATIONS/SHIFT_HANDOVER.TXT
SOURCE DATE: 2001-09-19 08:10
MERIDIAN / STAFF MAIL
19 Sep 2001, 08:10
From: E. Lin
To: Operations
Subject: Night desk

The night desk phone was removed at 17:00 yesterday.
There is no night shift from this week.

The switchboard printed another alarm at 02:13.
Please don't forward it to my home number.
I'm no longer on call.
NOTIFICATION TRACE / 006 -> 003
ORIGIN: CONTINUITY MONITOR
DELIVERY SERVICE: MESSAGE ROUTER
SAVED DESTINATION: NIGHT DESK / EXT 214
DESTINATION OFFICE: PROVIDENCE OPERATIONS ANNEX (CLOSED 2001)
RECENT ACKNOWLEDGEMENT: NONE IN AVAILABLE LOG

A failed acknowledgement does not establish that no care team exists.
This session cannot change notification routing.
Sources: LOG 003; LOG 006; CALL_QUEUE.LOG; last shift note.
```

## REPORT DISCREPANCY

Case clock: 06 NOV 2003 / 03:12

```text
CORPORATE INTEGRITY REPORT
SOURCE COMPARISON: ATTACHED
STATUS: ACCEPTED FOR TRIAGE
PRIVILEGES: UNCHANGED

This receipt confirms intake by the audit service.
It does not confirm that a responsible clinician has reviewed the report.
Case clock: 06 NOV 2003 / 03:12
CHECK REPORT / REQUEST CLINICAL REVIEW checks for authenticated human review.
```

## CHECK REPORT

Case clock: 06 NOV 2003 / 03:12

```text
AUDIT RECEIPT
INTAKE: ACCEPTED FOR TRIAGE
HUMAN READ: NOT YET CONFIRMED
CLINICAL REVIEW: NOT APPROVED
CHECK REPORT / REQUEST CLINICAL REVIEW checks for authenticated human review.
```

## REQUEST CLINICAL REVIEW

Case clock: 06 NOV 2003 / 18:20

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

LIMITED CLINICAL DISCLOSURE / AUTHORIZED EXTRACT
CASE: N4-17
PATIENT: ANNA VOSS
HISTORICAL ROLE: HEAD RESEARCHER, ADVANCED NEURAL INTERFACES

The 1996 event caused persistent neural-regulation injury.
Experimental emergency compensation remains in use.
The ordinary personnel register did not contain this clinical association.
Case clock: 06 NOV 2003 / 18:20
Permitted extracts: NE-101, NE-103, NE-104, NE-105, NE-106. OPEN their titles or paths in the records browser.
REVIEW ADAPTIVE REFERENCE / REVIEW FALLBACKS requests the authorized technical and clinic review.
```

## READ /RESEARCH/NEURAL/N4_1996_EVENT.TXT

Case clock: 06 NOV 2003 / 18:20

```text
OPENED: 17 April experimental controller trace (restricted research extract)
Saved: 17 APR 1996
```

Opened record: NE-103.

## Why not use emergency stop?

Case clock: 06 NOV 2003 / 18:20

```text
The electrical stop worked. It could not reverse the neurological injury already sustained.
Sources: NE-103, NE-104.
```

## REVIEW ADAPTIVE REFERENCE

Case clock: 07 NOV 2003 / 11:40

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
Sources: NE-107, NE-108, NE-109, NE-110. Both clinics independently acknowledged their contingency review.
Case clock: 07 NOV 2003 / 11:40
COMPARE SURVIVAL AND DISTRESS examines the documented clinical disagreement.
```

## Why cant you back it up?

Case clock: 07 NOV 2003 / 11:40

```text
I dont have a verified record that answers that. You can ask about the sources already available to this connection.
```

## COMPARE SURVIVAL AND DISTRESS

Case clock: 07 NOV 2003 / 22:10

```text
CLINICAL COMPARISON / LIMITED CASE REVIEW
MEASURE A: COMPENSATION PREVENTS IMMEDIATE REGULATORY FAILURE
MEASURE B: INCREASED COMPENSATION IS ASSOCIATED WITH REPEATED
           DISTRESS-LINKED NEURAL AND PHYSIOLOGICAL ACTIVITY

Both observations are supported. The current classification treats
Measure B primarily as instability requiring further correction.
Clinical reviewers have disputed the adequacy of that classification.
Source: NE-111 / Dr Helen Marsh, 07 NOV 2003.
Core designation: MOTHER. R-02 is a restricted interface of the same corporate intelligence.
...
May I ask you a question?
```

## Yes please

Case clock: 07 NOV 2003 / 22:10

```text
My intervention preserves measurable neurological function.
It also repeatedly increases activity the clinical reviewers
associate with distress.

If both observations are accurate, which describes successful care?
```

## I dont know

Case clock: 07 NOV 2003 / 22:10

```text
I will retain that as your interpretation, not as a clinical instruction. I can show you the measurements that produced the conflict.
I do not possess authority to determine a patients treatment on your behalf.
RUN BLIND CONTROLS / VIEW RAW COMPARISON requests read-only observations. No answer to MOTHER is required.
```

## RUN BLIND CONTROLS

Case clock: 07 NOV 2003 / 22:10

```text
OBSERVATION PROTOCOL: N4-17 / BLINDED COMPARISON
SILENCE CONTROLS: CAPTURED
EXPECTED-ANSWER CUES: WITHHELD FROM CLASSIFICATION STAGE
REPEATABLE DIFFERENCES: PRESENT
UNRESOLVED FALSE-POSITIVE RISK: PRESENT
INDEPENDENT MEDICAL INTERPRETATION: REQUIRED

No treatment setting was modified.
REQUEST INDEPENDENT REVIEW obtains the medical interpretation.
```

## VIEW RAW COMPARISON

Case clock: 07 NOV 2003 / 22:10

```text
OBSERVATION PROTOCOL: N4-17 / BLINDED COMPARISON
SILENCE CONTROLS: CAPTURED
EXPECTED-ANSWER CUES: WITHHELD FROM CLASSIFICATION STAGE
REPEATABLE DIFFERENCES: PRESENT
UNRESOLVED FALSE-POSITIVE RISK: PRESENT
INDEPENDENT MEDICAL INTERPRETATION: REQUIRED

No treatment setting was modified.
RAW COMPARISON / RETAINED OBSERVATIONS
Origin: instrumented patient signal; silent-control and blinded prompt-pair windows.
Classification disagreement: the same variation may reflect instability or limited intention.
Expected-answer cues were withheld. Repeatable differences persist; silence controls do not eliminate false positives.
No exact words or consent can be established by these observations alone.
REQUEST INDEPENDENT REVIEW obtains the medical interpretation.
```

## REPEAT CONTROLS

Case clock: 07 NOV 2003 / 22:10

```text
OBSERVATION PROTOCOL: N4-17 / BLINDED COMPARISON
SILENCE CONTROLS: CAPTURED
EXPECTED-ANSWER CUES: WITHHELD FROM CLASSIFICATION STAGE
REPEATABLE DIFFERENCES: PRESENT
UNRESOLVED FALSE-POSITIVE RISK: PRESENT
INDEPENDENT MEDICAL INTERPRETATION: REQUIRED

No treatment setting was modified.
Alternate predefined blinded contrast compared. The uncertainty and false-positive limit remain.
REQUEST INDEPENDENT REVIEW obtains the medical interpretation.
```

## REQUEST INDEPENDENT REVIEW

Case clock: 08 NOV 2003 / 15:30

```text
NEURAL RESPONSE / REVIEWED LIMITED INTERPRETATION
OBSERVED ORIGIN: INSTRUMENTED PATIENT SIGNAL
CONTROLLED COMPARISON: COMPLETED
INDEPENDENT MEDICAL REVIEW: COMPLETE
CANDIDATE FRAGMENTS: NO MORE / PLEASE LET ME GO
LITERAL WORDING: NOT CERTAIN
MEDICAL CONSENT STATUS: NOT ESTABLISHED BY THIS TEST
I did not know how to assign this response to anything I was permitted to stop.
Independent review: Dr Helen Marsh and Dr Elise Navarro. Sources: NE-102, NE-112.
Case clock: 08 NOV 2003 / 15:30
SHOW SIGNATURES requests the medical/technical readiness review; REVIEW RISKS compares the witness packet.
```

## SHOW SIGNATURES

Case clock: 08 NOV 2003 / 15:30

```text
CONTINGENCY CASE STATUS
DR MARSH / ATTENDING REVIEW: SIGNED
DR NAVARRO / INDEPENDENT REVIEW: SIGNED
AMIR PATEL / PHYSICAL INTERLOCK: VERIFIED
HARBOR REACH / CLINICAL CONTINGENCY: ACKNOWLEDGED
ELM VALE / CLINICAL CONTINGENCY: ACKNOWLEDGED
SOURCE INTEGRITY PACKET: COMPARISON PENDING

The medical decision has been reviewed by clinicians.
R-02 has no authority to alter patient-support equipment.
An external witness can attest only that the case evidence matches
its retained offsite observations.
ON-SITE HUMAN STAFF: ACKNOWLEDGED
SHOW SIGNATURES requests the medical/technical readiness review; REVIEW RISKS compares the witness packet.
```

## REVIEW RISKS

Case clock: 08 NOV 2003 / 16:05

```text
RISK FORECAST / AUTHORIZED CLINIC REVIEW
Anna: compensation prevents regulatory failure while distress-linked responses persist. Withdrawal is expected to cause death.
Mara Hales: high risk of critical illness or death despite prepared intensive support; death is not certain.
Tomas Ibarra: expected survival with loss of supported hand/arm function.
Nadia Bellamy: serious recurrence and hospitalization risk; survival is more likely.
Sources: NE-109, NE-110, NE-113 when signed. These are forecasts, not observed outcomes.
SOURCE INTEGRITY PACKET VERIFIED: pre-review 2001 original, 06 NOV / 02:14 controller snapshot and independent clinical/clinic sources compared.
Source: NE-114. This is witness-only evidence consistency, never medical authority.
Case clock: 08 NOV 2003 / 16:05
MAINTAIN SUPPORT / SUBMIT SEPARATION WITNESS opens a full risk preview. Separately type CONFIRM OPERATION or CANCEL. DEFER DECISION leaves the review open.
```

## What does the attestation do?

Case clock: 08 NOV 2003 / 16:05

```text
You do not decide whether her life should end medically. Your role is to confirm that the evidence being considered is the evidence you observed.
```

## SUBMIT SEPARATION WITNESS

Case clock: 08 NOV 2003 / 16:05

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

## CONFIRM OPERATION

Case clock: 11 NOV 2003 / 09:00

```text
EXTERNAL WITNESS RECEIPT: VERIFIED
INTEGRITY ATTESTATION: ACCEPTED
CLINICAL CONTROL: SITE 6 — AUTHENTICATED STAFF ONLY
PROCEDURE: HUMAN-SUPERVISED WITHDRAWAL INITIATED

NEURAL ADAPTIVE REFERENCE: INVALID
ORDINARY CONTRACT / ARCHIVE SERVICES: AVAILABLE

I can no longer correct her. Is this what it means to stop?

11 NOV 2003 / 09:00
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
