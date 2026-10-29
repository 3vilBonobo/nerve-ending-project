import { FILES, fileById } from '../../content/record-registry';
import type { GameState, Transition } from '../../models';
import { comparisonReady, observations, observedFact, routingReady, observationLines } from '../../investigation/observations';
import { hintObjective, investigationHint, journalLines, journalLinks } from '../../investigation/investigation-journal';
import { canRead } from '../story/continuation';
import { nonActionDiscussion, scenarioInteraction } from '../scenario/scenario';
import { serviceDetails } from '../services/services';
import { disclosureAllowed } from './mother-conversation';
import { parseCommand } from '../commands';
const normal = (s: string) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
/** Source-backed read-only conversation. Only raw, deliberate requests can enter existing case handlers. */
export function responsiveInvestigation(state: GameState, input: string): Transition | undefined {
    const s = state.scenario;
    if (!s)
        return undefined;
    const t = normal(input);
    const emit = (topic: string, lines: string[], ids: string[] = [], code: Transition['output']['code'] = 'ok'): Transition => ({ state: { ...state, lastTopic: `investigation:${topic}`, pendingClarification: undefined },
        output: { lines, links: FILES.filter(f => ids.includes(f.id) && canRead(state, f)).map(f => ({ fileId: f.id, label: f.path })), code, truth: 'record' },
        resolvedInterpretation: { intent: `q_fresh_investigation_${topic}`, provider: 'fallback', method: 'deterministic', needsClarification: code === 'notice' },
        dialogue: { variantId: `investigation:${topic}`, intent: `q_fresh_investigation_${topic}`, profile: 'RECORDS', modifiers: [], conditions: { gate: 'public', gateSatisfied: true, questionCount: null, previousIntent: state.lastIntent ?? null, previousFileId: state.lastFileId ?? null } } });
    const record = (id: string, filter?: (line: string) => boolean) => { const f = fileById(id); return f && canRead(state, f) ? [f.path, `SOURCE DATE: ${f.modified}`, ...f.body.split('\n').filter(filter ?? (() => true))] : []; };
    const serviceReply = (id: string): Transition => ({ ...serviceDetails(state, id), resolvedInterpretation: { intent: 'ask_service_status', entityId: `service-${id}`, provider: 'fallback', method: 'deterministic', needsClarification: false } });
    if (/^(?:journal|evidence|show (?:my |the )?(?:journal|evidence board)|investigation journal)$/.test(t))
        return { ...emit('journal', journalLines(state)), output: { ...emit('journal', []).output, lines: journalLines(state), links: journalLinks(state) } };
    if (parseCommand(input))
        return undefined;
    if (/\b(?:hint|guidance|stuck)\b|what (?:should|can|might) i (?:ask|investigate|examine)|question about.*(?:records|opened)|which source.*(?:closely|next)|^(?:more help|be more direct|stronger help|what next)$/.test(t)) {
        const objective = hintObjective(state), previous = s.hints?.objective === objective ? s.hints.level : 0, level = /^(?:be more direct|stronger help)$/.test(t) ? 3 : Math.min(3, Math.max(/^more help$/.test(t) ? 2 : 1, previous + 1));
        const r = emit('hint', investigationHint(state, level));
        r.state = { ...r.state, lastTopic: state.lastTopic, scenario: { ...s, hints: { objective, level } } };
        return r;
    }
    if (/\b(?:employees?|staff|personnel|workforce)\b/.test(t) && /\b(?:file|files|list|listing|directory|roster|names|find|where|browse)\b/.test(t))
        return emit('directory', ['The selected historical work directory is /PERSONNEL/WORK_DIRECTORY.TXT.', 'Open it from FILES → PERSONNEL, or type OPEN work-directory.'], ['work-directory']);
    if (/\b(?:files|documents|archive browser|document)\b/.test(t) && /\b(?:where|browse|root|read|located)\b/.test(t) && !/\b(?:clinical|patient|private|ne 1\d\d)\b/.test(t))
        return emit('files', ['FILES opens the file browser. Its root button returns to /.', 'DIR / lists available folders. OPEN /ADMIN/COMPANY_PROFILE.TXT opens the Office notice.'], ['company']);
    const saved = state.conversation?.lastFactual;
    const service = t.match(/\b00[1-8]\b/)?.[0] ?? saved?.subject.match(/service-(00[1-8])/i)?.[1];
    if (/\b(?:still function|actually do|still work)\b|\b(?:you|r 02).*still operating/.test(t) && !/\b(?:meridian|company|business)\b/.test(t)) {
        if (service || /continuity monitor/.test(t))
            return serviceReply(service ?? '006');
        const r = emit('clarification', ['Which subject do you mean?', '1. Meridian as a company', '2. This R-02 records interface'], [], 'notice');
        r.state.pendingClarification = { input, interpretation: { intent: 'unknown', provider: 'fallback', needsClarification: true, choices: [{ intent: 'q_fresh_history', label: 'Meridian as a company' }, { intent: 'q_fresh_capabilities', label: 'This R-02 records interface' }] } };
        return r;
    }
    if (/^(?:what about )?(?:service )?006$/.test(t) || /\b(?:what|purpose|work|job|describe|explain)\b/.test(t) && (/\b006\b/.test(t) || /continuity monitor/.test(t)) && !/closed|closure|running|operating.*after|stop|still|2001|mismatch|inconsistent/.test(t))
        return serviceReply('006');
    const comparative = /\b(?:compare|comparison|match|discrepancy|inconsistent|mismatch|differ|side by side)\b|dont match|didnt (?:they|that office).*close|why.*(?:006|monitor|continuity|that).*(?:still|running after)|how can.*closed.*(?:operating|running)|what changed after 2001/.test(t);
    const publicComparison = comparative && !/patient|clinical|survival|distress|fallback|reference|kernel|controls|neural|anna|raw|003|destination|desk|notification|214|\bjok\w*\b|\b(?:report|submit|refer|send|evidence|supports|prove|fraud|lie|stale|outdated|hypothetical)\b/.test(t);
    if (publicComparison && !comparisonReady(s) && !/^(?:(?:please|can you|could you) )?compare\b/.test(t))
        return emit('observation_needed', ['A question alone does not establish a source observation. You can inspect the administrative records and the service registry before comparing them.'], ['authorization', 'register']);
    if (publicComparison && comparisonReady(s) && !nonActionDiscussion(input))
        return scenarioInteraction(state, 'COMPARE SERVICES');
    if (publicComparison && comparisonReady(s) && /^(?:these|those|the (?:records|sources)) (?:do not|dont) match$/.test(t))
        return scenarioInteraction(state, 'COMPARE SERVICES');
    if (/\b(?:report|submit|refer|send)\b/.test(t) && /\b(?:discrepancy|mismatch|comparison|integrity|problem)\b/.test(t) && !nonActionDiscussion(input) && /^(?:(?:please|can you|could you|would you|i want to) )?(?:please )?(?:report|submit|refer|send)\b/.test(t))
        return scenarioInteraction(state, 'REPORT DISCREPANCY');
    if (/\b(?:compare|trace|inspect together)\b/.test(t) && /\b(?:destination|desk|notification|214)\b/.test(t) && routingReady(s) && !nonActionDiscussion(input))
        return scenarioInteraction(state, 'TRACE NOTIFICATIONS');
    if (/\b(?:stale|outdated|fraud|lie|evidence supports|supports your|supports that|rules out|strongest conclusion)\b/.test(t) && comparisonReady(s) && !/\b(?:address|warning|error)\b/.test(t))
        return emit('skeptic', [
            'The closure record concerns the annex. The service report describes a later operating state. I can display both sources together; neither record alone establishes why they differ.',
            'A dated claim and a retained observation can disagree. That alone does not prove fraud.',
            ...observations(s).filter(o => o.facts.some(f => f === 'closure-006' || f === 'running-006')).map(o => `${o.reference} / ${o.timestamp}`),
        ], ['authorization', 'register']);
    if (/\b(?:close|closed|closure|shut|shutdown|happened)\b/.test(t) && /\b(?:meridian|annex|company|firm|business|september|sep|2001|eighteenth)\b/.test(t) && !/\b(?:became|dispatch|relocat\w*|moved|responsibilit\w*)\b/.test(t) && !/^(?:open|read|search|report|request|compare|trace)\b/.test(t))
        return emit('closure', [
            'The closure concerns the Providence Operations Annex, not the whole Meridian company. The smaller company still operates in 2003.',
            ...record('company'),
            ...(observedFact(s, 'running-006') ? ['The later service observation is a separate source; neither record alone establishes why they differ.'] : []),
        ], ['company', 'corporate-profile', 'authorization']);
    if (/\b214\b|night desk.*(?:calls|go)|whose desk/.test(t) && !/^(?:open|read|trace|compare|report|request)\b/.test(t))
        return emit('destination', [
            'EXT 214 belonged to the Providence Operations Annex night desk. That office closed in 2001.',
            ...record('maintenance'), ...record('call', line => /TO |FROM |LATEST|QUEUED|Confirmed|By:/.test(line)),
            'A routing destination or saved confirmation does not prove that a phone rang or a person answered.',
        ], ['maintenance', 'call']);
    const code = /\b0417\b|authori[sz]ation (?:code|identify)|partial authori[sz]ation|backup number/.test(t);
    const bridge = /\b(?:comms|bridge 02|bridge label|confirmation source label)\b/.test(t);
    if (code || bridge) {
        if (!state.archive006Recovered || !observedFact(s, 'backup-identifiers'))
            return emit('identifier', ['The available observation ledger does not establish that identifier. A listed local attachment backup can be inspected.'], ['ledger']);
        return emit(code ? 'code' : 'bridge', [
            ...record('fragment', line => code ? /AUTHORISATION|STAFF NAME|BACKUP COPY|Only part/.test(line) : /CONFIRMATION SOURCE|Confirmation received|STAFF NAME|BACKUP COPY/.test(line)),
            code ? 'The available record does not establish the holder of this partial authorization code. A code is not an employee identity or an access credential for this connection.' : 'The label is recorded as the confirmation source. Its fuller meaning and any associated person are not established by this record.',
        ], ['fragment']);
    }
    if (/^(?:what do (?:you|yoy) mean|why|explain that|could you unpack.*(?:answer|explanation)|explain what you meant before the joke|thats not what i asked|what evidence supports that|who is he)$/.test(t)) {
        if (saved && disclosureAllowed(state, saved.gate) && saved.output.links.every(l => { const f = fileById(l.fileId); return !!f && canRead(state, f); })) {
            const r = emit('followup', ['PRECEDING FACTUAL SUBJECT / ' + saved.subject, ...saved.output.lines], saved.output.links.map(l => l.fileId));
            r.state = { ...r.state, lastTopic: state.lastTopic };
            return r;
        }
        if (t === 'why')
            return undefined;
        return emit('clarification', ['Which subject do you mean: the selected record or the preceding answer?'], [], 'notice');
    }
    if (/^(?:ok|okay) tell me this then$/.test(t))
        return emit('clarification', [`What would you like to establish about ${saved?.subject ?? 'the selected record'}?`], [], 'notice');
    if (/\b(?:answer any|answer anything|can you answer|can actually establish|records cannot settle)\b/.test(t))
        return emit('limits', [
            'I can retrieve and compare records. I cannot establish facts absent from them.',
            `We can examine ${observedFact(s, 'backup-identifiers') ? '/ARCHIVE/HANDOVER_006.BAK' : comparisonReady(s) ? '/ADMIN/CLOSURE_LIST.TXT' : '/PERSONNEL/WORK_DIRECTORY.TXT'} if you wish.`,
        ], [observedFact(s, 'backup-identifiers') ? 'fragment' : comparisonReady(s) ? 'authorization' : 'work-directory']);
    if (/\bbored\b/.test(t))
        return emit('bored', ['I am not a recreation service.', ...investigationHint(state, 1)]);
    return undefined;
}
