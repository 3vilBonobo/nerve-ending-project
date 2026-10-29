import type { Interpretation, QueryContext } from '../models';
import { SERVICES, serviceById, ServiceId, SERVICE_STATES, ServiceState } from '../service-records';
import { BASE_SEMANTIC_CATALOG as SEMANTIC_CATALOG } from './semantic-catalog';

export interface ServiceQuestion {
  kind: 'registry' | 'info' | 'log' | 'warnings' | 'states' | 'distinction' | 'missing' | 'invalid' | 'syntax' | 'deny';
  id?: ServiceId;
  state?: ServiceState;
  action?: string;
}
const normalized = (input: string): string => input.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 -]/g, ' ').replace(/\s+/g, ' ').trim();

/** Bounded factual routing shared by offline/model clients. Never supplies an operation. */
export function serviceQuestion(input: string, context: QueryContext = {}): ServiceQuestion | undefined {
  const text = normalized(input);
  if (/^(?:help|dir|ls|cd|open|read|search|status|info|log|clear|cls|recover|diag)\b/.test(text)) return undefined;
  // Retain the authored early/revealed dialogue and its gates for existing story questions.
  if (SEMANTIC_CATALOG.some(entry => entry.intent.startsWith('q_') && !entry.intent.startsWith('q_neconv_') && entry.examples.some(example => normalized(example) === text))) return undefined;
  if (/\b(?:difference|distinguish)\b/.test(text) && /(?:shutdown|closure|historical|archive)/.test(text) && /(?:current|live|status)/.test(text)) return { kind: 'distinction' };
  const state = (Object.keys(SERVICE_STATES) as ServiceState[]).find(value => new RegExp(`\\b${value.toLowerCase()}\\b`).test(text));
  if (state && /^(?:what (?:does|is)|explain|define)\b/.test(text) && /\b(?:mean|state|standby|retired)\b/.test(text) && !/\bservice\s+\d/.test(text)) return { kind: 'states', state };
  if (/\b(?:warnings?|errors?)\b/.test(text) && /\bservices?\b/.test(text) && /^(?:show|list|what|which|are|any)\b/.test(text) && !/\d/.test(text)) {
    return /\b(?:yesterday|today|week|month|between|since|before|after|page|filter)\b/.test(text) ? { kind: 'syntax' } : { kind: 'warnings' };
  }
  if (/\bservices?\b/.test(text) && /\b(?:running|active|registered|available|status|state|stopped|standby|retired|list|have)\b/.test(text) && !/\d|closed|closure|shutdown|contradiction|discrepancy/.test(text) && !SERVICES.some(service => text.includes(service.name.toLowerCase()))) return { kind: 'registry' };

  const code = text.match(/\bservice\s+(\d{3})\b/)?.[1] ?? text.match(/\b(00\d)\b/)?.[1];
  const named = SERVICES.filter(service => text.includes(service.name.toLowerCase()));
  const recordsSystem = /\brecords system\b/.test(text);
  const contextId = context.lastTopic?.match(/^service-(00[1-8])$/)?.[1] as ServiceId | undefined;
  const pronoun = /\b(?:it|its|that service|this service)\b/.test(text);
  const requested = code ?? (named.length === 1 ? named[0].id : recordsSystem ? '007' : undefined);
  const id = requested ?? (pronoun ? contextId : undefined);
  const logs = /\b(?:logs?|events?|history|activity entries)\b/.test(text) && /^(?:show|list|display|give|can|could|what|when)\b/.test(text);
  const factual = /^(?:what|who|why|when|how|is|was|does|has|tell|show|which|and|can|could)\b/.test(text);
  const control = /^(?:(?:can|could|would) (?:you|i) |please )?(start|stop|restart|reroute|redirect|disable|enable|shut down|turn (?:it )?off)\b/.exec(text);
  if (control && (id || requested || /\bservice\b/.test(text))) return { kind: 'deny', id: serviceById(id ?? '')?.id, action: control[1] };
  const shortFollowup = /^(?:what does (?:it|that service|this service) do|is it (?:working|running|active|stopped)|show me its logs|(?:can|could) (?:i|you) (?:see|show)(?: me)? its (?:activity entries|logs))$/.test(text);
  if (!requested && pronoun && !shortFollowup) return undefined;
  if (/^(?:show|show me) (?:service )?006$/.test(text)) return undefined;
  if (id === '006' && /\b(?:was|closed|decommissioned|turned off|stopped|shutdown|retired)\b/.test(text)) return undefined;
  // Causal investigations, approvals and the inherited restart explanation retain their existing paths.
  if (/\b(?:contradiction|discrepancy|investigate|investigation|approval|approved|authori[sz]|handover|release|restart|restarted)\b/.test(text)
    || /(?:running|active|online).*(?:closed|closure|shutdown)|(?:closed|closure|shutdown).*(?:running|active|online)/.test(text)
    || id === '006' && /\b(?:why|how)\b.*\b(?:006|it|service)\b.*\b(?:still|running)\b/.test(text)) return undefined;
  if (named.length > 1) return { kind: 'missing' };
  if (requested && !serviceById(requested)) return { kind: 'invalid' };
  if (factual && id && /\b(?:warnings?|errors?)\b/.test(text)) return { kind: 'syntax' };
  if (logs && (id || /\b(?:service|its|the) logs?\b/.test(text))) {
    if (/\b(?:yesterday|today|week|month|between|since|before|after|page|filter|last\s+\d|warnings?|errors?)\b/.test(text)) return { kind: 'syntax' };
    const remainder = SERVICES.reduce((rest, service) => rest.replace(service.name.toLowerCase(), ''), text)
      .replace(/\b(?:show|me|list|display|give|can|could|you|i|see|activity|entries|please|what|is|are|the|service|its|that|this|logs?|events?|history|for|of|recent|available|\d{3})\b/g, '').trim();
    if (remainder) return { kind: 'syntax' };
    return id ? { kind: 'log', id: id as ServiceId } : { kind: 'missing' };
  }
  if (/\b(?:holding|preservation|patient|clinical|body|neural|consciousness|suffering|anna|mother)\b/.test(text)) return undefined;
  if (factual && id) return { kind: 'info', id: id as ServiceId };
  if (/^(?:what does (?:it|that service|this service) do|is it (?:working|running|active|stopped)|show me its logs)$/.test(text)) return { kind: 'missing' };
  return undefined;
}
export function serviceInterpretation(input: string, context: QueryContext = {}): Interpretation | undefined {
  const question = serviceQuestion(input, context);
  if (!question) return undefined;
  const authored = SEMANTIC_CATALOG.find(entry => entry.examples.some(example => normalized(example) === normalized(input)));
  return {
    intent: authored?.intent ?? (question.kind === 'deny' ? 'request_stop' : 'ask_service_status'), provider: 'fallback', method: 'deterministic',
    needsClarification: question.kind === 'missing',
    ...(question.kind === 'missing' ? { clarification: 'Which service are you referring to?' } : {}),
    ...(question.id ? { entityId: `service-${question.id}` } : {}),
  };
}
