import { FILES } from '../content';
import { Interpretation, IntentInterpreter, QueryContext, QueryIntent } from '../models';

export function normalize(input: string): string {
  return input.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9/. _-]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function classify(input: string, context: QueryContext = {}): Interpretation {
  const text = normalize(input);
  const result = (intent: QueryIntent, extra: Partial<Interpretation> = {}): Interpretation => ({
    intent, needsClarification: false, provider: 'fallback', ...extra,
  });
  const entity = /\b(006|6|six)\b/.test(text) ? 'service-006' : context.lastTopic;
  const otherService = text.match(/\b(?:service\s*)?(004|005|007|four|five|seven)\b/);
  if (otherService && !/company|meridian/.test(text)) {
    return result('unknown', { needsClarification: true });
  }
  if (/\b(who am i talking|who are you|your name|what are you|is this a person)\b/.test(text)) return result('ask_identity');
  if (/\b(meridian|company|biomedical)\b/.test(text) && !/service|retire|archive/.test(text)) return result('ask_company');
  if (/^(what do you mean|explain|explain that|clarify|can you explain|what does that mean|tell me more|why)[ .?]*$/.test(text)) {
    return context.lastIntent ? result('ask_clarification', { entityId: entity }) : result('unknown', { needsClarification: true });
  }
  const requesting = /\b(show|read|view|see|display|bring up|look at|find|locate)\b/.test(text);
  if (requesting) {
    let fileId = FILES.find(file => text.includes(file.path.toLowerCase()) || text.includes(file.path.split('/').pop()!.toLowerCase()))?.id;
    if (!fileId) {
      if (/register|service list/.test(text)) fileId = 'register';
      else if (/retirement record|authorization|approval record/.test(text)) fileId = 'authorization';
      else if (/ledger|transfer record/.test(text)) fileId = 'ledger';
      else if (/repair note|maintenance note/.test(text)) fileId = 'repair';
      else if (/status log|restart|journal/.test(text)) fileId = 'status-log';
      else if (/fragment|recovered record/.test(text)) fileId = 'fragment';
    }
    if (fileId) return result('request_file', { fileId, entityId: entity });
    const term = text.match(/(?:search for|find|locate)\s+(.+)/)?.[1];
    if (term) return result('request_search', { searchTerm: term, entityId: entity });
  }
  let intent: QueryIntent = 'unknown';
  if (/who.*(approv|authoriz|sign)|signatory|who approved/.test(text)) intent = 'ask_authorization';
  else if (/recover|restore|repair|rebuild|rebuilt|reconcil|what do i need|how.*(index|reference)/.test(text)) intent = 'ask_recovery_process';
  else if (/where.*(archive|record|file)|wheres.*(archive|record|file)|archive.*(where|location)|its archive/.test(text)) intent = 'ask_archive_location';
  else if (/transfer|receipt|manifest|batch|routing|missing|moved|sent.*(file|record)/.test(text)) intent = 'ask_transfer';
  else if (/retir|decommission|shut down|discontinu|wasnt it|thought it was/.test(text)) intent = 'ask_retirement';
  else if (/active|running|online|restart|status|still.*(on|live)|keeps.*service|service.*doing/.test(text)) intent = 'ask_service_status';
  if (intent !== 'unknown') {
    const explicit = /\b(service|006|6|six|archive|index|retirement)\b/.test(text);
    if (!entity && !explicit) return result(intent, { needsClarification: true });
    return result(intent, { entityId: entity ?? 'service-006' });
  }
  return result('unknown');
}

export class FallbackInterpreter implements IntentInterpreter {
  readonly id = 'fallback';
  async isAvailable(): Promise<boolean> { return true; }
  async interpret(input: string, context: QueryContext): Promise<Interpretation> { return classify(input, context); }
}
