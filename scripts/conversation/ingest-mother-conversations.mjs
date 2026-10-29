import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';

const root='docs/narrative/';
const pack=JSON.parse(await readFile(root+'NERVE_ENDING_MOTHER_CONVERSATIONS_AUTHOR_PACK_v1_1.json','utf8'));
const evaluation=JSON.parse(await readFile(root+'NERVE_ENDING_MOTHER_CONVERSATION_EVALUATION_v1_1.json','utf8'));
const bible=(await readFile(root+'NERVE_ENDING_MOTHER_CONVERSATION_BIBLE_v1_1.md','utf8')).replace(/\r/g,'').split('\n').map(s=>s.replace(/^> ?/,'')).join('\n');
export const key=s=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const stages=['early','investigation','core'];
const domains=['social','world','system','investigation','easter_egg'];
const gates=['public','after_discrepancy','after_clinical_review','after_welfare_comparison','after_external_review','after_intent_review','after_final_review','after_severance','after_continuation'];
const handling=['answer','context_source','repeat_previous','clarify_previous','correction_context','out_of_world_ui','skeptical_challenge','read_only_explanation','post_outcome_read_only','read_only_refusal','fallback_non_action','tone_preference','respect_pause'];
assert.equal(pack.schema,'nerve-ending-author-dialogue-1.0');
assert.deepEqual(pack.heldout_validation,evaluation.heldout);assert.deepEqual(pack.adversarial_validation,evaluation.adversarial);assert.deepEqual(pack.multiturn_validation,evaluation.multiturn);
assert.equal(new Set(pack.topics.map(t=>t.id)).size,pack.topics.length);
for(const t of pack.topics){
  assert.match(t.id,/^neconv_[a-z0-9_]+$/);assert(domains.includes(t.domain));assert(gates.includes(t.min_disclosure));assert(handling.includes(t.handling));assert(['normal','safety'].includes(t.priority));
  assert(Array.isArray(t.example_utterances)&&t.example_utterances.every(s=>typeof s==='string'&&s.trim()));
  assert(t.responses.early&&Object.entries(t.responses).every(([stage,s])=>stages.includes(stage)&&typeof s==='string'&&s.trim()));
  assert(typeof t.author_note==='string'&&typeof t.repetition==='string'&&Array.isArray(t.tags)&&t.tags.every(s=>typeof s==='string'));
  assert(t.callback===null||typeof t.callback==='object');
  assert(bible.includes('`'+t.id+'`'),t.id);
  for(const s of Object.values(t.responses))assert(bible.includes(s.replace(/\r/g,'')),`Bible/JSON response mismatch: ${t.id}`);
  for(const s of t.example_utterances)assert(bible.includes(s),`Bible/JSON example mismatch: ${t.id}: ${s}`);
}
await mkdir('tmp/implementation06',{recursive:true});
let retained;
try{retained=JSON.parse(await readFile('tmp/implementation06/before-examples.json','utf8'));}catch{
  const target=resolve('tmp/implementation06/retained.mjs');
  await build({stdin:{contents:"export { BASE_SEMANTIC_CATALOG } from './src/app/core/interpretation/semantic/semantic-catalog';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:target});
  retained=(await import(pathToFileURL(target).href)).BASE_SEMANTIC_CATALOG.flatMap(t=>t.examples.map(text=>({text,intent:t.intent})));
}
assert.equal(retained.length,1739,'Collision audit must use retained Implementation 05 foundation, not the merged catalogue.');
const reserved=new Set([...evaluation.heldout.map(t=>t.input),...evaluation.adversarial.map(t=>t.input),...evaluation.multiturn.flatMap(t=>t.steps.map(s=>s[0]))].map(key));
const oldByKey=new Map(retained.map(e=>[key(e.text),e]));
const normalized=new Map(),exact=new Map(),collisions=[],excluded=[];
const unsafePhrase=s=>!key(s)||/^\d+$/.test(key(s))||/^(?:why|how so|who is she|what about her|yes|no|again|show me the logs)$/.test(key(s));
for(const t of pack.topics)for(const phrase of t.example_utterances){
  const n=key(phrase);const prior=normalized.get(n);
  if(exact.has(phrase))collisions.push({kind:'exact-new',text:phrase,labels:[exact.get(phrase),t.id]});
  if(prior)collisions.push({kind:'normalized-new',text:phrase,labels:[prior,t.id]});
  const old=oldByKey.get(n);if(old)collisions.push({kind:'retained',text:phrase,labels:[old.intent,t.id]});
  exact.set(phrase,t.id);if(!prior)normalized.set(n,t.id);
  if(reserved.has(n))excluded.push({topic:t.id,text:phrase,reason:'held-out/adversarial/multiturn fixture overlap; excluded from new references'});
  if(unsafePhrase(phrase))excluded.push({topic:t.id,text:phrase,reason:'symbol, bare identifier or context-only phrase; deterministic/context routing only'});
}
const ambiguous=new Set(collisions.filter(c=>c.kind==='normalized-new'&&c.labels[0]!==c.labels[1]).map(c=>key(c.text)));
const retainedHeldout=retained.filter(e=>reserved.has(key(e.text)));
// Exact authored strings only. Withheld statements are recorded, never rewritten.
const withheld={
  'neconv_experiment_success:core':'Adds a several-seconds alignment measurement absent from controlling NE-103; retain the authored investigation answer.',
  'neconv_anna_volunteer:core':'Asserts Anna\'s understanding and shared dependence beyond the recorded authorization; retain the authored investigation answer.',
  'neconv_night_desk:core':'Assigns old routing to unsatisfied release conditions, a mechanism not established in v1.0; retain the applicable authored earlier answer.',
};
const extraGates={'neconv_night_desk:investigation':'after_clinical_review','neconv_anna_status_early:core':'after_clinical_review','neconv_how_long:core':'after_clinical_review','neconv_ctrl_z:core':'after_welfare_comparison','neconv_poem:investigation':'after_discrepancy','neconv_poem:core':'after_welfare_comparison'};
const playfulTags=new Set(['ego','dry','humor','classic','film_reference','game','retro_computing','command_joke','interface_joke','social_joke','roast','soft_humor','absurd','literary_allusion','puzzle','meta_game','silly','creative','sass','meta_joke']);
const publicRefs={world:['corporate-profile'],system:['readme'],social:[],easter_egg:[],investigation:[]};
const topicRefs={neconv_anna_work:['work-directory'],neconv_employee_lookup:['work-directory'],neconv_calder:['work-directory','corporate-profile'],neconv_shaw:['work-directory','corporate-profile'],neconv_closure_vs_running:['authorization','register'],neconv_night_desk:['call','maintenance'],neconv_medical_staff:['NE-106'],neconv_anna_volunteer:['NE-101','NE-103'],neconv_experiment_success:['NE-103','NE-104'],neconv_failure_mechanism:['NE-103','NE-104'],neconv_ongoing_life_support:['NE-104','NE-105'],neconv_distress_vs_survival:['NE-111'],neconv_consent:['NE-101','NE-104'],neconv_other_patients:['NE-108','NE-109','NE-110'],neconv_fallbacks:['NE-107','NE-109','NE-110'],neconv_marsh:['NE-106'],neconv_external_medics:['NE-113'],neconv_anna_intention:['NE-112'],neconv_translation_challenge:['NE-112'],neconv_final_choice:['NE-114'],neconv_after_severance:['NE-115'],neconv_after_continuation:['NE-116']};
const seen=new Set();
const topics=pack.topics.map(t=>({id:t.id,intent:'q_'+t.id,domain:t.domain,gate:t.min_disclosure,handling:t.handling,safety:t.priority==='safety',playful:t.tags.some(tag=>playfulTags.has(tag)),explicitHumor:['neconv_tell_joke','neconv_roast_me','neconv_riddle','neconv_poem','neconv_ascii_art'].includes(t.id),responses:Object.fromEntries(Object.entries(t.responses).filter(([stage])=>!withheld[t.id+':'+stage])),responseGates:Object.fromEntries(stages.filter(stage=>extraGates[t.id+':'+stage]).map(stage=>[stage,extraGates[t.id+':'+stage]])),sources:topicRefs[t.id]??publicRefs[t.domain],examples:t.example_utterances.filter(s=>{const n=key(s);if(reserved.has(n)||unsafePhrase(s)||oldByKey.has(n)||ambiguous.has(n)||seen.has(n))return false;seen.add(n);return true;})}));
const embeddedKeys=new Set(topics.flatMap(t=>t.examples.map(key)));
const aliases=pack.topics.flatMap(t=>t.example_utterances.filter(s=>key(s)&&!unsafePhrase(s)&&!embeddedKeys.has(key(s))&&!reserved.has(key(s))&&!ambiguous.has(key(s))).map(text=>[text,t.id]));
const report={sourceStats:pack.stats,actual:{topics:topics.length,utterances:pack.topics.reduce((n,t)=>n+t.example_utterances.length,0),responseAnchors:pack.topics.reduce((n,t)=>n+Object.keys(t.responses).length,0)},runtime:{topics:topics.length,referenceExamples:topics.reduce((n,t)=>n+t.examples.length,0),responseAnchors:topics.reduce((n,t)=>n+Object.keys(t.responses).length,0)},domains:Object.fromEntries(domains.map(domain=>[domain,{topics:topics.filter(t=>t.domain===domain).length,references:topics.filter(t=>t.domain===domain).reduce((n,t)=>n+t.examples.length,0),responses:topics.filter(t=>t.domain===domain).reduce((n,t)=>n+Object.keys(t.responses).length,0)}])),collisions,collisionPairs:[...new Set(collisions.map(c=>c.labels.join(' <> ')))],ambiguousNewPhrases:[...ambiguous],excluded,retainedFixtureOverlaps:retainedHeldout,withheld,extraGates,sourceHashes:Object.fromEntries(await Promise.all(['NERVE_ENDING_MOTHER_CONVERSATIONS_AUTHOR_PACK_v1_1.json','NERVE_ENDING_MOTHER_CONVERSATION_EVALUATION_v1_1.json','NERVE_ENDING_MOTHER_CONVERSATION_BIBLE_v1_1.md','CODEX_IMPLEMENTATION_06_MOTHER_CONVERSATION_PROMPT.md'].map(async name=>[name,createHash('sha256').update(await readFile(root+name)).digest('hex')])))};
assert.equal(report.actual.topics,pack.stats.intent_families);assert.equal(report.actual.utterances,pack.stats.example_utterances);assert.equal(report.actual.responseAnchors,pack.stats.authored_response_anchors);
report.highRiskPhrases=pack.topics.flatMap(t=>t.example_utterances.flatMap(text=>{
 const n=key(text),risks=[];
 if(unsafePhrase(text))risks.push('symbol/identifier/context-only');
 if(/\b(?:not|dont|never|no)\b/.test(n))risks.push('negation');
 if(/\b(?:if|would|suppose|imagine)\b/.test(n))risks.push('hypothetical');
 if(/["“”]/.test(text))risks.push('quotation');
 if(/\b(?:sudo|rm rf|delete|grant|root|password|stop|shut down|confirm|authorize|authorise|clinical|witness)\b/.test(n))risks.push('command/authority boundary');
 return risks.length?[{topic:t.id,text,risks}]:[];
}));
assert(topics.every(t=>t.examples.length>=2),'Similarity scoring requires at least two distinct references per label.');
await writeFile('docs/IMPLEMENTATION_06_INGEST.json',JSON.stringify(report,null,2)+'\n');
// Tuple storage removes repeated field names and derived intent strings, preserving every authored value.
const rows=topics.map(({id,domain,gate,handling,safety,playful,explicitHumor,responses,responseGates,sources,examples})=>[id,domain,gate,handling,safety,playful,explicitHumor,responses,responseGates,sources,examples]);
const output='// Generated by scripts/conversation/ingest-mother-conversations.mjs. Authored strings; no source notes or evaluation fixtures.\nimport type {MotherTopic} from "./mother-routing";\nconst rows:readonly (readonly unknown[])[] = '+JSON.stringify(rows)+';\nexport const MOTHER_TOPICS = rows.map(([id,domain,gate,handling,safety,playful,explicitHumor,responses,responseGates,sources,examples])=>({id,intent:"q_"+id,domain,gate,handling,safety,playful,explicitHumor,responses,responseGates,sources,examples})) as unknown as readonly MotherTopic[];\nexport const MOTHER_ALIASES: readonly (readonly [string,string])[] = '+JSON.stringify(aliases)+';\n';
if(process.argv.includes('--check'))assert.equal(await readFile('src/app/core/interpretation/conversation/mother-corpus.ts','utf8'),output,'Regenerate the approved projection.');
else await writeFile('src/app/core/interpretation/conversation/mother-corpus.ts',output);
console.log(JSON.stringify({source:report.actual,runtime:report.runtime,domains:report.domains,collisionPairs:report.collisionPairs,withheld,retainedFixtureOverlaps:retainedHeldout.length}));
