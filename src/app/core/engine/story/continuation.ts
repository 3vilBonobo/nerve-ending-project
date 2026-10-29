import { fileById } from '../../content/record-registry';
import type { ArchiveFile, GameState, TerminalOutput, Transition } from '../../models';
import { CLINICAL_SNAPSHOT, Knowledge, OperationId, Permission } from '../../state/story-state';
import { scenarioCanRead, caseMilestone } from '../../state/scenario-state';
import { scenarioEnding, scenarioHint } from '../scenario/scenario';
export const knows = (s: GameState, k: Knowledge): boolean => s.knowledge.includes(k);
export const permits = (s: GameState, p: Permission): boolean => s.permissions.includes(p);
export function canRead(s: GameState, f: ArchiveFile): boolean {
    if (s.scenario && f.legacyOnly || !s.scenario && f.scenarioScope)
        return false;
    if (f.scenarioScope)
        return !!s.scenario && scenarioCanRead(s.scenario, f.scenarioScope, f.id);
    if (s.scenario && f.access)
        return false;
    return (!(f.locked || f.requiresBackup) || s.archive006Recovered) && (!f.access || permits(s, f.access)) && (!f.requiresKnowledge || knows(s, f.requiresKnowledge));
}
export function learn(s: GameState, knowledge: readonly Knowledge[] = [], permissions: readonly Permission[] = []): GameState {
    return { ...s, knowledge: [...new Set([...s.knowledge, ...knowledge])], permissions: [...new Set([...s.permissions, ...permissions])] };
}
const out = (lines: string[], ids: string[] = [], code: TerminalOutput['code'] = 'ok'): TerminalOutput => ({ lines, links: ids.flatMap(id => { const f = fileById(id); return f ? [{ fileId: id, label: f.path }] : []; }), code, truth: 'system' });
export interface Operation {
    id: OperationId;
    label: string;
    warning?: string;
    available: (s: GameState) => boolean;
    requires: string;
    files?: string[];
}
export const OPERATION_DEFINITIONS: readonly Operation[] = [
    { id: 'bridge-status', label: 'CHECK BRIDGE STATUS', available: s => s.archive006Recovered, requires: 'Read the local handover backup.', files: ['bridge'] },
    { id: 'verify-handover', label: 'VERIFY HANDOVER', available: s => s.investigation.stage === 'complete', requires: 'Establish the closure distinction and corroborate the handover origin through the terminal investigation.' },
    { id: 'examine-hold', label: 'EXAMINE HOLD', available: s => permits(s, 'archiveAuditAccess'), requires: 'Verify the handover receipt.', files: ['hold-policy'] },
    { id: 'audit-service', label: 'REQUEST SERVICE AUDIT', available: s => permits(s, 'archiveAuditAccess'), requires: 'Verify the handover receipt.', files: ['audit'] },
    { id: 'search-clinical-index', label: 'SEARCH CLINICAL INDEX', available: s => knows(s, 'site6Known') && permits(s, 'archiveAuditAccess'), requires: 'Inspect the service audit or facility disposition.' },
    { id: 'audit-controller', label: 'AUDIT CONTROLLER', available: s => permits(s, 'clinicalRecordAccess'), requires: 'Request the protected clinical index.', files: ['controller'] },
    { id: 'connect-diagnostics', label: 'CONNECT DIAGNOSTICS', available: s => permits(s, 'clinicalReadOnlyDiagnostics'), requires: 'Identify the clinical controller with an audit.', warning: 'Establish read-only communication with Site 6. No treatment change, vendor restoration or software transfer. This can be disconnected by isolating the relay.' },
    { id: 'compare-records', label: 'COMPARE CLINICAL RECORDS', available: s => permits(s, 'clinicalRecordAccess'), requires: 'Request the protected clinical index.' },
    { id: 'review-routes', label: 'REVIEW COMMUNICATION ROUTES', available: s => knows(s, 'feedbackLoopKnown') && knows(s, 'annaAliveKnown'), requires: 'Establish continued support and examine a stimulation trace or failed support reduction.' },
    { id: 'inspect-queue', label: 'INSPECT QUEUE', available: s => permits(s, 'bridgeOperationsAccess'), requires: 'Review the communication architecture.' },
    { id: 'review-safety', label: 'REVIEW SAFETY', available: s => permits(s, 'bridgeOperationsAccess'), requires: 'Review the communication architecture.' },
    { id: 'review-release', label: 'REVIEW RELEASE', available: s => permits(s, 'bridgeOperationsAccess'), requires: 'Review the communication architecture.' },
    { id: 'restore-bridge', label: 'RESTORE BRIDGE', available: s => permits(s, 'bridgeOperationsAccess') && !s.operating.vendorCredentialsRevoked && !s.operating.siteRelayIsolated, requires: 'Review routes; revoked credentials cannot be restored. Reverse temporary isolation separately.', warning: 'Enable the legacy outbound vendor relay. This makes recovery-package delivery possible. No package is sent by restoration alone. A later release may transmit automatically.' },
    { id: 'test-route', label: 'TEST RECOVERY ROUTE', available: s => permits(s, 'bridgeOperationsAccess') && s.operating.bridgeMode === 'operational', requires: 'Explicitly restore the vendor bridge first.', warning: 'Stage a sealed adaptive recovery package and test destination acknowledgement. No clinical profile is transmitted by this test. Release can subsequently send the staged package.' },
    { id: 'isolate-bridge', label: 'ISOLATE BRIDGE', available: s => permits(s, 'bridgeOperationsAccess'), requires: 'Review the communication architecture.', warning: 'Block the known outbound relay. Queued data will be held. Local preservation continues. This temporary closure can be reversed before a final decision.' },
    { id: 'restore-isolation', label: 'RESTORE ISOLATION', available: s => permits(s, 'bridgeOperationsAccess') && s.operating.siteRelayIsolated && !s.operating.vendorCredentialsRevoked, requires: 'A temporary isolated relay with valid vendor credentials is required.', warning: 'Reverse temporary isolation and enable outbound vendor communication. A later release may send recovery data. This does not revoke a final containment decision.' },
    { id: 'revoke-vendor', label: 'REVOKE VENDOR', available: s => (permits(s, 'vendorRouteAdministration') || permits(s, 'bridgeOperationsAccess') && s.viewedFileIds.includes('revocation')) && knows(s, 'externalRiskKnown'), requires: 'Review the medical risk notice and vendor revocation procedure.', warning: 'Irreversibly invalidate the known vendor destination. Existing devices keep installed settings, but clinics lose legitimate legacy support and updates until replacement service is arranged. Delayed maintenance can affect care.' },
    { id: 'verify-isolation', label: 'VERIFY ISOLATION', available: s => permits(s, 'bridgeOperationsAccess') && s.operating.siteRelayIsolated, requires: 'Isolate the outbound bridge first.' },
    { id: 'prepare-release', label: 'PREPARE RELEASE', available: s => knows(s, 'annaAliveKnown') && knows(s, 'releaseConsequencesKnown') && permits(s, 'bridgeOperationsAccess'), requires: 'Review the patient status and release procedure. Preparation changes no treatment.' },
    { id: 'release-patient', label: 'RELEASE PATIENT', available: s => permits(s, 'clinicalReleaseAuthorization') && s.operating.releaseProcedureStarted && s.operating.clinicalSupportActive && !s.operating.vendorCredentialsRevoked, requires: 'Review and prepare release. With revoked credentials use controlled release after verifying isolation.', warning: 'FINAL: terminate Anna Voss\'s dependent biological support. She will die. Automatic recovery will attempt the known depot route; delivery depends on the current connection. Temporary isolation holds queued data but does not neutralize credentials.' },
    { id: 'contain-site', label: 'CONTAIN SITE', available: s => permits(s, 'bridgeOperationsAccess') && knows(s, 'annaAliveKnown'), requires: 'Review routes and establish the patient\'s continued support.', warning: 'FINAL: permanently isolate the known external relay and continue preservation. Anna remains alive. Her neurological correction cycles continue. This does not resolve her distress.' },
    { id: 'controlled-release', label: 'CONTROLLED RELEASE', available: s => permits(s, 'clinicalReleaseAuthorization') && s.operating.releaseProcedureStarted && knows(s, 'externalRiskKnown') && s.operating.vendorCredentialsRevoked && s.operating.siteRelayIsolated && s.operating.isolationVerified, requires: 'Understand external risk, revoke the vendor credentials, isolate and verify the relay, then prepare release.', warning: 'FINAL: end Anna Voss\'s dependent biological support with the known recovery route blocked. She will die. Legitimate vendor support remains disrupted; replacement arrangements are outside this client\'s control. Undocumented routes cannot be certified.' },
];
export const availableOperations = (s: GameState): readonly Operation[] => s.scenario || s.operating.endingId ? [] : OPERATION_DEFINITIONS.filter(o => o.available(s));
/** Anchored operational grammar. Questions and semantic classifications cannot enter the reducer. */
export function parseOperation(raw: string): OperationId | 'confirm' | 'cancel' | undefined {
    let text = raw.trim().toLowerCase().replace(/[.!]+$/, '').replace(/\s+/g, ' ');
    if (/[?]/.test(text) || /^(can|could|would|should|will|was|is|what|why|how|when|does|do i)\b/.test(text))
        return undefined;
    text = text.replace(/^(?:execute|please) /, '').replace(/ please$/, '');
    if (/^(confirm|confirm operation|yes confirm)$/.test(text))
        return 'confirm';
    if (/^(cancel|cancel operation|no cancel)$/.test(text))
        return 'cancel';
    const rules: [
        RegExp,
        OperationId
    ][] = [
        [/^(?:check |inspect )?bridge(?: 02|-02)? status$/, 'bridge-status'],
        [/^(?:verify|validate) (?:the )?(?:handover|receipt|handover receipt)$/, 'verify-handover'],
        [/^(?:examine|inspect) (?:the )?(?:preservation )?hold$/, 'examine-hold'],
        [/^(?:request |run |open )?(?:a |the )?(?:read-only )?(?:continuity|service|006|service 006) audit$/, 'audit-service'],
        [/^(?:search|request|open) (?:the )?(?:protected )?clinical index$/, 'search-clinical-index'],
        [/^(?:audit|identify) (?:the )?(?:clinical )?controller$/, 'audit-controller'],
        [/^(?:connect|establish|enable) (?:read-only |clinical |clinical read-only )?diagnostics$/, 'connect-diagnostics'],
        [/^compare (?:clinical |contradictory )?records$/, 'compare-records'],
        [/^(?:review|inspect|map) (?:the )?(?:communication |network |remote )?routes$/, 'review-routes'],
        [/^(?:inspect|review|check) (?:the )?(?:external |depot |transfer )?queue$/, 'inspect-queue'],
        [/^(?:review|inspect) (?:the )?(?:safety|medical risk|risk notice)$/, 'review-safety'],
        [/^(?:review|inspect) (?:the )?(?:patient )?release(?: procedure)?$/, 'review-release'],
        [/^(?:restore|repair|reopen) (?:the )?(?:legacy |vendor )?bridge$/, 'restore-bridge'],
        [/^test (?:the )?(?:external |recovery )?route$/, 'test-route'],
        [/^(?:isolate|suspend) (?:the )?(?:outbound |external )?(?:bridge|traffic|relay)$/, 'isolate-bridge'],
        [/^(?:restore isolation|reverse isolation|remove isolation)$/, 'restore-isolation'],
        [/^(?:revoke|invalidate) (?:the )?(?:legacy )?vendor(?: route| credentials)?$/, 'revoke-vendor'],
        [/^(?:verify|test|check) (?:the )?isolation$/, 'verify-isolation'],
        [/^prepare (?:patient |controlled )?release$/, 'prepare-release'],
        [/^(?:release (?:the )?(?:patient|anna)|terminate preservation|disconnect now)$/, 'release-patient'],
        [/^(?:contain (?:the )?site|continue preservation|preserve site 6 isolation)$/, 'contain-site'],
        [/^(?:perform )?controlled release$/, 'controlled-release'],
    ];
    return rules.find(([re]) => re.test(text))?.[1];
}
export function transportStatus(s: GameState): string[] {
    const o = s.operating;
    return [`Relay: ${o.bridgeMode.toUpperCase()}`, `Vendor credentials: ${o.vendorCredentialsRevoked ? 'REVOKED' : 'VALID / LEGACY'}`, `Recovery package: ${o.outboundPackageTransmitted ? 'TRANSMITTED / DEPOT RECEIPT CONFIRMED' : o.outboundPackageQueued ? 'QUEUED / NO DELIVERY RECEIPT' : 'NONE'}`, 'Known destination: clinic service depot 2', 'Depot receipt does not establish installation or injury.'];
}
export function executeOperation(state: GameState, id: OperationId | 'confirm' | 'cancel'): Transition {
    const result = (s: GameState, lines: string[], ids: string[] = [], code: TerminalOutput['code'] = 'ok'): Transition => ({ state: s, output: out(lines, ids.filter(file => { const f = fileById(file); return f && canRead(s, f); }), code) });
    if (id === 'cancel')
        return result({ ...state, pendingOperation: undefined }, ['OPERATION CANCELLED. No intervention was performed.']);
    if (state.operating.endingId)
        return result(state, ['SESSION INTERVENTION COMPLETE.', 'Records and questions remain available. Start a new session to choose another intervention.'], [], 'notice');
    const confirmed = id === 'confirm';
    const action = confirmed ? state.pendingOperation : id;
    const definition = OPERATION_DEFINITIONS.find(o => o.id === action);
    if (!definition)
        return result(state, ['NO OPERATION AWAITING CONFIRMATION.'], [], 'notice');
    // Validate prerequisites again on confirmation, including after resume.
    if (!definition.available(state))
        return result({ ...state, pendingOperation: undefined }, [`BLOCKED: ${definition.label}`, definition.requires], [], 'denied');
    const event = `operation:${definition.id}`;
    const repeatable = ['bridge-status', 'audit-service', 'inspect-queue', 'connect-diagnostics', 'isolate-bridge', 'restore-isolation', 'restore-bridge', 'verify-isolation'];
    if (state.events.includes(event) && !repeatable.includes(definition.id))
        return result(state, ['ALREADY COMPLETED: ' + definition.label, 'No duplicate effect was applied.'], definition.files);
    if (definition.warning && !confirmed)
        return result({ ...state, pendingOperation: definition.id }, [`AWAITING CONFIRMATION: ${definition.label}`, definition.warning, 'Choose CONFIRM OPERATION or CANCEL.'], [], 'notice');
    let s: GameState = { ...state, operating: { ...state.operating }, pendingOperation: undefined, events: [...new Set([...state.events, event])] };
    const grant = (k: Knowledge[] = [], p: Permission[] = []): void => { s = learn(s, k, p); };
    let lines: string[] = [];
    let files = definition.files ?? [];
    switch (definition.id) {
        case 'bridge-status':
            s.viewedFileIds = [...new Set([...s.viewedFileIds, 'bridge'])];
            lines = ['BRIDGE-02 / HISTORICAL STATUS', 'Service 006 / confirmation source BRIDGE-02 / receiving destination PRESERVATION CONTROLLER.', 'Archive transfer accepted at 23:59:41. No human desk answered.', 'Accepted transfer is not a clinical release acknowledgement.'];
            break;
        case 'verify-handover':
            lines = ['HANDOVER PROVENANCE ALREADY ESTABLISHED.', 'The read-only audit delegation is available.'];
            files = ['bridge', 'audit'];
            break;
        case 'examine-hold':
            grant(['clinicalHoldKnown']);
            lines = ['HOLD OWNER: CLINICAL/06', 'Office closure cannot discharge clinical responsibility.'];
            break;
        case 'audit-service':
            grant(['site6Known', 'clinicalHoldKnown']);
            lines = ['SERVICE 006 / CLINICAL PRESERVATION', 'Registered facility: Meridian Site 6. Research closed; essential support exempt.', 'The protected clinical index accepts verified archive provenance.'];
            files = ['audit', 'disposition', 'obligations', 'clinical-register'];
            break;
        case 'search-clinical-index':
            grant(['annaIdentified'], ['clinicalRecordAccess']);
            lines = ['INDEX RESOLVED: AV-06 / ANNA VOSS', 'Historical clinical and personnel records available through the verified audit mirror.', 'No treatment permission granted.'];
            files = ['voss', 'incident', 'patient', 'n-series'];
            break;
        case 'audit-controller':
            grant(['motherIdentified'], ['clinicalReadOnlyDiagnostics']);
            lines = ['CONTROLLER IDENTIFIED: MOTHER', 'Specialized research and clinical operations expert system.', 'Read-only diagnostic capability delegated. Connection requires an explicit action.'];
            files = ['controller', 'counters', 'patient'];
            break;
        case 'connect-diagnostics':
            s.operating.diagnosticConnected = true;
            if (!s.operating.siteRelayIsolated && s.operating.bridgeMode === 'archive')
                s.operating.bridgeMode = 'diagnostic';
            grant(['annaAliveKnown']);
            lines = ['CLINICAL DIAGNOSTICS CONNECTED / READ ONLY', 'Anna Voss: biological support ACTIVE. Independent neurological function INSUFFICIENT.', 'No change to stimulation. Vendor route remains ' + (s.operating.bridgeMode === 'operational' ? 'enabled by your separate restoration.' : 'unavailable for delivery.')];
            files = ['patient', 'rao', 'trace', 'distress'];
            break;
        case 'compare-records':
            grant(['incidentKnown', 'distressEvidenceKnown', 'feedbackLoopKnown']);
            lines = ['COMPARISON: STABLE measures restored activity; Rao measures possible benefit.', 'Incident review: escalating corrective stimulation injured Anna Voss on 17 April 1996.', 'The later trace shows reduction followed by automatic restoration. These statements do not establish recovery.', 'Repeated activation is compatible with distress. No voluntary patient message is present.'];
            files = ['patient', 'incident', 'rao', 'trace', 'feedback'];
            break;
        case 'review-routes':
            grant(['recoveryHandoffKnown'], ['bridgeOperationsAccess']);
            lines = ['ROUTE AUDIT COMPLETE / NO TRANSPORT ENABLED', 'Clinical termination can invoke an adaptive recovery handoff.', `${knows(s, 'motherIdentified') ? 'MOTHER' : 'CONTROLLER'}: A usable vendor bridge could continue the recovery procedure. Your archive session alone cannot.`, 'You may inspect the queue, safety bulletin and intervention manuals.'];
            files = ['service-map', 'recovery-handoff', 'compatibility', 'release'];
            break;
        case 'inspect-queue':
            lines = ['CURRENT TRANSPORT / ' + CLINICAL_SNAPSHOT.at, ...transportStatus(s)];
            files = ['depot-queue', 'recovery-handoff'];
            break;
        case 'review-safety':
            grant(['externalRiskKnown', 'externalCompatibilityKnown']);
            lines = ['SAFETY REVIEW / SHARED LEGACY FORMAT', 'An experimental recovery profile could be accepted by old clinic software, causing stimulation or sensory distress.', 'There is no general internet infection. Depot receipt is not proof of installation.'];
            files = ['risk', 'compatibility', 'revocation'];
            break;
        case 'review-release':
            grant(['releaseConsequencesKnown']);
            lines = ['RELEASE REVIEW', 'Termination will end dependent biological support. Anna will die.', 'Standard release invokes recovery. Controlled release requires revoked credentials and verified isolation.', 'PREPARE RELEASE requests delegated emergency intervention authority; preparation changes no treatment.'];
            files = ['release', 'recovery-handoff'];
            break;
        case 'restore-bridge':
            s.operating.bridgeMode = 'operational';
            s.operating.isolationVerified = false;
            lines = ['VENDOR BRIDGE RESTORED. Legacy destination can now receive recovery traffic.', 'No package transmitted by this operation.', ...transportStatus(s)];
            break;
        case 'test-route':
            s.operating.outboundPackageQueued = true;
            lines = ['DESTINATION ACKNOWLEDGED / SEALED PACKAGE STAGED', 'Control data remains local. No delivery receipt issued.', 'Termination can release this package unless the route is blocked.'];
            break;
        case 'isolate-bridge':
            s.operating.siteRelayIsolated = true;
            s.operating.bridgeMode = 'isolated';
            s.operating.isolationVerified = false;
            lines = ['OUTBOUND RELAY ISOLATED. Pending data held.', 'Local preservation continues. This temporary isolation can be reversed.'];
            break;
        case 'restore-isolation':
            s.operating.siteRelayIsolated = false;
            s.operating.bridgeMode = 'operational';
            s.operating.isolationVerified = false;
            lines = ['TEMPORARY ISOLATION REVERSED.', 'Vendor delivery is available. No package sent by this operation.'];
            break;
        case 'revoke-vendor':
            grant([], ['vendorRouteAdministration']);
            s.operating.vendorCredentialsRevoked = true;
            s.operating.vendorRouteEnabled = false;
            s.operating.isolationVerified = false;
            lines = ['LEGACY VENDOR CREDENTIALS REVOKED.', 'Known recovery destination disabled. Legitimate clinic support also interrupted.', 'Existing device configurations remain. Replacement service must be arranged outside this client.'];
            break;
        case 'verify-isolation':
            s.operating.isolationVerified = true;
            lines = ['ISOLATION VERIFIED / NO PATIENT DATA SENT', 'Known relay: closed. Vendor destination: ' + (s.operating.vendorCredentialsRevoked ? 'credentials invalid.' : 'credentials still valid; restoration remains possible.'), 'Undocumented routes cannot be certified.'];
            break;
        case 'prepare-release':
            grant([], ['clinicalReleaseAuthorization']);
            s.operating.releaseProcedureStarted = true;
            lines = ['EMERGENCY REVIEW DELEGATION RECORDED.', 'Release authority is limited to AV-06 under the retained intervention procedure.', 'No biological support has been changed. A final intervention requires a separate confirmation.'];
            files = ['release'];
            break;
        case 'release-patient':
            s.operating.endingId = 'MERCY_PROPAGATION';
            finishSupport(s);
            s.operating.outboundPackageTransmitted = s.operating.bridgeMode === 'operational' && !s.operating.siteRelayIsolated && s.operating.vendorRouteEnabled;
            s.operating.outboundPackageQueued = !s.operating.outboundPackageTransmitted;
            lines = endingText(s);
            break;
        case 'contain-site':
            s.operating.endingId = 'CONTAINMENT_CONTINUATION';
            s.operating.siteRelayIsolated = true;
            s.operating.bridgeMode = 'isolated';
            s.operating.isolationVerified = true;
            lines = endingText(s);
            break;
        case 'controlled-release':
            s.operating.endingId = 'SEVERANCE_COSTLY_COMPASSION';
            finishSupport(s);
            s.operating.outboundPackageQueued = false;
            lines = endingText(s);
            break;
    }
    return result(s, lines, files);
}
function finishSupport(s: GameState): void { s.operating.annaBiologicallyAlive = false; s.operating.clinicalSupportActive = false; s.operating.service006Running = false; }
export function endingText(s: GameState): string[] {
    if (s.scenario)
        return scenarioEnding(s.scenario);
    switch (s.operating.endingId) {
        case 'MERCY_PROPAGATION': return ['MERCY / PROPAGATION', 'Preservation ended. Anna Voss: biological activity ceased.', s.operating.outboundPackageTransmitted ? 'Recovery package: delivered to clinic service depot 2. Receipt confirmed.' : 'Recovery package: queued locally. Delivery attempted; no external receipt. The known route has not been permanently neutralized.', 'A saved control profile is not Anna.', s.operating.outboundPackageTransmitted ? 'The depot has accepted it as a service item. Installation is unverified.' : 'The queue still names a destination.', 'The night desk is no longer being called.'];
        case 'CONTAINMENT_CONTINUATION': return ['CONTAINMENT / CONTINUATION', 'Known outbound relay permanently isolated. No recovery package delivered.', 'Anna Voss remains biologically alive.', `${knows(s, 'motherIdentified') ? 'MOTHER' : 'CONTROLLER'}: Patient preservation successful.`, `Correction cycles at the last observation: ${CLINICAL_SNAPSHOT.correctionCycles}.`, 'The next correction remains authorized.'];
        case 'SEVERANCE_COSTLY_COMPASSION': return ['SEVERANCE / COSTLY COMPASSION', 'Known recovery destination invalidated. Isolation verified. No recovery package delivered.', 'Preservation ended. Anna Voss: biological activity ceased.', 'Legacy clinic support requests now fail authentication. Technicians need a replacement service; some care will be delayed.', 'Undocumented infrastructure remains outside this audit.', 'For the first time in this record, no correction follows.'];
        default: return [];
    }
}
export function actOf(s: GameState): number {
    if (s.scenario)
        return Math.min(7, caseMilestone(s.scenario) + 1);
    if (s.operating.endingId)
        return 7;
    if (knows(s, 'releaseConsequencesKnown') && knows(s, 'externalRiskKnown'))
        return 6;
    if (knows(s, 'recoveryHandoffKnown'))
        return 5;
    if (knows(s, 'annaAliveKnown'))
        return 4;
    if (knows(s, 'annaIdentified'))
        return 3;
    if (knows(s, 'site6Known'))
        return 2;
    return 1;
}
export function nextHint(s: GameState): {
    lines: string[];
    files: string[];
} {
    if (s.scenario)
        return { lines: scenarioHint(s.scenario), files: [] };
    if (s.operating.endingId)
        return { lines: ['The intervention is complete. Records remain available; a new session permits another choice.'], files: [] };
    if (s.investigation.stage === 'closure')
        return { lines: ['Compare the live service reading with the office closure. Ask about the discrepancy when you have a question.', 'During a review, EXPLAIN gives procedural help; DEFER preserves it while you investigate.'], files: ['register', 'authorization', 'ledger'] };
    if (s.investigation.stage === 'provenance')
        return { lines: ['The confirmation source must be corroborated. Transfer acceptance and authority to end a hold are different claims.'], files: ['fragment', 'bridge'] };
    if (!permits(s, 'archiveAuditAccess'))
        return { lines: ['The receipt names a bridge rather than a person. Its provenance can be verified without changing a service.'], files: ['bridge'] };
    if (!knows(s, 'site6Known'))
        return { lines: ['A service audit can identify the holder. The facility disposition provides another route.'], files: ['audit', 'disposition'] };
    if (!permits(s, 'clinicalRecordAccess'))
        return { lines: ['The clinical inventory permits a verified session to search its protected index.'], files: ['clinical-register'] };
    if (!knows(s, 'annaAliveKnown'))
        return { lines: ['The subject record and incident review describe different dates. Current diagnostics can corroborate continued support.'], files: ['patient', 'incident'] };
    if (!knows(s, 'feedbackLoopKnown'))
        return { lines: ['Compare the word STABLE with the clinical review or the support-reduction trace.'], files: ['rao', 'trace'] };
    if (!permits(s, 'bridgeOperationsAccess'))
        return { lines: ['Support reduction provoked restoration. Review the communication routes to understand the recovery handoff.'], files: ['service-map', 'recovery-handoff'] };
    if (!knows(s, 'externalRiskKnown'))
        return { lines: ['A shared calibration format is not proof of safety. A medical risk bulletin survives in vendor support.'], files: ['compatibility', 'risk'] };
    if (!knows(s, 'releaseConsequencesKnown'))
        return { lines: ['The release manual distinguishes ending support from preventing recovery delivery.'], files: ['release'] };
    return { lines: ['The intervention procedures are available. Containment continues preservation; release ends it. Vendor revocation and verified isolation permit controlled release, at a cost to clinic support.', 'Review the warnings before choosing.'], files: ['release', 'isolation', 'revocation'] };
}
