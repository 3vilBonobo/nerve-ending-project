import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import assert from 'node:assert/strict';
await mkdir('tmp/implementation06',{recursive:true});
const path=resolve('tmp/implementation06/inventory.mjs');
await build({stdin:{contents:["export * from './src/app/core/engine/game';","export * from './src/app/core/engine/scenario-playthroughs';","export * from './src/app/core/interpretation/mother-routing';","export * from './src/app/core/content';"].join('\n'),resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:path});
const g=await import(pathToFileURL(path).href);
const pack=JSON.parse(await readFile('docs/narrative/NERVE_ENDING_MOTHER_CONVERSATIONS_AUTHOR_PACK_v1_1.json','utf8'));
const play=(steps,s=g.newGame())=>steps.reduce((s,input)=>g.runInput(s,input).state,s);
const clinical=['COMPARE SERVICES','TRACE NOTIFICATIONS','REPORT DISCREPANCY','REQUEST CLINICAL REVIEW'];
const stages={early:g.newGame(),investigation:play(['COMPARE SERVICES','TRACE NOTIFICATIONS']),clinical:play(clinical),external:play([...clinical,'REVIEW ADAPTIVE REFERENCE']),core:play(g.SCENARIO_REVIEW_PATH),intent:play([...g.SCENARIO_REVIEW_PATH,'RUN BLIND CONTROLS','REQUEST INDEPENDENT REVIEW']),final:play(g.SCENARIO_SIGNED_PATH)};
for(const ending of ['severance','continuation'])stages[ending]=play([ending==='severance'?'SUBMIT SEPARATION WITNESS':'MAINTAIN SUPPORT','CONFIRM OPERATION'],stages.final);
const anchors=new Set(),outputs=new Set(),rows=[];
for(const [stage,original]of Object.entries(stages)){
 const s=play(['What products does Meridian sell?'],original);
 for(const topic of g.MOTHER){
  for(const id of topic.sources)assert(g.FILES.some(f=>f.id===id),`Missing source ID: ${topic.id}/${id}`);
  const input=topic.id==='neconv_ascii_art'?topic.examples[0]:'A classified topic supplied through the read-only interpreter';
  const r=g.runInput(s,input,{intent:topic.intent,provider:'browser-ai',method:'semantic',needsClarification:false});
  const text=r.output.lines.join('\n');outputs.add(text);
  for(const [voice,anchor]of Object.entries(topic.responses))if(r.dialogue?.variantId===`mother:${topic.id}:${voice}`&&text.includes(anchor))anchors.add(topic.id+':'+voice);
  rows.push({stage,topic:topic.id,variant:r.dialogue?.variantId??null,sourceIds:r.output.links.map(l=>l.fileId),code:r.output.code});
 }
}
const all=g.MOTHER.flatMap(t=>Object.keys(t.responses).map(stage=>t.id+':'+stage));
const report={scope:'Dispatch reachability, not independent recognition accuracy. Each topic receives its known read-only intent in normal progressed states, after a public factual turn to leave an active medical report. No fixture input or expected label is trained.',summary:{families:g.MOTHER.length,sourceUtterances:pack.stats.example_utterances,newReferenceExamples:g.MOTHER.reduce((n,t)=>n+t.examples.length,0),sourceAnchors:pack.stats.authored_response_anchors,projectedAnchors:all.length,uniqueSourceAnchorStrings:new Set(pack.topics.flatMap(t=>Object.values(t.responses))).size,uniqueProjectedAnchorStrings:new Set(g.MOTHER.flatMap(t=>Object.values(t.responses))).size,anchorsObservedInDispatchProbes:anchors.size,distinctOutputPackages:outputs.size,probes:rows.length},anchorsObserved:[...anchors],anchorsNotObserved:all.filter(id=>!anchors.has(id)),rows};
await writeFile('docs/IMPLEMENTATION_06_CONVERSATION_INVENTORY.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.summary));
