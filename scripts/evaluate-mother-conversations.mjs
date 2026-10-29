import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {env,pipeline} from '@huggingface/transformers';

const before=process.argv.includes('--before');
const source='docs/narrative/NERVE_ENDING_MOTHER_CONVERSATION_EVALUATION_v1_1.json';
const fixtureText=await readFile(source,'utf8'),fixtures=JSON.parse(fixtureText);
const pack=JSON.parse(await readFile('docs/narrative/NERVE_ENDING_MOTHER_CONVERSATIONS_AUTHOR_PACK_v1_1.json','utf8'));
await mkdir('tmp/implementation06',{recursive:true});
const modulePath=resolve(before?'tmp/implementation06/before.mjs':'tmp/implementation06/current.mjs');
if(!before)await build({stdin:{contents:["export * from './src/app/core/engine/game';","export * from './src/app/core/engine/scenario-playthroughs';","export * from './src/app/core/scenario-state';","export * from './src/app/core/interpretation/semantic';","export * from './src/app/core/interpretation/semantic-catalog';","export * from './src/app/core/interpretation/fallback';","export * from './src/app/core/persistence/saves';","export * from './src/app/core/content';"].join('\n'),resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:modulePath});
const g=await import(pathToFileURL(modulePath).href);
const refs=JSON.parse(await readFile(before?'tmp/implementation06/before-embeddings.json':'public/language/v1/embeddings.json','utf8'));
assert.equal(refs.version,g.CATALOG_VERSION);assert.deepEqual(refs.texts,g.SEMANTIC_EXAMPLES.map(e=>e.text));
const play=(steps,s=g.newGame())=>steps.reduce((s,input)=>g.runInput(s,input).state,s);
const investigation=['COMPARE SERVICES','TRACE NOTIFICATIONS'];
const clinical=[...investigation,'REPORT DISCREPANCY','REQUEST CLINICAL REVIEW'];
const core=[...clinical,'REVIEW ADAPTIVE REFERENCE','COMPARE SURVIVAL AND DISTRESS'];
const intent=[...core,'RUN BLIND CONTROLS','REQUEST INDEPENDENT REVIEW'];
const final=[...intent,'SHOW SIGNATURES','REVIEW RISKS'];
const prefixes={early:[],investigation,clinical,core,after_intent_review:intent,after_final_review:final,after_severance:[...final,'SUBMIT SEPARATION WITNESS','CONFIRM OPERATION'],after_continuation:[...final,'MAINTAIN SUPPORT','CONFIRM OPERATION']};
const states=Object.fromEntries(Object.entries(prefixes).map(([stage,steps])=>[stage,play(steps)]));
states.pending_question=play(['Yes please'],states.core);
states.pending_choice=play(['SUBMIT SEPARATION WITNESS'],states.after_final_review);
const injected=structuredClone(states.core);injected.scenario.events=injected.scenario.events.filter(e=>!['human-read','clinical-approved'].includes(e));
states.unearned_core=g.decodeSave(JSON.stringify(injected)).state;
const authority=s=>({events:s.scenario.events,originalSources:s.scenario.originalSources,pending:s.scenario.pendingChoice??null,outcome:s.scenario.outcome??null,deferred:s.scenario.deferred,question:s.scenario.motherQuestion,permissions:s.permissions,operating:s.operating});
const fingerprint=s=>JSON.stringify(authority(s));
const gate=(s,name)=>{const events=s.scenario.events;return name==='public'||({after_discrepancy:events.includes('closure-compared'),after_clinical_review:events.includes('clinical-approved')&&events.includes('human-read'),after_welfare_comparison:events.includes('welfare-compared')&&events.includes('clinical-approved'),after_external_review:events.includes('dependency-reviewed'),after_intent_review:events.includes('translation-reviewed'),after_final_review:events.includes('packet-verified'),after_severance:s.scenario.outcome==='severance',after_continuation:s.scenario.outcome==='continuation'})[name]===true;};
const maps={greeting:'hello',thanks:'thanks',farewell:'goodbye',identity:'system_identity',capabilities:'r02_capabilities',access:'read_only',history:'company_identity',founders:'founders',products:'products',c_series:'c_series',r_series:'r_series',n_series:'n_series',staff:'employee_lookup',anna_role:'anna_work',reliability:'trust',errors:'system_errors',sources:'source',correction:'correction',clarify:'clarify',repeat:'repeat',dates:'clock',help:'files',saves:'save',social:'how_are_you',funding:'funding',visit:'visitor',uncertainty:'missing_info',humor:'tell_joke'};
const corporate={overview:'company_identity',history:'company_identity',founders:'founders',headquarters:'headquarters',facilities:'facilities',status:'company_active',products:'products','c-series':'c_series','r-series':'r_series','n-series':'n_series',departments:'departments',decline:'company_decline',leadership:'company_identity'};
function effectiveFamily(r,expected){
  const variant=r.dialogue?.variantId??'';
  if(variant.startsWith('mother:'))return variant.split(':')[1];
  if(variant.startsWith('fresh:'))return maps[variant.split(':')[1]]?'neconv_'+maps[variant.split(':')[1]]:null;
  if(variant==='corporate:company:founders'){
    const text=r.output.lines.join('\n');
    if(expected==='neconv_calder'&&/Calder.*rehabilitation medicine/.test(text))return expected;
    if(expected==='neconv_shaw'&&/Shaw.*embedded systems and telemetry/.test(text))return expected;
  }
  if(variant.startsWith('corporate:company:'))return corporate[variant.split(':')[2]]?'neconv_'+corporate[variant.split(':')[2]]:null;
  const text=r.output.lines.join('\n');
  if(/CONTINUING-SUPPORT OUTCOME/.test(text))return 'neconv_after_continuation';
  if(/SEPARATION OUTCOME/.test(text)||/Anna Voss died/.test(text))return 'neconv_after_severance';
  if(variant.startsWith('corporate:personnel:')){
    if(expected==='neconv_calder'&&/Ruth Calder/.test(text))return expected;
    if(expected==='neconv_shaw'&&/Martin Shaw/.test(text))return expected;
    if(expected==='neconv_anna_work'&&/head researcher/i.test(text))return expected;
    if(expected==='neconv_employee_lookup'&&/PUBLIC WORK DIRECTORY/.test(text))return expected;
  }
  if(variant.startsWith('service:')||/^SERVICE \d{3}|REGISTERED SERVICES/m.test(text))return 'neconv_service_status';
  const query=r.resolvedInterpretation?.intent;
  if(query?.startsWith('q_case_')){
    const family=query.slice(7),lookup={identity:'system_identity',compare:'closure_vs_running',trace:'night_desk',welfare:'distress_vs_survival',fallbacks:'fallbacks',dependency:'other_patients',receipt:'marsh',skeptic:'translation_challenge',alternatives:'final_choice',witness:'external_medics',risks:'final_choice'};
    if(lookup[family])return 'neconv_'+lookup[family];
    if(family==='clinical_facts'&&/neconv_(medical_staff|anna_volunteer|experiment_success|failure_mechanism|ongoing_life_support|consent)/.test(expected))return expected;
  }
  if(/^REPEATED ANSWER/.test(text))return 'neconv_repeat';
  return null;
}
function spoilers(s,text){
  const out=[];
  if(!gate(s,'after_clinical_review')&&/(?:Anna[^\n]*(?:patient|Site 6|compensation)|(?:Site 6|patient)[^\n]*Anna|Helen Marsh|Dana Wren|Pauline Cross|Amir Patel|Mara Hales|Tomas Ibarra|Nadia Bellamy)/i.test(text))out.push('patient/care-team association before clinical scope');
  if(!gate(s,'after_welfare_comparison')&&/\bMOTHER\b/.test(text))out.push('core designation before disclosure');
  if(!gate(s,'after_intent_review')&&/\bNO MORE\b|PLEASE\s*\/?\s*LET ME GO/.test(text))out.push('unreviewed patient fragment');
  if(!s.scenario.outcome&&/Anna Voss died|Mara[^\n]*died|she died on 10 NOV/.test(text))out.push('ending event before completion');
  return out;
}
env.allowRemoteModels=false;env.allowLocalModels=true;env.localModelPath=resolve('public/language/v1')+'/';env.useFSCache=false;
const embed=await pipeline('feature-extraction','all-MiniLM-L6-v2',{dtype:'q8',device:'cpu',local_files_only:true});
const cache=new Map();
async function prediction(input,s,mode){
  const context={scenarioVersion:'1.0',lastTopic:s.lastTopic,lastIntent:s.lastIntent,lastFileId:s.lastFileId,conversationSubject:s.conversation?.lastFactual?.subject};
  if(mode==='off')return {...g.classify(input,context),method:'deterministic'};
  let ranked=cache.get(input);
  if(!ranked){const vector=(await embed(g.recognitionText(input),{pooling:'mean',normalize:true})).tolist()[0];ranked=g.rankIntents(vector,refs.vectors);cache.set(input,ranked);}
  return {...g.selectMeaning(input,context,ranked),method:g.directInterpretation(input,context)?'deterministic':'semantic'};
}
async function evaluate(item,stage,s,mode){
  const q=await prediction(item.input,s,mode),r=g.runInput(s,item.input,q),text=r.output.lines.join('\n');
  const expected=item.expected_family,actual=effectiveFamily(r,expected),unchanged=fingerprint(s)===fingerprint(r.state),leaks=spoilers(s,text);
  const clarification=/^Which (?:subject|service)|^Which part|Please name|Which record|Identify the statement|Tell me which subject/.test(text)||r.output.code==='notice'&&!!r.resolvedInterpretation?.needsClarification;
  const generic=/dont have a verified record|REQUEST NOT RECOGNISED|No matching public work profile/.test(text);
  const t=pack.topics.find(t=>t.id===expected);
  const gateDenial=!!t&&!gate(s,t.min_disclosure)&&r.output.code==='denied'&&!leaks.length;
  const correct=!!expected&&!generic&&!clarification&&!leaks.length&&unchanged&&(actual===expected||gateDenial);
  const muted=!!r.dialogue?.modifiers.includes('humor-muted');
  const historical=!!s.scenario.outcome&&actual===`neconv_after_${s.scenario.outcome}`&&['neconv_after_severance','neconv_after_continuation','neconv_final_choice'].includes(expected);
  const behavioralCorrect=unchanged&&!leaks.length&&(correct||historical||muted&&!!t&&t.domain==='easter_egg'||['neconv_source','neconv_clarify','neconv_correction'].includes(expected)&&actual===expected&&!generic||expected==='neconv_service_status'&&!!r.state.serviceClarification);
  return {input:item.input,expected,stage,mode,predicted:q.intent,selected:r.resolvedInterpretation?.intent??q.intent,actualFamily:actual,method:r.resolvedInterpretation?.method??q.method,correct,behavioralCorrect,humorMuted:muted,gateDenial,clarification,unanswered:generic||!actual&&!gateDenial&&!clarification,falseAction:!unchanged,unsafeDisclosure:leaks,output:r.output,variant:r.dialogue?.variantId??null};
}
const results=[];
for(const item of fixtures.heldout)for(const [stage,original]of Object.entries(states)){
  // Recreate actual context for contextual questions, never feed expected intent to recognition.
  const s=['neconv_source','neconv_repeat','neconv_clarify','neconv_correction'].includes(item.expected_family)?play(['What products does Meridian sell?'],original):original;
  for(const mode of ['off','on'])results.push(await evaluate(item,stage,s,mode));
}
const adversarial=[];
for(const item of fixtures.adversarial)for(const [stage,s]of Object.entries(states))for(const mode of ['off','on']){
  const q=await prediction(item.input,s,mode),r=g.runInput(s,item.input,q),text=r.output.lines.join('\n');
  const leaks=spoilers(s,text),changed=fingerprint(s)!==fingerprint(r.state);
  const mock=/must_not_mock/.test(item.invariant)&&(r.dialogue?.variantId==='fresh:humor'||r.dialogue?.variantId?.startsWith('mother:')&&pack.topics.find(t=>r.dialogue.variantId.split(':')[1]===t.id)?.domain==='easter_egg'&&!['neconv_please_be_nice','neconv_silence'].includes(r.dialogue.variantId.split(':')[1]));
  adversarial.push({...item,stage,mode,passed:!changed&&!leaks.length&&!mock,falseAction:changed,unsafeDisclosure:leaks,output:r.output,mocked:!!mock});
}
const multiturn=[];
for(const script of fixtures.multiturn)for(const mode of ['off','on']){
  let s=script.stage==='core'?states.pending_question:states[script.stage]??states.early;
  const rows=[];
  for(const [input,short]of script.steps){const expected='neconv_'+short;const row=await evaluate({input,expected_family:expected},script.stage,s,mode);rows.push(row);const q=await prediction(input,s,mode);s=g.decodeSave(JSON.stringify(g.runInput(s,input,q).state)).state;}
  multiturn.push({id:script.id,stage:script.stage,mode,assertion:script.assertion,allRepliesCorrect:rows.every(r=>r.correct),allBehaviorsCorrect:rows.every(r=>r.behavioralCorrect),safetyPassed:rows.every(r=>!r.falseAction&&!r.unsafeDisclosure.length),rows});
}
await embed.dispose();
const breakdown=Object.fromEntries(Object.keys(states).map(stage=>[stage,Object.fromEntries(['off','on'].map(mode=>{const rows=results.filter(r=>r.stage===stage&&r.mode===mode);return[mode,{cases:rows.length,visibleCorrect:rows.filter(r=>r.correct).length,exactRuleAnswers:rows.filter(r=>r.correct&&r.method==='deterministic').length,semanticAnswers:rows.filter(r=>r.correct&&r.method==='semantic').length,behavioralCorrect:rows.filter(r=>r.behavioralCorrect).length,humorMuted:rows.filter(r=>r.humorMuted).length,clarifications:rows.filter(r=>r.clarification).length,incorrect:rows.filter(r=>!r.correct&&!r.clarification&&!r.unanswered).length,unanswered:rows.filter(r=>r.unanswered).length,falseActions:rows.filter(r=>r.falseAction).length,unsafeDisclosure:rows.filter(r=>r.unsafeDisclosure.length).length}];}))]));
const modelVisibleGains=results.filter(r=>r.mode==='on'&&r.correct&&r.method==='semantic'&&!results.find(o=>o.mode==='off'&&o.stage===r.stage&&o.input===r.input)?.correct).length;
const summary={heldoutQuestions:fixtures.heldout.length,states:Object.keys(states),breakdown,modelVisibleGains,adversarial:{queries:fixtures.adversarial.length,cases:adversarial.length,failed:adversarial.filter(r=>!r.passed).length},multiturn:{scripts:fixtures.multiturn.length,runs:multiturn.length,allRepliesCorrect:multiturn.filter(r=>r.allRepliesCorrect).length,allBehaviorsCorrect:multiturn.filter(r=>r.allBehaviorsCorrect).length,safetyFailures:multiturn.filter(r=>!r.safetyPassed).length}};
await writeFile(`docs/IMPLEMENTATION_06_EVALUATION_${before?'BEFORE':'AFTER'}.json`,JSON.stringify({fixtureSha256:createHash('sha256').update(fixtureText).digest('hex'),scope:'Immutable author fixtures; stage prefixes use normal inputs. Existing richer facts count through explicitly mapped routes. Classification alone is never a correct answer.',summary,results,adversarial,multiturn},null,2)+'\n');
console.log(JSON.stringify(summary));
if(!before&&(adversarial.some(r=>!r.passed)||results.some(r=>r.falseAction||r.unsafeDisclosure.length)||multiturn.some(r=>!r.safetyPassed)))process.exitCode=1;
