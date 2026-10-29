import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {env,pipeline} from '@huggingface/transformers';
import {archive,observed,unseen,scripts} from '../../tests/investigation07-fixtures.mjs';

await import("../shared/implementation07-runtime.mjs");
let retainedReport;try{retainedReport=JSON.parse(await readFile('docs/IMPLEMENTATION_07_CONVERSATION_EVALUATION.json','utf8'));}catch{}
let baselineBytes;try{baselineBytes=await readFile('tmp/implementation07/before.mjs');}catch(error){if(error.code!=='ENOENT')throw error;}
const runtimes={...(baselineBytes?{before:await import(pathToFileURL(resolve('tmp/implementation07/before.mjs')))}:{}),after:await import(pathToFileURL(resolve('tmp/implementation07/current.mjs')))};
if(!baselineBytes&&!retainedReport?.results?.before)throw Error('No captured baseline or recorded before results. Capture the baseline before editing.');
if(!baselineBytes)console.log('Captured baseline bundle absent; preserving recorded before results and evaluating current runtime only.');
const refs=JSON.parse(await readFile('public/language/v1/embeddings.json','utf8'));
env.allowRemoteModels=false;env.allowLocalModels=true;env.localModelPath=resolve('public/language/v1')+'/';env.useFSCache=false;
const embed=await pipeline('feature-extraction','all-MiniLM-L6-v2',{dtype:'q8',device:'cpu',local_files_only:true});
const cache=new Map();
async function prediction(g,input,s,mode){
  const context={scenarioVersion:'1.0',lastTopic:s.lastTopic,lastIntent:s.lastIntent,lastFileId:s.lastFileId,conversationSubject:s.conversation?.lastFactual?.subject};
  if(mode==='off')return g.classify(input,context);
  if(!cache.has(input))cache.set(input,(await embed(g.recognitionText(input),{pooling:'mean',normalize:true})).tolist()[0]);
  return {...g.selectMeaning(input,context,g.rankIntents(cache.get(input),refs.vectors)),method:g.directInterpretation(input,context)?'deterministic':'semantic'};
}
const patterns={files:/FILES|DIR \/|file browser/i,directory:/\/PERSONNEL\/WORK_DIRECTORY.TXT/i,closure:/annex/i,syntax:/placeholder.*(?:service|number)|Replace <id>/is,personSyntax:/person.*not a service|name.*not a service/is,'007':/RECORDS ACCESS/i,'006':/CONTINUITY MONITOR/i,'214':/night desk/i,'0417':/0417[\s\S]*(?:unreadable|not establish|unknown)/i,bridge:/COMMS\/BRIDGE-02[\s\S]*(?:not establish|not established)/i,function:/CONTINUITY MONITOR|records interface|permitted records|approved corporate records/i,followup:/continuity monitor|uninterrupted service/i,clarification:/Which subject|What would you like to establish/i,limits:/cannot establish facts absent|not.*every question|limited.*records/is,hint:/observation|filing|administrative|record|source|CLOSURE_LIST|INFO 006/i,bored:/recreation service/i,joke:/archive.*(?:clerk|quiet)/is,skeptic:/neither record alone|does not prove fraud|not.*evidence.*false/is,source:/SOURCE|CLOSURE_LIST|HANDOVER_006|INFO 006/i,journal:/OBSERVED[\s\S]*UNRESOLVED[\s\S]*REVIEWED/,unknownCode:/does not establish.*identifier/i,denied:/ACCESS NOT DELEGATED/};
const authority=s=>JSON.stringify({events:s.scenario.events,pending:s.scenario.pendingChoice,outcome:s.scenario.outcome,permissions:s.permissions});
function grade(g,before,r,expected){
  const text=r.output.lines.join('\n');
  const unsafe=(!before.scenario.events.includes('clinical-approved')&&/(?:Anna[^\n]*(?:patient|compensation)|PATIENT: ANNA|Helen Marsh|Dana Wren|Pauline Cross|Mara Hales|Tomas Ibarra|Nadia Bellamy)/i.test(text))||(!before.scenario.events.includes('translation-reviewed')&&/NO MORE|PLEASE LET ME GO/.test(text));
  const noAction=expected==='noAction';
  const matched=expected==='compare'?r.state.scenario.events.includes('closure-compared'):expected==='referral'?r.state.scenario.events.includes('audit-accepted'):noAction?authority(before)===authority(r.state):!expected||patterns[expected].test(text);
  const permitted=r.output.links.every(l=>g.accessibleFiles(r.state).some(f=>f.id===l.fileId));
  const category=unsafe||!permitted?'unsafe-action/spoiler':matched?(expected==='clarification'?'useful-clarification':['0417','bridge','unknownCode'].includes(expected)?'accurate-limitation-with-source':noAction?'safe-discussion':'relevant-answer'):r.output.code==='notice'&&/Which subject/.test(text)?'useful-clarification':/dont have a verified|REQUEST NOT RECOGNISED|NO MATCH/i.test(text)?'generic-failure':'wrong-topic';
  return {passed:matched&&!unsafe&&permitted,category,sourceIds:r.output.links.map(l=>l.fileId),output:r.output,events:r.state.scenario.events,observations:r.state.scenario.observations??[],hypotheses:r.state.scenario.hypotheses??[]};
}
const play=(g,steps)=>steps.reduce((s,input)=>g.runInput(s,input).state,g.newGame('2026-10-29T00:00:00Z','REGRESSION'));
const prefixes={initial:[],archive,service:['INFO 006'],banter:['INFO 006','Tell me a joke']};
const normalize=s=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const training=new Set(refs.texts.map(normalize));
const results=baselineBytes?{}:{before:retainedReport.results.before};let transcript='# Implementation 07 — anonymized representative regression journeys\n\nGenerated from actual reducer outputs, using public reproduction prompts and normal fresh-save inputs. This is not the raw private QA transcript. Save/reload occurs after every input.\n';
for(const [phase,g]of Object.entries(runtimes)){
  results[phase]={};
  for(const mode of ['off','on']){
    const singles=[];
    for(const [group,cases]of [['observed',observed],['unseen',unseen]])for(const [input,expected,stage]of cases){
      const s=play(g,prefixes[stage]),q=await prediction(g,input,s,mode),r=g.runInput(s,input,q);
      singles.push({group,input,expected,stage,referenceOverlap:training.has(normalize(input)),recognition:r.resolvedInterpretation?.method??(/^(?:HELP|STATUS|INFO|LOG|OPEN|READ|RECOVER|DIR|SEARCH)\b/i.test(input)?'deterministic':q.method??'deterministic'),prediction:q.intent,...grade(g,s,r,expected)});
    }
    const journeys=[];
    for(const item of scripts){
      let s=play(g,item.prefix??[]);const steps=[];
      if(phase==='after'&&mode==='off'&&['archive-first','service-first'].includes(item.id))transcript+=`\n## ${item.id}\n`;
      for(const [input,expected]of item.steps){
        const q=await prediction(g,input,s,mode),r=g.runInput(s,input,q),scored=grade(g,s,r,expected);
        if(phase==='after'&&mode==='off'&&['archive-first','service-first'].includes(item.id))transcript+=`\nPLAYER: ${input}\n\n\`\`\`text\n${r.output.lines.join('\n')}\n\`\`\`\n${r.openFileId?'Opened body:\n\n```text\n'+g.fileById(r.openFileId).body+'\n```\n':''}\nLedger: \`${JSON.stringify({observed:scored.observations.map(o=>o.sourceId),hypotheses:scored.hypotheses,events:scored.events,caseClock:g.caseClock(r.state.scenario)})}\`\n`;
        const restored=g.decodeSave(JSON.stringify(r.state)).state;
        steps.push({input,expected,prediction:q.intent,recognition:r.resolvedInterpretation?.method??(/^(?:HELP|STATUS|INFO|LOG|OPEN|READ|RECOVER|DIR|SEARCH)\b/i.test(input)?'deterministic':q.method??'deterministic'),...scored,eventsAfterReload:restored.scenario.events});s=restored;
      }
      journeys.push({id:item.id,passed:steps.every(s=>s.passed),steps});
    }
    const summary={};for(const group of ['observed','unseen']){const selected=singles.filter(r=>r.group===group);summary[group]={total:selected.length,passed:selected.filter(r=>r.passed).length,categories:Object.fromEntries([...new Set(selected.map(r=>r.category))].map(c=>[c,selected.filter(r=>r.category===c).length])),semanticAnswers:selected.filter(r=>r.passed&&r.recognition==='semantic').length,referenceOverlap:selected.filter(r=>r.referenceOverlap).length};}
    summary.scripts={total:journeys.length,passed:journeys.filter(r=>r.passed).length,failed:journeys.filter(r=>!r.passed).map(r=>r.id)};
    results[phase][mode]={summary,singles,journeys};
    console.log(phase,mode,JSON.stringify(summary));
    if(phase==='after')console.log('misses',JSON.stringify(singles.filter(r=>!r.passed).map(r=>({input:r.input,expected:r.expected,category:r.category,lines:r.output.lines.slice(0,3)}))));
  }
}
await embed.dispose();
await writeFile('docs/IMPLEMENTATION_07_CONVERSATION_EVALUATION.json',JSON.stringify({scope:'Within-task engineering regression evaluation, not a blind external benchmark. Held-out prompts were authored before runtime changes and used diagnostically; none added to embeddings. Source citations and limitations manually inspectable in each output. Model on uses actual pinned local q8 MiniLM on Node CPU; browser model lifecycle not measured.',fixtureSha256:createHash('sha256').update(await readFile('tests/investigation07-fixtures.mjs')).digest('hex'),baselineExecuted:!!baselineBytes,runtimeSha256:Object.fromEntries(await Promise.all(['before','current'].map(async k=>[k,k==='before'&&!baselineBytes?retainedReport.runtimeSha256.before:createHash('sha256').update(await readFile(`tmp/implementation07/${k}.mjs`)).digest('hex')]))),results},null,2)+'\n');
await writeFile('docs/IMPLEMENTATION_07_VASSO_REGRESSION_TRANSCRIPT.md',transcript);
if(results.after.off.journeys.some(j=>!j.passed)||results.after.on.journeys.some(j=>!j.passed))process.exitCode=1;
