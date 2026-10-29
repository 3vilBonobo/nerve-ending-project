import type { GameState } from './models';
import { CLINICAL_SNAPSHOT } from './story-state';

export const SERVICE_STATES = {
  RUNNING: 'The current controller reports the service executing.',
  STANDBY: 'Installed and available, but not currently processing its normal scheduled work. Standby is not necessarily a fault.',
  STOPPED: 'The current controller reports no active execution.',
  RETIRED: 'Formally retired from the register; requires documented retirement and an observed operational state.',
} as const;
export type ServiceState = keyof typeof SERVICE_STATES;
export type ServiceId = '001' | '002' | '003' | '004' | '005' | '006' | '007' | '008';
export interface ServiceDefinition {
  readonly id: ServiceId;
  readonly name: string;
  readonly state: ServiceState;
  readonly purpose: string;
  readonly functions: string;
  readonly limitations: string;
  readonly history: string;
  readonly contacts?: string;
  readonly department?: string;
}

/** Explicit permitted projection of infrastructure v0.5 §3. No protected associations. */
export const SERVICES: readonly ServiceDefinition[] = [
  { id: '001', name: 'Contract Support', state: 'RUNNING',
    purpose: 'Tracks active customer support agreements, scheduled renewals and service commitments.',
    functions: 'Weekday batches and contract queries; product families, maintenance periods, assigned support desks and service obligations.',
    limitations: 'Renewals may await customer signatures; legacy contract attachments may be missing. General output excludes patient details.',
    history: 'Active and renewed across 2001–2003.', contacts: 'Peter Duarte (contracts); Samuel Ortiz (support); Helen Mercer (financial summaries).' },
  { id: '002', name: 'Equipment Register', state: 'RUNNING',
    purpose: 'Records supported medical devices, serial numbers, calibration dates and spare-parts needs.',
    functions: 'Equipment registration and daily record synchronization; approved models and generic technical compatibility metadata.',
    limitations: 'Duplicate historical serial references, outdated device locations and late field-service acknowledgements can occur. Customer and patient records have separate controls.',
    history: 'Ordinary ongoing equipment operations.', contacts: 'Nina Park; Owen Keller; Andrew Bell; Leah Morgan.' },
  { id: '003', name: 'Message Router', state: 'STANDBY',
    purpose: 'Accepts notifications from registered services and forwards them to configured mailboxes, internal telephone-extension systems or maintenance endpoints.',
    functions: 'Wakes for queued work; records routing attempts, coded destinations and acknowledgements.',
    limitations: 'Retired extensions may be unreachable; mail delivery may be unconfirmed; switching hardware is aging. A routing entry does not establish a usable external path.',
    history: 'Routing changed during the Operations Annex closure; legacy mappings persist.', contacts: 'Victor Chen; Miles Harper; Evelyn Lin.' },
  { id: '004', name: 'Billing', state: 'STOPPED',
    purpose: 'Former automated invoice preparation and ledger export.',
    functions: 'Retained invoices, closeout reports and final batch status are available as historical records.',
    limitations: 'No scheduled billing execution is recorded after the September 2001 stop. Reading an archived log does not restart billing.',
    history: 'Administratively closed and actually stopped in September 2001. Finance Operations requested the stop on 18 September; termination was confirmed at 18:31.',
    contacts: 'Helen Mercer; Brent Holloway.' },
  { id: '005', name: 'Building Sensors', state: 'STOPPED',
    purpose: 'Former overnight temperature, entry and utility monitoring for the Providence Operations Annex.',
    functions: 'Retained environmental alarms, sensor tests and maintenance entries are historical records.',
    limitations: 'No recent sensor readings are supplied. Reading historical records does not reactivate collection.',
    history: 'Collection was disabled and the monitoring service stopped at the office closure on 18 September 2001; termination was confirmed at 18:02.',
    contacts: 'Thomas Keene; Teresa Walsh.' },
  { id: '006', name: 'Continuity Monitor', state: 'RUNNING', department: 'Historical Technical Operations',
    purpose: 'Watches designated equipment that requires uninterrupted service.',
    functions: 'Tracks incidents, assigns a notification destination and records whether an operator acknowledges alerts.',
    limitations: 'Equipment-specific obligations and control procedures are not available through routine service information. No active operator is assigned to the old notification desk.',
    history: 'A limited administrative and technical event history is retained. Last recorded restart: 02 NOV 2003 03:14:09.' },
  { id: '007', name: 'Records Access', state: 'RUNNING',
    purpose: 'Runs approved remote and internal document access sessions, including R-02, the connection you are using.',
    functions: 'Permitted document indexes, session capability information and connection diagnostics.',
    limitations: 'Archive mirrors may be stale, tokens may expire and records may be absent from a mirror. Other visitors\' private session activity is not available.',
    history: 'Reduced but maintained for support contracts and legacy archive requests.', contacts: 'Victor Chen; Oliver Ames; Gina Valdez.' },
  { id: '008', name: 'Archive Index', state: 'RUNNING',
    purpose: 'Indexes retained corporate files and their metadata for approved clients.',
    functions: 'Locates permitted paths, titles, originating departments, dates, retention information and access conditions.',
    limitations: 'Incomplete media imports, damaged references, missing attachments and stale pointers can occur. Some older originals are physically unavailable.',
    history: 'Retains early company records alongside current archives.', contacts: 'Oliver Ames; Gina Valdez.' },
];
export const serviceById = (id: string): ServiceDefinition | undefined => SERVICES.find(service => service.id === id);
export const currentServiceState = (service: ServiceDefinition, state: GameState): ServiceState => state.scenario?.outcome ? service.state : service.id === '006' ? state.operating.service006Running ? 'RUNNING' : 'STOPPED' : service.state;

