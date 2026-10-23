import type { GameState, Interpretation, TerminalOutput, Transition } from '../models';
import { voiceOf } from './dialogue';

export function outputFingerprint(output: TerminalOutput): string {
  let hash = 14695981039346656037n;
  for (const char of JSON.stringify(output)) hash = BigInt.asUintN(64, (hash ^ BigInt(char.codePointAt(0)!)) * 1099511628211n);
  return hash.toString(16).padStart(16, '0');
}
/** Content-addressed IDs identify retained opening branches without rewriting their authored replies. */
export function legacyResponseTrace(s: GameState, query: Interpretation, transition: Transition): Transition {
  if (transition.dialogue) return transition;
  const intent = query.intent === 'ask_clarification' && !query.needsClarification ? s.lastIntent ?? query.intent : query.intent;
  return { ...transition, dialogue: { variantId: `${query.needsClarification ? 'clarification' : 'legacy'}:${intent}:${outputFingerprint(transition.output)}`, intent, profile: voiceOf(s, intent), modifiers: query.needsClarification ? ['ambiguity'] : [], conditions: { gate: null, gateSatisfied: true, questionCount: null, previousIntent: s.lastIntent ?? null, previousFileId: s.lastFileId ?? null } } };
}
