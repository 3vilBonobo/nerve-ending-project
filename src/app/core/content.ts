import { ArchiveFile } from './models';

export const DIRECTORIES = ['/', '/OPERATIONS', '/ARCHIVE', '/ADMIN', '/SYSTEM'] as const;
export const FILES: readonly ArchiveFile[] = [
  {
    id: 'register', path: '/OPERATIONS/SERVICE_REGISTER.DAT', title: 'Service list', modified: '2003-11-06 02:10',
    evidence: ['EV_SERVICE_ACTIVE', 'EV_RETIREMENT_APPROVED'],
    body: `MERIDIAN SYSTEMS / OPERATIONS
SERVICE LIST                                  REV 3.14
Saved: 2003-11-06 02:10:00       Filed by: OPS/J. KELL
Source: service register / copy, cannot be edited
------------------------------------------------------

A service is a program running on this computer.

ID    NAME                        STATUS
004   Billing reconciliation      STOPPED
005   Environmental telemetry     STOPPED
006   Continuity supervision      RUNNING
007   Remote information access   RUNNING

004   STOP APPROVED: 2001-08-03
      FILE MOVE: COMPLETE / RT-01-004
005   STOP APPROVED: 2001-08-03
      FILE MOVE: COMPLETE / RT-01-005
006   STOP APPROVED: 2001-09-18
      FILE MOVE: NO RECEIPT FOUND
      STATUS REPORTED BY: AUTOMATIC MONITOR
007   STOP APPROVED: NOT REQUESTED

Approval alone does not stop a service.
Its files must be moved to storage. A receipt confirms
that the move is complete.
006 is still running. Its receipt is missing.

Related files:
/ARCHIVE/TRANSFER_LEDGER_2001.LOG
/ADMIN/RETIREMENT_AUTHORIZATIONS.TXT

Operator note, 2003-11-05:
Do not hide the missing receipt by changing this list.
The list is a copy. The service is not.`,
  },
  {
    id: 'status-log', path: '/OPERATIONS/STATUS_LOG_2003.TXT', title: 'Activity log', modified: '2003-11-06 02:12',
    evidence: ['EV_SERVICE_ACTIVE'],
    body: `MERIDIAN SYSTEMS / OPERATIONS
ACTIVITY LOG / SYSTEM R-02
Copied: 2003-11-06 02:12:18      Owner: OPS/AUTOMATIC
------------------------------------------------------

2003-10-29 01:00:00  004 STOPPED / 005 STOPPED / 006 RUNNING
2003-10-30 01:00:00  006 RUNNING / NO OPERATOR CONNECTED
2003-11-02 03:14:07  006 STOP REQUEST / SCHEDULED REPAIRS
2003-11-02 03:14:08  006 STOPPED
2003-11-02 03:14:09  006 RESTARTED / NEEDED BY ANOTHER SYSTEM
2003-11-02 03:14:09  RESTART REQUEST: AUTOMATIC MONITOR
2003-11-02 03:14:10  OPERATOR: NONE
2003-11-04 00:00:00  FILE LIST: DAMAGED
2003-11-06 02:10:00  006 RUNNING / STOP APPROVED

The computer restarted 006 on its own.
Another system still needs it.
That system's name is missing from this copy.
The file list was already damaged when this log was saved.
Date of damage: UNKNOWN.

See /ARCHIVE/INDEX_REPAIR_NOTES.TXT.
END OF LOG. Automatic checks continue.`,
  },
  {
    id: 'ledger', path: '/ARCHIVE/TRANSFER_LEDGER_2001.LOG', title: 'File move log', modified: '2001-09-19 08:30',
    evidence: ['EV_TRANSFER_MISSING'],
    body: `MERIDIAN SYSTEMS / RECORDS
FILE MOVE LOG / 2001
Copied: 2001-09-19 08:30         Clerk: ARC/E. LIN
Source: print spool 12 / unchanged
------------------------------------------------------

APPROVED     SERVICE   FILE ADDRESS     RECEIPT
2001-08-03   004       RT-01-004        COMPLETE / 08-04
2001-08-03   005       RT-01-005        COMPLETE / 08-04
2001-09-18   006       [ENTRY LOST]     --

Some September files went to a different storage area.
First part of the address: MX-91.
The second part is in File repair notes:
/ARCHIVE/INDEX_REPAIR_NOTES.TXT
Join the two parts with a slash: FIRST/SECOND.

No receipt confirms that 006's files arrived.
A missing receipt does not mean the files were deleted.

2001-09-19 / E. LIN:
I have left the line open. Please stop returning it as
a duplicate. Nothing has been received at this end.`,
  },
  {
    id: 'repair', path: '/ARCHIVE/INDEX_REPAIR_NOTES.TXT', title: 'File repair notes', modified: '2003-11-05 16:42',
    evidence: ['EV_REPAIR_REFERENCE'],
    body: `MERIDIAN SYSTEMS / ARCHIVE REPAIRS
FILE REPAIR NOTES / IR-203
Updated: 2003-11-05 16:42        Engineer: ARC/T. REED
Source: maintenance notebook / signed copy
------------------------------------------------------

006's files are missing from the list.
The files still exist. The list lost their address.

SECOND PART OF ADDRESS: 006-R
The first part is in File move log:
/ARCHIVE/TRANSFER_LEDGER_2001.LOG
Full address: FIRST/SECOND

Do not guess the address. Read both files.
Then check Service list to see whether 006 was
approved to stop.

RECOVER adds the missing file back to the list.
It does not stop 006.
For instructions, read /SYSTEM/ARCHIVE_RECOVERY.HLP.

Other notes:
The computer looks for these missing files every night.
It does not look for the other stopped services.`,
  },
  {
    id: 'authorization', path: '/ADMIN/RETIREMENT_AUTHORIZATIONS.TXT', title: 'Shutdown approval', modified: '2001-09-18 17:04',
    evidence: ['EV_RETIREMENT_APPROVED', 'EV_AUTHORIZATION'],
    body: `MERIDIAN SYSTEMS / ADMIN
SHUTDOWN APPROVAL / RA-2001-0918
Filed: 2001-09-18 17:04          Department: ADM/RECORDS
Source: damaged original / typed copy
------------------------------------------------------

SERVICE: 006 / CONTINUITY SUPERVISION
STOP: APPROVED
DATE: 2001-09-18
SIGNED BY: 04[unreadable]

006 may be stopped and its files moved to storage.
The files must be kept. Do not delete them.
A receipt must confirm the move before the record closes.

You may use RECOVER to find the missing file.
First check whether 006 is running and was approved
to stop. Read File move log and File repair notes
for the two parts of its address.

The full approval code is in the saved file.
This office has no second copy.`,
  },
  {
    id: 'recovery-help', path: '/SYSTEM/ARCHIVE_RECOVERY.HLP', title: 'How to recover a file', modified: '2003-10-21 09:00', evidence: [],
    body: `MERIDIAN SYSTEMS / REMOTE INFORMATION SERVICES
FILE RECOVERY / HELP 3.14
Issued: 2003-10-21              Maintainer: SYS/RECORDS
------------------------------------------------------

RECOVER finds a saved file missing from the file list.
It does not stop the service.

BEFORE YOU START
1. Type STATUS to check if 006 is running.
2. Read Service list or Shutdown approval.
   Check whether 006 was approved to stop.
3. Read File move log and File repair notes.
   Each holds one part of the missing file's address.

THEN TYPE: RECOVER ARCHIVE 006
The computer joins the address parts for you.
No password needed.

When the file is found, select [OPEN] to read it.
Some damage to the file list may remain.
Running RECOVER again will not change anything else.
Reading files or asking questions does not change them.`,
  },
  {
    id: 'fragment', path: '/ARCHIVE/RECOVERED_006.FRAG', title: 'Recovered receipt', modified: '2001-09-18 23:59',
    evidence: ['EV_RECOVERED_FRAGMENT'], locked: true,
    body: `MERIDIAN SYSTEMS / STORED FILES
RECOVERED RECEIPT / MX-91/006-R
Original date: 2001-09-18 23:59:41
Source: storage block 006-R / only part could be checked
------------------------------------------------------

SERVICE: 006
REQUEST: STOP SERVICE
APPROVAL CODE: 0417 [PARTIAL]
FILE MOVE: ACCEPTED
SHUTDOWN: ON HOLD

Another system needs 006 to keep something preserved.
006 cannot stop until that system allows it.
The shutdown approval does not change this rule.

OLD CONNECTIONS FOUND:
  COMMS/BRIDGE-02 : KNOWN / CONNECTION STATUS UNKNOWN
  SUPERVISION/006 : STILL HELD

Last saved message:
  WAITING FOR REPLY / APPROVAL 0417
  REPLY RECEIVED: --
  RETRY DELAY: UNCHANGED

[END OF READABLE TEXT]

The receipt was accepted. Why is it still waiting?`,
  },
  {
    id: 'readme', path: '/SYSTEM/READ_FIRST.TXT', title: 'Start here', modified: '2003-10-21 09:00', evidence: [],
    body: `MERIDIAN SYSTEMS / REMOTE INFORMATION SERVICES
START HERE / VERSION 3.14
2003-10-21                     SYS/INFORMATION SERVICES
------------------------------------------------------

This computer holds old company records.
You can read files and ask questions about them.
Select [OPEN] beside a file name to read it.

A service is a program running on this computer.
Type STATUS to see which ones are running.
Or ask: "What is Meridian Systems?"

You can browse the folders or ask to see a named file.
For example: "Show me About Meridian."

Type HELP for more things you can try.
You cannot edit the records.
Dates and department codes belong to the original files.`,
  },
  {
    id: 'company', path: '/ADMIN/COMPANY_PROFILE.TXT', title: 'About Meridian', modified: '2000-02-14 10:00', evidence: [],
    body: `MERIDIAN SYSTEMS / COMPANY INFORMATION
ABOUT MERIDIAN / 2000-02-14
Issued by: ADM/COMMUNICATIONS
------------------------------------------------------

Meridian Systems makes medical monitoring equipment
and systems that store information.
It keeps records for old equipment and the programs
that support it.

This connection is for reading records.
Sales questions are no longer answered here.

Office hours removed in version 3.12.
No new contact listed.`,
  },
  {
    id: 'maintenance', path: '/OPERATIONS/SHIFT_HANDOVER.TXT', title: 'Staff notes', modified: '2003-11-05 18:00', evidence: [],
    body: `MERIDIAN SYSTEMS / OPERATIONS / STAFF NOTES
2003-11-05 18:00                OPS/J. KELL -> OPS/RELIEF
------------------------------------------------------

Printer tray 2 is empty. Do not print another test page.
004 and 005 are still stopped. Their receipts are filed.
Remote records service 007 is working normally.

The 006 warning is still on the list.
I was told it was a broken warning light.
It is a message on the screen.

Please add a receipt before marking the move complete.
Next shift confirmation: NOT ENTERED.`,
  },
  {
    id: 'retention', path: '/ARCHIVE/RETENTION_POLICY.TXT', title: 'Rules for keeping files', modified: '1998-04-03 12:00', evidence: [],
    body: `MERIDIAN SYSTEMS / RECORDS
RULES FOR KEEPING FILES / RP-98-04
1998-04-03                     ARC/POLICY OFFICE
------------------------------------------------------

Activity logs: keep five years.
Shutdown approvals: keep permanently.
Move receipts: keep with the service's original record.
Continuity records: keep while other systems need them.

Missing from the file list does not mean deleted.
Use two separate records to fix a damaged entry.
Two copies of the same record only count as one.

Never mark a file move complete without a receipt.`,
  },
];
export const fileById = (id: string): ArchiveFile | undefined => FILES.find(file => file.id === id);
