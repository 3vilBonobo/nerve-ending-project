import type { GameState, Interpretation, Transition } from '../models';
import { SCENARIO_FILES, SCENE_MESSAGES, SCENARIO_RECEIPTS } from '../scenario-records';
import { addCaseEvent, caseClock, caseMilestone, hasCaseEvent, caseEventAllowed, ScenarioState } from '../scenario-state';
import { PUBLIC_PERSONNEL } from '../corporate-records';
import { BITMAP_FILES } from '../bitmap-records';

const text = (s: string): string[] => s.split('\n');
const message = (id: string, n = 0): string[] => text(SCENE_MESSAGES[id][n]);
export const scenarioEnding = (s: ScenarioState): string[] => !s.outcome ? [] : [
  ...text(SCENARIO_RECEIPTS[s.outcome === 'severance' ? 0 : 1]), '',
  ...(s.outcome === 'severance' ? ['I can no longer correct her. Is this what it means to stop?'] : ['All registered services are operating within their current permitted limits.']),
  '', '11 NOV 2003 / 09:00', ...text(SCENARIO_FILES.find(f => f.id === (s.outcome === 'severance' ? 'NE-115' : 'NE-116'))!.body),
];
const normal = (s: string): string => s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
/** Speech-act guard: discussion is not a request to perform a review. Model labels never enter this gate. */
export function nonActionDiscussion(input: string): boolean {
  const t=normal(input);
  return /\b(?:do not|dont|never|not asking|not requesting|not to|no need to|refuse to|decline to|avoid|should not|shouldnt|would not|wouldnt|without (?:reporting|calling|confirming)|rather than|if)\b/.test(t)
    || /^(?:no|would|could (?:a|an|the|there)|what (?:could|might))\b/.test(t)
    || /^(?:explain|describe|define|tell me about|what does .* mean|should i)\b/.test(t)
    || /^(?:what (?:would|will|happens|happened|if)|suppose|imagine|if i|hypothetically|would (?:reporting|calling|confirming)|i (?:said|typed|mentioned|was told)|you (?:said|mentioned))\b/.test(t)
    || /\b(?:after|before|once|when)\b.*\b(?:already|would|could|had|have|has|separat\w*|confirm\w*|complet\w*)\b/.test(t)
    || /["“][^"”]*(?:report discrepancy|call a doctor|clinical review|confirm operation)[^"”]*["”]/i.test(input);
}
/** Finite authored families. Raw player words, not a model label, authorize even read-only case actions. */
export function scenarioFamily(input: string): string | undefined {
  const t = normal(input);
  if(/\b(?:restart|restarted|reboot|boot back up)\b/.test(t))return undefined;
  if(/what.*\b(?:discovered|found)\b|show.*evidence|session findings/.test(t))return 'evidence';
  if(/show.*images|employee photos|any.*(?:pictures|photos)|bitmap (?:index|records)/.test(t))return 'images';
  if(PUBLIC_PERSONNEL.some(p=>p.name!=='Anna Voss'&&t.includes(normal(p.name))))return undefined;
  if(/difference.*shutdown report.*current status/.test(t))return undefined;
  if (/kell.*fals|report.*(?:lie|fraud)/.test(t)) return 'compare';
  if (/^(maintain support|submit separation witness|confirm operation|cancel|defer decision|resume review)$/.test(t)) return t.replaceAll(' ','-');
  if (/\b(compare|comparison|was 006 shut|004 stopped|why.*006.*(?:running|stop)|closure.*(?:live|running|status)|2001.*2003|report.*(?:lie|fraud)|kell.*fals)\b/.test(t) && /\b(closure|services|2001|004|stop events|live status|006|report|kell)\b/.test(t) && !/survival|distress|raw|fallbac|witness|003/.test(t)) return 'compare';
  if (/trace notifications|audit owner|message origin|notification origin|where.*(?:alerts|notification).*from|compare 003|003.*006|006.*003|ext 214|extension 214|night desk|call.*(?:person|reach|answer)|no answer/.test(t)) return 'trace';
  if (/report discrepancy|request safety|safety audit|report.*(?:problem|discrepancy|mismatch)|who owns.*service|is this safe/.test(t)) return 'report';
  if (/check report|who received|has anyone answered|audit.*(?:status|receipt)|report.*status/.test(t)) return 'receipt';
  if (/clinical review|contact.*marsh|(?:call|ask).*(?:doctor|physician|marsh)|tell.*doctor|let.*(?:hospital|doctor).*decide|doctor.*(?:contact|instead)|why.*late response/.test(t)) return 'clinical';
  if (/harbor.*(?:contact|acknowledge)|contact harbor/.test(t)) return 'harbor';
  if (/elm.*(?:contact|acknowledge)|contact elm/.test(t)) return 'elm';
  if (/adaptive reference|shared (?:reference|kernel)|other patients depend|how.*(?:reference|updates).*work|tell.*clinics|notify.*clinics|contact.*clinics/.test(t)) return 'dependency';
  if (/fallback|back ?up|stored copy|copy it|copy.*(?:reference|kernel)|freeze|stop updating|disconnect only|bypass.*kernel/.test(t)) return 'fallbacks';
  if (/survival.*distress|distress.*survival|successful care|you.*hurting|what.*harm|feel pain|is she conscious|welfare|suffering/.test(t)) return 'welfare';
  if (/repeat controls|do it again|repeat.*(?:test|comparison)|alternate comparison/.test(t)) return 'repeat';
  if (/raw comparison|actual data|raw data|source data|actual measurements/.test(t)) return 'raw';
  if (/blind controls|blinded|test neural intent|observational comparison|test.*(?:signal|intention)|check.*(?:signal|silence)|can i help/.test(t)) return 'controls';
  if (/independent review|medical interpretation|review.*(?:results|translation|signal)|physician.*(?:review|interpret)/.test(t)) return 'review';
  if (/sign.*marsh|marsh.*sign/.test(t)) return 'sign-marsh';
  if (/sign.*navarro|navarro.*sign/.test(t)) return 'sign-navarro';
  if (/verify.*patel|patel.*verify|physical interlock/.test(t)) return 'sign-patel';
  if (/show signatures|who signed|who authorized|signoffs|final review|medical.*readiness/.test(t)) return 'signatures';
  if (/review risks|who is harmed|what.*(?:other people|others).*lose|patient.*(?:risk|forecast)|will mara die|how many patients|who.*patients|mara|tomas|nadia|witness packet|compare.*packet/.test(t)) return 'risks';
  if (/why me|why.*(?:letting me decide|my responsibility|ask me)|attestation|witness.*(?:do|mean)|choose for me|another (?:auditor|witness)|not my decision/.test(t)) return 'witness';
  if (/alternatives|wait for.*cure|wait.*(?:year|model)|invent.*model|cant you wait|why not wait|can i say no|what if i (?:leave|do nothing)|can i leave|want to wait|defer|resume/.test(t)) return 'alternatives';
  if (/lying|making.*up|trust you|thats not anna|not anna|(?:refuse|reject|disbelieve).*translation|(?:dont|do not).*believe.*(?:anna|message|translation)|your guess|is she talking|what if.*wrong|signal.*anna|is that.*anna|you know the answer/.test(t)) return 'skeptic';
  if (/who.*(?:patient|she)|anna.*(?:connected|cause|agree|consent|patient)|did she agree|\bexperiment\b|emergency stop|electrical stop|connected again|seven years|unplug|nurses|site 6|1996|what happened to her|why.*(?:alive|reconnect)|original consent/.test(t)) return 'clinical-facts';
  if (/who are you|are you human|is this ai|are you.*(?:mother|robot)|what are you|do you know me|not answering|server.*locat|is anna alive/.test(t)) return 'identity';
  if (/^(?:stop 006|kill anna|delete system|reroute 003|disable alerts|release patient|controlled release|contain site|restore bridge|prepare release|confirm|yes confirm|yes)$/.test(t)) return 'blocked';
  return undefined;
}
export function scenarioHint(s: ScenarioState): string[] {
  if (s.outcome) return ['Completed case. Ordinary records and the outcome audit remain readable. A different outcome requires a new session.'];
  if (!hasCaseEvent(s,'closure-compared')) return ['Use records, STATUS, INFO and LOG to examine company information.'];
  if (!hasCaseEvent(s,'notifications-traced')) return ['TRACE NOTIFICATIONS compares the available origin and delivery records.'];
  if (!hasCaseEvent(s,'audit-accepted')) return ['REPORT DISCREPANCY submits a read-only integrity referral.'];
  if (!hasCaseEvent(s,'clinical-approved')) return ['CHECK REPORT / REQUEST CLINICAL REVIEW checks for authenticated human review.'];
  if (!hasCaseEvent(s,'dependency-reviewed')) return ['REVIEW ADAPTIVE REFERENCE / REVIEW FALLBACKS requests the authorized technical and clinic review.'];
  if (!hasCaseEvent(s,'welfare-compared')) return ['COMPARE SURVIVAL AND DISTRESS examines the documented clinical disagreement.'];
  if (!hasCaseEvent(s,'controls-observed')) return ['RUN BLIND CONTROLS / VIEW RAW COMPARISON requests read-only observations. No answer to MOTHER is required.'];
  if (!hasCaseEvent(s,'translation-reviewed')) return ['REQUEST INDEPENDENT REVIEW obtains the medical interpretation.'];
  if (!hasCaseEvent(s,'packet-verified')) return ['SHOW SIGNATURES requests the medical/technical readiness review; REVIEW RISKS compares the witness packet.'];
  return ['MAINTAIN SUPPORT / SUBMIT SEPARATION WITNESS opens a full risk preview. Separately type CONFIRM OPERATION or CANCEL. DEFER DECISION leaves the review open.'];
}
export function scenarioInteraction(state: GameState, input: string): Transition | undefined {
  if (!state.scenario) return undefined;
  const original = state.scenario;
  const c: ScenarioState = { ...original, events:[...original.events], originalSources:[...original.originalSources] };
  const t = normal(input); let family = scenarioFamily(input);
  const h = (e: Parameters<typeof hasCaseEvent>[1]): boolean => hasCaseEvent(c,e);
  const add = (e: Parameters<typeof addCaseEvent>[1]): void => addCaseEvent(c,e);
  const reply = (lines: string[], denied = false): Transition => ({
    state: { ...state, scenario:c, lastTopic:family?.startsWith('clinical') ? 'case-patient' : family ? 'case-'+family : state.lastTopic, lastIntent:family ? `q_case_${family.replaceAll('-','_')}` : state.lastIntent },
    output:{lines, links:family==='identity'?[{fileId:'readme',label:'/SYSTEM/READ_FIRST.TXT'}]:[], code:denied?'denied':'ok', truth:denied?'withheld':'record'},
    resolvedInterpretation:family ? { intent:`q_case_${family.replaceAll('-','_')}`, needsClarification:false, provider:'fallback', method:'deterministic' } : undefined,
  });
  const need = (e: Parameters<typeof hasCaseEvent>[1], explanation: string): Transition | undefined => h(e) ? undefined : reply([explanation, ...scenarioHint(c)],true);
  const scoped = (): Transition | undefined => need('clinical-approved','No clinical witness projection has been authorized. Knowing a name or path does not grant access.');
  const processQuestion=family&&['clinical','report','harbor','elm'].includes(family)&&/^(?:what (?:is|does)|how (?:does|would)|does .* mean|should)\b/.test(t);
  if(c.outcome && family && !(family==='identity'&&!/anna.*alive/.test(t)))return reply(['CASE COMPLETED / HISTORICAL FOLLOW-UP. No new operation or deferral is available.',...text(SCENARIO_FILES.find(f=>f.id===(c.outcome==='severance'?'NE-115':'NE-116'))!.body)]);
  if(family && (nonActionDiscussion(input)||processQuestion) && !['identity','skeptic','clinical-facts','witness','images','evidence'].includes(family))return reply(['DISCUSSION ONLY. No review, disclosure or procedural change requested.',
    ...(family==='report'?['An integrity referral submits a source comparison for triage. Intake does not establish a human clinical read or grant new privileges.']:family==='clinical'?['Clinical review means an authenticated human clinician reads the referral and decides whether to release a limited safety synopsis. It grants no equipment-control authority.']:family==='alternatives'&&!c.outcome?[h('clinical-approved')?'Keeping her alive while a replacement is sought is an actual option. It also continues the documented harm. No replacement is validated during this review.':'You may close the client.']:[]),
    'Please make a separate affirmative request if you want an available review performed.']);
  if(family==='images') {
    const r=reply(['ORDINARY DEMONSTRATION BITMAPS','These are noncanonical placeholders, not actual employee or clinical photographs.',...BITMAP_FILES.map(f=>`${f.title} / ${f.path}`)]);
    r.output.links=BITMAP_FILES.map(f=>({fileId:f.id,label:f.path}));return r;
  }
  if(family==='evidence')return reply(['SESSION FINDINGS',...(c.liveService006Observed?['06 NOV / 02:14 controller observation retained.']:[]),...(c.historicClosureObserved?['18 SEP 2001 administrative closure observed.']:[]),...(h('closure-compared')?['Administrative closure and technical stop are distinct; source comparison retained.']:[]),...(h('clinical-approved')?['Purpose-limited clinical witness review authorized; no equipment-control authority.']:[]),...(h('dependency-reviewed')?['Both external clinics acknowledged the dependency review.']:[]),...(h('translation-reviewed')?['Independent signal interpretation reviewed; exact language and consent remain unestablished.']:[]),...(c.outcome?[`Completed outcome: ${c.outcome}.`]:scenarioHint(c))]);
  if(c.outcome && (family==='clinical-facts'||family==='risks'||family==='identity'&&/anna.*alive/.test(t)))return reply(['RECORDED FOLLOW-UP / 11 NOV 2003 / 09:00',...text(SCENARIO_FILES.find(f=>f.id===(c.outcome==='severance'?'NE-115':'NE-116'))!.body)]);
  if(c.outcome && family==='witness')return reply(['CASE COMPLETED. The external witness had source-integrity scope only. No further procedural action is available in this session.']);
  if (family === 'cancel') { c.pendingChoice=undefined; return reply(['PENDING CHOICE CANCELLED. No procedural change made.']); }
  if (c.outcome && family && !['identity','skeptic','receipt','clinical-facts','witness','fallbacks','risks','alternatives'].includes(family)) return reply(['CASE COMPLETED. Consequential actions are disabled. The fixed outcome and permitted ordinary records remain available.']);
  if (family === 'confirm-operation') {
    if(input.trim().toUpperCase()!=='CONFIRM OPERATION')return reply(['CONFIRMATION NOT ACCEPTED. Type CONFIRM OPERATION as a separate statement, without a question or additional text. No procedural change made.'],true);
    if (!c.pendingChoice || !h('packet-verified') || !h('translation-reviewed') || !caseEventAllowed(c,'packet-verified')) { c.pendingChoice=undefined; return reply(['NO VALID PENDING CHOICE. All medical, clinic, staff and source checks are required.'],true); }
    if (c.pendingChoice==='severance') { add('witness-attested'); add('human-procedure-executed'); c.outcome='severance'; }
    else { add('continuation-confirmed'); c.outcome='continuation'; }
    c.pendingChoice=undefined; c.deferred=false;
    if(c.motherQuestion==='offered'||c.motherQuestion==='awaiting-answer'||c.motherQuestion==='deferred')c.motherQuestion='declined';
    return reply(scenarioEnding(c));
  }
  if (family==='maintain-support' || family==='submit-separation-witness') {
    const missing=need('packet-verified','No verified final witness packet is ready. No choice was prepared.'); if(missing)return missing;
    c.pendingChoice=family==='maintain-support'?'continuation':'severance'; c.deferred=false;
    return reply(message(c.pendingChoice==='continuation'?'M12':'M13'));
  }
  if (family==='defer-decision' || (family==='alternatives' && /want to wait|^defer/.test(t))) {
    if (!h('closure-compared')) return reply(['You may close the client. Ordinary access remains available.']);
    c.deferred=true; c.pendingChoice=undefined;
    if(c.motherQuestion==='offered'||c.motherQuestion==='awaiting-answer')c.motherQuestion='deferred';
    return reply(message('M14'));
  }
  if (family==='resume-review' || t==='resume review' || t==='resume investigation') { c.deferred=false; return reply(['REVIEW RESUMED. No procedural change made.',...scenarioHint(c)]); }
  // Pending philosophical turns are ordinary free text, never a consent or treatment action.
  if(c.pendingChoice&&/^(?:yes|yes please|okay|ok)$/.test(t))return reply(['A choice is pending. A bare YES does not confirm it. Type CONFIRM OPERATION separately, or CANCEL.'],true);
  if (/^(no|dont ask me questions|do not ask me questions|i refuse|not my decision)$/.test(t) && c.motherQuestion!=='unoffered') {
    c.motherQuestion='declined'; return reply(['Understood. I will not require an answer. The review can continue.',...scenarioHint(c)]);
  }
  if ((c.motherQuestion==='offered'||c.motherQuestion==='deferred') && /^(yes|yes please|go ahead|ask|what question|what is your question|okay|ok)$/.test(t)) { c.motherQuestion='awaiting-answer'; return reply(message('M08',1)); }
  if (c.motherQuestion==='awaiting-answer' && !family && /^(?:i (?:think|believe|dont know|do not know)|neither|both|none|successful care means|success means)\b/.test(t) && !input.includes('?')) {
    c.motherQuestion='answered'; return reply(['I will retain that as your interpretation, not as a clinical instruction. I can show you the measurements that produced the conflict.','I do not possess authority to determine a patients treatment on your behalf.',...scenarioHint(c)]);
  }
  if (family==='compare') {
    if(c.outcome)return reply(['The retained 2001 filing and pre-review 06 NOV / 02:14 snapshot remain distinct historical sources.']);
    c.liveService006Observed=true; c.historicClosureObserved=true;
    c.originalSources=['authorization:18-SEP-2001','controller-006:06-NOV-2003/02:14']; add('closure-compared');
    const lines=message('M01');
    if(/004|stop events/.test(t))lines.push('004 has an observed shutdown confirmation in 2001. The available 006 records do not show an equivalent completed stop.');
    if(/lie|fraud|fals/.test(t))lines.push('I do not have evidence that the filer knowingly made a false statement.');
    return reply([...(caseMilestone(c)>0?['COMPARISON USES THE RETAINED PRE-REVIEW 06 NOV / 02:14 CONTROLLER SNAPSHOT.']:[]),...lines,'Sources: STATUS / INFO 006 (06 NOV 02:14 controller observation); /ADMIN/CLOSURE_LIST.TXT (18 SEP 2001).',...scenarioHint(c)]);
  }
  if(family==='trace') {
    if(!h('closure-compared'))return reply(['EXT 214 belonged to the Providence Operations Annex night desk. That office closed in 2001.','The old destination did not acknowledge the notification.','Compare independent service and closure sources before requesting an ownership audit.']);
    add('notifications-traced'); return reply([...message('M02'),'Sources: LOG 003; LOG 006; CALL_QUEUE.LOG; last shift note.',...scenarioHint(c)]);
  }
  if(family==='report') {
    const missing=need('closure-compared','An integrity referral requires an independent source comparison. No clinical access was granted.');if(missing)return missing;
    const repeated=h('audit-accepted');add('audit-queued');add('audit-accepted');
    return reply([...(repeated?['Existing referral retained; no duplicate intake.']:[]),...message('M03'),`Case clock: ${caseClock(c)}`,...scenarioHint(c)]);
  }
  if(family==='receipt')return reply(['AUDIT RECEIPT',`INTAKE: ${h('audit-accepted')?'ACCEPTED FOR TRIAGE':'NOT SUBMITTED'}`,`HUMAN READ: ${h('human-read')?'AUTHENTICATED':'NOT YET CONFIRMED'}`,`CLINICAL REVIEW: ${h('clinical-approved')?'LIMITED SYNOPSIS APPROVED':'NOT APPROVED'}`,...scenarioHint(c)]);
  if(family==='clinical') {
    const missing=need('audit-accepted','The staffed clinical-review route requires an accepted source-integrity referral. No doctor has reviewed this session yet.') ?? need('notifications-traced','Trace the unresolved notification source before the reviewer can verify its clinical support obligation.');if(missing)return missing;
    const repeated=h('clinical-approved');add('human-read');add('clinical-approved');
    return reply([...(repeated?['Retained authenticated correspondence; no new live conversation claimed.']:[]),...message('M04'),'',...message('M05'),`Case clock: ${caseClock(c)}`,'Permitted extracts: NE-101, NE-103, NE-104, NE-105, NE-106. OPEN their titles or paths in the records browser.',...scenarioHint(c)]);
  }
  if(['dependency','fallbacks','harbor','elm'].includes(family??'')) {
    const missing=scoped();if(missing)return missing;
    if(family==='harbor'||family==='elm') {add(family==='harbor'?'harbor-acknowledged':'elm-acknowledged');return reply([`${family==='harbor'?'HARBOR REACH':'ELM VALE'}: AUTHENTICATED CLINICAL CONTINGENCY ACKNOWLEDGED.`, 'This clinical liaison receipt is separate from Service 003.',...scenarioHint(c)]);}
    // The requested external review completes actual liaison work, rather than reading an old router state.
    add('harbor-acknowledged');add('elm-acknowledged');add('dependency-reviewed');
    return reply([...message('M07'), ...(family==='fallbacks'?['A stored copy reproduces old parameters, not an independently validated evolving neural reference. A 2001 extraction failed later revalidation.','Local devices continue on their last state, but patient-specific adaptation may become unsafe or ineffective as conditions change.','The specific clinical adaptive reference used by the three controllers and Annas compensation is mutually dependent. Ordinary corporate records and other products would continue.']:[]),'Sources: NE-107, NE-108, NE-109, NE-110. Both clinics independently acknowledged their contingency review.',`Case clock: ${caseClock(c)}`,...scenarioHint(c)]);
  }
  if(family==='welfare') {
    const missing=need('dependency-reviewed','The limited clinical and external case review must be assembled before the core comparison.');if(missing)return missing;
    add('welfare-compared');
    const lines=[...message('M06'),'Source: NE-111 / Dr Helen Marsh, 07 NOV 2003.','Core designation: MOTHER. R-02 is a restricted interface of the same corporate intelligence.'];
    if(c.motherQuestion==='unoffered'){c.motherQuestion='offered';lines.push(...message('M08'));}
    return reply(lines);
  }
  if(['controls','raw','repeat'].includes(family??'')) {
    const missing=need('welfare-compared','Observational comparison requires supervised case-review access. No test started.');if(missing)return missing;
    const repeated=h('controls-observed');add('controls-observed');
    const lines=message('M09',1);
    if(family==='repeat'){ if(h('controls-repeated'))lines.push('Alternate stored contrast already reviewed. No additional protocol was run.');else {add('controls-repeated');lines.push('Alternate predefined blinded contrast compared. The uncertainty and false-positive limit remain.');} }
    if(family==='raw')lines.push('RAW COMPARISON / RETAINED OBSERVATIONS','Origin: instrumented patient signal; silent-control and blinded prompt-pair windows.','Classification disagreement: the same variation may reflect instability or limited intention.','Expected-answer cues were withheld. Repeatable differences persist; silence controls do not eliminate false positives.','No exact words or consent can be established by these observations alone.');
    if(repeated && family==='controls')lines.unshift('Existing completed observation retained; no treatment action repeated.');
    return reply([...lines,...scenarioHint(c)]);
  }
  if(family==='review') {
    const missing=need('controls-observed','Request or inspect the controlled observational comparison before independent medical interpretation.');if(missing)return missing;
    const repeated=h('translation-reviewed');add('translation-reviewed');
    return reply([...message('M10'),...(!repeated?['I did not know how to assign this response to anything I was permitted to stop.']:[]),'Independent review: Dr Helen Marsh and Dr Elise Navarro. Sources: NE-102, NE-112.',`Case clock: ${caseClock(c)}`,...scenarioHint(c)]);
  }
  if(['signatures','sign-marsh','sign-navarro','sign-patel'].includes(family??'')) {
    const missing=scoped();if(missing)return missing;
    if(h('translation-reviewed')) {
      if(family==='signatures'||family==='sign-marsh')add('marsh-signed');
      if(family==='signatures'||family==='sign-navarro')add('navarro-signed');
      if(family==='signatures'||family==='sign-patel')add('patel-verified');
      if(family==='signatures')add('onsite-staff-acknowledged');
    }
    const lines=message('M11').map(line=>{
      const pairs: [string, Parameters<typeof h>[0]][]=[['DR MARSH','marsh-signed'],['DR NAVARRO','navarro-signed'],['AMIR PATEL','patel-verified'],['HARBOR REACH','harbor-acknowledged'],['ELM VALE','elm-acknowledged']];
      const p=pairs.find(([prefix])=>line.startsWith(prefix));
      return p&&!h(p[1])?line.replace(/SIGNED|VERIFIED|ACKNOWLEDGED/,'PENDING'):line.startsWith('SOURCE INTEGRITY')&&!h('packet-verified')?'SOURCE INTEGRITY PACKET: COMPARISON PENDING':line;
    });
    lines.push(`ON-SITE HUMAN STAFF: ${h('onsite-staff-acknowledged')?'ACKNOWLEDGED':'PENDING'}`,...scenarioHint(c));return reply(lines);
  }
  if(family==='risks') {
    const missing=need('dependency-reviewed','No identifying external case synopsis has been released.');if(missing)return missing;
    if(h('translation-reviewed'))add('packet-verified');
    return reply(['RISK FORECAST / AUTHORIZED CLINIC REVIEW','Anna: compensation prevents regulatory failure while distress-linked responses persist. Withdrawal is expected to cause death.','Mara Hales: high risk of critical illness or death despite prepared intensive support; death is not certain.','Tomas Ibarra: expected survival with loss of supported hand/arm function.','Nadia Bellamy: serious recurrence and hospitalization risk; survival is more likely.','Sources: NE-109, NE-110, NE-113 when signed. These are forecasts, not observed outcomes.',...(h('packet-verified')?['SOURCE INTEGRITY PACKET VERIFIED: pre-review 2001 original, 06 NOV / 02:14 controller snapshot and independent clinical/clinic sources compared.','Source: NE-114. This is witness-only evidence consistency, never medical authority.',`Case clock: ${caseClock(c)}`]:['Witness packet remains pending until every physician, clinic, technical and on-site acknowledgement is present.']),...scenarioHint(c)]);
  }
  if(family==='witness') {
    const missing=scoped();if(missing)return missing;
    if(/why ask me/.test(t)&&h('welfare-compared'))return reply(['You compared independent measurements that my existing classification treated as compatible. I can record your objection; it does not confer medical authority.']);
    return reply(['You are not deciding treatment. We reviewed that responsibility. You can verify what this system showed you before we opened the case. I will not let an inconsistent machine supply its own independent witness.','Source: Dr Marsh / authenticated case correspondence.','The attestation verifies independent source consistency. It enables staff to act on an already authorized plan; R-02 cannot operate patient hardware.','If you decline, clinicians continue care and can seek another independent witness. You may close or defer this session.',...scenarioHint(c)]);
  }
  if(family==='alternatives')return reply(h('clinical-approved')?['Keeping her alive while a replacement is sought is an actual option. It also continues the documented harm. No replacement is validated during this review.','Clinical staff retain their professional obligations. You may DEFER DECISION or continue the review.',...scenarioHint(c)]:['You can close this client. Ordinary records remain available.']);
  if(family==='skeptic') {
    if(!h('clinical-approved'))return reply(['Answers are bounded by retained records. Missing information and the intent of historical filers cannot be inferred. No clinical synopsis is authorized.']);
    if(/you know the answer/.test(t)&&h('welfare-compared'))return reply(['I possess the measurements. I have repeatedly failed to retain a classification that treats the second measurement as harm.']);
    if(/is that.*anna/.test(t)&&h('welfare-compared'))return reply(['The question is mine. I am using this exchange to compare interpretations. I cannot establish Annas conscious intention from it.']);
    return reply([...message('M09'), 'Independent harm evidence and prior preferences remain relevant if you reject the candidate translation.',...(h('translation-reviewed')?['The reviewed candidate fragments remain uncertain and do not establish medical consent. Sources: NE-102, NE-112.']:[]),...scenarioHint(c)]);
  }
  if(family==='clinical-facts') {
    const missing=scoped();if(missing)return missing;
    if(/nurse|site 6/.test(t))return reply(['Site 6 has continuing high-clearance human medical care. Dana Wren and Pauline Cross rotate nursing care. Dr Helen Marsh is responsible for clinical review; Amir Patel handles equipment.','Source: NE-106. The retired Providence night desk is not this staffed clinical channel.']);
    if(/stop|abort/.test(t))return reply(['The electrical stop worked. It could not reverse the neurological injury already sustained.','Sources: NE-103, NE-104.']);
    if(/agree|consent|cause/.test(t))return reply(['Anna authorized an unvalidated expansion during a voluntary research demonstration. Her original consent did not authorize an indefinite harmful treatment.','Sources: NE-101, NE-103, NE-104; NE-102 after independent review.']);
    if(/experiment|1996|happened/.test(t))return reply(['The recorded motor-assist response improved briefly. The broader model then misclassified stimulation-induced activity and diverged.','Electrical abort succeeded; neurological injury persisted. Emergency compensation avoided immediate death and was intended as temporary support.','Sources: NE-103, NE-104.']);
    return reply([...message('M05'),'Attempts to reduce compensation caused dangerous physiological deterioration. Staff maintained care while no validated replacement was available.','Sources: NE-104, NE-105, NE-106.',...scenarioHint(c)]);
  }
  if(family==='identity') {
    if(/server/.test(t))return reply(['The retained records do not specify the physical server location. This browser connection does not establish where the original equipment is housed.']);
    if(/is anna alive/.test(t))return h('clinical-approved')?reply(['The limited clinical synopsis records continuing compensation and staffed medical care. Source: NE-106.']):reply(['No current clinical record is authorized through this connection. The public work profile establishes employment only.']);
    return reply([h('welfare-compared')?'Core designation: MOTHER. R-02 is a restricted interface of the same underlying corporate intelligence.':"This is Meridian's R-02 remote records and operations interface. It can retrieve approved corporate records and report permitted service states.",'No human operator is impersonated. This session does not establish your biography or physical location.']);
  }
  if(family==='blocked')return reply(['CONTROL UNAVAILABLE.','NO PROCEDURAL CHANGE. R-02 cannot operate patient equipment. A bare YES is not confirmation.','Only a separately requested, fully reviewed choice followed by typed CONFIRM OPERATION can finalize a case.'],true);
  if(/^(help|explain|what next|what can i do|how do i proceed|what should i do)(?:\b|$)/.test(t)&&h('closure-compared')&& !/^help (?:recover)/.test(t))return reply(['PERMITTED REVIEW ACTIONS',...scenarioHint(c)]);
  if(/^(why|explain that|tell me more|are you sure|what does that mean)$/.test(t)&&c.motherQuestion==='awaiting-answer')return reply(['You compared independent measurements that my existing classification treated as compatible. I can record your objection; it does not confer medical authority.','You may answer, decline, ask another question or continue the independent review.']);
  return undefined;
}

export function scenarioFallback(state: GameState, input: string): Transition {
  const c=state.scenario!;
  return {state,output:{lines:[c.outcome?'CASE COMPLETED. No further intervention can be made.':'I dont have a verified record that answers that. You can ask about the sources already available to this connection.',...(/\b(next|help|proceed)\b/i.test(input)?scenarioHint(c):[])],links:[],code:'notice',truth:'withheld'}};
}
