import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';

await mkdir('tmp/service-validation', { recursive: true });
const bundle = resolve('tmp/service-validation/services.mjs');
await build({ stdin: { contents: [
  "export * from './src/app/core/content/service-records';", "export * from './src/app/core/engine/game';",
  "export * from './src/app/core/interpretation/semantic/semantic';", "export * from './src/app/core/interpretation/basic/fallback';",
  "export * from './src/app/core/persistence/saves';",
].join('\n'), resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: bundle });
const g = await import(pathToFileURL(bundle).href);
const bible = await readFile('docs/narrative/NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5.md', 'utf8');
const reference = [...bible.matchAll(/^## 4\.(\d)[^\n]*\r?\n[\s\S]*?```text\r?\n([\s\S]*?)```/gm)].flatMap(match => match[2].split(/\r?\n/).flatMap(line => {
  const event = line.match(/^(\d{2} [A-Z]{3} \d{4}(?: \d{2}:\d{2})?)\s*\| (INFO|NOTICE|WARN|ERROR|HIST) \| (.+)$/);
  return event ? [{ serviceId: match[1].padStart(3, '0'), timestamp: event[1], category: event[2], message: event[3] }] : [];
}));
assert.equal(reference.length, 33);
const excluded = reference.filter(event =>
  event.timestamp.startsWith('06 NOV 2003') && / (07:41|08:10|08:14|08:50|08:55)$/.test(event.timestamp)
  || event.serviceId === '006' && event.timestamp.endsWith('03:41')
  || event.serviceId === '007' && event.timestamp.startsWith('03 NOV 2003'));
assert.equal(excluded.length, 9);
const samples = g.SERVICE_EVENTS.filter(event => event.source.reference.startsWith('docs/'));
assert.deepEqual(samples.map(event => ({ serviceId: event.serviceId, timestamp: g.serviceTimestamp(event.timestamp), category: event.category, message: event.message })), reference.filter(event => !excluded.includes(event)), 'Every admitted sample retains its authored timestamp precision, category and exact message.');
assert.equal(g.SERVICE_EVENTS.length, 27);
const preservedHashes = {
  NERVE_ENDING_MOTHER_ANNA_CANON_v0_3: '905A7A3ECE0894771C5CBD62D8C729DB3DA9CD3015084012FAE24C6F34D7EDBF',
  NERVE_ENDING_MERIDIAN_WORLD_BIBLE_v0_4: '79DF8A285FDCA2F9CF9760A2572FB275C76B111C3603EB4CAA934A2FABA16005',
  NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5: '429F1D898D1A27F843FA135429EC257F1FEC61B94F44D2D235F0CD98A72CDF07',
  NERVE_ENDING_PERSONNEL_DIRECTORY_v0_4: '702ED9124DB58DE9C64BF9F71FA42CD35926A028389EF79B503BDE9811E86499',
};
for (const [name, hash] of Object.entries(preservedHashes)) {
  const bytes = await readFile(`docs/narrative/${name}.${name.includes('PERSONNEL') ? 'json' : 'md'}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex').toUpperCase(), hash, name);
}
const inputs = ['What services are running?', ...g.SERVICES.map(s => `What does Service ${s.id} do?`),
  'Is the message router working?', 'Why is billing stopped?', 'Show me the equipment register logs.', 'What happened to Building Sensors?',
  'When did Service 004 stop?', 'Which services are still active?', 'What does standby mean?', 'Who maintains the records system?',
  'Show me recent service warnings.', 'What is the difference between a shutdown report and current status?',
  'What does it do?', 'What does Service 999 do?', 'STOP 006', 'REROUTE 003', 'Show me Service 002 logs from last week.'];
let embed; let vectors; let inferences = 0;
if (process.argv.includes('--model')) {
  const { env, pipeline } = await import('@huggingface/transformers');
  env.allowRemoteModels = false; env.allowLocalModels = true; env.useFSCache = false; env.localModelPath = resolve('public/language/v1') + '/';
  embed = await pipeline('feature-extraction', 'all-MiniLM-L6-v2', { dtype: 'q8', device: 'cpu', local_files_only: true });
  ({ vectors } = JSON.parse(await readFile('public/language/v1/embeddings.json', 'utf8')));
}
const rows = [];
const evaluate = async (state, input) => {
  const offline = g.runInput(state, input, g.classify(input, state));
  if (embed) {
    const vector = (await embed(g.recognitionText(input), { pooling: 'mean', normalize: true })).tolist()[0]; inferences++;
    const query = g.selectMeaning(input, state, g.rankIntents(vector, vectors));
    assert.deepEqual(g.runInput(state, input, query).output, offline.output, input);
  }
  assert.deepEqual(offline.state.operating, state.operating); assert.deepEqual(offline.state.permissions, state.permissions);
  assert.deepEqual(offline.state.knowledge, state.knowledge); assert.deepEqual(offline.state.investigation, state.investigation);
  assert.deepEqual(JSON.parse(JSON.stringify(g.decodeSave(JSON.stringify(offline.state)).state)), JSON.parse(JSON.stringify(offline.state)), input);
  assert.doesNotMatch(JSON.stringify(offline.output), /Anna|AV-06|Site 6|MOTHER|author_only|story_role|cause_ref/i);
  rows.push({ input, output: offline.output, topic: offline.state.lastTopic });
  return offline.state;
};
try {
  for (const input of inputs) await evaluate(g.newGame(), input);
  let state = g.newGame();
  for (const input of ['What does Service 003 do?', 'Is it working?', 'Show me its logs.']) state = await evaluate(state, input);
  assert.equal(state.lastTopic, 'service-003');
} finally { await embed?.dispose(); }
const summary = { services: 8, retainedEvents: 27, exactDraftSamples: 24, reusedRestartEvents: 3, excludedDraftSamples: 9, unchangedReferences: 4, queries: rows.length, realModelInferences: inferences, passed: true };
await writeFile('tmp/service-validation/report.json', JSON.stringify({ summary, excluded, rows }, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
