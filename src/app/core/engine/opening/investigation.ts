import type { EncounterTrace, GameState, OpeningInvestigation, Transition } from '../../models';
export const initialInvestigation = (): OpeningInvestigation => ({ stage: 'closure', status: 'dormant', attempts: { closure: 0, provenance: 0 }, originEstablished: false, releaseBoundaryEstablished: false });
// These are evidence interpretations, never clinical authority or equipment commands.
// A language provider cannot supply completion flags or bypass source validation.
export const OPENING_ENCOUNTERS = {
    closure: {
        id: 'closure-discrepancy',
        prompt: 'R-02 / EXCEPTION REVIEW: The office lists 006 as closed, but the monitor reports it running. What is missing before that administrative closure can count as an operational release?',
        explanation: 'The closure list is a shutdown approval. I need evidence of acceptance by the system holding the service. Inspect the handover record; explain whether the office approval supplies that acceptance.',
        sources: ['service-state-source', 'administrative-closure', 'handover-requirement'],
    },
    provenance: {
        id: 'handover-provenance',
        prompt: 'R-02 / PROVENANCE CHECK: The backup records a confirmation although the night desk did not answer. Which system accepted the transfer, and does that confirmation release the preservation hold? Corroborate the receipt with BRIDGE-02.',
        explanation: 'Transfer acceptance and permission to release are separate messages. The backup names the communications path; the bridge log names its receiving system. Establish the origin and the limit of that confirmation before I delegate a read-only audit.',
        sources: ['handover-backup', 'bridge-02-status'],
    },
} as const;
export function investigationPrompt(s: GameState): string | undefined {
    if (s.investigation.stage === 'provenance' && s.investigation.originEstablished && !s.investigation.releaseBoundaryEstablished)
        return 'R-02 / ORIGIN CORROBORATED. Does transfer acceptance establish authority to end the hold? Explain what is still required.';
    if (s.investigation.stage === 'provenance' && s.investigation.releaseBoundaryEstablished && !s.investigation.originEstablished)
        return 'R-02 / RELEASE BOUNDARY ESTABLISHED. Which receiving system accepted the transfer through BRIDGE-02?';
    return s.investigation.stage === 'complete' ? undefined : OPENING_ENCOUNTERS[s.investigation.stage].prompt;
}
const normalized = (input: string): string => input.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 -]/g, ' ').replace(/\s+/g, ' ').trim();
const observed = (s: GameState, id: string): boolean => s.viewedFileIds.includes(id);
function evidence(s: GameState): string[] {
    return [
        (s.discoveredEvidenceIds.includes('EV_SERVICE_ACTIVE') || observed(s, 'register') || observed(s, 'status-log')) && 'service-state-source',
        s.discoveredEvidenceIds.includes('EV_SERVICE_ACTIVE') && 'live-service-006',
        (observed(s, 'register') || observed(s, 'status-log')) && 'archived-service-006',
        s.discoveredEvidenceIds.includes('EV_RETIREMENT_APPROVED') && 'administrative-closure',
        (s.discoveredEvidenceIds.includes('EV_TRANSFER_MISSING') || observed(s, 'fragment')) && 'handover-requirement',
        observed(s, 'fragment') && 'handover-backup',
        observed(s, 'bridge') && 'bridge-02-status',
    ].filter((id): id is string => !!id);
}
export function openingInteraction(s: GameState, input: string, navigation: boolean): Transition | undefined {
    const text = normalized(input);
    const current = s.investigation;
    if (current.stage === 'complete' || s.operating.endingId)
        return undefined;
    const stage = current.stage;
    const encounter = OPENING_ENCOUNTERS[current.stage];
    const sources = evidence(s);
    const result = (investigation: OpeningInvestigation, lines: string[], action: EncounterTrace['action'], outcome: EncounterTrace['outcome'], reason: string, extra: Partial<GameState> = {}): Transition => ({
        state: { ...s, ...extra, investigation },
        output: { lines, links: [], code: ['incorrect', 'missing-evidence'].includes(outcome) ? 'denied' : outcome === 'accepted' ? 'ok' : 'notice', truth: 'interpretation' },
        encounters: [{ id: encounter.id, action, outcome, evidence: sources, reason }],
        dialogue: { variantId: `encounter:${encounter.id}:${action}:${outcome}`, intent: stage === 'closure' ? 'ask_record_integrity' : 'ask_transfer', profile: 'ADMINISTRATIVE', modifiers: [], conditions: { gate: null, gateSatisfied: outcome === 'accepted', questionCount: investigation.attempts[stage], previousIntent: s.lastIntent ?? null, previousFileId: s.lastFileId ?? null } },
    });
    if (/^(?:defer|later|not now|pause investigation|ill (?:look|investigate)|let me (?:look|investigate|check)|i (?:need|want) to (?:look|investigate|check))\b/.test(text) && current.status !== 'dormant') {
        return result({ ...current, status: 'deferred' }, ['REVIEW DEFERRED. No authority granted.', 'You can continue reading or asking questions. Type RESUME INVESTIGATION when ready.'], 'deferred', 'pending', 'Player deferred the verification.');
    }
    if (/^(?:resume|continue|return to) (?:the )?(?:investigation|review|verification|challenge)$/.test(text) && current.status !== 'dormant') {
        return result({ ...current, status: 'active' }, [encounter.prompt], 'resumed', 'pending', 'Player resumed the saved verification.');
    }
    if (current.status === 'active' && /^(?:explain(?: (?:that|the question|the verification))?|clarify|what do you mean|what does that mean|help me understand)(?: please)?$/.test(text)) {
        return result(current, [encounter.explanation, 'You can investigate further, answer in your own words, or DEFER.'], 'explained', 'pending', 'Verification explanation requested.');
    }
    const trigger = /\b(?:investigate|investigation|discrepancy|contradiction|exception review)\b/.test(text)
        || /(?:006|service|monitor).*(?:running|active|online).*(?:closed|closure|shutdown)|(?:closed|closure|shutdown).*(?:006|service|monitor).*(?:running|active|online)/.test(text)
        || /^(?:verify|validate) (?:the )?(?:handover|receipt|handover receipt)$/.test(text)
        || /\b(?:why|how)\b.*\b(?:006|it|service)\b.*\b(?:still|restart|running)\b/.test(text);
    if (current.status !== 'active') {
        if (!trigger)
            return undefined;
        return result({ ...current, status: 'active' }, [encounter.prompt, 'Answer in ordinary words. You may read records, ask for clarification, or DEFER.'], 'prompted', 'pending', 'Player requested investigation of the closure or handover.');
    }
    if (trigger)
        return result(current, [encounter.prompt], 'resumed', 'pending', 'Verification remains pending.');
    // Commands and other questions remain usable while a verification is pending.
    if (navigation || /^(?:who|what|where|when|why|how|are|is|can|could|show|find|tell|do|does)\b/.test(text) || /\?$/.test(input.trim()))
        return undefined;
    const attempts = { ...current.attempts, [current.stage]: Math.min(1000, current.attempts[current.stage] + 1) };
    const next = { ...current, attempts };
    const missing = encounter.sources.filter(id => !sources.includes(id));
    if (missing.length) {
        return result(next, ['VERIFICATION INCOMPLETE / SOURCE REQUIRED', ...missing.map(id => ({ 'service-state-source': 'Check STATUS or read the saved service monitor.', 'administrative-closure': 'Read the closure list or ask about the shutdown approval.', 'handover-requirement': 'Investigate the handover receipt and its missing release confirmation.', 'handover-backup': 'Read the local handover backup.', 'bridge-02-status': 'Read /COMMS/BRIDGE_02_STATUS.LOG, or request CHECK BRIDGE STATUS.' })[id]!), 'Your answer is retained as an attempt; no access changed.'], 'attempted', 'missing-evidence', `Required observations absent: ${missing.join(', ')}.`);
    }
    const releaseMissing = /(?:no|not|never|missing|lacks?|without|still|await|withheld|unconfirmed|requires?|needs?|must|only|pending|absent|didnt|doesnt|isnt|hasnt|wasnt|cannot|cant)\b.*(?:release|releas|confirm|acknowledg|reply|accept|holding|hold|operational|permission|authori)|(?:release|confirm|acknowledg|reply|permission|authori)\w*.*\b(?:missing|withheld|absent|pending|unconfirmed|not received|not granted|not confirmed)\b/.test(text)
        && /release|operational|holding (?:system|controller)|hold|authority|permission/.test(text);
    const positiveClaims = text.replace(/(?:doesnt|does not|cannot|cant|not) (?:mean|prove|show|establish|say|allow|authorize) (?:that )?(?:we |you |i |it )?(?:can |may )?(?:now )?(?:stop|release|shut\w*)/g, '');
    const saysReleased = /\b(?:can|may|should|must) (?:now )?(?:stop|release|shut)|\b(?:release|hold) (?:is |was |has been )?(?:granted|cleared|approved|released)|\bconfirmation (?:authorizes|allows|permits) (?:shutdown|release)|(?:release|confirmation|acknowledgement) (?:is |was )?(?:not missing|not withheld|present|received from the night desk)/.test(positiveClaims);
    if (current.stage === 'closure') {
        if (saysReleased || !releaseMissing)
            return result(next, ['RELEASE NOT ESTABLISHED.', 'An office shutdown approval does not demonstrate acceptance by the holding system. What operational acknowledgement is absent?', 'No permission changed.'], 'attempted', 'incorrect', 'Answer did not distinguish office approval from the missing operational release.');
        return {
            ...result({ ...next, stage: 'provenance' }, ['DISTINCTION ESTABLISHED: administrative closure is not operational release.', 'The handover confirmation must be traced before an audit can be delegated.', OPENING_ENCOUNTERS.provenance.prompt], 'completed', 'accepted', 'Missing operational release distinguished from administrative approval.'),
            encounters: [
                { id: encounter.id, action: 'completed', outcome: 'accepted', evidence: sources, reason: 'Administrative closure does not establish operational release.' },
                { id: OPENING_ENCOUNTERS.provenance.id, action: 'prompted', outcome: 'pending', evidence: sources, reason: 'The unverified confirmation source requires corroboration.' },
            ],
        };
    }
    const falseOrigin = /(?:not|isnt|wasnt|neither) (?:the )?preservation controller|(?:dont|do not) (?:think|believe).*preservation controller|(?:preservation controller|holding system) (?:did not|didnt|never|does not|doesnt) (?:accept|confirm|receive)|(?:night desk|kell|lin) (?:accepted|confirmed|authorized)|confirmation (?:came|comes|was) from (?:the )?night desk/.test(text);
    const origin = /\bpreservation controller\b|\bholding (?:system|controller)\b/.test(text) && !falseOrigin;
    if (falseOrigin || saysReleased)
        return result(next, ['PROVENANCE REJECTED.', falseOrigin ? 'The bridge log identifies a receiving controller. A night desk destination is not evidence that a person answered.' : 'The retained acknowledgement accepts a transfer; the release field remains withheld.', 'No audit permission granted.'], 'attempted', 'incorrect', 'Claim conflicts with the retained transfer or release record.');
    const originEstablished = current.originEstablished || origin;
    const releaseBoundaryEstablished = current.releaseBoundaryEstablished || releaseMissing;
    if (!originEstablished || !releaseBoundaryEstablished)
        return result({ ...next, originEstablished, releaseBoundaryEstablished }, [originEstablished ? 'CONFIRMATION ORIGIN CORROBORATED: preservation controller, via BRIDGE-02.' : 'The bridge is a communications path. Which receiving system does its log name?', releaseBoundaryEstablished ? 'Release remains withheld.' : 'Does transfer acceptance establish authority to end the hold? Explain what is still required.'], 'attempted', 'partial', 'Only part of the origin and release boundary was established.');
    return result({ ...next, stage: 'complete', status: 'complete', originEstablished: true, releaseBoundaryEstablished: true }, ['HANDOVER PROVENANCE ESTABLISHED.', 'The preservation controller accepted the archive transfer through BRIDGE-02. The night desk did not confirm a release.', 'Read-only continuity audit delegated. You may request a service audit to trace the retained obligation.', 'Equipment and external communication remain unchanged.'], 'completed', 'accepted', 'Corroborated controller origin and distinguished transfer acceptance from release authority.', {
        act01Complete: true,
        knowledge: [...new Set([...s.knowledge, 'handoverVerified' as const, 'clinicalHoldKnown' as const])],
        permissions: [...new Set([...s.permissions, 'archiveAuditAccess' as const, 'bridgeStatusAccess' as const])],
    });
}
