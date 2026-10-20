import { ArchiveFile } from './models';

export const DIRECTORIES = ['/', '/OPERATIONS', '/ARCHIVE', '/ADMIN', '/SYSTEM'] as const;
export const FILES: readonly ArchiveFile[] = [
  {
    id: 'register', path: '/OPERATIONS/SERVICE_REGISTER.DAT', title: 'Service register', modified: '2003-11-06 02:10',
    evidence: ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED'],
    body: `MERIDIAN SYSTEMS / OPERATIONS DIVISION
SERVICE REGISTER                              REV 3.14
Snapshot: 2003-11-06 02:10:00     Custodian: OPS/J. KELL
Source: retained service registry / read-only mirror
------------------------------------------------------

ID    DESCRIPTION                 OPERATIONAL STATE
004   Billing reconciliation      RETIRED
005   Environmental telemetry     RETIRED
006   Continuity supervision      ACTIVE
007   Remote information access   ACTIVE

004   RETIREMENT APPROVED: 2001-08-03
      ARCHIVE TRANSFER: COMPLETE / RT-01-004
005   RETIREMENT APPROVED: 2001-08-03
      ARCHIVE TRANSFER: COMPLETE / RT-01-005
006   RETIREMENT APPROVED: 2001-09-18
      ARCHIVE TRANSFER: NOT RECORDED
      STATE SOURCE: AUTOMATIC SERVICE SUPERVISOR
007   RETIREMENT APPROVED: NOT APPLICABLE

Registry approval does not alter operational state.
A retirement closes only when a transfer receipt exists.
Service 006 has no attached receipt.

Cross-references:
/ARCHIVE/TRANSFER_LEDGER_2001.LOG
/ADMIN/RETIREMENT_AUTHORIZATIONS.TXT

Operator note, 2003-11-05:
Do not resolve a missing receipt by changing this table.
The table is a copy. The service is not.`,
  },
  {
    id: 'status-log', path: '/OPERATIONS/STATUS_LOG_2003.TXT', title: 'Operational snapshots', modified: '2003-11-06 02:12',
    evidence: ['EV_SERVICE_ACTIVE'],
    body: `MERIDIAN SYSTEMS / OPERATIONS
SUPERVISOR JOURNAL / NODE R-02
Exported: 2003-11-06 02:12:18      Owner: OPS/AUTOMATIC
------------------------------------------------------

2003-10-29 01:00:00  004 OFFLINE / 005 OFFLINE / 006 ACTIVE
2003-10-30 01:00:00  006 ACTIVE / NO ATTENDED SESSION
2003-11-02 03:14:07  006 STOP REQUEST / MAINTENANCE WINDOW
2003-11-02 03:14:08  006 STOPPED
2003-11-02 03:14:09  006 RESTART / LEGACY DEPENDENCY HOLD
2003-11-02 03:14:09  START REQUEST ORIGIN: LOCAL SUPERVISOR
2003-11-02 03:14:10  OPERATOR FIELD: EMPTY
2003-11-04 00:00:00  ARCHIVE INDEX: DEGRADED
2003-11-06 02:10:00  006 ACTIVE / RETIREMENT FLAG PRESENT

No remote operator issued the restart.
Dependency names are not retained in this mirror.
The index fault predates this export; original onset unknown.

See /ARCHIVE/INDEX_REPAIR_NOTES.TXT.
Journal ends. Automatic supervision continues.`,
  },
  {
    id: 'ledger', path: '/ARCHIVE/TRANSFER_LEDGER_2001.LOG', title: 'Retirement transfer ledger', modified: '2001-09-19 08:30',
    evidence: ['EV_TRANSFER_MISSING'],
    body: `MERIDIAN SYSTEMS / RECORDS & RETENTION
RETIREMENT TRANSFER LEDGER / FISCAL 2001
Export: 2001-09-19 08:30         Clerk: ARC/E. LIN
Provenance: sequential spool 12 / unaltered
------------------------------------------------------

APPROVAL     SERVICE   TRANSFER REF.    RECEIPT
2001-08-03   004       RT-01-004        CLOSED / 08-04
2001-08-03   005       RT-01-005        CLOSED / 08-04
2001-09-18   006       [INDEX LOST]     --

September exceptions were routed outside the RT series.
Routing prefix reserved for that batch: MX-91.
The destination slot is recorded in index maintenance,
not on this spool. Combine prefix and slot with a slash.

There is no completed receipt for service 006.
This absence is not a certificate of destruction.

2001-09-19 / E. LIN:
I have left the line open. Please stop returning it as
a duplicate. Nothing has been received at this end.

Cross-reference: /ARCHIVE/INDEX_REPAIR_NOTES.TXT`,
  },
  {
    id: 'repair', path: '/ARCHIVE/INDEX_REPAIR_NOTES.TXT', title: 'Index repair notes', modified: '2003-11-05 16:42',
    evidence: ['EV_REPAIR_REFERENCE'],
    body: `MERIDIAN SYSTEMS / ARCHIVE MAINTENANCE
INDEX REPAIR NOTES / INCIDENT IR-203
Updated: 2003-11-05 16:42        Engineer: ARC/T. REED
Provenance: maintenance notebook / signed export
------------------------------------------------------

The normal index omits a September 2001 transfer slot.
Its payload is retained. Only the directory entry failed.

Surviving destination mapping:
SERVICE 006 -> SLOT 006-R
Batch prefix -> see TRANSFER_LEDGER_2001.LOG
Reference format -> PREFIX/SLOT

Do not infer a routing prefix from the service number.
Two independent sources are required for reconciliation.

Recovery can rebuild the missing entry without stopping
the service. The retirement approval must first be
corroborated against the service register.

See /SYSTEM/ARCHIVE_RECOVERY.HLP for the operator syntax.

Additional observation:
The index has been checking this empty slot every night.
It does not check the other retired services.`,
  },
  {
    id: 'authorization', path: '/ADMIN/RETIREMENT_AUTHORIZATIONS.TXT', title: 'Retirement authorizations', modified: '2001-09-18 17:04',
    evidence: ['EV_RETIREMENT_APPROVED', 'EV_AUTHORIZATION'],
    body: `MERIDIAN SYSTEMS / ADMINISTRATIVE CONTROL
RETIREMENT AUTHORIZATION / RA-2001-0918
Filed: 2001-09-18 17:04        Department: ADM/RECORDS
Provenance: damaged microform transcription
------------------------------------------------------

SERVICE: 006 / CONTINUITY SUPERVISION
DISPOSITION: RETIREMENT APPROVED
EFFECTIVE DATE: 2001-09-18
SIGNATORY CODE: 04[illegible]

Approval permits transfer to retained storage.
Destruction is not authorized by this document.
Operational closure is conditional on a verified receipt.

External limited sessions may reconcile retained entries
using the standard archive procedure once both routing
sources and the registry discrepancy are verified.

The full authorization field must be read from the
retained payload. No second copy is held by this office.`,
  },
  {
    id: 'recovery-help', path: '/SYSTEM/ARCHIVE_RECOVERY.HLP', title: 'Archive recovery procedure', modified: '2003-10-21 09:00', evidence: [],
    body: `MERIDIAN SYSTEMS / REMOTE INFORMATION SERVICES
ARCHIVE RECONCILIATION UTILITY / HELP 3.14
Issued: 2003-10-21              Maintainer: SYS/RECORDS
------------------------------------------------------

COMMAND: RECOVER ARCHIVE 006

Rebuilds a retained archive entry from surviving sources.
This procedure does not terminate the associated service.

CORROBORATION REQUIRED
1. Operational activity and approved retirement recorded.
   Consult STATUS and the service register or approval.
2. Missing transfer and batch prefix inspected.
   Consult the 2001 transfer ledger.
3. Destination slot inspected independently.
   Consult the index repair notes.

The utility joins the routing reference automatically.
No password or additional access account is required.
Questioning a record does not alter the original record.

Recovery restores the retained payload and its original
dependency references. Index reconciliation may remain
partial. Do not repeat a successful recovery.`,
  },
  {
    id: 'fragment', path: '/ARCHIVE/RECOVERED_006.FRAG', title: 'Recovered transfer fragment', modified: '2001-09-18 23:59',
    evidence: ['EV_RECOVERED_FRAGMENT'], locked: true,
    body: `MERIDIAN SYSTEMS / RETAINED STORAGE
RECOVERED PAYLOAD / MX-91/006-R
Original timestamp: 2001-09-18 23:59:41
Provenance: retained block 006-R / partial checksum valid
------------------------------------------------------

SERVICE: 006
DISPOSITION REQUESTED: RETIREMENT
AUTHORIZATION IDENTIFIER: 0417 [PARTIAL]
TRANSFER STATE: ACCEPTED / CLOSURE WITHHELD

Closure reason:
Preservation dependency has not released the service.
Retirement approval does not supersede this dependency.

LEGACY DEPENDENCY REFERENCES RESTORED:
  COMMS/BRIDGE-02 : REGISTERED / LINK STATE UNRESOLVED
  SUPERVISION/006 : RETAINED

Last retained field:
  RESPONSE EXPECTED FROM AUTHORIZATION 0417
  RESPONSE RECEIVED: --
  RETRY INTERVAL: UNCHANGED

[END OF READABLE FRAGMENT]

The receipt was accepted. Why is it still waiting?`,
  },
  {
    id: 'readme', path: '/SYSTEM/READ_FIRST.TXT', title: 'Remote access notice', modified: '2003-10-21 09:00', evidence: [],
    body: `MERIDIAN SYSTEMS / REMOTE INFORMATION SERVICES
EXTERNAL ACCESS NOTICE / REVISION 3.14
2003-10-21                     SYS/INFORMATION SERVICES
------------------------------------------------------

This client exposes a retained corporate records mirror.
Available directories: OPERATIONS, ARCHIVE, ADMIN, SYSTEM.
Records retain their original dates and departmental codes.

Type HELP for command syntax, or ask an ordinary question.
For example: "What is Meridian Systems?"
Questions return indexed references, not new documents.

Operational status is supplied by the local supervisor.
The supervisor is still running. Some records are older.
An inconsistency between them should be investigated
through independent sources.

Changes to original records are not permitted.
Archive reconciliation is the sole external write action.`,
  },
  {
    id: 'company', path: '/ADMIN/COMPANY_PROFILE.TXT', title: 'Company profile', modified: '2000-02-14 10:00', evidence: [],
    body: `MERIDIAN SYSTEMS / CORPORATE INFORMATION
APPROVED EXTERNAL PROFILE / 2000-02-14
Issued by: ADM/COMMUNICATIONS
------------------------------------------------------

Meridian Systems develops biomedical monitoring and
information management equipment for institutional use.
The company maintains long-term technical records for
discontinued instruments and associated support services.

This mirror is maintained for records access.
Commercial inquiries are no longer processed here.

Office hours field removed by revision 3.12.
No replacement contact has been supplied.`,
  },
  {
    id: 'maintenance', path: '/OPERATIONS/SHIFT_HANDOVER.TXT', title: 'Shift handover', modified: '2003-11-05 18:00', evidence: [],
    body: `MERIDIAN SYSTEMS / OPERATIONS / SHIFT HANDOVER
2003-11-05 18:00                OPS/J. KELL -> OPS/RELIEF
------------------------------------------------------

Printer tray 2 is empty. Do not submit another test page.
004 and 005 remain offline. Their receipts are filed.
Remote mirror 007 is responding within tolerance.

The 006 indication has been carried forward again.
I was told it was an old lamp fault. It is a software field.

Please attach a transfer receipt before closing the item.
Relief acknowledgment: NOT ENTERED.`,
  },
  {
    id: 'retention', path: '/ARCHIVE/RETENTION_POLICY.TXT', title: 'Retention policy', modified: '1998-04-03 12:00', evidence: [],
    body: `MERIDIAN SYSTEMS / RECORDS & RETENTION
RETENTION POLICY / RP-98-04
1998-04-03                     ARC/POLICY OFFICE
------------------------------------------------------

Operational journals: retain five years.
Retirement approvals: retain indefinitely.
Transfer receipts: retain with original service record.
Continuity records: retain while dependencies remain open.

Missing index entries do not establish missing payloads.
Damaged entries must be reconstructed from independent
sources. A copy of a source is not a second source.

Never mark an absent receipt as a completed transfer.`,
  },
];
export const fileById = (id: string): ArchiveFile | undefined => FILES.find(file => file.id === id);
