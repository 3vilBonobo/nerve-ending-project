import { fileById } from '../content';
import { DIALOGUE } from '../interpretation/dialogue-catalog';
import type { GameState, QueryIntent, Transition } from '../models';
import { CLINICAL_SNAPSHOT } from '../story-state';
import { availableOperations, canRead, knows, nextHint, transportStatus } from './continuation';

export function voiceOf(s: GameState, intent?: QueryIntent): string {
  if (s.pendingOperation || s.operating.releaseProcedureStarted) return 'PRESERVATION-CRITICAL';
  if (!knows(s, 'motherIdentified')) return 'ADMINISTRATIVE';
  if (/lie|trust|manipulation|protecting/.test(intent ?? '')) return 'DEFENSIVE';
  if (/source|compare|authority|safe|verify/.test(intent ?? '')) return 'COOPERATIVE';
  if (knows(s, 'distressEvidenceKnown')) return 'CONFLICTED';
  return 'CLINICAL';
}
export function answerDialogue(s: GameState, intent: QueryIntent): Transition | undefined {
  const entry = DIALOGUE.find(i => i.id === intent);
  if (!entry) return undefined;
  const count = (s.questionCounts[intent] ?? 0) + 1;
  let lines = [(entry.gate && !knows(s, entry.gate)) ? entry.early : entry.revealed];
  let files = entry.files;
  if (intent === 'q_source') {
    files = DIALOGUE.find(i => i.id === s.lastIntent)?.files ?? (s.lastFileId ? [s.lastFileId] : []);
    if (!files.length) files = ['register', 'authorization'];
  }
  if (intent === 'q_file_summary') {
    const f = fileById(s.lastFileId ?? '');
    lines = f && canRead(s, f) ? [`${f.title} / ${f.author ?? 'Meridian retained records'}`, f.body.split('\n').filter(Boolean).slice(0,5).join('\n'), 'The source remains available below.'] : ['Select a record to establish which file you mean.'];
    files = f ? [f.id] : [];
  }
  if (intent === 'q_next') {
    const hint = nextHint(s); lines = hint.lines; files = hint.files;
    if (s.hintLevel >= 1) lines = [...lines, 'Available action: ' + (availableOperations(s).find(o => !s.events.includes(`operation:${o.id}`))?.label ?? 'Review the intervention procedures.')];
  }
  if (intent === 'q_summary') lines = ['VERIFIED SESSION FINDINGS', ...(s.knowledge.length ? s.knowledge.map(k => KNOWLEDGE_LABELS[k] ?? k) : ['Only the opening records have been observed.'])];
  if (intent === 'q_safe_now') lines = ['OBSERVATION: read and search accessible records.', ...availableOperations(s).filter(o => !o.warning).map(o => o.label), 'Interventions are shown separately with warnings and explicit confirmation.'];
  if (intent === 'q_pending') lines = s.pendingOperation ? ['Awaiting: ' + s.pendingOperation, 'Use the confirmation panel to review its complete warning. Asking a question does not confirm it.'] : ['No operation is awaiting confirmation.'];
  if (['q_sent', 'q_queue_contents', 'q_connection_used', 'q_restore_possible'].includes(intent) && knows(s, 'recoveryHandoffKnown')) lines = [...lines, ...transportStatus(s)];
  if (intent === 'q_counting' && knows(s, 'feedbackLoopKnown')) lines.push(`Fixed observation: ${CLINICAL_SNAPSHOT.correctionCycles} correction cycles; ${CLINICAL_SNAPSHOT.recoveryAttempts} recovery attempts.`);
  if (intent === 'q_greeting' && count >= 3) lines = [knows(s, 'annaAliveKnown') ? 'One supported clinical subject remains registered. Repeating a greeting will not establish voluntary communication.' : 'The same records connection remains active. Public office: closed.'];
  if (s.operating.endingId && ['q_anna_alive', 'q_anna_pain', 'q_stable', 'q_site_now', 'q_anna_save', 'q_let_go', 'q_waiting'].includes(intent)) {
    lines = s.operating.annaBiologicallyAlive ? ['Anna remains biologically alive. The known outbound relay is isolated. Preservation cycles continue.'] : ['Anna Voss has died following confirmed release. Local preservation has ended. The historical records remain unchanged.'];
  }
  if (count >= 4 && !['q_counting','q_greeting','q_next'].includes(intent)) lines = ['REVIEW / the source and operating conditions are unchanged.', ...lines];
  const next = { ...s, lastIntent: ['q_source', 'q_pending'].includes(intent) ? s.lastIntent : intent, lastTopic: ['q_source', 'q_pending'].includes(intent) ? s.lastTopic : entry.family, questionCounts: { ...s.questionCounts, [intent]: count }, hintLevel: intent === 'q_next' ? Math.min(3, s.hintLevel + 1) : s.hintLevel };
  return { state: next, output: { lines, links: [...new Set(files)].flatMap(id => { const f = fileById(id); return f && canRead(s, f) ? [{ fileId: id, label: f.title }] : []; }), code: 'ok', truth: 'interpretation' } };
}
export const KNOWLEDGE_LABELS: Record<string, string> = {
  handoverVerified: 'The handover sequence is verified.', clinicalHoldKnown: 'A clinical hold outlived the office closure.', site6Known: 'Site 6 retains clinical support after research closure.', motherIdentified: 'The clinical controller is designated MOTHER.', annaIdentified: 'AV-06 identifies researcher Anna Voss.', incidentKnown: 'The calibration incident occurred on 17 April 1996.', annaAliveKnown: 'Anna retains dependent biological function.', distressEvidenceKnown: 'Clinical evidence indicates severe distress.', feedbackLoopKnown: 'Support reductions provoke automatic restoration.', recoveryHandoffKnown: 'Controller termination may invoke recovery distribution.', externalCompatibilityKnown: 'Some commercial software shares a legacy calibration format.', externalRiskKnown: 'Recovery data could cause harmful external stimulation.', releaseConsequencesKnown: 'Release ends dependent biological life; route preparation changes external consequences.',
};
