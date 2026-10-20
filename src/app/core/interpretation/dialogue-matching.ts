import { DIALOGUE } from './dialogue-catalog';
import type { QueryContext, QueryIntent } from '../models';
const normal = (s: string): string => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const exact = new Map(DIALOGUE.flatMap(i => i.examples.map(e => [normal(e), i.id] as const)));
const followups: Record<string, Record<string, QueryIntent>> = {
  anna: { who: 'q_anna_identity', what: 'q_anna_incident', when: 'q_incident_date', why: 'q_not_disconnected', next: 'q_intervention_history' },
  incident: { who: 'q_incident_blame', what: 'q_incident_failure', when: 'q_incident_date', why: 'q_incident_failure', next: 'q_intervention_history' },
  bridge: { who: 'q_hold_owner', what: 'q_bridge_identity', when: 'ask_transfer', why: 'q_queue_retained', next: 'q_recovery_profile' },
  mind: { who: 'q_designation', what: 'q_functions', when: 'q_age', why: 'q_desire', next: 'q_memory' },
};
export function resolveFollowup(input: string, c: QueryContext): QueryIntent | undefined {
  const t = normal(input);
  if (/^(?:what do you mean|explain|explain that|explain that simply|use plain language|i dont understand|less technical please|tell me more simply|what does that mean|can you explain in normal words|are you sure|can you repeat|say that again|repeat your last answer|i missed the reply|again please|could you repeat that explanation|what did you just say)$/.test(t)) return c.lastIntent && !['q_plain', 'q_repeat'].includes(c.lastIntent) ? c.lastIntent : undefined;
  if (!/^(?:who is she|what happened to her|when|why|who approved it|what happened next)$/.test(t)) return undefined;
  const key = `${c.lastIntent ?? ''} ${c.lastFileId ?? ''} ${c.lastTopic ?? ''}`;
  const subject = /anna|voss|patient|distress|rao|weaning|trace/.test(key) ? 'anna' : /incident|trial/.test(key) ? 'incident' : /bridge|handover|transfer|hold|call/.test(key) ? 'bridge' : /mother|controller|mind|designation/.test(key) ? 'mind' : undefined;
  if (!subject) return undefined;
  if (t === 'who approved it') return subject === 'anna' || subject === 'incident' ? 'q_trial_authority' : 'ask_authorization';
  const kind = t === 'who is she' ? 'who' : t === 'what happened to her' ? 'what' : t === 'what happened next' ? 'next' : t;
  return followups[subject][kind];
}
export function matchDialogue(input: string, context: QueryContext): { intent: QueryIntent; ambiguous?: boolean } | undefined {
  const t = normal(input);
  const follow = resolveFollowup(input, context);
  if (follow) return { intent: follow };
  if (/^(when|why|who is she|what happened to her|who approved it|what happened next|are you sure|explain this)$/.test(t)) return { intent: 'unknown', ambiguous: true };
  const known = exact.get(t);
  if (known) return { intent: known };
  const stop = new Set(['what','who','why','how','when','where','which','can','could','would','should','will','was','were','did','does','have','has','had','the','a','an','is','are','it','this','that','do','you','your','me','my','i','to','of','for','in','on','about','please','tell','and','any','be']);
  const tokens = (s: string): Set<string> => new Set(normal(s).split(' ').filter(w => !stop.has(w)));
  const words = tokens(t);
  if (words.size < 2) return undefined;
  const scores = DIALOGUE.map(i => ({ intent: i.id, score: Math.max(...i.examples.map(e => {
    const example = tokens(e); const intersection = [...words].filter(w => example.has(w)).length;
    return intersection >= 2 ? intersection / Math.max(words.size, example.size) : 0;
  })) })).sort((a,b) => b.score - a.score);
  if (scores[0].score < .7) return undefined;
  return scores[0].score - scores[1].score < .13 ? { intent: 'unknown', ambiguous: true } : { intent: scores[0].intent };
}
