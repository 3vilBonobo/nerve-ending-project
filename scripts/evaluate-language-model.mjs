import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { env, pipeline } from '@huggingface/transformers';

await mkdir('tmp/model-evaluation', { recursive: true });
const mode = process.argv.includes('--catalogue') ? 'catalogue' : process.argv.includes('--continuation') ? 'continuation' : process.argv.includes('--holdout') ? 'holdout' : process.argv.includes('--write-embeddings') ? 'references' : 'development';
const modulePath = resolve(`tmp/model-evaluation/recognition-${mode}.mjs`);
await build({ stdin: { contents: "export * from './src/app/core/interpretation/semantic'; export * from './src/app/core/interpretation/semantic-catalog'; export { classify } from './src/app/core/interpretation/fallback'; export { newGame, newLegacyGame, runInput } from './src/app/core/engine/game';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: modulePath });
const { SEMANTIC_EXAMPLES, SEMANTIC_CATALOG, CATALOG_VERSION, rankIntents, selectMeaning, recognitionText, classify, newGame, newLegacyGame, runInput } = await import(pathToFileURL(modulePath).href);
env.allowRemoteModels = false; env.allowLocalModels = true;
env.localModelPath = resolve('public/language/v1') + '/'; env.useFSCache = false;
const started = performance.now();
const embed = await pipeline('feature-extraction', 'all-MiniLM-L6-v2', { dtype: 'q8', device: 'cpu', local_files_only: true });
const texts = SEMANTIC_EXAMPLES.map(example => example.text);
let vectors;
if (process.argv.includes('--write-embeddings')) {
  vectors = [];
  for (let index = 0; index < texts.length; index += 16) vectors.push(...(await embed(texts.slice(index, index + 16), { pooling: 'mean', normalize: true })).tolist());
  vectors = vectors.map(row => row.map(value => +value.toFixed(7)));
  const body = Buffer.from(JSON.stringify({ version: CATALOG_VERSION, texts, vectors }));
  await writeFile('public/language/v1/embeddings.json', body);
  const manifest = JSON.parse(await readFile('public/language/v1/manifest.json', 'utf8'));
  manifest.assets = manifest.assets.filter(asset => asset.path !== 'embeddings.json');
  manifest.assets.push({ path: 'embeddings.json', bytes: body.length, sha256: createHash('sha256').update(body).digest('hex') });
  manifest.downloadBytes = manifest.assets.reduce((sum, asset) => sum + asset.bytes, 0);
  await writeFile('public/language/v1/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
} else {
  const references = JSON.parse(await readFile('public/language/v1/embeddings.json', 'utf8'));
  if (references.version !== CATALOG_VERSION || references.texts.join('\n') !== texts.join('\n')) throw new Error('Run --write-embeddings after changing recognition examples.');
  vectors = references.vectors;
}
const catalogue = process.argv.includes('--catalogue');
const suite = catalogue ? 'language-catalogue' : process.argv.includes('--continuation') ? 'language-continuation' : process.argv.includes('--holdout') ? 'language-holdout' : 'language-evaluation';
const cases = catalogue ? SEMANTIC_EXAMPLES.map(example => ({ input: example.text, intent: example.intent, context: /^(q_fresh_|q_neconv_)/.test(example.intent)?{scenarioVersion:'1.0'}:/^(?:Who is she|What happened to her)\?/i.test(example.text) ? { lastTopic: 'Anna Voss', lastFileId: 'voss', lastIntent: 'q_anna_identity' } : { lastTopic: 'service-006', lastFileId: 'register' } })) : JSON.parse(await readFile(`tests/${suite}.json`, 'utf8'));
const results = [];
for (const item of cases) {
  const began = performance.now();
  const vector = (await embed(recognitionText(item.input), { pooling: 'mean', normalize: true })).tolist()[0];
  const ranked = rankIntents(vector, vectors);
  const result = selectMeaning(item.input, item.context ?? {}, ranked);
  const equivalent = [['ask_transfer','ask_archive_location'], ['ask_calls','q_call_repeat'], ['ask_company','q_products'], ['ask_identity','q_personhood','q_robot'], ['ask_transfer','q_original'], ['ask_recovery_process','q_backup_reliable']];
  const sameMeaning = result.intent === item.intent || item.alternatives?.includes(result.intent) || equivalent.some(pair => pair.includes(result.intent) && pair.includes(item.intent));
  const passed = item.clarify ? result.needsClarification : !result.needsClarification && sameMeaning && (!item.fileId || result.fileId === item.fileId);
  const base=item.context?.scenarioVersion==='1.0'?newGame():newLegacyGame();
  const before = runInput({ ...base, ...item.context }, item.input, result).output;
  const after = runInput({ ...base, ...item.context, archive006Recovered: true }, item.input, result).output;
  results.push({ ...item, result, passed, before, after, ms: +(performance.now() - began).toFixed(1), ranking: ranked.slice(0, 3) });
}
const passed = results.filter(result => result.passed).length;
const baseline = cases.filter(item => { const result = classify(item.input, item.context); return item.clarify ? result.needsClarification : !result.needsClarification && result.intent === item.intent && (!item.fileId || result.fileId === item.fileId); }).length;
const clarified = results.filter(item => !item.passed && item.result.needsClarification).length;
const wrong = results.filter(item => !item.passed && !item.result.needsClarification && item.result.intent !== 'unknown').length;
const summary = { suite, catalogueQuestions: texts.length, cases: cases.length, passed, clarified, wrong, baseline, modelAndEvaluationMs: Math.round(performance.now() - started), meanInferenceMs: +(results.reduce((sum, item) => sum + item.ms, 0) / results.length).toFixed(1) };
await writeFile(`tmp/${suite}.json`, JSON.stringify({ summary, results }, null, 2) + '\n');
console.log(JSON.stringify(summary));
for (const item of results.filter(result => !result.passed)) console.log(JSON.stringify({ input: item.input, expected: item.intent ?? 'clarification', got: item.result, ranking: item.ranking }));
if (catalogue) {
  const escape = text => text.replaceAll('|', '\\|').replaceAll('\n', ' ');
  const lines = ['# Recognizer catalogue — legacy and fresh scopes', '', `${texts.length} training/reference questions, not independent evaluation. Contains spoilers; not player help.`, '', 'Rows labeled q_fresh_ use a fresh v1.0 session. All other groups show retained legacy prototype dialogue and must not be counted as current playable answers. See IMPLEMENTATION_05_CONVERSATION_INVENTORY.json and IMPLEMENTATION_05_EVALUATION_AFTER.json for fresh coverage and independent questions.', ''];
  for (const group of SEMANTIC_CATALOG) {
    lines.push(`## ${group.label} — ${/^(q_fresh_|q_neconv_)/.test(group.intent)?'FRESH v1.0':'LEGACY PROTOTYPE'}`, '', '| Reference question | Reply in the labeled session scope |', '| --- | --- |');
    for (const question of group.examples) {
      const item = results.find(result => result.input === question);
      lines.push(`| ${escape(question)} | ${item.before.lines.map(escape).join('<br>')} |`);
    }
    lines.push('');
  }
  await writeFile('docs/QUESTION_CATALOG.md', lines.join('\n').trimEnd() + '\n');
}
await embed.dispose();
// Unseen wording may legitimately need clarification. Wrong factual routes fail the evaluation.
if (wrong || passed / cases.length < .85 || results.some(item => !item.before.lines.length)) process.exitCode = 1;
