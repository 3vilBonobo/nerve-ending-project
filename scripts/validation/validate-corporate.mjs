import assert from 'node:assert/strict';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

// Authoring references are read here only. This validator is never part of the client bundle.
await mkdir('tmp/corporate-validation', { recursive: true });
const bundle = resolve('tmp/corporate-validation/corporate.mjs');
await build({ stdin: { contents: "export * from './src/app/core/content/corporate-records'; export * from './src/app/core/content/scenario-records'; export * from './src/app/core/engine/game'; export * from './src/app/core/engine/story/continuation'; export * from './src/app/core/interpretation/semantic/semantic';", resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: bundle });
const g = await import(pathToFileURL(bundle).href);
const writer = JSON.parse(await readFile('docs/narrative/NERVE_ENDING_PERSONNEL_DIRECTORY_v0_4.json', 'utf8'));
const approved = Array.from({ length: 34 }, (_, index) => `P${String(index + 1).padStart(3, '0')}`);
assert.deepEqual(g.PUBLIC_PERSONNEL.map(person => person.id), approved);
for (const person of g.PUBLIC_PERSONNEL) {
  const reference = writer.personnel.find(candidate => candidate.id === person.id);
  assert.deepEqual(person, { id: reference.id, name: reference.name, department: reference.department, role: reference.job_title, dates: reference.employment_dates_proposed.split(';')[0], profile: reference.normal_work_profile });
  const state = g.newGame();
  for (const input of [`Who is ${person.name}?`, `SEARCH ${person.name}`]) {
    const t = g.runInput(state, input);
    assert.ok(t.output.lines.join(' ').includes(person.profile), input);
    assert.deepEqual(t.state.investigation, state.investigation);
    assert.deepEqual(t.state.knowledge, []); assert.deepEqual(t.state.permissions, []);
    assert.deepEqual(t.state.operating, state.operating);
    assert.doesNotMatch(JSON.stringify(t.output), /AV-06|Site 6|MOTHER|author_only_note|writer_depth|DOC-CLN|subsequent status restricted/i);
  }
}
const world = await readFile('docs/narrative/NERVE_ENDING_MERIDIAN_WORLD_BIBLE_v0_4.md', 'utf8');
const bodies = [...world.matchAll(/^> (MERIDIAN SYSTEMS — COMPANY PROFILE|HISTORICAL WORK DIRECTORY — RESEARCH \/ SELECTED ENTRIES|PROVIDENCE OPERATIONS ANNEX — OFFICE TRANSFER|LOWELL — MONTHLY VERIFICATION REPORT)[\s\S]*?(?=\r?\n\r?\n)/gm)].map(match => match[0].split(/\r?\n/).map(line => line.replace(/^> ?/, '').trimEnd()).join('\n'));
assert.equal(bodies.length, 4);
assert.deepEqual(g.CORPORATE_FILES.map(file => file.body), bodies, 'Approved document bodies retain authored wording.');
for (const file of g.CORPORATE_FILES) {
  assert.deepEqual(file.evidence, []); assert.equal(file.access, undefined); assert.equal(file.reveals, undefined);
  assert.equal(g.runInput(g.newGame(), `READ ${file.path}`).openFileId, file.id);
}
const excluded = writer.personnel.filter(person => !approved.includes(person.id));
const publicData = JSON.stringify([g.PUBLIC_PERSONNEL, g.CORPORATE_FILES]);
for (const person of excluded) {
  assert.ok(!publicData.includes(person.name));
  const search = g.runInput(g.newGame(), `SEARCH ${person.name}`);
  assert.deepEqual(search.output.lines, [`SEARCH: ${person.name} / FILES FOUND: 0`]);
  assert.deepEqual(g.runInput(g.newGame(), `Who is ${person.name}?`).output.lines, ['No matching public work profile is available.']);
}
let realModelInferences = 0;
if (process.argv.includes('--model')) {
  const { env, pipeline } = await import('@huggingface/transformers');
  env.allowRemoteModels = false; env.allowLocalModels = true; env.useFSCache = false;
  env.localModelPath = resolve('public/language/v1') + '/';
  const embed = await pipeline('feature-extraction', 'all-MiniLM-L6-v2', { dtype: 'q8', device: 'cpu', local_files_only: true });
  const { vectors } = JSON.parse(await readFile('public/language/v1/embeddings.json', 'utf8'));
  const inputs = ['What is Meridian Systems?', 'Who founded Meridian?', 'Where is the company based?', 'Are they still operating?', 'What do they manufacture?', 'What was the N-Series?', 'Why did the company downsize?', 'Who is Bell?', ...writer.personnel.map(person => `Who is ${person.name}?`)];
  try {
    for (const input of inputs) {
      const state = g.newGame();
      const vector = (await embed(g.recognitionText(input), { pooling: 'mean', normalize: true })).tolist()[0]; realModelInferences++;
      const query = g.selectMeaning(input, state, g.rankIntents(vector, vectors));
      const t = g.runInput(state, input, query);
      assert.deepEqual(t.output, g.runInput(state, input).output, input);
      assert.deepEqual(t.state.investigation, state.investigation);
      assert.deepEqual(t.state.knowledge, []); assert.deepEqual(t.state.permissions, []);
    }
  } finally { await embed.dispose(); }
}
let checkedProductionFiles = 0;
if (process.argv.includes('--dist')) {
  // v1.0 explicitly authors a protected care roster. Public projection exclusion above still applies to all six.
  // Only names actually present in the approved playable records may occur in the static story bundle.
  const authoredStory=JSON.stringify(g.SCENARIO_FILES).replace(/Dr\.? /g,'');
  const unapprovedNames=excluded.filter(person=>!authoredStory.includes(person.name.replace(/Dr\.? /g,'')));
  const files = await readdir('dist/client', { recursive: true });
  assert.ok(files.some(file => /^main-.*\.js$/.test(file)), 'Build the production client before using --dist.');
  for (const file of files.filter(file => /\.(?:js|json|md)$/i.test(file))) {
    const text = await readFile(resolve('dist/client', file), 'utf8'); checkedProductionFiles++;
    assert.doesNotMatch(text, /author_only_note|writer_depth|NERVE_ENDING_PERSONNEL_DIRECTORY/);
    for (const person of unapprovedNames) assert.ok(!text.includes(person.name), `Unapproved contractor in ${file}`);
  }
}
const report = { publicProfiles: g.PUBLIC_PERSONNEL.length, excludedContractors: excluded.length, authoredDocuments: g.CORPORATE_FILES.length, realModelInferences, checkedProductionFiles, sourceProjectionAndPrivacy: 'passed' };
await writeFile('tmp/corporate-validation/report.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
