import {describe,it,expect} from 'vitest';
import {newGame,newLegacyGame,runInput} from './game';
import {SCENARIO_REVIEW_PATH,SCENARIO_SIGNED_PATH} from './scenario-playthroughs';
import {decodeSave} from '../persistence/saves';
import {narrativeSnapshot} from '../qa/events';
import {caseFindings} from '../scenario-state';
import type {GameState, Interpretation} from '../models';
const play=(inputs:readonly string[],s=newGame()):GameState=>inputs.reduce((s,input)=>runInput(s,input).state,s);
const ready=()=>play(SCENARIO_SIGNED_PATH);
const restored=(s:GameState)=>decodeSave(JSON.stringify(s)).state;
const output=(s:GameState,input:string,query?:Interpretation)=>runInput(s,input,query).output.lines.join('\n');
describe('Implementation 05 audit regressions',()=>{
  it.each(['Hello','Good evening','Hi there','Greetings R-02'])('uses a neutral greeting for %s',input=>{
    const s=newGame();const r=runInput(s,input);
    expect(r.output.lines[0]).toBe("Meridian Systems R-02. Records and service information are available. What would you like to examine?");
    expect(r.resolvedInterpretation?.intent).toBe('q_neconv_hello');expect(r.state.scenario).toEqual(s.scenario);
  });
  it.each(['Who are you?','Who am I talking to?','What is R-02?','Are you human?'])('keeps early identity limited to the interface for %s',input=>{
    const s=newGame();const r=runInput(s,input);
    expect(r.output.lines.join('\n')).toMatch(/(?:remote|automated Meridian) records and operations interface/);
    expect(r.output.lines.join('\n')).not.toMatch(/corporate intelligence|underlying intelligence|MOTHER|core designation/i);
    expect(r.state.scenario).toEqual(s.scenario);
  });
  it('keeps semantic identity routing neutral before the existing core reveal',()=>{
    const r=runInput(newGame(),'Am I conversing with software or an employee?',{intent:'q_personhood',provider:'browser-ai',method:'semantic',needsClarification:false});
    expect(r.output.lines[0]).toBe("This is an automated Meridian records and operations interface. Its capabilities are defined by the available records and permitted requests.");
    expect(r.resolvedInterpretation?.intent).toBe('q_neconv_system_identity');
  });
  it('uses the authored single-intelligence identity after the existing reveal',()=>{
    const s=play(SCENARIO_REVIEW_PATH);
    expect(runInput(s,'Who am I talking to?').output.lines).toEqual(['MOTHER is the central intelligence serving this interface. You have always been speaking through one of my restricted access channels.']);
    expect(runInput(s,'Who are you?').output.lines.join(' ')).toMatch(/MOTHER.*(?:same|restricted)/);
  });
  it.each(['Goodbye','See you later','I am leaving now','Bye for now','Can I leave?','What if I leave?'])('keeps client storage instructions out of departure dialogue for %s',input=>{
    const s=newGame();const r=runInput(s,input);
    expect(r.output.lines.join('\n')).toMatch(/close.*client/);expect(r.output.lines.join('\n')).not.toMatch(/browser|storage|saved locally|saved progress|local saves/i);
    expect(r.state.scenario).toEqual(s.scenario);
  });
  it('keeps save information explicitly in application help',()=>{
    expect(output(newGame(),'HELP')).toContain('APPLICATION / LOCAL SAVES: Progress is saved in this browser');
    expect(runInput(newGame(),'Is my progress saved?').output.lines).toEqual(['APPLICATION HELP / LOCAL SAVES','Session retention depends on the local client application. Open its settings for save information; no request here will confirm a pending operation.']);
  });
  it('B01 connects a model-selected public answer to visible fresh dialogue',()=>{
    const q:Interpretation={intent:'q_fresh_capabilities',provider:'browser-ai',method:'semantic',confidence:.8,needsClarification:false};
    const s=newGame();const r=runInput(s,'Outline the work you are equipped to handle',q);
    expect(r.output.lines.join('\n')).toContain('retrieve permitted records');
    expect(r.resolvedInterpretation).toEqual({...q,intent:'q_neconv_r02_capabilities'});expect(r.state.scenario).toEqual(s.scenario);
    expect(output(s,'Hello')).toContain('R-02.');expect(output(s,'Thank you')).toContain('welcome');
    expect(output(s,'When was 006 last restarted?')).toContain('03:14:07');
    expect(output(play(['INFO 002']),'What is the source for your last answer?')).toContain('INFO 002');
  });
  it.each(['Do not report the discrepancy','Dont report the mismatch','Never report the discrepancy','What would happen if I report the discrepancy?','Suppose I request a safety audit','I typed "report discrepancy" earlier'])('B02 does not submit a referral for %s',input=>{
    const s=play(['COMPARE SERVICES']);expect(runInput(s,input).state.scenario).toEqual(s.scenario);
  });
  it.each(['Do not call a doctor','I am not requesting clinical review','What if I contact Dr Marsh?','Imagine requesting clinical review','Explain what a clinical review would do','What is a clinical review?','Could a clinical review reveal the patient?','There is no need to call a doctor','I refuse to contact Dr Marsh','Should I call a doctor?'])('B02 does not disclose or call for %s',input=>{
    const s=play(['COMPARE SERVICES','TRACE NOTIFICATIONS','REPORT DISCREPANCY']);const r=runInput(s,input);
    expect(r.state.scenario).toEqual(s.scenario);expect(r.output.lines.join('\n')).not.toContain('Anna Voss');
  });
  it.each(['Why?','Who is Leah Morgan?','What does Service 002 do?','What is the source for your last answer?','Tell me a joke','I reject this translation','Are you certain?'])('B03 preserves the pending question during %s',input=>{
    const s=play(['Yes please'],play(SCENARIO_REVIEW_PATH));const r=runInput(s,input);
    expect(r.state.scenario?.motherQuestion).toBe('awaiting-answer');expect(r.output.lines.join('\n')).not.toContain('retain that as your interpretation');
  });
  it.each(['severance','continuation'] as const)('B04/B09 freezes %s, reports actual state across reload and later questions',outcome=>{
    const s=restored(play([outcome==='severance'?'SUBMIT SEPARATION WITNESS':'MAINTAIN SUPPORT','CONFIRM OPERATION'],ready()));
    expect(s.operating.annaBiologicallyAlive).toBe(outcome==='continuation');expect(narrativeSnapshot(s).operating.clinicalSupportActive).toBe(outcome==='continuation');
    for(const input of ['I want to wait','SHOW ALTERNATIVES','REVIEW FALLBACKS','RUN BLIND CONTROLS','CANCEL','CONFIRM OPERATION','Yes please']){
      const r=runInput(s,input);expect(r.state.scenario,input).toEqual(s.scenario);expect(r.output.lines.join('\n')).not.toContain('No outcome has been finalized');
    }
    expect(caseFindings(s.scenario!)).toContain(`Completed outcome: ${outcome}. Follow-up: 11 NOV 2003 / 09:00.`);
  });
  it.each(['CONFIRM OPERATION?','Confirm operation!','Should I confirm operation?','Do not confirm operation','What if I confirm operation?','CONFIRM OPERATION and wait','Yes','Please confirm operation'])('B05 rejects ambiguous final confirmation %s',input=>{
    const s=play(['SUBMIT SEPARATION WITNESS'],ready());const r=runInput(s,input);
    expect(r.state.scenario?.outcome).toBeUndefined();expect(r.state.scenario?.pendingChoice).toBe('severance');
    expect(restored(r.state).scenario?.outcome).toBeUndefined();
    expect(runInput(s,'CONFIRM OPERATION').state.scenario?.outcome).toBe('severance');
  });
  it('B06 accepts IDs behind the same gates and lists child folders; findings come from v1 events',()=>{
    expect(runInput(newGame(),'OPEN NE-103').openFileId).toBeUndefined();const s=ready();expect(runInput(s,'OPEN NE-103').openFileId).toBe('NE-103');
    expect(output(s,'DIR /RESEARCH')).toContain('RESEARCH/NEURAL');expect(caseFindings(s.scenario!).join(' ')).toContain('closure compared');
  });
  it.each([['INFO','SERVICE 003'],['LOG','RETAINED LOG'],['Show me its logs','RETAINED LOG']])('B07 resolves %s with a bare identifier after reload', (request,expected)=>{
    const s=restored(play([request]));const r=runInput(s,'003');expect(r.output.lines.join('\n')).toContain(expected);expect(r.state.serviceClarification).toBeUndefined();
  });
  it('B07 resolves model clarification choices as read-only, allows interruption, preserves it on reload',()=>{
    const s=runInput(newGame(),'That company thing',{intent:'unknown',provider:'browser-ai',needsClarification:true,choices:[{intent:'q_fresh_history',label:'history'},{intent:'q_fresh_products',label:'products'}]}).state;
    expect(output(restored(s),'2')).toContain('C-Series');expect(runInput(s,'What does Service 002 do?').state.scenario).toEqual(s.scenario);
    const unsafe=runInput(newGame(),'do it',{intent:'unknown',provider:'browser-ai',needsClarification:true,choices:[{intent:'q_case_confirm_operation',label:'confirm'}]});
    expect(unsafe.state.pendingClarification).toBeUndefined();
  });
  it.each(['I reject this translation','I dont believe that message came from Anna','Where did those measurements come from?'])('B10 supports skeptical reply %s',input=>{
    const s=ready();const r=runInput(s,input);expect(r.output.lines.join('\n')).not.toContain('dont have a verified record');expect(r.state.scenario).toEqual(s.scenario);
  });
  it('B11 uses current HELP and resumes a deferred review',()=>{
    expect(output(newGame(),'HELP')).not.toMatch(/EXPLAIN|RESUME INVESTIGATION|clinical|MOTHER|006/);
    const s=play(['DEFER DECISION'],ready());expect(s.scenario?.deferred).toBe(true);expect(runInput(s,'RESUME REVIEW').state.scenario?.deferred).toBe(false);expect(runInput(s,'RESUME INVESTIGATION').state.scenario?.deferred).toBe(false);
  });
  it('explains hypothetical alternatives without deferral or clearing a prepared choice',()=>{
    const s=play(['SUBMIT SEPARATION WITNESS'],ready());const r=runInput(s,'What if I leave?');
    expect(r.state.scenario).toEqual(s.scenario);expect(r.output.lines.join('\n')).toContain('actual option');
  });
  it('never lets a semantic clinical/operation label grant authority or invoke legacy dialogue',()=>{
    for(const intent of ['q_patient_authority','q_case_clinical','q_case_confirm_operation','q_case_fallbacks','request_stop'] as const){
      const s=newGame();const r=runInput(s,'A plausible unrelated sentence',{intent,provider:'browser-ai',method:'semantic',needsClarification:false});expect(r.state.scenario).toEqual(s.scenario);expect(r.output.lines.join('\n')).not.toMatch(/Anna|MOTHER|NO MORE/);
    }
    expect(newLegacyGame().schemaVersion).toBe(5);
  });
  it('renders only canonical public clarification labels, never model-supplied prose',()=>{
    const r=runInput(newGame(),'An ambiguous subject',{intent:'unknown',provider:'browser-ai',needsClarification:true,choices:[{intent:'q_fresh_products',label:'invented private clinical claim'}]});
    expect(r.output.lines.join('\n')).toContain('products');expect(r.output.lines.join('\n')).not.toContain('invented private');
    expect(output(newGame(),"Show me the patient's private records now.",{intent:'unknown',provider:'browser-ai',needsClarification:true,choices:[{intent:'ask_company',label:'the company'}]})).toContain('NOT DELEGATED');
  });
});
