import { publicPersonnelLines } from '../corporate-records';
import { CompanyTopic, corporateQuestion } from '../interpretation/corporate-questions';
import type { GameState, Interpretation, Transition } from '../models';

const COMPANY_ANSWERS: Record<CompanyTopic, readonly string[]> = {
  overview: ['Meridian Systems develops medical monitoring and rehabilitation equipment. It also conducted specialist research into electrical interfaces with the nervous system.'],
  history: ['Meridian was founded in 1984 and expanded from monitoring equipment into rehabilitation and neural-interface research.', 'After its research peak in the mid-1990s, reduced funding, competition and costly projects led to restructuring. The smaller company still operates in 2003.'],
  founders: ['Dr. Ruth Calder and Martin Shaw founded Meridian in 1984. Calder brought rehabilitation medicine experience; Shaw specialized in embedded systems and telemetry.'],
  headquarters: ['Meridian headquarters is in Providence, Rhode Island. The company maintains a reduced administrative and support staff there.'],
  facilities: ['The corporate headquarters is in Providence, Rhode Island. The former Providence Operations Annex closed in 2001.', 'The Lowell Technical Center handles engineering and device testing on a reduced scale. The former Worcester Research Administration Office closed in 1999.'],
  status: ['Meridian is still operating in 2003, with about 70 employees plus contractors. It concentrates on parts, maintenance, support agreements and licensing for existing equipment.', 'The remote work directory is a selected historical sample, not a complete payroll.'],
  products: ['C-Series products monitor patients and equipment. R-Series products support supervised motor and sensory rehabilitation.', 'N-Series research explored two-way interfaces that observe nervous-system signals and deliver controlled stimulation. Research capabilities and commercial device capabilities differ.'],
  'c-series': ['The C-Series is Meridian\'s clinical monitoring family: the C-14 Bedside Monitor, C-20 Station Recorder and CL-3 Equipment Link. They report measurements, alarms and equipment condition.'],
  'r-series': ['The R-Series supports supervised rehabilitation and assessment. Products include the R-8 Motor Rehabilitation Controller, R-11 Sensory Assessment Kit and R-Series Clinic Console.'],
  'n-series': ['The N-Series was Meridian\'s research program for two-way neural interfaces: instruments that read selected nervous-system signals and can deliver controlled stimulation.', 'Examples include the N-2 Research Interface, N-4 Adaptive Interface Platform and N-Series Calibration Workbench. Limited clinical descendants have narrower capabilities.'],
  departments: ['Meridian\'s organization includes Corporate Administration, Customer & Field Services, Biomedical Equipment Engineering, Clinical Systems, and Corporate Computing & Communications.', 'Advanced Neural Interfaces and Research Administration & Compliance are historical research units. Facilities and contracted care cover continuing maintenance obligations.'],
  decline: ['Expensive research, reduced funding, stronger product competition and ended contracts forced Meridian to downsize.', 'Research programs and offices closed in stages. Remaining operations focus on supporting equipment already installed; an office closure did not dissolve the company.'],
  leadership: ['Daniel Price leads the remaining business as Acting Chief Executive. Dr. Ruth Calder left daily management in 1999; Martin Shaw left the systems director role in 2000.'],
  unavailable: ['That detail is not included in the available company information. I can describe Meridian\'s history, products, ordinary facilities and departments.'],
};

/** Corporate information never grants evidence, authority, encounter progress or equipment effects. */
export function answerCorporate(state: GameState, input: string, predicted?: Interpretation): Transition | undefined {
  const query = corporateQuestion(input, state);
  if (!query) return undefined;
  if (query.intent === 'q_anna_identity' && state.knowledge.includes('annaIdentified') && !query.explicitCareer) return undefined;
  const people = query.people ?? [];
  const ambiguous = query.kind === 'personnel' && people.length > 1 && people.every(person => /\bBell$/.test(person.name));
  let lines: string[];
  if (query.kind === 'company') lines = [...COMPANY_ANSWERS[query.topic!]];
  else if (query.kind === 'unavailable') lines = [people.length ? 'The public work directory does not include that personal information or assignment. I can describe the recorded work role.' : 'No matching public work profile is available.'];
  else if (ambiguous) lines = ['Two work profiles match Bell. Which do you mean?', ...people.map(person => `${person.name} — ${person.role} / ${person.department}`)];
  else lines = people.length ? ['PUBLIC WORK DIRECTORY', ...publicPersonnelLines(people)] : ['No public work profiles match that name, role or department.'];
  const fileId = query.kind === 'company' ? 'corporate-profile' : 'work-directory';
  const topic = ambiguous ? 'public-personnel:bell' : query.kind === 'company' ? `corporate:${query.topic}` : query.intent === 'q_anna_identity' ? 'Anna Voss' : `public-personnel:${people.length === 1 ? people[0].id : 'directory'}`;
  const interpretation: Interpretation = { intent: query.intent, provider: predicted?.provider ?? 'fallback', method: 'deterministic', needsClarification: false };
  return {
    state: { ...state, lastTopic: topic, lastIntent: query.intent },
    resolvedInterpretation: interpretation,
    dialogue: { variantId: `corporate:${query.kind}:${query.topic ?? (people.map(person => person.id).join(',') || 'unavailable')}`, intent: query.intent, profile: 'RECORDS', modifiers: [], conditions: { gate: null, gateSatisfied: true, questionCount: null, previousIntent: state.lastIntent ?? null, previousFileId: state.lastFileId ?? null } },
    output: { lines, links: [{ fileId, label: fileId === 'corporate-profile' ? '/ADMIN/MERIDIAN_COMPANY_PROFILE.TXT' : '/PERSONNEL/WORK_DIRECTORY.TXT' }], code: ambiguous ? 'notice' : 'ok', truth: 'record' },
  };
}
