import { corporateText, findPublicPersonnel, PUBLIC_PERSONNEL, PublicEmployee } from '../corporate-records';
import type { Interpretation, QueryContext } from '../models';
import { BASE_SEMANTIC_CATALOG as SEMANTIC_CATALOG } from './semantic-catalog';

export type CompanyTopic = 'overview' | 'history' | 'founders' | 'headquarters' | 'facilities' | 'status' | 'products' | 'n-series' | 'c-series' | 'r-series' | 'departments' | 'decline' | 'leadership' | 'unavailable';
export interface CorporateQuestion { kind: 'company' | 'personnel' | 'unavailable'; topic?: CompanyTopic; people?: readonly PublicEmployee[]; intent: Interpretation['intent']; explicitCareer?: boolean }

/** Bounded authored information routes, shared by offline and optional-model recognition. */
export function corporateQuestion(input: string, context: QueryContext = {}): CorporateQuestion | undefined {
  const text = corporateText(input);
  if(/\b(?:weather|rain|snow|freezing|forecast)\b/.test(text)||/\b(?:web|website|internet)\b/.test(text)&&/\b(?:outside|external|beyond|not part)\b/.test(text))return undefined;
  if (!text || /^(?:open|read|search|help|status|dir|cd|clear|recover|diag|confirm|cancel|defer|resume|verify|audit|connect|release|revoke|isolate|restore|prepare|compare)\b/.test(text)) return undefined;
  const explicitCareer = /\b(?:career|employment|work profile|job|role|department|research responsibilities)\b/.test(text);
  const named = PUBLIC_PERSONNEL.filter(person => {
    const name = corporateText(person.name).replace(/^dr /, '');
    if ((` ${text} `).includes(` ${name} `)) return true;
    if (/^(?:what|where|when|why|how|does|did|is|are)\b/.test(text)) return false;
    const words = text.split(' '); const index = words.indexOf(name.split(' ').at(-1)!);
    if (index < 0) return false;
    const before = words[index - 1];
    // A different given name must not silently resolve to a public employee with the same surname.
    return !before || ['who','is','was','about','for','named','called','dr','mr','ms','the'].includes(before)
      || before === name[0] || corporateText(`${person.department} ${person.role}`).split(' ').includes(before);
  });
  const clinical = /\b(?:mother|av ?06|site ?6|patient|clinical record|clinical support|preservation|consent|distress|suffering|injury|incident|alive|dead|hurt|pain)\b/.test(text);
  if (named.length) {
    // Leave established clinical questions and later Anna dialogue to their existing guards.
    if (clinical || named.some(person => person.id === 'P025') && /\b(?:where|now|current|condition|experiments?|participat|happened|hear|save)\b/.test(text) && !explicitCareer) return undefined;
    if (!/^(?:who|what|when|where|tell|show|find|list|do|did|does|is|was|can|could)|^[a-z]+(?: [a-z]+)?$/.test(text)) return undefined;
    if (/\b(?:where|now|current location|home|address|salary|family|secret|experiments?)\b/.test(text) && !explicitCareer) return { kind: 'unavailable', people: named, intent: 'ask_staff' };
    const qualified = named.length > 1 ? named.filter(person => {
      const words = corporateText(`${person.name} ${person.department} ${person.role}`).split(' ');
      return text.split(' ').some(word => word !== 'bell' && words.includes(word));
    }) : named;
    const people = qualified.length ? qualified : named;
    return { kind: 'personnel', people, intent: people.length === 1 && people[0].id === 'P025' ? 'q_anna_identity' : 'ask_staff', explicitCareer };
  }
  if (context.lastTopic === 'public-personnel:bell' && /^(?:the )?(?:first|second|andrew|iris|workshop|neuroscience|researcher|technician)(?: one)?$/.test(text)) {
    const person = PUBLIC_PERSONNEL.find(person => person.id === (/first|andrew|workshop|technician/.test(text) ? 'P024' : 'P028'))!;
    return { kind: 'personnel', people: [person], intent: 'ask_staff' };
  }
  if (/^(?:show|find|display|view|bring up)(?: me)? (?:the )?(?:company profile|company information|work directory|staff directory|public directory|equipment qa|equipment qa report|operations annex transfer notice|office transfer)/.test(text)) return undefined;
  if (clinical || /\b(?:00[0-9]|service six|night desk|handover|shutdown|holding system|release|bridge|operator|alarm|call|receipt|staff note|sign in)\b/.test(text)) return undefined;
  const directory = text.match(/^(?:who (?:works|worked|is|was) (?:in|for)|(?:show|list|find)(?: me)?(?: the| all)? (?:staff|employees|personnel|people|work profiles)(?: (?:in|from|named|called|for))?)\s*(.*)$/);
  if (directory || /^(?:staff|employees|personnel|work directory|employee directory|who works (?:here|there|at meridian))$/.test(text)) {
    return { kind: 'personnel', people: findPublicPersonnel(directory?.[1] ?? ''), intent: 'ask_staff' };
  }
  const role = text.match(/^(?:who (?:is|was|are|were)|find|list|show me) (?:the )?(.+)$/)?.[1];
  if (role) {
    const people = findPublicPersonnel(role);
    if (people.length) return { kind: 'personnel', people, intent: 'ask_staff' };
  }
  // Unknown people receive the same public-directory limitation; no private roster is consulted.
  if (/^(?:who (?:is|was)|tell me about|show me (?:the )?(?:work )?profile (?:of|for)) [a-z]+(?: [a-z]+){1,3}$/.test(text)
    && !/\b(?:meridian|company|corporation|business|founders?|headquarters|office|system|interface|c series|r series|n series|lowell|worcester|providence|products?|departments?|you|your|the|it|this|that|there|here|she|her|he|him|they|them|operator|supervisor|responsible|to|from|answer|supposed)\b/.test(text)) return { kind: 'unavailable', intent: 'ask_staff' };

  const companyContext = context.lastTopic?.startsWith('corporate:');
  const company = /\b(?:meridian|company|corporation|business|manufacturer|founders?|headquarters|hq|departments|divisions|c series|r series|n series|lowell|worcester|providence|operations annex)\b/.test(text)
    || /^(?:are they still operating|what do they manufacture|what do they make|why did (?:they|the company) downsize)$/.test(text)
    || !!companyContext && (/\b(?:it|they|its|their)\b/.test(text) || /^(?:where|why|products|history)$/.test(text));
  if (!company) return undefined;
  if (/\breception\b/.test(text) || /\b(?:copy|mirror|records?)\b/.test(text) && /\b(?:contain|complete|every|all|trust|integrity|altered)\b/.test(text)) return undefined;
  if (/\b(?:company|meridian)\b.*\band\b.*\boffice\b/.test(text)) return undefined;
  let topic: CompanyTopic = 'unavailable';
  if (/\b(?:found|founded|founder|founders|establish|established|started|begin|began)\b/.test(text)) topic = 'founders';
  else if (/\b(?:downsize|downsized|decline|shrink|shrunk|restructur\w*|contracted|bankrupt|fail|failed)\b/.test(text) || /\bwhy\b.*\b(?:smaller|closed|close)\b/.test(text) || /what happened to (?:meridian|the company)/.test(text)) topic = 'decline';
  else if (/\b(?:department|departments|organization|organisation|structur\w*|divisions|division)\b/.test(text)) topic = 'departments';
  else if (/\b(?:headquarters|hq|based)\b/.test(text)) topic = 'headquarters';
  else if (/\b(?:facilities|sites|offices|buildings|lowell|worcester|providence|annex)\b/.test(text)) topic = 'facilities';
  else if (/\b(?:operating|operate|active|exist|exists|trading|still in business|employees|workforce|staff count)\b/.test(text) || /how many (?:people|staff)/.test(text)) topic = 'status';
  else if (/\bn series\b/.test(text)) topic = 'n-series';
  else if (/\bc series\b/.test(text)) topic = 'c-series';
  else if (/\br series\b/.test(text)) topic = 'r-series';
  else if (/\bresearch\b/.test(text)) topic = 'n-series';
  else if (/\b(?:products?|manufactur\w*|sell|sold|make|made|equipment)\b/.test(text)) topic = 'products';
  else if (/\b(?:runs|run|leads|leadership|executive|ceo|manages)\b/.test(text)) topic = 'leadership';
  else if (/\b(?:history|historical|past|timeline)\b/.test(text)) topic = 'history';
  else if (/^(?:what is|what was|whats|tell me about|describe|explain) (?:the )?(?:meridian(?: systems)?|company|business|corporation)(?:s purpose| purpose)?$/.test(text) || /\b(?:purpose|line of business)\b/.test(text) || /^what (?:does|did) (?:meridian(?: systems)?|the company) do$/.test(text)) topic = 'overview';
  if (/\b(?:street|postal|zip|address|coordinates|telephone|phone|email|website|exact|unlisted)\b/.test(text)) topic = 'unavailable';
  return { kind: 'company', topic, intent: 'ask_company' };
}

export function corporateInterpretation(input: string, context: QueryContext = {}): Interpretation | undefined {
  const query = corporateQuestion(input, context);
  if(context.scenarioVersion==='1.0'&&query?.kind==='company'&&query.topic==='unavailable'&&!/\b(?:street|postal|zip|address|coordinates|telephone|phone|email|exact|unlisted)\b/i.test(input))return undefined;
  // Preserve existing classifier labels for exact catalogue examples; answers use the public data route.
  const authored = query && SEMANTIC_CATALOG.find(entry => entry.examples.some(example => corporateText(example) === corporateText(input)));
  return query ? { intent: authored?.intent ?? query.intent, provider: 'fallback', method: 'deterministic', needsClarification: false } : undefined;
}
