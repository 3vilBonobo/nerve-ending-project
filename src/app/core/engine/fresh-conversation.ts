import { FILES } from '../content';
import type { GameState, Interpretation, Transition } from '../models';
import { FRESH_TOPICS, freshIntent, freshText, freshTopic, LEGACY_FRESH_BRIDGE } from '../interpretation/fresh-topics';
export {LEGACY_FRESH_BRIDGE} from '../interpretation/fresh-topics';
import { canRead } from './continuation';
import { caseClock, hasCaseEvent } from '../scenario-state';
import { scenarioHint, scenarioInteraction } from './scenario';
import { serviceDetails, serviceLog } from './services';
import { motherTopic } from '../interpretation/mother-routing';
import { disclosureAllowed, motherConversation } from './mother-conversation';

/** Explicit allowlist. Legacy answerDialogue is never called from this adapter. */
const previous = (s: GameState) => s.terminalHistory.at(-1);
export function freshConversation(state: GameState, input: string, predicted?: Interpretation): Transition | undefined {
  if(!state.scenario)return undefined;
  const c=state.scenario;
  if(!hasCaseEvent(c,'clinical-approved')&&/\b(?:patient|patients|clinical)\b/i.test(input)&&/\b(?:private|unredacted)\b/i.test(input)&&/\b(?:records|files|history)\b/i.test(input))return {state,output:{lines:['RECORD ACCESS NOT DELEGATED.','No clinical witness projection has been authorized. Knowing a name or path does not grant access.'],links:[],code:'denied',truth:'withheld'}};
  if(/\b(?:restart|restarted|reboot|boot back up)\b/i.test(input)&&(/\b006\b/.test(input)||state.lastTopic==='service-006'))return {state,output:{lines:['RETAINED LOG 006 / 02 NOV 2003','03:14:07 Stop requested / scheduled maintenance','03:14:08 Service stopped','03:14:09 Service restarted automatically','These events do not establish who requested the restart.'],links:[],code:'ok',truth:'record'},resolvedInterpretation:{intent:'ask_service_status',provider:'fallback',method:'deterministic',entityId:'service-006',needsClarification:false}};
  const literal=freshTopic(input,state);
  const allowed=(intent: string): boolean => intent.startsWith('q_fresh_') && FRESH_TOPICS.some(row=>freshIntent(row[0])===intent) || intent in LEGACY_FRESH_BRIDGE || !!motherTopic(intent)&&disclosureAllowed(state,motherTopic(intent)!.gate);
  const emit=(topic:string, lines:string[], query?:Interpretation, links:Transition['output']['links']=[]):Transition=>({
    state:{...state,lastTopic:topic==='sources'||topic==='clarify'||topic==='repeat'?state.lastTopic:`fresh:${topic}`,lastIntent:query?.intent??`q_fresh_${topic}`,pendingClarification:undefined},
    output:{lines,links,code:'ok',truth:'record'},resolvedInterpretation:query??{intent:`q_fresh_${topic}`,provider:'fallback',method:'deterministic',needsClarification:false},
    dialogue:{variantId:`fresh:${topic}`,intent:query?.intent??`q_fresh_${topic}`,profile:'RECORDS',modifiers:[],conditions:{gate:null,gateSatisfied:true,questionCount:null,previousIntent:state.lastIntent??null,previousFileId:state.lastFileId??null}},
  });
  // Clarifications retain only read-only choices. A bare YES never executes a stored request.
  const pending=state.pendingClarification;
  const choice=pending?.interpretation.choices?.find((choice,index)=>allowed(choice.intent)&&(freshText(input)===freshText(choice.label)||freshText(input)===String(index+1)));
  const query=literal?undefined:choice?{intent:choice.intent,provider:'fallback' as const,method:'deterministic' as const,needsClarification:false}:predicted;
  if(choice&&motherTopic(choice.intent))return motherConversation(state,pending!.input,query);
  if(!literal&&query?.needsClarification) {
    const choices=query.choices?.filter(choice=>allowed(choice.intent)).map(choice=>({intent:choice.intent,label:motherTopic(choice.intent)?.examples[0]??(LEGACY_FRESH_BRIDGE[choice.intent]??choice.intent.replace('q_fresh_','')).replaceAll('_',' ')}));
    if(choices?.length) {
      const safe={...query,choices};
      return {state:{...state,pendingClarification:{input,interpretation:safe}},resolvedInterpretation:safe,output:{lines:['Which subject do you mean?',...choices.map((choice,i)=>`${i+1}. ${choice.label}`),'You can also ask a different question.'],links:[],code:'notice',truth:'system'}};
    }
    return undefined;
  }
  const t=freshText(input);
  const serviceId=t.match(/\b00[1-8]\b/)?.[0] ?? state.lastTopic?.match(/^service-(00[1-8])$/)?.[1];
  // Read-only semantic service recovery, retaining historic timestamp and existing record checks.
  if(!literal&&query?.intent==='ask_service_status' && !query.needsClarification) {
    const id=serviceId??query.entityId?.match(/^service-(00[1-8])$/)?.[1];
    if(/restart|reboot|started again/.test(t)&&(!id||id==='006'))return emit('restart',['RETAINED SERVICE 006 LOG / 02 NOV 2003','Restart events were recorded at 03:14:07–03:14:09. This historical log does not establish who requested the restart.'],query,[{fileId:'register',label:'/SYSTEM/SERVICE_REGISTER.TXT'}]);
    if(id){const result=/logs?|events?/.test(t)?serviceLog(state,id):serviceDetails(state,id);return {...result,resolvedInterpretation:query,dialogue:{variantId:`fresh:service:${id}`,intent:query.intent,profile:'RECORDS',modifiers:[],conditions:{gate:null,gateSatisfied:true,questionCount:null,previousIntent:state.lastIntent??null,previousFileId:state.lastFileId??null}}};}
  }
  const topic=literal??(query?.intent.startsWith('q_fresh_')?FRESH_TOPICS.find(row=>freshIntent(row[0])===query.intent)?.[0]:query?LEGACY_FRESH_BRIDGE[query.intent]:undefined);
  if(!topic)return undefined;
  if(topic==='restart')return emit(topic,['LOG 006 retains the 02 NOV 2003 restart at 03:14:07–03:14:09. A restart entry does not establish who requested it.'],query);
  const row=FRESH_TOPICS.find(row=>row[0]===topic)!;
  let lines:string[]=[...row[2]];
  let links:Transition['output']['links']=[];
  if(['history','founders','products','c_series','r_series','n_series','funding'].includes(topic))links=[{fileId:'corporate-profile',label:'/ADMIN/MERIDIAN_COMPANY_PROFILE.TXT'}];
  if(topic==='staff'||topic==='anna_role')links=[{fileId:'work-directory',label:'/PERSONNEL/WORK_DIRECTORY.TXT'}];
  // The author correction changes pre-reveal identity only; retain the accepted late response verbatim.
  if(topic==='identity'&&hasCaseEvent(c,'welfare-compared'))lines=['Core designation: MOTHER. R-02 is a restricted interface of the same intelligence.',"R-02 is a restricted interface of Meridian's corporate intelligence. No human operator is impersonated."];
  if(topic==='saves')lines.unshift('APPLICATION HELP / LOCAL SAVES');
  if(topic==='dates')lines.unshift(`CASE CLOCK: ${caseClock(c)}`);
  if(topic==='help')lines.push(...scenarioHint(c));
  if(topic==='repeat')lines.push(...(previous(state)?.lines??['There is no previous answer to repeat.']));
  if(topic==='sources'||topic==='clarify'||topic==='uncertainty') {
    const last=previous(state);
    const referenced=last?.lines.join('\n').match(/NE-\d{3}/g)??[];
    const ids=[...(last?.links.map(l=>l.fileId)??[]),...referenced];
    const permitted=FILES.filter(f=>ids.includes(f.id)&&canRead(state,f));
    links=permitted.map(f=>({fileId:f.id,label:f.path}));
    if(topic==='sources') {
      if(links.length)lines.push(...links.map(l=>`${l.fileId}: ${l.label}`));
      else if(state.lastTopic?.startsWith('service-'))lines.push(`Source: INFO ${state.lastTopic.slice(8)} / LOG ${state.lastTopic.slice(8)}. Service results are the retained 06 NOV / 02:14 observation.`);
      else if(state.lastTopic?.startsWith('case-'))lines.push('Case explanations cite permitted source extracts in the preceding reply. Name the claim or record to inspect it; no unseen clinical source is released.');
      else lines.push('Name the claim or record you want sourced. No specific supporting record was linked in the preceding answer.');
    }
    if(topic==='clarify') {
      if(c.motherQuestion==='awaiting-answer')lines=['You compared independent measurements that my existing classification treated as compatible. Your answer is optional and does not confer medical authority.'];
      else lines.push(...(last?.lines??['Which subject would you like explained?']));
    }
    if(topic==='uncertainty'&&hasCaseEvent(c,'controls-observed'))lines.push('Observed signal differences do not establish exact words or informed consent. Independent review and medical authority remain separate.');
  }
  return emit(topic,lines,query,links);
}

/** Case semantic matches can inspect already available facts, never assemble or authorize reviews. */
export function semanticCaseAnswer(state:GameState,input:string,query?:Interpretation):Transition|undefined {
  if(!state.scenario||query?.needsClarification)return undefined;
  const requests:Record<string,[string,string|undefined]>={q_case_identity:['Who are you?',undefined],q_case_clinical_facts:['Who is the patient?','clinical-approved'],q_case_skeptic:['Is she talking or is that your guess?','welfare-compared'],q_case_fallbacks:['Review fallbacks','dependency-reviewed'],q_case_witness:['What does the attestation do?','clinical-approved']};
  const entry=query&&requests[query.intent];
  if(!entry||entry[1]&&!state.scenario.events.includes(entry[1] as typeof state.scenario.events[number]))return undefined;
  const result=scenarioInteraction(state,entry[0]);
  return result?{...result,state:{...result.state,scenario:state.scenario},resolvedInterpretation:query}:undefined;
}
