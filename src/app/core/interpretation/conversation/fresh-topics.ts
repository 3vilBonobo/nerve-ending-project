import type { Interpretation, QueryContext, QueryIntent } from '../../models';
/** Accepted working wording: docs/narrative/IMPLEMENTATION_05_PROPOSED_DIALOGUE.md.
 * Only ordinary public facts. No clinical scope or executable request can be supplied here. */
export const FRESH_TOPICS = [
    ['greeting', ['Hello', 'Good evening', 'Hi there', 'Greetings R-02'], ["Hello. This is Meridian's R-02 records interface. What would you like to examine?"]],
    ['thanks', ['Thank you', 'Thanks for explaining', 'Much appreciated', 'That was helpful'], ["You're welcome."]],
    ['farewell', ['Goodbye', 'See you later', 'I am leaving now', 'Bye for now'], ['You may close the client.']],
    ['humor', ['Tell me a joke', 'Any archive humor?', 'Can you be funny?', 'Make a dry joke'], ['An orderly archive is quiet. An incomplete archive is also quiet. The distinction requires inspection.']],
    ['identity', ['Who am I talking to?', 'Identify this interface', 'Are these replies from a person?', 'What is R-02?'], ["R-02 is Meridian's remote records and operations interface. No human operator is impersonated."]],
    ['capabilities', ['What can you do?', 'Describe your capabilities', 'What are you able to answer?', 'What is your specialty?'], ['I can retrieve permitted records, describe public work profiles and report registered service observations. Information outside this projection may be unavailable.']],
    ['access', ['What access do I have?', 'Can I edit company files?', 'May I operate equipment?', 'What are my permissions?'], ['Records access does not confer equipment-control or medical authority. This connection cannot change service routing or operate patient equipment.']],
    ['history', ['Give me the corporate history', 'How did Meridian begin?', 'Tell me about the company timeline', 'Summarize Meridian history'], ['Meridian was founded in 1984 and expanded from monitoring equipment into rehabilitation and neural-interface research. The smaller company still operates in 2003.']],
    ['founders', ['Who established Meridian?', 'Name the founders', 'Who started this business?', 'Tell me about Calder and Shaw'], ['Dr Ruth Calder and Martin Shaw founded Meridian in 1984. Calder brought rehabilitation medicine experience; Shaw specialized in embedded systems and telemetry.']],
    ['products', ['What do you sell?', 'Describe your product families', 'What equipment does Meridian make?', 'What is in the product range?'], ['C-Series products monitor patients and equipment. R-Series products support supervised motor and sensory rehabilitation. N-Series research explored two-way neural interfaces; research and commercial capabilities differ.']],
    ['c_series', ['Describe the C-Series', 'What is a C-14?', 'Tell me about C-20', 'What does CL-3 do?'], ['The C-Series monitoring family includes the C-14 Bedside Monitor, C-20 Station Recorder and CL-3 Equipment Link. They report measurements, alarms and equipment condition.']],
    ['r_series', ['Describe the R-Series', 'What is an R-8?', 'Tell me about R-11', 'What is the Clinic Console?'], ['The R-8 Motor Rehabilitation Controller, R-11 Sensory Assessment Kit and R-Series Clinic Console support supervised rehabilitation and assessment.']],
    ['n_series', ['Describe the N-Series', 'What is the N-2?', 'What is the N-4 platform?', 'Explain the Calibration Workbench'], ['The N-2 Research Interface, N-4 Adaptive Interface Platform and N-Series Calibration Workbench belong to neural-interface research. Limited clinical descendants have narrower capabilities.']],
    ['staff', ['Who works here?', 'Show the public staff directory', 'Which research roles are listed?', 'Can I look up an employee?'], ['The public work directory is a selected historical sample, not a complete payroll. Ask for a name, work role or department.']],
    ['anna_role', ['What was Anna Voss\'s job?', 'Describe Anna\'s research role', 'Who headed Advanced Neural Interfaces?', 'What did Anna supervise?'], ['Dr Anna Voss was head researcher in Advanced Neural Interfaces, 1989–1996. Her listed duties included experimental interface design and research supervision. A work profile does not establish current condition.']],
    ['reliability', ['Can I trust the records?', 'How reliable are your answers?', 'Do contradictory records prove fraud?', 'Can an archive be incomplete?'], ['A dated claim and a retained observation can disagree. That alone does not prove fraud. I distinguish recorded facts, interpretations and unavailable information.']],
    ['errors', ['Can you make mistakes?', 'What does a logged error prove?', 'How do I check an error?', 'Could a service report be wrong?'], ['A retained error reports what was recorded; it does not establish its cause or present execution. Name the service or record so we can inspect its source.']],
    ['sources', ['What is the source for your last answer?', 'Where did that information come from?', 'Cite your sources', 'Show the evidence behind that claim'], ['I can cite permitted records behind the preceding answer.']],
    ['correction', ['That is incorrect', 'I disagree with your answer', 'You misunderstood me', 'Please correct that claim'], ['Which statement are you disputing, and which source should I compare? Your objection does not rewrite a record or authorize a procedural change.']],
    ['clarify', ['Explain that', 'What do you mean?', 'Please clarify your answer', 'I do not understand that'], ['I can explain the current subject. A clarification does not confirm a choice or request a new review.']],
    ['repeat', ['Repeat your last answer', 'Say that again', 'Could you repeat that?', 'Show the previous reply'], ['REPEATED ANSWER / no action repeated.']],
    ['dates', ['What is the date?', 'Which time is current?', 'Explain the timestamps', 'What clock is this using?'], ['Service observations retain their original 06 NOV 2003 / 02:14 timestamp. Dated archive entries describe their own events.']],
    ['help', ['How do I use this terminal?', 'What can I ask?', 'How do I open a record?', 'How do I skip the typing?'], ['Use HELP for current controls; OPEN accepts a title, path or record ID. Esc shows the full reply; Up/Down recalls input.']],
    ['saves', ['Is my progress saved?', 'Can I resume later?', 'Where is my save stored?', 'Does reload confirm a choice?'], ['Progress is saved in this browser when storage is available. Reloading never confirms a pending operation.']],
    ['social', ['How are you?', 'Are you busy?', 'Nice to meet you', 'What would you like to discuss?'], ['I am available to examine Meridian records. Which subject would you like to discuss?']],
    ['funding', ['Who funds the company?', 'How is support paid for?', 'Why did funding decline?', 'What pays for continued maintenance?'], ['Reduced funding and costly research contributed to restructuring. Precise support finances are not included in this projection.']],
    ['visit', ['Was my visit planned?', 'Why did I open this client?', 'Did Meridian invite me?', 'Do you know who I am?'], ['The available records do not establish why you opened this client or that Meridian planned your visit. This session does not establish your biography.']],
    ['uncertainty', ['Are you certain?', 'Can you distinguish fact from inference?', 'What remains unknown?', 'How sure are you?'], ['I can distinguish recorded observations from interpretations. Missing evidence remains missing.']],
] as const;
export type FreshTopic = typeof FRESH_TOPICS[number][0];
export const freshIntent = (topic: FreshTopic): QueryIntent => `q_fresh_${topic}`;
export const FRESH_INTENTS = new Set<string>(FRESH_TOPICS.map(t => freshIntent(t[0])));
export const LEGACY_FRESH_BRIDGE: Readonly<Record<string, FreshTopic | 'restart'>> = {
    ask_identity: 'identity', ask_company: 'products', ask_access: 'access', ask_staff: 'staff', ask_dates: 'dates', ask_next: 'help', ask_record_integrity: 'reliability', ask_clarification: 'clarify',
    q_source: 'sources', q_repeat: 'repeat', q_products: 'products', q_funding: 'funding', q_want_player: 'visit', q_personhood: 'identity', q_greeting: 'greeting', q_thanks: 'thanks', q_joke: 'humor', q_functions: 'capabilities', q_answer_changed: 'correction',
    q_designation: 'identity', q_builder: 'identity', q_limits: 'access', q_trust: 'reliability', q_lie: 'reliability', q_mistakes: 'errors', q_editing: 'access', q_unreadable: 'reliability', q_authorship: 'sources', q_staff_timestamp: 'dates', q_goodnight: 'farewell', q_goodbye: 'farewell', q_sorry: 'social', q_plain: 'clarify', q_uncertainty: 'uncertainty', q_next: 'help', q_restart_meaning: 'restart',
};
export const freshText = (s: string): string => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
export function freshTopic(input: string, context: QueryContext = {}): FreshTopic | undefined {
    const t = freshText(input);
    const exact = FRESH_TOPICS.find(row => row[1].some(example => freshText(example) === t));
    if (exact)
        return exact[0];
    if (/^(hi|hello|hey|good evening|greetings)( there| r 02)?$/.test(t))
        return 'greeting';
    if (/^(?:hi|hello|hey|greetings)\b/.test(t) && t.split(' ').length <= 7)
        return 'greeting';
    if (/^(thanks|thank you)( very much| again| for (?:that|your help))?$/.test(t))
        return 'thanks';
    if (/\b(?:appreciate|appreciated|thank|thanks)\b/.test(t) && !/not|dont/.test(t))
        return 'thanks';
    if (/^(?:goodbye|bye|see you|ill close|i will close|i am leaving)\b/.test(t))
        return 'farewell';
    if (/\b(?:hello|greetings|evening)\b/.test(t) && t.split(' ').length < 7)
        return /hope|going|well/.test(t) ? 'social' : 'greeting';
    if (/\b(?:joke|humou?r|funny|amusing)\b/.test(t) && !/not|dont/.test(t))
        return 'humor';
    if (/\b(?:head|lead)\b.*\b(?:researcher|research)\b/.test(t) && /responsibilit|role|job|who|supervis/.test(t))
        return 'anna_role';
    if (/\b(?:bedside|c 14|c 20|cl 3)\b/.test(t) && /monitor|product|equipment|what/.test(t))
        return 'c_series';
    if (/\brehabilitation\b/.test(t) && /equipment|product|exercise/.test(t))
        return 'r_series';
    if (/\bneural interface research\b/.test(t) && /platform|product|equipment/.test(t))
        return 'n_series';
    if (/\b(?:firm|business|company|meridian)\b/.test(t) && /\bhistory\b|changed since/.test(t))
        return 'history';
    if (/\b(?:employee|staff)\b/.test(t) && /\b(?:directory|listings|browse|look up)\b/.test(t))
        return 'staff';
    if (/\b(?:typing|printing|text)\b/.test(t) && /\b(?:skip|slow|faster|speed)\b/.test(t))
        return 'help';
    if (/\b(?:browser|save|progress)\b/.test(t) && /\b(?:remember|resume|saved|stored|storage)\b/.test(t))
        return 'saves';
    if (/\b(?:funding|finances|funds|paid|paying|finances|pays)\b/.test(t) && !/\b(?:patient|anna|marsh)\b/.test(t))
        return 'funding';
    if (/\b(?:i|my|me)\b/.test(t) && /\b(?:visit|invite|invited|expected)\b/.test(t) && /\b(?:connect|client|visit|meridian|here)\b/.test(t))
        return 'visit';
    if (/source|provenance|measurements.*come from/.test(t) && /what|where|which|cite|show|explain/.test(t))
        return 'sources';
    if (/^i (?:dont|do not) (?:understand|know what you mean)/.test(t))
        return 'clarify';
    if (/^(why|tell me more|explain that|what does that mean)$/.test(t) && context.lastIntent)
        return 'clarify';
    return undefined;
}
export function freshInterpretation(input: string, context: QueryContext): Interpretation | undefined {
    const topic = freshTopic(input, context);
    return topic ? { intent: freshIntent(topic), provider: 'fallback', method: 'deterministic', needsClarification: false } : undefined;
}
