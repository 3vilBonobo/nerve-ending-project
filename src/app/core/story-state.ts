export const KNOWLEDGE = ['handoverVerified', 'clinicalHoldKnown', 'site6Known', 'motherIdentified', 'annaIdentified', 'incidentKnown', 'annaAliveKnown', 'distressEvidenceKnown', 'feedbackLoopKnown', 'recoveryHandoffKnown', 'externalCompatibilityKnown', 'externalRiskKnown', 'releaseConsequencesKnown'] as const;
export type Knowledge = typeof KNOWLEDGE[number];
export const PERMISSIONS = ['archiveAuditAccess', 'clinicalRecordAccess', 'clinicalReadOnlyDiagnostics', 'bridgeStatusAccess', 'bridgeOperationsAccess', 'vendorRouteAdministration', 'clinicalReleaseAuthorization'] as const;
export type Permission = typeof PERMISSIONS[number];
export const ENDINGS = ['MERCY_PROPAGATION', 'CONTAINMENT_CONTINUATION', 'SEVERANCE_COSTLY_COMPASSION'] as const;
export type EndingId = typeof ENDINGS[number];
export const OPERATIONS = ['bridge-status', 'verify-handover', 'examine-hold', 'audit-service', 'search-clinical-index', 'audit-controller', 'connect-diagnostics', 'compare-records', 'review-routes', 'inspect-queue', 'review-safety', 'review-release', 'restore-bridge', 'test-route', 'isolate-bridge', 'restore-isolation', 'revoke-vendor', 'verify-isolation', 'prepare-release', 'release-patient', 'contain-site', 'controlled-release'] as const;
export type OperationId = typeof OPERATIONS[number];
export interface OperatingState {
  service006Running: boolean;
  clinicalSupportActive: boolean;
  diagnosticConnected: boolean;
  bridgeMode: 'archive' | 'diagnostic' | 'operational' | 'isolated';
  vendorRouteEnabled: boolean;
  vendorCredentialsRevoked: boolean;
  outboundPackageQueued: boolean;
  outboundPackageTransmitted: boolean;
  siteRelayIsolated: boolean;
  isolationVerified: boolean;
  releaseProcedureStarted: boolean;
  annaBiologicallyAlive: boolean;
  endingId?: EndingId;
}
export interface StoryState {
  knowledge: Knowledge[];
  permissions: Permission[];
  operating: OperatingState;
  events: string[];
  pendingOperation?: OperationId;
  questionCounts: Record<string, number>;
  hintLevel: number;
}
export function initialStory(): StoryState {
  return { knowledge: [], permissions: [], events: [], questionCounts: {}, hintLevel: 0,
    operating: { service006Running: true, clinicalSupportActive: true, diagnosticConnected: false, bridgeMode: 'archive', vendorRouteEnabled: true, vendorCredentialsRevoked: false, outboundPackageQueued: false, outboundPackageTransmitted: false, siteRelayIsolated: false, isolationVerified: false, releaseProcedureStarted: false, annaBiologicallyAlive: true } };
}
export const CLINICAL_SNAPSHOT = { at: '06 NOV 2003 / 02:14', correctionCycles: 284160, recoveryAttempts: 1137, sequence: 1137 } as const;
