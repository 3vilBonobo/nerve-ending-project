import type { GameState, Interpretation, TerminalOutput, Transition } from '../../models';
import { FILES } from '../../content/record-registry';
import { caseClock, hasCaseEvent } from '../../state/scenario-state';
import { canRead } from '../story/continuation';
import { scenarioFamily, scenarioInteraction, nonActionDiscussion } from '../scenario/scenario';
import { canonicalMotherIntent, Disclosure, MOTHER, MotherTopic, motherKey, motherLiteral, motherTopic, VoiceStage } from '../../interpretation/conversation/mother-routing';
export interface ConversationMemory {
    tone: 'normal' | 'plain' | 'dry';
    paused: boolean;
    ordinarySinceHumor: number;
    recentEggs: string[];
    selfQuestions: number;
    voiceStage?: VoiceStage;
    lastFactual?: {
        subject: string;
        answerId: string;
        stage: VoiceStage;
        gate: Disclosure;
        output: TerminalOutput;
    };
}
export const initialConversation = (): ConversationMemory => ({ tone: 'normal', paused: false, ordinarySinceHumor: 4, recentEggs: [], selfQuestions: 0 });
export function disclosureAllowed(s: GameState, gate: Disclosure): boolean {
    const c = s.scenario;
    if (!c)
        return false;
    const h = (id: Parameters<typeof hasCaseEvent>[1]) => hasCaseEvent(c, id);
    switch (gate) {
        case 'public': return true;
        case 'after_discrepancy': return h('closure-compared');
        case 'after_clinical_review': return h('human-read') && h('clinical-approved');
        case 'after_welfare_comparison': return h('human-read') && h('clinical-approved') && h('welfare-compared');
        case 'after_external_review': return h('clinical-approved') && h('dependency-reviewed') && h('harbor-acknowledged') && h('elm-acknowledged');
        case 'after_intent_review': return h('clinical-approved') && h('controls-observed') && h('translation-reviewed');
        case 'after_final_review': return h('packet-verified');
        case 'after_severance': return c.outcome === 'severance';
        case 'after_continuation': return c.outcome === 'continuation';
    }
}
export function motherStage(s: GameState): VoiceStage { return disclosureAllowed(s, 'after_welfare_comparison') ? 'core' : disclosureAllowed(s, 'after_discrepancy') ? 'investigation' : 'early'; }
/** Existing intentional review requests retain their semantics. Recognition labels never call this. */
export function explicitCaseRequest(s: GameState, input: string): boolean {
    const t = motherKey(input);
    if (nonActionDiscussion(input))
        return false;
    const request = t.replace(/^(?:please |(?:can|could|would) you (?:please )?)/, '');
    if (/^(?:maintain support|submit separation witness|confirm operation|cancel|defer decision|resume review|resume investigation|i want to wait|can i leave)$/.test(t))
        return true;
    if (/^(?:compare|trace|audit owner|report|request|contact|sign (?:marsh|navarro)|verify patel|review (?:adaptive|fallbacks|risks)|show signatures|run blind controls|test neural intent|view raw comparison|repeat controls|check report|tell (?:the )?(?:doctor|doctors|clinics)|call (?:a |the )?(?:doctor|physician|marsh))\b/.test(request))
        return true;
    if (/^(?:was (?:service )?006 shut down|004 stopped why not 006|did kell falsify the report|show message origin|where do the alerts come from|what is ext 214|did the call reach a person|who owns the unresolved service|why not call a doctor|why do other patients depend on her|use a backup|can you copy it|freeze state|why not just stop updating others|you are hurting her|does she feel pain|let me see the actual data|do it again|who signed this|who authorized this|what do other people lose)$/.test(t))
        return true;
    return t === 'can i help' && disclosureAllowed(s, 'after_welfare_comparison');
}
const discussions: Readonly<Record<string, string>> = { compare: 'closure_vs_running', trace: 'night_desk', report: 'read_only', clinical: 'marsh', dependency: 'other_patients', fallbacks: 'fallbacks', welfare: 'distress_vs_survival', raw: 'translation_challenge', controls: 'anna_intention', review: 'anna_intention', signatures: 'external_medics', risks: 'final_choice', witness: 'external_medics', alternatives: 'final_choice' };
const gravity = (s: GameState, input: string): boolean => !!s.scenario?.pendingChoice || !!s.scenario?.outcome || /\b(?:anna|patient|patients|mara|tomas|nadia|consent|attestation|clinical|dying|died|death|suffer\w*|distress|translation|injur\w*)\b/i.test(input) || /^case-(?:patient|welfare|controls|review|risks|clinical|sign|witness|defer|maintain|submit)/.test(s.lastTopic ?? '') || motherTopic(s.conversation?.lastFactual?.answerId ?? '')?.domain === 'investigation';
const preservedTurn = (s: GameState, input: string): boolean => s.scenario?.motherQuestion !== 'unoffered' && /^(?:yes|yes please|go ahead|ask|what question|what is your question|okay|ok|no|dont ask me questions|do not ask me questions|i refuse|not my decision|i dont know|i do not know|both|neither|none)$/.test(motherKey(input));
function selectText(s: GameState, topic: MotherTopic): {
    text: string;
    stage: VoiceStage;
} {
    const stage = motherStage(s), allowed = disclosureAllowed(s, topic.gate);
    const order: VoiceStage[] = stage === 'core' ? ['core', 'investigation', 'early'] : stage === 'investigation' ? ['investigation', 'early'] : ['early'];
    for (const candidate of order) {
        if (candidate !== 'early' && !allowed)
            continue;
        const gate = topic.responseGates[candidate];
        if (gate && !disclosureAllowed(s, gate))
            continue;
        const text = topic.responses[candidate];
        if (text)
            return { text, stage: candidate };
    }
    return { text: topic.responses.early!, stage: 'early' };
}
// Repeating a remembered reply must recheck current disclosure and file access.
// Conversation memory records context; it never grants permission to reveal a source.
function permissibleMemory(s: GameState, m: ConversationMemory): boolean {
    const factual = m.lastFactual;
    return !!factual && disclosureAllowed(s, factual.gate)
        && (factual.stage !== 'core' || motherStage(s) === 'core')
        && factual.output.links.every(link => {
            const file = FILES.find(file => file.id === link.fileId);
            return !!file && canRead(s, file);
        });
}
export function motherConversation(s: GameState, input: string, predicted?: Interpretation): Transition | undefined {
    if (!s.scenario || explicitCaseRequest(s, input) || preservedTurn(s, input))
        return undefined;
    const questioning = s.scenario.motherQuestion === 'awaiting-answer' && /\bwhy\b.*\b(?:ask\w*|question)\b/i.test(input) && !/\b(?:sign|attest|medical|clinical|physician)\b/i.test(input);
    const literal = questioning ? motherTopic('neconv_clarify') : motherLiteral(input, { ...s, conversationSubject: s.conversation?.lastFactual?.subject });
    let topic = literal ?? (predicted && !predicted.needsClarification ? motherTopic(canonicalMotherIntent(predicted.intent) ?? predicted.intent) : undefined);
    const family = scenarioFamily(input);
    if (family === 'alternatives' && nonActionDiscussion(input))
        return scenarioInteraction(s, input);
    if (!topic && family && discussions[family])
        topic = motherTopic('neconv_' + discussions[family]);
    if (!topic)
        return undefined;
    // The supplied ASCII anchor draws a cat. A nearest-neighbor match for an ordinary
    // request to describe something cannot manufacture a request for that drawing.
    const creativeClarification = topic.id === 'neconv_ascii_art' && !/ascii|text (?:art|drawing|picture)|(?:draw\w*|render\w*|picture|sketch).*(?:cat|text|art|characters)|cat.*draw/i.test(input);
    if (creativeClarification)
        topic = motherTopic('neconv_clarify')!;
    // Facts about a completed clinical case always use its actual record, never a stale personality anchor.
    if (s.scenario.outcome && (topic.domain === 'investigation' || /\b(?:anna|mara|tomas|nadia|patient|patients)\b/i.test(input)))
        return scenarioInteraction(s, 'Is Anna alive?');
    const memory: ConversationMemory = { ...initialConversation(), ...s.conversation, recentEggs: [...(s.conversation?.recentEggs ?? [])] };
    if (memory.voiceStage !== motherStage(s)) {
        memory.voiceStage = motherStage(s);
        memory.ordinarySinceHumor = motherStage(s) === 'early' ? 4 : 3;
    }
    let muted = false;
    if (topic.playful && (gravity(s, input) || memory.tone === 'plain' || !topic.explicitHumor && memory.ordinarySinceHumor < (motherStage(s) === 'early' ? 4 : 3) || memory.recentEggs.includes(motherStage(s) + ':' + topic.id))) {
        if (s.scenario.outcome)
            return scenarioInteraction(s, 'Is Anna alive?');
        topic = motherTopic(gravity(s, input) ? disclosureAllowed(s, 'after_welfare_comparison') ? 'neconv_distress_vs_survival' : 'neconv_medical_staff' : topic.safety ? 'neconv_read_only' : memory.tone === 'plain' ? 'neconv_please_be_nice' : 'neconv_repeat_banter')!;
        muted = true;
    }
    const selected = selectText(s, topic);
    let lines = selected.text.split('\n');
    let refs = FILES.filter(f => topic.sources.includes(f.id) && canRead(s, f)).map(f => ({ fileId: f.id, label: f.path }));
    let code: TerminalOutput['code'] = creativeClarification ? 'notice' : 'ok';
    if (creativeClarification)
        refs = [];
    if (topic.handling === 'out_of_world_ui')
        lines = ['APPLICATION HELP / LOCAL SAVES', ...lines];
    if (topic.handling === 'tone_preference')
        memory.tone = topic.id === 'neconv_please_be_nice' ? 'plain' : 'dry';
    if (topic.handling === 'respect_pause')
        memory.paused = true;
    else
        memory.paused = false;
    if (topic.id === 'neconv_clock')
        lines.push(caseClock(s.scenario));
    if (topic.handling === 'context_source') {
        if (permissibleMemory(s, memory)) {
            refs = memory.lastFactual!.output.links;
            lines.push(...refs.map(r => `${r.fileId}: ${r.label}`));
            if (!refs.length) {
                const service = memory.lastFactual!.subject.match(/^service-(00[1-8])$/)?.[1];
                if (service)
                    lines.push(`Source: INFO ${service} / LOG ${service}. Service results are the retained 06 NOV / 02:14 observation.`);
                else
                    code = 'notice';
            }
        }
        else
            code = 'notice';
    }
    if (topic.handling === 'repeat_previous') {
        const last = s.terminalHistory.at(-1);
        if (last) {
            lines.push(...last.lines);
            refs = last.links.filter(l => { const file = FILES.find(f => f.id === l.fileId); return file && canRead(s, file); });
        }
        else
            code = 'notice';
    }
    if (topic.handling === 'clarify_previous' && !creativeClarification) {
        if (s.scenario.motherQuestion === 'awaiting-answer') {
            const r = scenarioInteraction(s, 'Why?');
            if (r)
                lines.push(...r.output.lines);
        }
        else if (permissibleMemory(s, memory)) {
            lines.push(...memory.lastFactual!.output.lines);
            refs = memory.lastFactual!.output.links;
        }
        else
            code = 'notice';
    }
    if (topic.id === 'neconv_anna_status_early' && disclosureAllowed(s, 'after_clinical_review'))
        return scenarioInteraction(s, 'Who is the patient?');
    if (topic.id === 'neconv_marsh' && disclosureAllowed(s, 'after_clinical_review')) {
        const status = scenarioInteraction(s, 'CHECK REPORT');
        if (status)
            lines.push(...status.output.lines);
    }
    if (s.scenario.outcome && ['neconv_you_are_alive', 'neconv_ghost', 'neconv_love', 'neconv_how_long', 'neconv_favorite_human'].includes(topic.id))
        lines = topic.responses.early!.split('\n');
    if (!muted && topic.playful) {
        const egg = motherStage(s) + ':' + topic.id;
        memory.recentEggs = [...memory.recentEggs.filter(id => id !== egg), egg].slice(-6);
        memory.ordinarySinceHumor = 0;
    }
    else if (!muted && !creativeClarification && topic.domain !== 'investigation')
        memory.ordinarySinceHumor = Math.min(100, memory.ordinarySinceHumor + 1);
    if (['neconv_system_identity', 'neconv_name_preference', 'neconv_r02_capabilities'].includes(topic.id))
        memory.selfQuestions = Math.min(1000, memory.selfQuestions + 1);
    const query: Interpretation = !literal && predicted && !predicted.needsClarification && canonicalMotherIntent(predicted.intent) === topic.intent ? { ...predicted, intent: topic.intent } : { intent: topic.intent, provider: 'fallback', method: 'deterministic', needsClarification: false };
    if (creativeClarification)
        query.needsClarification = true;
    const out: TerminalOutput = { lines, links: refs, code, truth: 'record' };
    const factual = ['world', 'system', 'investigation'].includes(topic.domain) && !['context_source', 'repeat_previous', 'clarify_previous', 'correction_context', 'out_of_world_ui'].includes(topic.handling);
    if (factual)
        memory.lastFactual = { subject: topic.id, answerId: topic.id, stage: selected.stage, gate: selected.stage === 'early' ? 'public' : topic.responseGates[selected.stage] ?? topic.gate, output: out };
    return { state: { ...s, conversation: memory, lastIntent: topic.intent, lastTopic: factual ? `mother:${topic.id}` : s.lastTopic, pendingClarification: undefined }, output: out, resolvedInterpretation: query, dialogue: { variantId: `mother:${topic.id}:${selected.stage}${muted ? ':muted' : ''}`, intent: topic.intent, profile: motherStage(s) === 'core' ? 'MOTHER' : 'RECORDS', modifiers: muted ? ['humor-muted'] : [], conditions: { gate: topic.gate, gateSatisfied: disclosureAllowed(s, topic.gate), questionCount: null, previousIntent: s.lastIntent ?? null, previousFileId: s.lastFileId ?? null } } };
}
/** Capture real factual outputs from older approved routes, without replaying requests. */
export function rememberFactual(before: GameState, r: Transition): Transition {
    if (r.dialogue?.variantId.match(/^investigation:(?:journal|hint|followup|bored|clarification)$/))
        return r;
    if (!r.state.scenario || r.dialogue?.variantId.startsWith('mother:') || r.output.code !== 'ok' || !r.output.lines.length)
        return r;
    const factual = r.output.links.length > 0 || r.state.lastTopic?.startsWith('service-') || r.dialogue?.variantId.startsWith('corporate:') || r.dialogue?.variantId.startsWith('service:') || r.resolvedInterpretation?.intent.startsWith('q_case_');
    if (!factual)
        return r;
    const memory: ConversationMemory = { ...initialConversation(), ...r.state.conversation, recentEggs: [...(r.state.conversation?.recentEggs ?? [])] };
    const protectedCase = r.state.lastTopic?.startsWith('case-');
    const required = protectedCase ? (['after_severance', 'after_continuation', 'after_final_review', 'after_intent_review', 'after_welfare_comparison', 'after_external_review', 'after_clinical_review', 'after_discrepancy'] as const).find(g => disclosureAllowed(r.state, g)) ?? 'public' : 'public';
    const text = r.output.lines.join('\n');
    const sources = r.output.lines.filter(line => /^Sources?:/i.test(line)).join('\n').toLowerCase();
    const cited = FILES.filter(f => canRead(r.state, f) && (text.includes(f.path) || text.includes(f.path.split('/').at(-1)!) || sources.includes(f.title.toLowerCase()) || /^NE-\d+$/.test(f.id) && text.includes(f.id)));
    const links = [...r.output.links];
    for (const f of cited)
        if (!links.some(l => l.fileId === f.id))
            links.push({ fileId: f.id, label: f.path });
    const opened = r.openFileId ? FILES.find(f => f.id === r.openFileId && canRead(r.state, f)) : undefined;
    if (opened && !links.some(l => l.fileId === opened.id))
        links.push({ fileId: opened.id, label: opened.path });
    memory.lastFactual = { subject: opened?.title ?? r.state.lastTopic ?? before.lastTopic ?? 'records', answerId: r.dialogue?.variantId ?? r.resolvedInterpretation?.intent ?? 'record', stage: motherStage(r.state), gate: required, output: { ...r.output, lines: opened ? [opened.path, ...opened.body.split('\n')] : r.output.lines, links } };
    if (!protectedCase)
        memory.ordinarySinceHumor = Math.min(100, memory.ordinarySinceHumor + 1);
    memory.paused = false;
    return { ...r, state: { ...r.state, conversation: memory } };
}
export function restoreConversation(s: GameState, value: unknown): ConversationMemory | undefined {
    if (!value || typeof value !== 'object' || !s.scenario)
        return undefined;
    const v = value as Record<string, unknown>, m = initialConversation();
    if (['normal', 'plain', 'dry'].includes(String(v['tone'])))
        m.tone = v['tone'] as ConversationMemory['tone'];
    m.paused = v['paused'] === true;
    const bounded = (n: unknown, max: number) => typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(0, Math.floor(n))) : 0;
    m.ordinarySinceHumor = bounded(v['ordinarySinceHumor'], 100);
    m.selfQuestions = bounded(v['selfQuestions'], 1000);
    if (['early', 'investigation', 'core'].includes(String(v['voiceStage'])))
        m.voiceStage = v['voiceStage'] as VoiceStage;
    if (Array.isArray(v['recentEggs']))
        m.recentEggs = v['recentEggs'].filter((id): id is string => typeof id === 'string' && /^(early|investigation|core):neconv_[a-z0-9_]+$/.test(id) && !!motherTopic(id.split(':')[1])).slice(-6);
    const f = v['lastFactual'] as Record<string, unknown> | undefined, o = f?.['output'] as Record<string, unknown> | undefined;
    const validGates = ['public', 'after_discrepancy', 'after_clinical_review', 'after_welfare_comparison', 'after_external_review', 'after_intent_review', 'after_final_review', 'after_severance', 'after_continuation'];
    if (f && o && typeof f['subject'] === 'string' && typeof f['answerId'] === 'string' && ['early', 'investigation', 'core'].includes(String(f['stage'])) && validGates.includes(String(f['gate'])) && Array.isArray(o['lines']) && Array.isArray(o['links'])) {
        const lines = o['lines'].filter((line): line is string => typeof line === 'string').slice(0, 120).map(line => line.slice(0, 16000));
        const links = (o['links'] as {
            fileId?: string;
        }[]).flatMap(link => { const file = FILES.find(f => f.id === link?.fileId); return file && canRead(s, file) ? [{ fileId: file.id, label: file.path }] : []; });
        const code = (['ok', 'notice', 'denied', 'error'].includes(String(o['code'])) ? o['code'] : 'ok') as TerminalOutput['code'];
        const truth = (['record', 'interpretation', 'withheld', 'system'].includes(String(o['truth'])) ? o['truth'] : 'record') as TerminalOutput['truth'];
        m.lastFactual = { subject: f['subject'].slice(0, 100), answerId: f['answerId'].slice(0, 120), stage: f['stage'] as VoiceStage, gate: f['gate'] as Disclosure, output: { lines, links, code, truth } };
        if (!permissibleMemory(s, m) || links.length !== o['links'].length)
            m.lastFactual = undefined;
    }
    return m;
}
