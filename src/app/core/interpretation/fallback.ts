import { FILES, FILE_ALIASES } from '../content';
import { Interpretation, IntentInterpreter, QueryContext, QueryIntent } from '../models';
import { matchDialogue } from './dialogue-matching';
import { SEMANTIC_CATALOG } from './semantic-catalog';
import { openingQuestion } from './opening-questions';

const openingExamples = new Map(SEMANTIC_CATALOG.filter(i => !i.intent.startsWith('q_')).flatMap(i => i.examples.map(e => [normalize(e), i.intent] as const)));
export const isOpeningExample = (input: string): boolean => openingExamples.has(normalize(input));

export function normalize(input: string): string {
  return input.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9/. _-]/g, ' ').replace(/\s+/g, ' ').trim();
}
export function classify(input: string, context: QueryContext = {}): Interpretation {
  const regression = openingQuestion(input);
  if (regression) return regression;
  const text = normalize(input);
  const result = (intent: QueryIntent, extra: Partial<Interpretation> = {}): Interpretation => ({ intent, needsClarification: false, provider: 'fallback', method: 'deterministic', ...extra });
  const code = text.match(/\b(004|005|006|007|4|5|6|7|four|five|six|seven)\b/)?.[1];
  const numbers: Record<string, string> = { '4': '004', '5': '005', '6': '006', '7': '007', four: '004', five: '005', six: '006', seven: '007' };
  const entity = code ? `service-${numbers[code] ?? code}` : context.lastTopic;
  const story = (intent: QueryIntent): Interpretation => result(intent, { entityId: entity ?? 'service-006' });
  const fileRequest = /^(?:(?:can|could|would) (?:you|i) (?:please )?|please )?(?:open|read|show(?: me)?|view|display|bring up|look at|see)\s/.test(text);
  if (fileRequest && !/^(?:please )?(?:read|open|show(?: me)?) (?:the |local )*backup(?: copy)?$/.test(text)) {
    const requested = FILES.find(f => [f.path.toLowerCase(), f.path.split('/').pop()!.toLowerCase(), normalize(f.title)].some(name => text.includes(name)));
    const alias = Object.keys(FILE_ALIASES).sort((a,b) => b.length - a.length).find(name => text.includes(name));
    if (requested || alias) return result('request_file', { fileId: requested?.id ?? FILE_ALIASES[alias!], entityId: entity });
  }
  // Keep the opening's concise clarification route; later dialogue can repeat its resolved subject.
  if (/^(what do you mean|explain|explain that|clarify|can you explain|what does that mean|tell me more)$/.test(text) && context.lastIntent && !context.lastIntent.startsWith('q_')) return result('ask_clarification', { entityId: entity });
  const catalogueIntent = openingExamples.get(text);
  if (catalogueIntent && !catalogueIntent.startsWith('request_') && catalogueIntent !== 'ask_clarification') {
    const needsSubject = ['ask_authorization', 'ask_retirement', 'ask_service_status'].includes(catalogueIntent) && !entity && /\b(it|that|this|they)\b/.test(text) && !/service|program|monitor|order/.test(text);
    return result(catalogueIntent, { entityId: entity, needsClarification: needsSubject });
  }
  const dialogue = matchDialogue(input, context);
  if (dialogue) return result(dialogue.intent, { needsClarification: !!dialogue.ambiguous, ...(dialogue.ambiguous ? { clarification: 'Which record, person or operation do you mean? Name the subject so I can distinguish it.' } : {}) });
  if (/^(?:hi|hello|hey|thanks|thank you)$/.test(text)) return result('ask_identity');
  if (/what is this place|whats this place|where am i|what am i looking at|whose records/.test(text)) return result('ask_company');
  if (/can (?:i trust you|you (?:hear|understand) me)|are you still there/.test(text)) return result(/trust/.test(text) ? 'ask_record_integrity' : 'ask_identity');
  if (/hiding something|telling me everything|why wont you tell|record.*(?:reliable|trust|contradict|altered)|edit history/.test(text)) return result('ask_record_integrity');
  if (/where is everybody|what happened to the people|anyone still alive|someone get hurt|everyone leave|anybody come back/.test(text)) return result('ask_office');
  if (/who am i$|why am i here|can i leave|can you get me out|how did i get access|permissions|administrator|(?:can|may|could) i.*(?:edit|change|remove|write)|give me a password/.test(text)) return result('ask_access');
  if (/time ?zone|timestamp|what date is it|date of this session|system clock|different years/.test(text)) return result('ask_dates');
  if (/\be lin\b|\bj kell\b|who.*(?:wrote|sent).*(?:note|message)|who.*removed.*phone/.test(text)) return result('ask_staff');
  if (/^(what do you mean|explain|explain that|clarify|can you explain|what does that mean|tell me more|why)$/.test(text)) {
    return context.lastIntent ? result('ask_clarification', { entityId: entity }) : result('unknown', { needsClarification: true });
  }
  if (/^(?:please )?(?:read|open|show(?: me)?|load|restore|recover|use|retrieve) (?:the |a |that |its )?(?:local )?backup(?: copy| receipt| file)?$/.test(text)
    || /^(?:please )?(?:can|could|would) (?:you|i).*(?:open|read|see|show|load|restore).*backup/.test(text)) return story('request_backup');
  if (/^(?:please )?(?:stop|switch (?:it )?off|turn (?:it )?off|disconnect|shut (?:it )?down)\b/.test(text)) return story('request_stop');
  if (/(?:can|could|would) (?:you|i) (?:please )?(?:stop|switch (?:it )?off|turn (?:it )?off|disconnect|shut (?:it )?down)\b/.test(text)) return story('request_stop');
  if (/who.*(?:talking|are you)|your name|what are you|is this (?:a person|an? automatic|automated)/.test(text)) return result('ask_identity');
  const requesting = /\b(show|read|open|view|see|display|bring up|look at|find|locate|search)\b/.test(text);
  if (requesting) {
    const file = FILES.find(item => [item.path.toLowerCase(), item.path.split('/').pop()!.toLowerCase(), normalize(item.title)].some(name => text.includes(name)));
    const alias = Object.keys(FILE_ALIASES).sort((a, b) => b.length - a.length).find(name => text.includes(name));
    const fileId = file?.id ?? (alias ? FILE_ALIASES[alias] : undefined);
    if (fileId) return result('request_file', { fileId, entityId: entity });
    if (/register|program list/.test(text)) return result('request_file', { fileId: 'register', entityId: entity });
    if (/retirement record|authorization|approval record/.test(text)) return result('request_file', { fileId: 'authorization', entityId: entity });
    if (/fragment|recovered receipt/.test(text)) return result('request_file', { fileId: 'fragment', entityId: entity });
    if (code) return entity === 'service-006' ? result('request_file', { fileId: 'register', entityId: entity }) : story('ask_service_status');
  }
  if (/who.*(?:approv|authoriz|sign|gave permission)|signatory|\b0417\b/.test(text)) return entity || /0417|service/.test(text) ? story('ask_authorization') : result('ask_authorization', { needsClarification: true });
  if (/who.*(?:answer|pick|supposed|recipient)|(?:who is|what is).*night|who.*(?:works|staffs|sits).*night|where.*(?:night desk|extension|phone)|where.*(?:calls? going|calls? go)|who.*(?:get|receiv).*call/.test(text)) return story('ask_recipient');
  if (/call|ring|alarm|dial|switchboard|phone.*(?:on|work)/.test(text)) return story('ask_calls');
  if (/what(?:s| is) (?:going on|happening)/.test(text)) return story('ask_calls');
  if (/office|reception|any(?:one|body).*(?:there|here|inside)|someone.*(?:there|here)|staff|what happened here|what happened to meridian/.test(text)) return result('ask_office');
  if (/meridian|company|biomedical/.test(text) && !/service|retire|archive/.test(text)) return result('ask_company');
  if (/recover|restore|repair|rebuild|reconcil|backup|what do i need|how.*(?:find|get|read).*(?:missing|lost)/.test(text)) return story('ask_recovery_process');
  if (/where.*(?:archive|record|file)|wheres.*(?:archive|record|file)|its archive/.test(text)) return story('ask_archive_location');
  if (/transfer|receipt|handover|manifest|missing|moved|sent.*(?:file|record)/.test(text)) return story('ask_transfer');
  if (/closed|close/.test(text) && context.lastIntent === 'ask_office') return result('ask_office');
  if (/retir|decommission|shut ?down|turn(?:ed)? off|switch(?:ed)? off|\bstop(?:ped)?\b|discontinu|wasnt it|thought it was|closed/.test(text)) {
    return entity || /service|006|program/.test(text) ? story('ask_retirement') : result('ask_retirement', { needsClarification: true });
  }
  if (/active|running|online|restart|status|still.*(?:on|live)|keeps.*service|service.*doing/.test(text) || code && /what|which|tell/.test(text)) return story('ask_service_status');
  if (requesting) {
    const term = text.match(/(?:search for|search|find|locate)\s+(?:the\s+)?(.+)/)?.[1];
    if (term) return result('request_search', { searchTerm: term, entityId: entity });
  }
  return result('unknown');
}
export class FallbackInterpreter implements IntentInterpreter {
  readonly id = 'fallback';
  async isAvailable(): Promise<boolean> { return true; }
  async interpret(input: string, context: QueryContext): Promise<Interpretation> { return classify(input, context); }
}
