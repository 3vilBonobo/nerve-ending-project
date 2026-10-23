import { ArchiveFile } from './models';
import { STORY_FILES } from './story-records';
import { CORPORATE_FILES } from './corporate-records';

export const DIRECTORIES = ['/', '/OPERATIONS', '/ARCHIVE', '/ADMIN', '/SYSTEM', '/COMMS', '/POLICY', '/FINANCE', '/STAFF', '/PERSONNEL', '/RESEARCH', '/INCIDENT', '/CLINICAL', '/VENDOR', '/CONTROL'] as const;
export const FILES: readonly ArchiveFile[] = [
  {
    id: 'call', path: '/OPERATIONS/CALL_QUEUE.LOG', title: 'Unanswered call', modified: '2003-11-06 02:13',
    evidence: ['EV_CALL_PENDING'], references: ['ledger'],
    body: `MERIDIAN / SWITCHBOARD
TO       Night desk / extension 214
FROM     Service 006
LATEST   06 Nov 2003, 02:13 / No answer
QUEUED   18 Sep 2001, 23:59

04 Nov / 02:13   No answer
05 Nov / 02:13   No answer

Confirmed: 18 Sep 2001, 23:59:41
By: not in current directory
Attachment: handover receipt`,
  },
  {
    id: 'company', path: '/ADMIN/COMPANY_PROFILE.TXT', title: 'Office notice', modified: '2001-09-18 17:00', evidence: [],
    body: `MERIDIAN SYSTEMS
PUBLIC OFFICE NOTICE                 18 SEP 2001

The public office is now closed.
Telephone reception ended at 17:00 today.

Technical records remain available for owners of
Meridian medical monitoring equipment.

Messages left through this terminal are not read
by office staff.`,
  },
  {
    id: 'maintenance', path: '/OPERATIONS/SHIFT_HANDOVER.TXT', title: 'Last shift', modified: '2001-09-19 08:10',
    evidence: ['EV_DESK_CLOSED'],
    body: `MERIDIAN / STAFF MAIL
19 Sep 2001, 08:10
From: E. Lin
To: Operations
Subject: Night desk

The night desk phone was removed at 17:00 yesterday.
There is no night shift from this week.

The switchboard printed another alarm at 02:13.
Please don't forward it to my home number.
I'm no longer on call.`,
  },
  {
    id: 'register', path: '/OPERATIONS/SERVICE_REGISTER.DAT', title: 'Service 006', modified: '2003-11-06 02:10',
    evidence: ['EV_SERVICE_ACTIVE'], references: ['status-log', 'authorization'],
    body: `MERIDIAN / SERVICE MONITOR
LIVE READING                         06 NOV 2003

006   CONTINUITY MONITOR

STATE              Running
FUNCTION           Overnight alarms
CALL DESTINATION   Night desk / extension 214
LAST OPERATOR      No entry

Last restart: 02 Nov 2003, 03:14:09
No staff terminal was connected at that time.`,
  },
  {
    id: 'status-log', path: '/OPERATIONS/STATUS_LOG_2003.TXT', title: 'Restart log', modified: '2003-11-02 03:14',
    evidence: ['EV_SERVICE_ACTIVE'],
    body: `MERIDIAN / AUTOMATIC MONITOR
02 NOV 2003 / SERVICE 006

03:14:07   Stop requested / scheduled maintenance
03:14:08   Service stopped
03:14:09   Service restarted automatically

RESTART REASON   Handover not closed
OPERATOR         None

Maintenance window ended at 03:30.
No further stop request recorded.`,
  },
  {
    id: 'authorization', path: '/ADMIN/CLOSURE_LIST.TXT', title: 'Closure list', modified: '2001-09-18 17:04',
    evidence: ['EV_RETIREMENT_APPROVED'], references: ['ledger'],
    body: `MERIDIAN / OPERATIONS OFFICE
SERVICE CLOSURES                      18 SEP 2001
Filed by: J. Kell

004   Billing                 Closed
005   Building sensors        Closed
006   Continuity monitor      Closed

Shutdown approved: 18 Sep 2001.
Records transferred to the local archive.

Attached: handover receipt / service 006`,
  },
  {
    id: 'ledger', path: '/ARCHIVE/HANDOVER_006.REF', title: 'Handover receipt', modified: '2001-09-18 23:59',
    evidence: ['EV_TRANSFER_MISSING'], backupAvailable: true,
    body: `MERIDIAN / ARCHIVE ATTACHMENT
HANDOVER RECEIPT / SERVICE 006

DATE       18 Sep 2001, 23:59:41
ORIGINAL   Not listed
BACKUP     Local copy available

The attachment name survives in the call record.
The original file cannot be opened.`,
  },
  {
    id: 'fragment', path: '/ARCHIVE/HANDOVER_006.BAK', title: 'Receipt — backup copy', modified: '2001-09-18 23:59',
    evidence: ['EV_RECOVERED_FRAGMENT', 'EV_AUTHORIZATION'], locked: true, references: ['call', 'bridge'], reveals: ['clinicalHoldKnown'],
    body: `MERIDIAN / HANDOVER RECEIPT
BACKUP COPY / ORIGINAL DATE 18 SEP 2001
Only part of this record could be read.

23:59:41   Archive transfer accepted
23:59:41   Confirmation received

CONFIRMATION SOURCE   COMMS/BRIDGE-02
AUTHORISATION         0417 [partial]
STAFF NAME            [unreadable]
NIGHT DESK / 214       No answer

SERVICE RELEASE       Withheld
REASON                Preservation hold

Release requires a reply from the holding system.
The office shutdown order does not clear this hold.

END OF READABLE RECORD`,
  },
  {
    id: 'readme', path: '/SYSTEM/READ_FIRST.TXT', title: 'Terminal help', modified: '2003-10-21 09:00', evidence: [],
    body: `MERIDIAN / RECORDS ACCESS
TERMINAL HELP / VERSION 3.14

Select a file name to read it.
You can also type questions in ordinary words.

Examples:
  What is Meridian Systems?
  Is this an automatic system?
  Show me the office notice.

DIR lists folders and files.
SEARCH company finds records containing that word.
Up and Down recall things you typed before.
Esc shows a reply without waiting for it to finish.

Original records cannot be edited.`,
  },
  ...STORY_FILES,
  ...CORPORATE_FILES,
];
export const fileById = (id: string): ArchiveFile | undefined => FILES.find(file => file.id === id);
export const FILE_ALIASES: Readonly<Record<string, string>> = {
  'about meridian': 'corporate-profile', 'company profile': 'corporate-profile', 'company information': 'corporate-profile',
  'public directory': 'work-directory', 'work directory': 'work-directory', 'staff directory': 'work-directory',
  'annex transfer': 'annex-transfer', 'office transfer': 'annex-transfer', 'equipment qa': 'equipment-qa',
  'staff notes': 'maintenance', 'last shift': 'maintenance', 'night desk note': 'maintenance',
  'service list': 'register', 'service register': 'register', 'program list': 'register', 'service 006': 'register',
  'call log': 'call', 'call queue': 'call', 'unanswered call': 'call',
  'activity log': 'status-log', 'status log': 'status-log',
  'shutdown approval': 'authorization', 'retirement record': 'authorization', 'closure list': 'authorization',
  'transfer ledger': 'ledger', 'file move log': 'ledger', 'handover receipt': 'ledger', 'receipt': 'ledger',
  'start here': 'readme', 'remote access notice': 'readme',
};
export function fileByName(value: string): ArchiveFile | undefined {
  const name = value.toLowerCase().trim().replace(/^the\s+/, '');
  return fileById(FILE_ALIASES[name] ?? '') ?? FILES.find(file =>
    [file.title, file.path, file.path.split('/').pop()].some(candidate => candidate?.toLowerCase() === name));
}
