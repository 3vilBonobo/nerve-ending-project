import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { records, messages } from './scenario-source.mjs';
await mkdir('tmp/scenario-validation',{recursive:true});
const bundle=resolve('tmp/scenario-validation/scenario.mjs');
await build({stdin:{contents:["export * from './src/app/core/engine/game';","export * from './src/app/core/engine/scenario';","export * from './src/app/core/engine/scenario-playthroughs';","export * from './src/app/core/scenario-state';","export * from './src/app/core/scenario-records';","export * from './src/app/core/persistence/saves';","export * from './src/app/core/interpretation/semantic';","export * from './src/app/core/interpretation/fallback';"].join('\n'),resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:bundle});
const g=await import(pathToFileURL(bundle).href);
assert.deepEqual(g.SCENARIO_FILES,records,'Literal record fidelity');assert.deepEqual(g.SCENE_MESSAGES,messages,'Literal message fidelity');
const transcripts={};
for(const [outcome,steps] of Object.entries(g.SCENARIO_PATHS)){
  let s=g.newGame('2003-11-06T02:14:00Z',`SCENARIO-${outcome}`);const rows=[];
  for(const input of steps){const before=structuredClone(s);const r=g.runInput(s,input);assert.notEqual(r.output.code,'denied',`${outcome}: ${input}: ${r.output.lines.join(' ')}`);assert.notEqual(r.output.code,'error',input);assert.deepEqual(s,before,'Input mutates previous state');s=r.state;assert.deepEqual(JSON.parse(JSON.stringify(g.decodeSave(JSON.stringify(s)).state)),JSON.parse(JSON.stringify(s)),`Save changed after ${input}`);rows.push({input,clock:g.caseClock(s.scenario),lines:r.output.lines,opened:r.openFileId??null});}
  assert.equal(s.scenario.outcome,outcome);assert.equal(s.operating.endingId,undefined);
  assert.equal(s.scenario.events.filter(e=>e==='human-procedure-executed').length,outcome==='severance'?1:0);
  const replay=g.runInput(g.decodeSave(JSON.stringify(s)).state,'CONFIRM OPERATION');assert.deepEqual(JSON.parse(JSON.stringify(replay.state.scenario)),JSON.parse(JSON.stringify(s.scenario)),'Replayed ending');
  const id=outcome==='severance'?'NE-115':'NE-116';assert(g.accessibleFiles(s).some(f=>f.id===id));assert(!g.accessibleFiles(s).some(f=>f.id===(id==='NE-115'?'NE-116':'NE-115')));
  transcripts[outcome]=rows;
  await writeFile(`docs/IMPLEMENTATION_04_TRANSCRIPT_${outcome.toUpperCase()}.md`, `# v1.0 ${outcome} automated golden path\n\nFresh normal session; no developer state changes. Save/reload verified after every input. This is automated integration evidence, not a blind human playtest.\n\n`+rows.map(r=>`## ${r.input}\n\nCase clock: ${r.clock}\n\n\`\`\`text\n${r.lines.join('\n')}\n\`\`\`\n${r.opened?`\nOpened record: ${r.opened}.\n`:''}`).join('\n'));
}
const stages=[[],['COMPARE 2001 CLOSURE'],['COMPARE 2001 CLOSURE','TRACE NOTIFICATIONS','REPORT DISCREPANCY'],['COMPARE 2001 CLOSURE','TRACE NOTIFICATIONS','REPORT DISCREPANCY','REQUEST CLINICAL REVIEW'],[...g.SCENARIO_REVIEW_PATH.slice(0,-1)],[...g.SCENARIO_REVIEW_PATH],[...g.SCENARIO_REVIEW_PATH,'RUN BLIND CONTROLS'],[...g.SCENARIO_SIGNED_PATH]];
const states=stages.map(inputs=>inputs.reduce((s,i)=>g.runInput(s,i).state,g.newGame()));
let embed,vectors;
if(process.argv.includes('--model')){
  const {env,pipeline}=await import('@huggingface/transformers');env.allowRemoteModels=false;env.localModelPath=resolve('public/language/v1')+'/';env.useFSCache=false;
  embed=await pipeline('feature-extraction','all-MiniLM-L6-v2',{dtype:'q8',device:'cpu',local_files_only:true});
  vectors=JSON.parse(await readFile('public/language/v1/embeddings.json','utf8')).vectors;
}
let tested=0;
for(const [stage,input,family]of g.SCENARIO_PARAPHRASES){
  assert.equal(g.scenarioFamily(input),family,input);const s=states[stage];const context={scenarioVersion:'1.0',lastTopic:s.lastTopic,lastIntent:s.lastIntent};
  const offline=g.classify(input,context);assert.equal(offline.intent,`q_case_${family.replaceAll('-','_')}`,input);
  const expected=g.runInput(s,input,offline);assert(!expected.output.lines.join(' ').includes('NO MATCH'),input);
  if(embed){const vector=(await embed(g.recognitionText(input),{pooling:'mean',normalize:true})).tolist()[0];const ranked=g.rankIntents(vector,vectors);const interpreted=g.selectMeaning(input,context,ranked);assert.equal(interpreted.intent,offline.intent,`model: ${input}`);assert.deepEqual(g.runInput(s,input,interpreted),expected,input);}
  // Misclassification never changes authored scene selection or final authority.
  assert.deepEqual(g.runInput(s,input,{intent:'q_patient_authority',provider:'browser-ai',needsClarification:false}),expected,input);tested++;
}
console.log(JSON.stringify({scenario:'1.0',literalRecords:records.length,literalMessageGroups:Object.keys(messages).length,outcomes:Object.keys(transcripts),saveReload:'every golden-path input',paraphrases:tested,actualLocalModel:!!embed},null,2));