// This is the existing fixed story observation, not a server clock or elapsed play time.
export const SERVICE_OBSERVATION = { local: '2003-11-06T02:14:00', label: CLINICAL_SNAPSHOT.at } as const;
export interface ServiceEvent {
  readonly id: string;
  readonly serviceId: ServiceId;
  /** Installation-local ISO order; date-only values retain their authored precision. */
  readonly timestamp: string;
  readonly category: 'INFO' | 'NOTICE' | 'WARN' | 'ERROR' | 'HIST';
  readonly message: string;
  readonly source: { readonly reference: string; readonly section: string; readonly origin: string; readonly kind: 'service-event' | 'archive-annotation' };
  readonly visibility: 'public' | 'internal';
}
const sample = (serviceId: ServiceId, key: string, timestamp: string, category: ServiceEvent['category'], message: string): ServiceEvent => ({
  id: `svc-${serviceId}-${key}`, serviceId, timestamp, category, message, visibility: 'public',
  source: { reference: 'docs/narrative/NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5.md', section: `4.${Number(serviceId)}`, origin: category === 'HIST' ? 'Historical registry annotation' : `Service ${serviceId} event history`, kind: category === 'HIST' ? 'archive-annotation' : 'service-event' },
});
const restart = (second: string, message: string): ServiceEvent => ({
  id: `svc-006-20031102-0314${second}`, serviceId: '006', timestamp: `2003-11-02T03:14:${second}`, category: 'INFO', message, visibility: 'public',
  source: { reference: '/OPERATIONS/STATUS_LOG_2003.TXT', section: '02 NOV 2003 / SERVICE 006', origin: 'Retained automatic monitor log', kind: 'service-event' },
});

