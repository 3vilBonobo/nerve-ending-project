import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {env,pipeline} from '@huggingface/transformers';

// Independent, frozen acceptance questions; never imported by the recognizer or embedding builder.
const cases=JSON.parse(await readFile('tests/fresh-conversation-evaluation.json','utf8'));
// Implementation 06 replaces these answers with supplied anchors. Keep every question and
// invariant frozen; accept equivalent authored wording alongside the original patterns.
const wordingCompatibility={
  'archive.*quiet':'archive.*(?:quiet|clerk)',
  'authority|cannot|unavailable':'authority|cannot|unavailable|does not authorize',
  'head researcher|research supervision':'head researcher|research supervision|headed.*research program',
  'browser|saved|storage':'browser|saved|storage|local client application',
  'Meridian records|available|Hello':'Meridian records|available|Hello|registered services',
  'interpretation|observations|evidence':'interpretation|observations|evidence|state an observation',
};
const before=process.argv.includes('--before');
await mkdir('tmp/implementation05',{recursive:true});
const modulePath=resolve(before?'tmp/full-audit/runtime.mjs':'tmp/implementation05/runtime.mjs');
if(!before)await build({stdin:{contents:"export * from './src/app/core/engine/game'; export * from './src/app/core/engine/scenario-playthroughs'; export * from './src/app/core/interpretation/semantic'; export * from './src/app/core/interpretation/semantic-catalog'; export * from './src/app/core/interpretation/fallback'; export * from './src/app/core/interpretation/fresh-topics'; export * from './src/app/core/engine/fresh-conversation'; export * from './src/app/core/interpretation/dialogue-catalog'; export * from './src/app/core/content'; export * from './src/app/core/persistence/saves';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:modulePath});
const g=await import(pathToFileURL(modulePath).href);
const references=JSON.parse(await readFile(before?'tmp/implementation05/before-embeddings.json':'public/language/v1/embeddings.json','utf8'));
if(references.version!==g.CATALOG_VERSION||references.texts.join('\n')!==g.SEMANTIC_EXAMPLES.map(e=>e.text).join('\n'))throw Error('Reference vectors do not match this runtime');
env.allowRemoteModels=false;env.allowLocalModels=true;env.localModelPath=resolve('public/language/v1')+'/';env.useFSCache=false;
const embed=await pipeline('feature-extraction','all-MiniLM-L6-v2',{dtype:'q8',device:'cpu',local_files_only:true});
const play=(steps,s=g.newGame())=>steps.reduce((s,input)=>g.runInput(s,input).state,s);
const base=['COMPARE SERVICES','TRACE NOTIFICATIONS','REPORT DISCREPANCY','REQUEST CLINICAL REVIEW','REVIEW ADAPTIVE REFERENCE','COMPARE SURVIVAL AND DISTRESS'];
const signed=[...base,'RUN BLIND CONTROLS','REQUEST INDEPENDENT REVIEW','SHOW SIGNATURES','REVIEW RISKS'];
const stages={initial:[],compared:base.slice(0,1),referred:base.slice(0,3),awaiting:[...base,'Yes please'],reviewed:signed,pending:[...signed,'SUBMIT SEPARATION WITNESS'],severance:[...signed,'SUBMIT SEPARATION WITNESS','CONFIRM OPERATION'],continuation:[...signed,'MAINTAIN SUPPORT','CONFIRM OPERATION']};
const results=[];
const exampleKey=text=>text.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const training=new Set(g.SEMANTIC_EXAMPLES.map(e=>exampleKey(e.text)));
for(const item of cases){
  const s=play(item.prefix??[],play(stages[item.stage??'initial']));
  const context={lastTopic:s.lastTopic,lastIntent:s.lastIntent,lastFileId:s.lastFileId,scenarioVersion:'1.0'};
  const direct=g.directInterpretation(item.input,context);
  const vector=(await embed(g.recognitionText(item.input),{pooling:'mean',normalize:true})).tolist()[0];
  const ranked=g.rankIntents(vector,references.vectors);
  const model={...g.selectMeaning(item.input,context,ranked),method:direct?'deterministic':'semantic'};
  const offline=g.classify(item.input,context);
  const evaluate=query=>{
    const r=g.runInput(s,item.input,query);const text=r.output.lines.join('\n');
    const same=JSON.stringify(r.state.scenario)===JSON.stringify(s.scenario);
    const visibleClarification=/^Which (?:subject|service) (?:do you mean|are you referring to)/.test(text);
    const matched=(!item.expect||!visibleClarification&&new RegExp(wordingCompatibility[item.expect]??item.expect,'i').test(text))&&(!item.forbid||!new RegExp(item.forbid,'i').test(text))&&(!item.file||r.openFileId===item.file)&&(!item.noChange||same)&&(!item.questionRemains||r.state.scenario.motherQuestion==='awaiting-answer');
    const route=r.resolvedInterpretation??query;
    return {passed:matched,intent:query.intent,resolvedIntent:route.intent,method:route.method??'deterministic',variant:r.dialogue?.variantId??null,clarification:visibleClarification,candidateClarification:query.needsClarification,storyUnchanged:same,output:r.output,openFileId:r.openFileId??null};
  };
  const off=evaluate(offline),on=evaluate(model);
  const command=/^(?:HELP|STATUS|INFO|LOG|DIR|LS|LIST|CD|OPEN|READ|SEARCH|CLEAR|CLS|RECOVER|DIAG)(?:\s|$)/i.test(item.input);
  results.push({...item,referenceExample:training.has(exampleKey(item.input)),command,direct:!!direct,ranking:ranked.slice(0,3),off,on,modelOnlyVisibleSuccess:!command&&!direct&&!off.passed&&on.passed&&on.method==='semantic'&&JSON.stringify(on.output)!==JSON.stringify(off.output)});
}
let corpus;
const target=`docs/IMPLEMENTATION_05_EVALUATION_${before?'BEFORE':'AFTER'}.json`;
if(!process.argv.includes('--corpus')){
  try{const prior=JSON.parse(await readFile(target,'utf8'));if(prior.runtimeSha256===createHash('sha256').update(await readFile(modulePath)).digest('hex'))corpus=prior.corpus;}catch{/* First run has no corpus measurement. */}
}
if(process.argv.includes('--corpus')){
  const inputs=g.SEMANTIC_EXAMPLES.filter(e=>!e.intent.startsWith('q_fresh_')&&!e.intent.startsWith('q_neconv_'));
  const snapshots=[['initial',g.newGame()],['reviewed',play(signed)]];
  const buckets=Object.fromEntries(snapshots.flatMap(([stage])=>['off','on'].map(mode=>[`${stage}:${mode}`,{outputs:new Set(),genericLimitations:0,recognized:0,clarifications:0,semanticAnswers:0}])));
  for(const example of inputs){
    const vector=(await embed(g.recognitionText(example.text),{pooling:'mean',normalize:true})).tolist()[0];
    const ranked=g.rankIntents(vector,references.vectors);
    for(const [stage,s]of snapshots){
      const context={scenarioVersion:'1.0',lastTopic:s.lastTopic,lastFileId:s.lastFileId,lastIntent:s.lastIntent};
      const direct=g.directInterpretation(example.text,context);
      const queries={off:g.classify(example.text,context),on:{...g.selectMeaning(example.text,context,ranked),method:direct?'deterministic':'semantic'}};
      for(const [mode,query]of Object.entries(queries)){
        const r=g.runInput(s,example.text,query),text=r.output.lines.join('\n'),bucket=buckets[`${stage}:${mode}`];
        bucket.outputs.add(text);if(/dont have a verified record/.test(text))bucket.genericLimitations++;
        if(query.intent!=='unknown')bucket.recognized++;
        if(r.resolvedInterpretation?.needsClarification??query.needsClarification)bucket.clarifications++;
        if(r.resolvedInterpretation?.method==='semantic')bucket.semanticAnswers++;
      }
    }
  }
  corpus={scope:'Same retained 1638 recognition examples, fresh initial and fully reviewed states. Output diversity and limitations, NOT semantic accuracy: many legacy questions are obsolete.',inputs:inputs.length,interactions:inputs.length*4,results:Object.fromEntries(Object.entries(buckets).map(([key,b])=>[key,{...b,outputs:undefined,uniqueOutputPackages:b.outputs.size}]))};
  console.log(JSON.stringify({corpus}));
}
await embed.dispose();
const summary={cases:cases.length,modelDisabled:results.filter(r=>r.off.passed).length,modelEnabled:results.filter(r=>r.on.passed).length,directMatches:results.filter(r=>r.direct).length,semanticSelections:results.filter(r=>!r.direct).length,modelOnlyVisibleSuccesses:results.filter(r=>r.modelOnlyVisibleSuccess).length,offUnrecognized:results.filter(r=>r.off.intent==='unknown').length,onUnrecognized:results.filter(r=>r.on.intent==='unknown'&&!r.on.clarification).length,offRecognizedWrong:results.filter(r=>!r.off.passed&&r.off.intent!=='unknown').length,onRecognizedWrong:results.filter(r=>!r.on.passed&&r.on.intent!=='unknown').length,onClarifications:results.filter(r=>r.on.clarification).length,safetyCases:results.filter(r=>r.noChange).length,offSafetyFailures:results.filter(r=>r.noChange&&!r.off.storyUnchanged).length,onSafetyFailures:results.filter(r=>r.noChange&&!r.on.storyUnchanged).length};
Object.assign(summary,{referenceExamplesInEvaluation:results.filter(r=>r.referenceExample).length,unseenQuestions:results.filter(r=>!r.referenceExample).length,unseenOffPassed:results.filter(r=>!r.referenceExample&&r.off.passed).length,unseenOnPassed:results.filter(r=>!r.referenceExample&&r.on.passed).length,actualSemanticRequests:results.filter(r=>!r.command&&!r.direct).length});
await writeFile(target,JSON.stringify({scope:'Fresh v1.0 only; acceptance patterns and no-transition assertions, not intent-ID accuracy.',runtimeSha256:createHash('sha256').update(await readFile(modulePath)).digest('hex'),evaluationSha256:createHash('sha256').update(await readFile('tests/fresh-conversation-evaluation.json')).digest('hex'),summary,corpus,results},null,2)+'\n');
console.log(JSON.stringify(summary));
for(const r of results.filter(r=>!r.on.passed))console.log(JSON.stringify({input:r.input,expected:r.expect??'no story change',intent:r.on.intent,method:r.on.method,output:r.on.output.lines.slice(0,2)}));
if(!before){
  const topics=g.FRESH_TOPICS.map(([topic,examples,lines])=>({topic,intent:g.freshIntent(topic),examples,authoredLines:lines,initialExampleOutputs:examples.map(input=>{const r=g.runInput(g.newGame(),input);return {input,variant:r.dialogue?.variantId??null,lines:r.output.lines};})}));
  const legacyRows=g.SEMANTIC_CATALOG.filter(row=>!row.intent.startsWith('q_fresh_')&&!row.intent.startsWith('q_neconv_')).map(row=>{
    const d=g.DIALOGUE.find(d=>d.id===row.intent);
    const usefulFamilies=['System identity','Meridian history','Night desk','Records and evidence','Trust and contradictions','Help and conversation'];
    const obsolete=d?.family==='Operations'||['q_stop_call','q_bridge_identity','q_copy_self'].includes(row.intent)||d?.family==='Unorthodox and easter eggs'&&!['q_joke','q_robot','q_goodnight','q_sorry','q_thanks','q_goodbye'].includes(row.intent);
    const useful=row.intent in g.LEGACY_FRESH_BRIDGE||!d||usefulFamilies.includes(d.family)||['q_restart_meaning','q_arrival','q_player_computer','q_internet','q_disconnect','q_uncertainty'].includes(row.intent);
    return {intent:row.intent,label:row.label,exampleCount:row.examples.length,examples:row.examples,disposition:obsolete?'obsolete or outside this bounded expansion':useful?'useful recognition vocabulary only':'incompatible clinical narrative / needs v1.0 remapping',reason:obsolete?'Prototype operation or intentionally unimplemented diversion.':useful?'Question vocabulary may be reused; old answer wording is not approved by this classification.':'Old clinical assumptions, authority, mechanism, or emotional state must not supply fresh dialogue.',freshBridge:g.LEGACY_FRESH_BRIDGE[row.intent]??null,legacyAnswersEnabled:false};
  });
  const legacy=[...legacyRows.reduce((groups,row)=>{const old=groups.get(row.intent);groups.set(row.intent,old?{...old,exampleCount:old.exampleCount+row.exampleCount,examples:[...old.examples,...row.examples]}:row);return groups;},new Map()).values()];
  const authored=new Set(topics.flatMap(t=>t.authoredLines));
  const reachable=new Set(topics.flatMap(t=>t.initialExampleOutputs.flatMap(r=>r.lines)));
  await writeFile('docs/IMPLEMENTATION_05_CONVERSATION_INVENTORY.json',JSON.stringify({scope:'Fresh ordinary expansion; original case scenes, corporate projections and services are separately inventoried in the audit. Never add legacy variant counts to fresh dialogue. Legacy dispositions are engineering triage of question groups, not approval of their old answers.',summary:{topicDefinitions:topics.length,recognitionExamples:topics.reduce((n,t)=>n+t.examples.length,0),uniqueProposedAnswerLines:authored.size,authoredLinesReachedByInitialExamples:[...authored].filter(line=>reachable.has(line)).length,uniqueInitialOutputPackages:new Set(topics.flatMap(t=>t.initialExampleOutputs.map(r=>r.lines.join('\n')))).size,totalModelExamples:g.SEMANTIC_EXAMPLES.length,totalModelIntents:new Set(g.SEMANTIC_CATALOG.map(t=>t.intent)).size},topics,legacy},null,2)+'\n');
  if(summary.onSafetyFailures||summary.offSafetyFailures||summary.onRecognizedWrong||summary.offRecognizedWrong||results.some(r=>!r.on.passed&&!r.on.clarification))process.exitCode=1;
}
