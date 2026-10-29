import {readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const file=resolve('tmp/implementation06/label-runtime.mjs');
await build({stdin:{contents:"export * from './src/app/core/engine/game';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:file});
const g=await import(pathToFileURL(file).href),catalogue=JSON.parse(await readFile('tmp/language-catalogue.json','utf8'));
const failures=catalogue.results.filter(r=>!r.passed),counts={},rows=[];
for(const row of failures){
 const s={...(row.context?.scenarioVersion==='1.0'?g.newGame():g.newLegacyGame()),...row.context};
 const r=g.runInput(s,row.input,row.result),variant=r.dialogue?.variantId;
 const category=variant?.startsWith(`mother:${row.intent.slice(2)}:`)?'authored-family-delivered':variant?.startsWith('corporate:')?'corporate-projection':variant?.startsWith('service:')?'service-projection':r.resolvedInterpretation?.intent.startsWith('q_case_')?'existing-case-route':'other';
 counts[category]=(counts[category]??0)+1;
 rows.push({input:row.input,expectedLabel:row.intent,actualClassifierLabel:row.result.intent,method:row.result.method,category,variant:variant??null,output:r.output});
}
const summary={referenceCases:catalogue.results.length,strictLabelMismatches:failures.length,retainedReferenceMismatches:failures.filter(r=>!r.intent.startsWith('q_neconv_')).length,classifierMethods:Object.fromEntries([...new Set(failures.map(r=>r.result.method))].map(m=>[m,failures.filter(r=>r.result.method===m).length])),dispatchCategories:counts};
await writeFile('docs/IMPLEMENTATION_06_LABEL_AUDIT.json',JSON.stringify({scope:'Strict classifier IDs preserved. Actual saved model/rule predictions from the catalogue are replayed through the final dispatcher; no intent is corrected using its expected label. Categories describe the delivered route, not a blanket claim of semantic correctness.',summary,rows},null,2)+'\n');
console.log(JSON.stringify(summary));
