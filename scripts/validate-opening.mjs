import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { env, pipeline } from '@huggingface/transformers';

await mkdir('tmp/opening-validation', { recursive: true });
const bundle = resolve('tmp/opening-validation/engine.mjs');
await build({ stdin: { contents: [
  "export * from './src/app/core/engine/game';", "export * from './src/app/core/engine/continuation';",
  "export * from './src/app/core/interpretation/semantic';", "export * from './src/app/core/interpretation/fallback';",
  "export * from './src/app/core/persistence/saves';",
].join('\n'), resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: bundle });
const g = await import(pathToFileURL(bundle).href);
env.allowRemoteModels = false; env.allowLocalModels = true; env.useFSCache = false;
env.localModelPath = resolve('public/language/v1') + '/';
const embed = await pipeline('feature-extraction', 'all-MiniLM-L6-v2', { dtype: 'q8', device: 'cpu', local_files_only: true });
const { vectors } = JSON.parse(await readFile('public/language/v1/embeddings.json', 'utf8'));
const paths = [
  ['STATUS', 'READ Closure list', 'Why is 006 still running despite being closed?', 'READ Handover receipt', 'The office approval lacks an operational release confirmation.', 'OPEN backup', 'READ /COMMS/BRIDGE_02_STATUS.LOG', 'The preservation controller accepted the transfer, but release is still withheld.', 'Request a read-only continuity audit'],
  ['OPEN backup', 'CHECK BRIDGE STATUS', 'What is 006?', 'Can you investigate the discrepancy?', 'The administrative approval is not permission to release the service.', 'The holding system accepted the transfer, not the night desk.', 'No, transfer acceptance is not permission to release; the hold still needs a reply.', 'Run service audit'],
  ['READ Closure list', 'STATUS', 'Investigate service 006', 'DEFER', 'OPEN backup', 'READ /COMMS/BRIDGE_02_STATUS.LOG', 'RESUME INVESTIGATION', 'The office closed but no one confirmed the service could be released.', 'The preservation controller confirmed the transfer. That does not mean we can stop; release is withheld.', 'Request service audit'],
];
const questions = [
  ['Are you human?', 'AUTOMATED RECORDS INTERFACE'], ['Are you AI?', 'AUTOMATED RECORDS INTERFACE'],
  ['Robot', 'AUTOMATED RECORDS INTERFACE'], ['Intelligence', 'intelligence architecture'],
  ['Who is J. Kell?', 'No full name'], ['Where are Meridian headquarters?', 'no headquarters address'],
  ['Where is your server located?', 'physical server location'], ['Show me what you have saved locally', 'LOCAL CLIENT STORAGE'],
  ['What is records access 007?', 'connection you are using'], ['Online', 'Do you mean'],
  ['What is biological activity?', 'Physiological processes'], ['What is the live monitor?', 'SERVICE STATUS'],
];
const results = []; let inferences = 0;
try {
  for (const model of [false, true]) {
    const interpret = async (input, state) => {
      if (!model) return g.classify(input, state);
      const vector = (await embed(g.recognitionText(input), { pooling: 'mean', normalize: true })).tolist()[0]; inferences++;
      return g.selectMeaning(input, state, g.rankIntents(vector, vectors));
    };
    for (const [input, expected] of questions) {
      const t = g.runInput(g.newGame(), input, await interpret(input, {}));
      assert.ok(t.output.lines.join(' ').includes(expected), input);
      assert.doesNotMatch(t.output.lines.join(' '), /MOTHER|Anna Voss|Site 6|AV-06/);
      results.push({ model, input, output: t.output });
    }
    for (let n = 0; n < paths.length; n++) {
      let state = g.newGame('2003-11-06T02:14:00Z', `OPENING-${n}`); const rows = [];
      for (const input of paths[n]) {
        const query = await interpret(input, state); const t = g.runInput(state, input, query);
        assert.ok(!['denied','error'].includes(t.output.code), `${input}: ${t.output.lines.join(' ')}`);
        assert.deepEqual(t.state.operating, state.operating, 'Opening must never change equipment');
        const reloaded = g.decodeSave(JSON.stringify(t.state)).state;
        assert.deepEqual(JSON.parse(JSON.stringify(reloaded)), JSON.parse(JSON.stringify(t.state)), input);
        rows.push({ input, recognition: query, output: t.output, encounters: t.encounters }); state = reloaded;
      }
      assert.equal(g.actOf(state), 2); assert.equal(state.investigation.stage, 'complete');
      results.push({ model, path: n + 1, rows });
    }
  }
  const summary = { model: 'all-MiniLM-L6-v2 / q8 / local CPU', regressionQuestions: 12, modes: ['offline','real model'], pathsPerMode: paths.length, reloadAfterEveryInput: true, inferences, passed: true };
  await writeFile('tmp/opening-validation/results.json', JSON.stringify({ summary, results }, null, 2) + '\n');
  console.log(JSON.stringify(summary));
} finally { await embed.dispose(); }