/** Only past, permitted authored events. Exclusions are documented in the delivery report. */
export const SERVICE_EVENTS: readonly ServiceEvent[] = [
  sample('001', '20031105-0810', '2003-11-05T08:10', 'INFO', 'Contract renewal index updated; 19 records checked; 0 errors'),
  sample('001', '20031031-1622', '2003-10-31T16:22', 'NOTICE', 'Contract MS-204 renewal pending customer signature'),
  sample('002', '20031105-0812', '2003-11-05T08:12', 'INFO', 'Equipment register synchronized; 139 records; 0 errors'),
  sample('002', '20031103-1106', '2003-11-03T11:06', 'WARN', 'Duplicate legacy serial reference; queued for manual review'),
  sample('002', '20031103-1142', '2003-11-03T11:42', 'INFO', 'Duplicate reference corrected; equipment register unchanged'),
  sample('003', '20031106-0213', '2003-11-06T02:13', 'WARN', 'Message to EXT 214 received no acknowledgement'),
  sample('003', '20031105-0213', '2003-11-05T02:13', 'WARN', 'Message to EXT 214 received no acknowledgement'),
  sample('003', '20031029-1220', '2003-10-29T12:20', 'INFO', 'Support mailbox route test successful'),
  sample('004', '20010918-1804', '2001-09-18T18:04', 'INFO', 'Final billing export archived'),
  sample('004', '20010918-1830', '2001-09-18T18:30', 'INFO', 'Stop requested by Finance Operations'),
  sample('004', '20010918-1831', '2001-09-18T18:31', 'INFO', 'Billing process stopped; termination confirmed'),
  sample('004', '20010918-1833', '2001-09-18T18:33', 'INFO', 'Archive handover complete'),
  sample('005', '20010918-1745', '2001-09-18T17:45', 'INFO', 'Final annex sensor inspection completed'),
  sample('005', '20010918-1801', '2001-09-18T18:01', 'INFO', 'Sensor event collection disabled'),
  sample('005', '20010918-1802', '2001-09-18T18:02', 'INFO', 'Monitoring service stopped; termination confirmed'),
  sample('006', '20031106-0213', '2003-11-06T02:13', 'WARN', 'Scheduled alert to EXT 214 not acknowledged'),
  sample('006', '20031105-0213', '2003-11-05T02:13', 'WARN', 'Scheduled alert to EXT 214 not acknowledged'),
  sample('006', '20031104-0213', '2003-11-04T02:13', 'WARN', 'Scheduled alert to EXT 214 not acknowledged'),
  restart('07', 'Stop requested / scheduled maintenance'),
  restart('08', 'Service stopped'),
  restart('09', 'Service restarted automatically'),
  sample('006', '20031101-0213', '2003-11-01T02:13', 'WARN', 'Scheduled alert to EXT 214 not acknowledged'),
  sample('006', '20010918-closure', '2001-09-18', 'HIST', 'Service included in administrative closure batch'),
  sample('008', '20031106-0155', '2003-11-06T01:55', 'WARN', 'Legacy reference ARC-91-044 unresolved in index'),
  sample('008', '20031106-0156', '2003-11-06T01:56', 'INFO', 'Remaining archive index available'),
  sample('008', '20031105-0155', '2003-11-05T01:55', 'INFO', 'Nightly archival integrity scan completed'),
  sample('008', '20031104-1420', '2003-11-04T14:20', 'INFO', '12 retention records updated'),
];
export function permittedServiceEvents(id?: ServiceId, warningsOnly = false): readonly ServiceEvent[] {
  return SERVICE_EVENTS.filter(event => event.visibility === 'public' && event.timestamp <= SERVICE_OBSERVATION.local && (!id || event.serviceId === id) && (!warningsOnly || event.category === 'WARN' || event.category === 'ERROR'))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp) || a.serviceId.localeCompare(b.serviceId) || a.id.localeCompare(b.id));
}
export function serviceTimestamp(timestamp: string): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${timestamp.slice(8, 10)} ${months[Number(timestamp.slice(5, 7)) - 1]} ${timestamp.slice(0, 4)}${timestamp.includes('T') ? ' ' + timestamp.slice(11) : ''}`;
}
