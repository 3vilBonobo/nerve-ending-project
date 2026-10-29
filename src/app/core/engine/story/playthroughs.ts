import type { EndingId } from '../../state/story-state';
// Reproducible opening fixture; later operations retain their existing technical contract.
export const OPENING_PATH = ['STATUS', 'READ Closure list', 'Why is 006 still running despite being closed?', 'READ Handover receipt', 'The office approval is not an operational release; the holding system confirmation is missing.', 'OPEN backup', 'READ /COMMS/BRIDGE_02_STATUS.LOG', 'The preservation controller accepted the transfer via BRIDGE-02, but release is still withheld.', 'Request a read-only continuity audit'] as const;
export const INVESTIGATION_PATH = [...OPENING_PATH, 'SEARCH CLINICAL INDEX', 'OPEN /CLINICAL/AV06_STATUS.CLIN', 'AUDIT CONTROLLER', 'CONNECT DIAGNOSTICS', 'CONFIRM OPERATION', 'COMPARE CLINICAL RECORDS', 'REVIEW COMMUNICATION ROUTES', 'REVIEW SAFETY', 'REVIEW RELEASE', 'PREPARE RELEASE'] as const;
export const GOLDEN_PATHS: Readonly<Record<EndingId, readonly string[]>> = {
    MERCY_PROPAGATION: [...INVESTIGATION_PATH, 'RESTORE BRIDGE', 'CONFIRM OPERATION', 'TEST RECOVERY ROUTE', 'CONFIRM OPERATION', 'INSPECT QUEUE', 'RELEASE PATIENT', 'CONFIRM OPERATION'],
    CONTAINMENT_CONTINUATION: [...INVESTIGATION_PATH, 'CONTAIN SITE', 'CONFIRM OPERATION'],
    SEVERANCE_COSTLY_COMPASSION: [...INVESTIGATION_PATH, 'OPEN /CONTROL/VENDOR_REVOCATION.MAN', 'REVOKE VENDOR', 'CONFIRM OPERATION', 'ISOLATE BRIDGE', 'CONFIRM OPERATION', 'VERIFY ISOLATION', 'CONTROLLED RELEASE', 'CONFIRM OPERATION'],
};
