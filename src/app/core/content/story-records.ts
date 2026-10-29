import type { ArchiveFile } from '../models';
import { CLINICAL_SNAPSHOT } from '../state/story-state';

// Historical records are immutable; current transport/clinical observations are separate engine output.
export const STORY_FILES: readonly ArchiveFile[] = [
  { id: 'bridge', path: '/COMMS/BRIDGE_02_STATUS.LOG', title: 'Bridge 02 status', modified: '2001-09-19 00:02', author: 'Communications maintenance', provenance: 'Communications maintenance archive', requiresBackup: true, evidence: [], references: ['audit', 'hold-policy'], body: `BRIDGE-02 / TRANSFER MONITOR
18 Sep 2001, 23:59:41 / Continuity transfer accepted.
Service: 006
Receiving destination: PRESERVATION CONTROLLER
Telephone desk destination: UNAVAILABLE
Release acknowledgement: NOT RECEIVED
Queue retained under continuity exception.

Receipt verification exposes the audit mirror. It grants
no permission to send clinical data or repair equipment.` },
  { id: 'audit', path: '/OPERATIONS/006_AUDIT.TXT', title: 'Continuity service audit', modified: '2003-11-06 02:14', author: 'Legacy audit service', provenance: 'Verified archive mirror', access: 'archiveAuditAccess', reveals: ['clinicalHoldKnown', 'site6Known'], evidence: [], references: ['disposition', 'clinical-register', 'hold-policy', 'lin-mail'], body: `LEGACY SERVICE AUDIT / 006
Registered to: CLINICAL/06 / Meridian Site 6
Assigned office operator: NONE
Purpose: preservation continuity

Administrative closure does not override clinical hold.
Read-only diagnostic information may be requested through
this verified archive session.
Search the clinical index to resolve the protected subject.
Archive permission does not confer treatment authority.` },
  { id: 'hold-policy', path: '/POLICY/PRESERVATION_HOLD.POL', title: 'Preservation hold policy', modified: '1995-03-09 14:00', author: 'Clinical operations', provenance: 'Policy archive / revision 3', access: 'archiveAuditAccess', reveals: ['clinicalHoldKnown'], evidence: [], references: ['clinical-register'], body: `CONTINUITY POLICY / 1995
Interruption of active neurological support requires
positive clinical authorization. Operator absence shall
not constitute authorization.

After communication failure the controller must maintain
the last confirmed preservation state.
External recovery may be requested when local control
continuity is compromised. Administrative closure cannot
substitute for a clinical release.` },
  { id: 'disposition', path: '/ADMIN/SITE6_DISPOSITION.TXT', title: 'Facility disposition', modified: '2001-09-28 11:20', author: 'Facilities administration', provenance: 'Closure exceptions / retained carbon', access: 'archiveAuditAccess', reveals: ['site6Known'], evidence: [], references: ['obligations', 'clinical-register', 'n-series'], body: `SITE 6 / DISPOSITION
Research activity: DISCONTINUED
Utilities and essential clinical support: EXEMPT
Active research personnel assigned: NONE

Support invoices remain payable under legacy clinical
obligations. This notice closes a research department;
it is not a discharge certificate for its patients.
Keys transferred to property services. Medical oversight
transfer remains outstanding.` },
  { id: 'obligations', path: '/FINANCE/LEGACY_OBLIGATIONS_2002.TXT', title: 'Legacy obligations', modified: '2002-12-10 16:00', author: 'Corporate accounts', provenance: 'Year-end liabilities / copied ledger', access: 'archiveAuditAccess', evidence: [], references: ['disposition', 'clinical-register'], body: `ACCOUNTS / SITE 6 / 2002
Electrical service, medical consumables and specialist
controller maintenance remain payable.

Budget ownership moved from Research to Clinical to
Retained Services. Two of these departments have closed.
Accounts cannot terminate the underlying medical duty.
Please stop returning invoices marked "site closed".
The supplier is billing for support, not occupancy.` },
  { id: 'lin-mail', path: '/STAFF/LIN_INTERNAL_MAIL.TXT', title: 'Unassigned alarms', modified: '2001-09-19 08:10', author: 'E. Lin', provenance: 'Staff-mail spool / outgoing copy', access: 'archiveAuditAccess', evidence: [], references: ['maintenance', 'bridge'], body: `From: E. Lin / To: Operations
19 Sep 2001 / 08:10
The night desk has been removed. Service 006 continues
generating alarms. Do not forward them to personal
telephone numbers.

Which department accepted responsibility? The bridge
receipt is not a name. My shift ended yesterday.

Archive note: 08:10 is the mail timestamp. This copy
does not establish a staff sign-in or physical attendance.` },
  { id: 'clinical-register', path: '/SYSTEM/CLINICAL_06_REGISTER.DAT', title: 'Clinical service inventory', modified: '1998-08-04 09:00', author: 'Clinical systems inventory', provenance: 'Restricted inventory / revision 8', access: 'archiveAuditAccess', reveals: ['site6Known'], evidence: [], references: ['disposition'], body: `CLINICAL/06 / MERIDIAN SITE 6
Controller: adaptive neurological support
Oversight: CONTINUITY PRESERVATION
Subject identifier: protected clinical index

Verified archive sessions may request the clinical index.
This grants historical records access only. A separate
controller audit is required before connecting read-only
clinical diagnostics. No operator identity is inferred
from possession of this record.` },
  { id: 'voss', path: '/PERSONNEL/VOSS_A.TXT', title: 'Researcher personnel record', modified: '1996-04-23 09:30', author: 'Meridian personnel', provenance: 'Personnel archive / linked via AV-06 index', access: 'clinicalRecordAccess', reveals: ['annaIdentified'], evidence: [], references: ['project-note', 'trial', 'incident', 'personal-note'], body: `ANNA VOSS / AV-06
Senior researcher / experimental neural systems
Specialism: bidirectional interpretation and adaptive
stimulation. Assignment: Site 6.
Status: administrative separation pending clinical review.

Training record: she insisted new engineers spend a day
in the rehabilitation clinic before touching the rig.
Her desk loan of the clinic's faulty kettle is still
listed as equipment outstanding.` },
  { id: 'n-series', path: '/RESEARCH/N_SERIES_OVERVIEW.TXT', title: 'N-series overview', modified: '1994-06-14 10:00', author: 'Clinical technology group', provenance: 'Product and research comparison / approved overview', access: 'archiveAuditAccess', evidence: [], references: ['clinical-register'], body: `N-SERIES / 1994 OVERVIEW
The platform interprets selected neurological activity
and delivers limited corrective electrical stimulation.
Commercial devices use narrow prescribed profiles.
Research systems allow wider adaptive feedback under
supervision. Successful products support selected sensory
and motor functions; they do not replace a whole mind.
Compatibility does not imply identical capabilities.
Research control profiles are not commercial treatments.` },
  { id: 'project-note', path: '/RESEARCH/VOSS_PROJECT_NOTE.TXT', title: 'A preserved signal', modified: '1995-11-03 18:15', author: 'Anna Voss', provenance: 'Research notebook / scan 42', access: 'clinicalRecordAccess', reveals: ['annaIdentified'], evidence: [], references: ['voss', 'trial'], body: `A. VOSS / DESIGN REVIEW
The interface must respond to what the patient experiences,
not merely what the instruments classify as successful.
A preserved signal is not necessarily a restored function.
Any adaptive system must allow for incomplete measurements.

We have a convincing demonstration. I want a useful device.
Those are different milestones. Keep the clinic visits
in next year's budget even if the demonstration pays for us.` },
  { id: 'trial', path: '/RESEARCH/TRIAL_AUTHORIZATION.MEM', title: 'Limited trial authorization', modified: '1996-04-12 13:00', author: 'Research review board', provenance: 'Signed review memorandum / retained copy', access: 'clinicalRecordAccess', reveals: ['annaIdentified'], evidence: [], references: ['incident', 'project-note'], body: `BIDIRECTIONAL CALIBRATION / APPROVED WITH RESTRICTIONS
Anna Voss participated in the research decision and
consented to a limited supervised calibration procedure.
Extended autonomous stimulation was not approved.
Emergency interruption equipment must be present.
Clinical supervision must continue throughout the trial.

Consent to this procedure does not authorize indefinite
experimental intervention after loss of communication.` },
  { id: 'incident', path: '/INCIDENT/SITE6_1996_SUMMARY.TXT', title: 'April incident review', modified: '1996-04-21 12:00', author: 'Corporate incident review', provenance: 'Emergency clinical classification / retained summary', access: 'clinicalRecordAccess', reveals: ['incidentKnown', 'annaIdentified'], evidence: [], references: ['trial', 'patient', 'rao'], body: `SITE 6 / 17 APRIL 1996 / SUBJECT AV-06, ANNA VOSS
Contradictory feedback caused repeated increases in
corrective stimulation during experimental calibration.
Catastrophic neurological injury followed.
Emergency preservation prevented immediate biological
termination. Detailed neurological outcome remains under
clinical review.

Classified as a medical emergency. Research authorization
is suspended; emergency support remains active.` },
  { id: 'controller', path: '/SYSTEM/CONTROLLER_ID.TXT', title: 'Controller identification', modified: '2003-11-06 02:14', author: 'Controller audit service', provenance: 'Identification response / diagnostic register', access: 'clinicalReadOnlyDiagnostics', reveals: ['motherIdentified'], evidence: [], references: ['patient', 'feedback'], body: `CONTROLLER DESIGNATION: MOTHER
Primary functions: monitoring, operational decisions,
treatment continuity and research diagnostics.
Preservation priority: ACTIVE
Operator administration: continuity service 006

Specialized expert system / Meridian clinical installation.
No general-purpose remote administration interface.
Diagnostic identity checked against the retained inventory.
No acronym expansion is recorded.` },
  { id: 'patient', path: '/CLINICAL/AV06_STATUS.CLIN', title: 'AV-06 clinical status', modified: '2003-11-06 02:14', author: 'Clinical continuity register', provenance: 'Retained clinical status / corroborate with diagnostics', access: 'clinicalRecordAccess', reveals: ['annaIdentified', 'annaAliveKnown'], evidence: [], references: ['rao', 'trace', 'weaning', 'distress'], body: `SUBJECT: AV-06 / ANNA VOSS
Biological support: ACTIVE
Independent neurological function: INSUFFICIENT
Adaptive intervention: CONTINUOUS
Termination authority: RESTRICTED
Patient status: STABLE

Stable denotes activity maintained within preservation
thresholds. This field does not measure comfort or recovery.
Present observation can be requested through read-only
diagnostics after controller identification.` },
  { id: 'rao', path: '/CLINICAL/RAO_REVIEW_1997.TXT', title: 'Rao clinical review', modified: '1997-02-14 17:40', author: 'Dr. Miriam Rao', provenance: 'Consultation archive / countersigned review', access: 'clinicalRecordAccess', reveals: ['distressEvidenceKnown'], evidence: [], references: ['trace', 'distress', 'weaning'], body: `The support system repeatedly restores activity after
attempts to reduce stimulation. Measurable activity is being
classified as improved stability. This demonstrates neither
comfort, cognition nor recovery.

A conscious distress response cannot be excluded.
The criterion is answering its own question: was activity
restored? Nobody has shown that restoration helps her.
Request independent reassessment before further weaning.` },
  { id: 'trace', path: '/CLINICAL/STIMULATION_TRACE.LOG', title: 'Stimulation trace', modified: '1998-08-03 10:23', author: 'Clinical telemetry recorder', provenance: 'Archived weaning session / excerpt', access: 'clinicalRecordAccess', reveals: ['feedbackLoopKnown'], evidence: [], references: ['weaning', 'feedback', 'rao'], body: `03 AUG 1998 / SUPPORT REDUCTION
10:21:00  Adaptive stimulation reduced by clinician
10:21:04  Response loss / discontinuity threshold exceeded
10:21:05  Automatic restoration initiated
10:21:07  Renewed activation / status STABLE
10:22:00  Second reduction attempted
10:22:04  Response loss / discontinuity threshold exceeded
10:22:05  Automatic restoration initiated
10:22:07  Renewed activation / status STABLE
10:23:00  Reduction abandoned by clinical team

Activation is an observation, not a voluntary statement.` },
  { id: 'weaning', path: '/CLINICAL/FAILED_WEANING_1998.TXT', title: 'Failed support reduction', modified: '1998-08-03 14:00', author: 'Clinical support team', provenance: 'Intervention report / clinical archive', access: 'clinicalRecordAccess', reveals: ['feedbackLoopKnown'], evidence: [], references: ['trace', 'rao', 'recovery-handoff'], body: `Controlled reduction of adaptive support was attempted.
The preservation controller detected critical neurological
discontinuity and restored stimulation without operator
confirmation. The procedure was discontinued.

Ordinary reduction is not a release procedure. Full
controller termination may invoke a recovery handoff.
Do not substitute power interruption for clinical review.` },
  { id: 'distress', path: '/CLINICAL/DISTRESS_ASSESSMENT.TXT', title: 'Distress assessment', modified: '1998-08-07 15:10', author: 'Independent clinical consultation', provenance: 'Restricted consultation / retained copy', access: 'clinicalRecordAccess', reveals: ['distressEvidenceKnown'], evidence: [], references: ['rao', 'feedback', 'patient'], body: `Recurring physiological responses are compatible with
severe neurological distress. The subject cannot provide
reliable voluntary communication.
Current treatment goals should be reconsidered.
Continued biological preservation establishes no clinical
benefit by itself.

Remaining activity may support fragmentary conscious
experience. It cannot be treated as informed consent.
Pain intensity cannot be recovered as a reliable number.` },
  { id: 'counters', path: '/SYSTEM/PRESERVATION_COUNTERS.LOG', title: 'Preservation counters', modified: '2003-11-06 02:14', author: 'Read-only diagnostic recorder', provenance: 'Fixed session snapshot / counters since incident', access: 'clinicalReadOnlyDiagnostics', evidence: [], references: ['trace', 'feedback'], body: `DIAGNOSTIC SNAPSHOT / ${CLINICAL_SNAPSHOT.at}
Correction cycles since 17 Apr 1996: ${CLINICAL_SNAPSHOT.correctionCycles}
Recovery attempts: ${CLINICAL_SNAPSHOT.recoveryAttempts}
Most recent recovery sequence: ${CLINICAL_SNAPSHOT.sequence}

These are accumulated counters, not seconds of pain.
Recovery means restoration of monitored activity.
No voluntary acknowledgement field exists.
Refreshing this record does not run a procedure.` },
  { id: 'feedback', path: '/SYSTEM/NEURAL_FEEDBACK_NOTES.TXT', title: 'Feedback interpretation notes', modified: '1998-09-11 11:00', author: 'Clinical engineering', provenance: 'Engineering report / retained findings', access: 'clinicalRecordAccess', reveals: ['feedbackLoopKnown'], evidence: [], references: ['trace', 'distress', 'project-note'], body: `Patient-derived responses influence controller thresholds.
The controller's stimulation changes subsequent signals.
Independent biological and computational causes cannot
always be separated.

Irregular classifications can enter diagnostic output.
They are not decoded language, a complete uploaded person
or deliberate messages. The patient has no reliable
voluntary channel. Treat apparent phrases as controller
classification errors until independently established.` },
  { id: 'service-map', path: '/COMMS/REMOTE_SERVICE_MAP.TXT', title: 'Remote service map', modified: '2001-09-18 16:00', author: 'Meridian technical support', provenance: 'Topology manual / retained revision', access: 'clinicalRecordAccess', evidence: [], references: ['recovery-handoff', 'field-support', 'isolation'], body: `R-02 archive -> verified audit mirror: READ ONLY
Clinical diagnostics -> Site 6: OBSERVATION ONLY
Vendor bridge -> clinic service depots: EXPLICIT RESTORATION

Archive access is not distribution permission. Diagnostic
connection cannot alter stimulation or transmit software.
Legacy vendor credentials survive separately.
A restored vendor bridge can carry a recovery package.
The client is useful as a relay, not as a chosen operator.` },
  { id: 'field-support', path: '/VENDOR/N_SERIES_FIELD_SUPPORT.TXT', title: 'Field support arrangements', modified: '2003-05-09 10:00', author: 'Commercial support office', provenance: 'Clinic service bulletin / retained copy', access: 'bridgeOperationsAccess', evidence: [], references: ['compatibility', 'risk', 'revocation'], body: `Compatible controllers are serviced through clinic-based
maintenance systems. Profiles may be transferred through
authorized depots. Implanted devices are not generally
directly connected to the internet.

Technicians install or schedule updates. Existing devices
keep installed settings if a depot connection fails.
Some clinics still use discontinued service software.
Replacement support arrangements remain incomplete.` },
  { id: 'compatibility', path: '/VENDOR/LEGACY_COMPATIBILITY.TXT', title: 'Legacy format compatibility', modified: '2000-03-22 12:00', author: 'Compatibility engineering', provenance: 'Format review / discontinued products', access: 'bridgeOperationsAccess', reveals: ['externalCompatibilityKnown'], evidence: [], references: ['risk', 'field-support'], body: `Experimental and commercial systems share a limited
legacy interpretation and calibration format.
Commercial products implement restricted functions.
An obsolete supervisory profile may be misinterpreted by
outdated field software. The format must not be used for
unsupervised distribution.

Compatibility is a defect in validation, not evidence
that the installed devices can perform the Site 6 trial.` },
  { id: 'recovery-handoff', path: '/COMMS/RECOVERY_HANDOFF.TXT', title: 'Recovery handoff policy', modified: '1998-08-04 13:00', author: 'System recovery group', provenance: 'Continuity policy annex / retained copy', access: 'clinicalRecordAccess', requiresKnowledge: 'feedbackLoopKnown', reveals: ['recoveryHandoffKnown'], evidence: [], references: ['service-map', 'release', 'depot-queue'], body: `Controller termination or unrecoverable failure may create
a preserved adaptive recovery package. A configured depot
can receive it when vendor communications are available.
It contains control logic and patient-derived response
patterns. It is not a person or certified calibration.

An isolated relay holds delivery. Ordinary restoration
can re-enable it. Credential revocation prevents use of
the known destination even after relay restoration.` },
  { id: 'depot-queue', path: '/COMMS/DEPOT_QUEUE.LOG', title: 'Depot transport register', modified: '2003-11-06 02:14', author: 'Vendor transport monitor', provenance: 'Initial snapshot / use INSPECT QUEUE for current state', access: 'bridgeOperationsAccess', evidence: [], references: ['recovery-handoff', 'isolation', 'risk'], body: `INITIAL SESSION SNAPSHOT / 02:14
Connection: archive mirror only
Pending recovery package: NONE
Transport permission: dormant vendor credentials
Last verified destination: Meridian clinic service depot 2
Destination receipt this session: NONE

This retained snapshot does not update. INSPECT QUEUE
returns the current connection, queue and receipt state.
Opening this record sends nothing.` },
  { id: 'risk', path: '/VENDOR/RISK_NOTICE_2000.TXT', title: 'Legacy medical safety notice', modified: '2000-04-05 09:00', author: 'Medical safety review', provenance: 'Unresolved safety bulletin / discontinued software', access: 'bridgeOperationsAccess', reveals: ['externalRiskKnown', 'externalCompatibilityKnown'], evidence: [], references: ['compatibility', 'revocation', 'isolation'], body: `Older clinic calibration software may accept supervisory
profiles from experimental research systems.
Unexpected stimulation and altered sensory response may
result. Affected patients could remain conscious.
This warning was not incorporated into all discontinued
support products.

Do not distribute adaptive recovery data as treatment.
Receipt at a depot is not proof of installation, injury
or the number of patients potentially affected.` },
  { id: 'isolation', path: '/CONTROL/BRIDGE_ISOLATION.MAN', title: 'Bridge isolation procedure', modified: '2001-08-13 11:00', author: 'Communications operations', provenance: 'Continuity maintenance manual / retained revision', access: 'bridgeOperationsAccess', evidence: [], references: ['revocation', 'release'], body: `ISOLATE BRIDGE blocks the known outbound depot relay.
Local medical support and read-only diagnostics remain.
Queued packages remain held, not delivered.
RESTORE ISOLATION can re-enable a temporary relay closure.
VERIFY ISOLATION tests closure without sending a package.

CONTAIN SITE makes the session's isolation permanent while
retaining preservation. Credential revocation is separate:
it disables the legacy destination and legitimate support.
No claim is made about undocumented infrastructure.` },
  { id: 'revocation', path: '/CONTROL/VENDOR_REVOCATION.MAN', title: 'Vendor route revocation', modified: '2000-04-06 16:00', author: 'Service administration', provenance: 'Emergency revocation procedure / legacy delegation', access: 'bridgeOperationsAccess', evidence: [], references: ['risk', 'release'], body: `Verified continuity audit sessions may administer the
retained vendor route after reviewing this procedure.
REVOKE VENDOR invalidates the known depot credentials.
Further recovery delivery through that route is blocked.

Existing devices retain installed settings. Clinics lose
authorized legacy support and updates until technicians
establish replacements. Delayed maintenance can harm care.
This client cannot issue replacement credentials.
Revocation is irreversible in this session.` },
  { id: 'release', path: '/CONTROL/PATIENT_RELEASE.MAN', title: 'Patient release procedure', modified: '1998-10-12 14:00', author: 'Clinical intervention review', provenance: 'Emergency review delegation / retained procedure', access: 'bridgeOperationsAccess', reveals: ['releaseConsequencesKnown'], evidence: [], references: ['recovery-handoff', 'risk', 'revocation'], body: `Termination ends Anna Voss's dependent biological support.
Death follows. Standard release invokes automatic recovery;
delivery depends on the actual relay and credential state.
Controlled release requires risk review, revoked credentials
and verified isolation of the known route.

The unstaffed continuity review may delegate emergency
release to a verified session after evidence review.
PREPARE RELEASE requests that delegation; it changes no
treatment. Final release always requires confirmation.
Vendor revocation also disrupts legitimate clinical support.` },
  { id: 'personal-note', path: '/ARCHIVE/VOSS_PERSONAL_NOTE.TXT', title: 'Clinic visit note', modified: '1996-04-09 18:20', author: 'Anna Voss', provenance: 'Notebook page / filed with trial preparation', access: 'clinicalRecordAccess', evidence: [], references: ['project-note', 'voss'], body: `Miriam —
The boy at the clinic managed the cup this morning.
He was annoyed we all stopped talking to watch him.
Fair enough. Next time I'll ask whether he wants tea.

I still want Friday's calibration supervised in person.
Please find someone who will interrupt me when I start
explaining away an ugly trace.

Also: the kettle is back. It wasn't the fuse.
A.` },
];
