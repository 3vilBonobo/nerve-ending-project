import { ArchiveFile } from './models';

export const DIRECTORIES = ['/', '/OPERATIONS', '/ARCHIVE', '/ADMIN', '/SYSTEM'] as const;
export const FILES: readonly ArchiveFile[] = [
  {
    id: 'register', path: '/OPERATIONS/SERVICE_REGISTER.DAT', title: 'Service register', modified: '2003-11-06 02:10',
    evidence: ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED'],
    body: `MERIDIAN SYSTEMS / OPERATIONS DIVISION
SERVICE REGISTER                              REV 3.14
Recorded: 2003-11-06 02:10:00     Filed by: OPS/J. KELL
Source: service register / read-only copy
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

RETIREMENT = approved shutdown and transfer to storage.
Approval alone does not stop a service.
A transfer receipt is required to close the record.
Service 006 is still running. Its receipt is missing.

Cross-references:
/ARCHIVE/TRANSFER_LEDGER_2001.LOG
/ADMIN/RETIREMENT_AUTHORIZATIONS.TXT

Operator note, 2003-11-05:
Do not fix a missing receipt by changing this table.
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
2003-10-30 01:00:00  006 ACTIVE / NO OPERATOR CONNECTED
2003-11-02 03:14:07  006 STOP REQUEST / MAINTENANCE WINDOW
2003-11-02 03:14:08  006 STOPPED
2003-11-02 03:14:09  006 RESTART / REQUIRED SYSTEM LINK
2003-11-02 03:14:09  START REQUEST ORIGIN: LOCAL SUPERVISOR
2003-11-02 03:14:10  OPERATOR FIELD: EMPTY
2003-11-04 00:00:00  ARCHIVE FILE LIST: DAMAGED
2003-11-06 02:10:00  006 ACTIVE / RETIREMENT APPROVED

The supervisor restarted 006 automatically.
No operator was connected. A linked system still needs it.
The name of that system is missing from this copy.
The file list was already damaged when this log was copied.
Date of damage: UNKNOWN.

See /ARCHIVE/INDEX_REPAIR_NOTES.TXT.
END OF LOG. Automatic supervision continues.`,
  },
  {
    id: 'ledger', path: '/ARCHIVE/TRANSFER_LEDGER_2001.LOG', title: 'Retirement transfer ledger', modified: '2001-09-19 08:30',
    evidence: ['EV_TRANSFER_MISSING'],
    body: `MERIDIAN SYSTEMS / RECORDS & RETENTION
RETIREMENT TRANSFER LEDGER / FISCAL 2001
Export: 2001-09-19 08:30         Clerk: ARC/E. LIN
Source: print spool 12 / unchanged
------------------------------------------------------

APPROVAL     SERVICE   TRANSFER REF.    RECEIPT
2001-08-03   004       RT-01-004        CLOSED / 08-04
2001-08-03   005       RT-01-005        CLOSED / 08-04
2001-09-18   006       [ENTRY LOST]     --

Some September transfers used a separate batch code.
BATCH CODE: MX-91.
The storage slot is in INDEX_REPAIR_NOTES.TXT.
The full reference uses both parts: BATCH/SLOT.

There is no completed receipt for service 006.
A missing receipt does not mean the files were deleted.

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
Source: maintenance notebook / signed copy
------------------------------------------------------

The index is the archive's file list.
One September 2001 transfer is missing from that list.
The stored files still exist. Only the list entry is lost.

STORAGE LOCATION:
SERVICE 006 -> SLOT 006-R
Batch code -> see TRANSFER_LEDGER_2001.LOG
Full reference -> BATCH/SLOT

Do not guess the batch code from the service number.
Read both records before running recovery.

Recovery restores the missing file-list entry.
It does not stop the service.
First check the service register for retirement approval.

See /SYSTEM/ARCHIVE_RECOVERY.HLP for the command.

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
Source: damaged microform / typed copy
------------------------------------------------------

SERVICE: 006 / CONTINUITY SUPERVISION
DISPOSITION: RETIREMENT APPROVED
EFFECTIVE DATE: 2001-09-18
SIGNATORY CODE: 04[illegible]

Retirement means shutdown and transfer to storage.
This approval allows storage, not deletion.
A verified transfer receipt is required before closure.

External users may recover a missing archive entry.
First check the service's status and retirement approval.
Then read the transfer ledger and index repair notes
to confirm both parts of the storage reference.

The full approval code is in the stored archive record.
This office has no second copy.`,
  },
  {
    id: 'recovery-help', path: '/SYSTEM/ARCHIVE_RECOVERY.HLP', title: 'Archive recovery procedure', modified: '2003-10-21 09:00', evidence: [],
    body: `MERIDIAN SYSTEMS / REMOTE INFORMATION SERVICES
ARCHIVE RECOVERY UTILITY / HELP 3.14
Issued: 2003-10-21              Maintainer: SYS/RECORDS
------------------------------------------------------

COMMAND: RECOVER ARCHIVE 006

Restores a missing archive entry so its files can be read.
This command does not stop the service.

REQUIRED CHECKS
1. Confirm that 006 is running and retirement was approved.
   Run STATUS. Read SERVICE_REGISTER.DAT or the approval.
2. Find the missing transfer and its batch code.
   Read TRANSFER_LEDGER_2001.LOG.
3. Find the storage slot in a separate record.
   Read INDEX_REPAIR_NOTES.TXT.

The utility combines the batch code and slot for you.
No password or extra account is required.
Reading or asking questions does not change the records.

Recovery makes the stored record and its system links
readable again. Other file-list errors may remain.
After recovery, open the restored file to read it.
Running recovery again will not make further changes.`,
  },
  {
    id: 'fragment', path: '/ARCHIVE/RECOVERED_006.FRAG', title: 'Recovered transfer fragment', modified: '2001-09-18 23:59',
    evidence: ['EV_RECOVERED_FRAGMENT'], locked: true,
    body: `MERIDIAN SYSTEMS / RETAINED STORAGE
RECOVERED RECORD / MX-91/006-R
Original timestamp: 2001-09-18 23:59:41
Source: storage block 006-R / data check partly passed
------------------------------------------------------

SERVICE: 006
REQUEST: RETIREMENT
APPROVAL CODE: 0417 [PARTIAL]
TRANSFER: ACCEPTED / CLOSURE WITHHELD

SHUTDOWN ON HOLD:
A linked preservation system still requires this service.
Retirement approval does not override that requirement.

OLD SYSTEM LINKS RESTORED:
  COMMS/BRIDGE-02 : REGISTERED / LINK STATUS UNKNOWN
  SUPERVISION/006 : STILL HELD

Last saved field:
  WAITING FOR RESPONSE / APPROVAL 0417
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

This terminal provides copies of company records.
Folders: OPERATIONS, ARCHIVE, ADMIN, SYSTEM.
Original dates and department codes are unchanged.

Type HELP for commands, or ask a question.
For example: "What is Meridian Systems?"
Replies use the available records. Open a file to check it.

STATUS reports what the supervisor sees running now.
The records may be older. If they disagree with STATUS,
check other records to find out why.

Original records cannot be edited.
RECOVER can restore a missing archive entry.`,
  },
  {
    id: 'company', path: '/ADMIN/COMPANY_PROFILE.TXT', title: 'Company profile', modified: '2000-02-14 10:00', evidence: [],
    body: `MERIDIAN SYSTEMS / CORPORATE INFORMATION
APPROVED EXTERNAL PROFILE / 2000-02-14
Issued by: ADM/COMMUNICATIONS
------------------------------------------------------

Meridian Systems makes medical monitoring equipment
and systems for storing and managing information.
It keeps technical records for older equipment and
the services that support it.

This connection is for reading records.
Sales inquiries are no longer handled here.

Office hours removed in revision 3.12.
No new contact listed.`,
  },
  {
    id: 'maintenance', path: '/OPERATIONS/SHIFT_HANDOVER.TXT', title: 'Shift handover', modified: '2003-11-05 18:00', evidence: [],
    body: `MERIDIAN SYSTEMS / OPERATIONS / SHIFT HANDOVER
2003-11-05 18:00                OPS/J. KELL -> OPS/RELIEF
------------------------------------------------------

Printer tray 2 is empty. Do not submit another test page.
004 and 005 remain offline. Their receipts are filed.
Remote records service 007 is responding normally.

The 006 warning is still on the list.
I was told it was an old lamp fault. It is a software field.

Please attach a transfer receipt before closing the item.
Next shift confirmation: NOT ENTERED.`,
  },
  {
    id: 'retention', path: '/ARCHIVE/RETENTION_POLICY.TXT', title: 'Retention policy', modified: '1998-04-03 12:00', evidence: [],
    body: `MERIDIAN SYSTEMS / RECORDS & RETENTION
RETENTION POLICY / RP-98-04
1998-04-03                     ARC/POLICY OFFICE
------------------------------------------------------

Service logs: keep five years.
Retirement approvals: keep permanently.
Transfer receipts: keep with the original service record.
Continuity records: keep while linked systems need them.

Missing from the file list does not mean deleted.
Rebuild damaged entries using separate source records.
Two copies of the same record count as one source.

Never mark an absent receipt as a completed transfer.`,
  },
];
export const fileById = (id: string): ArchiveFile | undefined => FILES.find(file => file.id === id);
