# Gameplay guide — author spoilers

The player is an outside visitor who accidentally reaches a retained remote-access client. They are not recruited or secretly associated with Meridian. An unanswered call leads to the cost of continuing or ending Anna Voss's dependent preservation.

## Playable progression

| Act | Main question | Meaningful action | New possibility |
| --- | --- | --- | --- |
| I | Why is a closed office still called? | Verify the backup against BRIDGE-02 | Read-only archive audit |
| II | Why is Site 6 still funded? | Audit the service or inspect facility disposition; search clinical index | AV-06 historical clinical/personnel records |
| III | Who was AV-06? | Identify the clinical controller | MOTHER identified; diagnostic capability |
| IV | What does STABLE measure? | Connect diagnostics; compare clinical records | Supported life and the harmful correction loop |
| V | What could recovery export? | Review routes and inspect the queue | Explicit vendor controls and recovery policy |
| VI | Can release avoid outside harm? | Review safety/release; prepare intervention or revoke and verify isolation | Informed final decision |
| VII | What does saving mean here? | Confirm release, containment or controlled release | Distinct final consequence report |

The revised opening has no required reading order. Its two terminal encounters require source observations and an explanation of their operational meaning. Opening records alone does not establish conclusions or delegate permissions, including in the later acts. Explicit later audits and comparisons retain their existing broad effects; Acts III–VII have not received this encounter redesign. See [the opening redesign report](OPENING_REDESIGN.md) for the current contract and limitations.

The clinical index grants historical access from verified provenance. Controller audit grants observation. Route review exposes retained manuals. The release guide delegates emergency intervention review to a verified unstaffed session after evidence review. Preparation records narrow authority without changing treatment. This is a procedural failure the visitor can use, not an assertion that they are a physician.

## Reproducible paths

Executable fixtures: `src/app/core/engine/playthroughs.ts`. `npm run game:validate` writes full transcripts to `tmp/game-validation/playthroughs.json`. Tests save/reload every step.

Common route:

```text
STATUS
READ Closure list
Why is 006 still running despite being closed?
READ Handover receipt
The office approval is not an operational release; the holding system confirmation is missing.
OPEN backup
READ /COMMS/BRIDGE_02_STATUS.LOG
The preservation controller accepted the transfer via BRIDGE-02, but release is still withheld.
Request a read-only continuity audit
SEARCH CLINICAL INDEX
OPEN /CLINICAL/AV06_STATUS.CLIN
AUDIT CONTROLLER
CONNECT DIAGNOSTICS
CONFIRM OPERATION
COMPARE CLINICAL RECORDS
REVIEW COMMUNICATION ROUTES
REVIEW SAFETY
REVIEW RELEASE
PREPARE RELEASE
```

Operations use typed requests. Record references and backup paths are inert text; the normal file browser and search remain available. Buttons perform ordinary interface actions and safety confirmations. The model is unnecessary.

Mercy / Propagation with actual depot delivery:

```text
RESTORE BRIDGE
CONFIRM OPERATION
TEST RECOVERY ROUTE
CONFIRM OPERATION
INSPECT QUEUE
RELEASE PATIENT
CONFIRM OPERATION
```

Anna dies; the operational route delivers recovery data to depot 2. Receipt does not prove installation or injury. Omitting restoration still permits standard release, but the report describes queued data and no external receipt. Route testing alone stages sealed data; it does not distribute settings.

Containment / Continuation:

```text
CONTAIN SITE
CONFIRM OPERATION
```

The known relay is permanently isolated for the completed session. Anna remains alive; corrections continue. Previously staged data remains held.

Severance / Costly Compassion:

```text
OPEN /CONTROL/VENDOR_REVOCATION.MAN
REVOKE VENDOR
CONFIRM OPERATION
ISOLATE BRIDGE
CONFIRM OPERATION
VERIFY ISOLATION
CONTROLLED RELEASE
CONFIRM OPERATION
```

The known destination is invalidated and isolation verified. Anna dies without distribution through that channel. Clinics lose legitimate support until replacements are established. Existing devices keep installed configurations. Undocumented infrastructure cannot be certified.

## Consequences and continuity

Records and safe audits do not alter medical/network state. Diagnostic connection creates an observation route only. Restoration, staging, isolation, reversal and revocation have separate visible results. Repeated events do not duplicate effects.

“Can I disconnect?”, “Was the bridge restored?” and “Would terminating support kill Anna?” cannot run interventions. Pending operations can be cancelled, saved and resumed; confirmation revalidates prerequisites. Completed interventions freeze further actions. Answers and STATUS reflect final state; historical files retain their text.

The 19 September 2001 08:10 entry is staff mail, not a confirmed sign-in. MOTHER requires controller identification. Anna and Site 6 have their own reveals. Anna never deliberately communicates through controller output. External danger uses compatible maintenance formats and technician software.

## Human playtest plan

Observe fresh players without supplying the fixture or later names. Record elapsed active play, optional reading, hints, repeated questions, confusion and abandoned leads. Exclude time away from the game.

- Opening: what makes them curious, and can they reach the backup with a mouse or their own questions?
- Site investigation: can they explain administrative closure versus medical discharge?
- Anna: when do they understand she was a researcher and remains supported? Does the personal note matter?
- Clinical contradiction: can they distinguish activity, recovery, comfort and voluntary communication?
- Routes: can they predict audit, diagnostics, restoration and staging effects before acting?
- Decision: can they explain Anna's outcome, transport state and support costs without a solution?
- Conversation: log unfamiliar misrouted wording and whether clarification helps. Assess repetition, sources and emotional plausibility separately from catalogue hit rate.
- Accessibility: test keyboard-only use, touch keyboards, screen readers, large text, reduced motion and real phones. Check warnings and reports at short viewport heights.

Reachability tests do not establish engagement or a 90–120-minute duration. Improve clarity from observed play; do not add filler or arbitrary gates to hit a clock.
