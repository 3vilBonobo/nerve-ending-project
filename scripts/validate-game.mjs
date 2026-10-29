import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { isDeepStrictEqual } from 'node:util';

await mkdir('tmp/game-validation', { recursive: true });
const writeAuthorFile = async (path, body) => { if (!process.argv.includes('--check')) await writeFile(path, body); };
const bundle = resolve('tmp/game-validation/game.mjs');
await build({ stdin: { contents: [
  "export * from './src/app/core/engine/game';", "export * from './src/app/core/engine/continuation';",
  "export * from './src/app/core/engine/dialogue';", "export * from './src/app/core/engine/playthroughs';",
  "export * from './src/app/core/interpretation/dialogue-catalog';", "export * from './src/app/core/interpretation/semantic-catalog';",
  "export * from './src/app/core/interpretation/fallback';", "export * from './src/app/core/persistence/saves';",
  "export * from './src/app/core/story-state';", "export * from './src/app/core/content';",
].join('\n'), resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: bundle });
const exports = await import(pathToFileURL(bundle).href);
// This retained catalogue and its three paths describe resumable prototype sessions only.
const g = {...exports,newGame:exports.newLegacyGame};
const legacyExamples=g.SEMANTIC_EXAMPLES.filter(e=>!e.intent.startsWith('q_fresh_')&&!e.intent.startsWith('q_neconv_'));
const errors = []; const ambiguous = []; const mismatches = [];
const key = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const seen = new Map();
const late = g.GOLDEN_PATHS.SEVERANCE_COSTLY_COMPASSION.reduce((s,input) => g.runInput(s,input).state, g.newGame());
let explored = g.INVESTIGATION_PATH.reduce((s,input) => g.runInput(s,input).state, g.newGame());
for (let pass = 0; pass < 2; pass++) for (const f of g.accessibleFiles(explored)) explored = g.inspectFile(explored, f.id).state;
for (const e of legacyExamples) {
  const prior = seen.get(key(e.text));
  if (prior) errors.push(`Duplicate example: ${e.text} (${prior}, ${e.intent})`);
  seen.set(key(e.text), e.intent);
  if (g.parseOperation(e.text)) errors.push(`Question classified as operation: ${e.text}`);
  const r = g.classify(e.text);
  if (r.needsClarification) ambiguous.push({ ...e, clarification: r.clarification });
  else if (r.intent !== e.intent) mismatches.push({ ...e, actual: r.intent });
  const before = g.runInput(g.newGame(), e.text, { intent: e.intent, provider: 'fallback', needsClarification: false });
  const after = g.runInput(late, e.text, { intent: e.intent, provider: 'fallback', needsClarification: false });
  if (!before.output.lines.length || !after.output.lines.length) errors.push(`Missing answer: ${e.text}`);
  if (JSON.stringify(before.state.operating) !== JSON.stringify(g.newGame().operating)) errors.push(`Initial question changed operations: ${e.text}`);
}
const transcripts = {};
for (const [ending, steps] of Object.entries(g.GOLDEN_PATHS)) {
  let s = g.newGame('2003-11-06T02:14:00Z', 'VALIDATE'); const rows = [];
  for (const input of steps) {
    const r = g.runInput(s, input); rows.push({ input, output: r.output, act: g.actOf(r.state) });
    if (['denied','error'].includes(r.output.code)) errors.push(`${ending}: ${input}: ${r.output.lines.join(' ')}`);
    s = r.state;
    if (!isDeepStrictEqual(JSON.parse(JSON.stringify(g.decodeSave(JSON.stringify(s)).state)), JSON.parse(JSON.stringify(s)))) errors.push(`${ending}: save changed after ${input}`);
  }
  if (s.operating.endingId !== ending) errors.push(`Unreachable ending: ${ending}`);
  transcripts[ending] = { steps: rows, finalState: s.operating };
}
const families = Object.fromEntries([...new Set(g.DIALOGUE.map(i => i.family))].map(f => {
  const rows = g.DIALOGUE.filter(i => i.family === f);
  return [f, { intents: rows.length, examples: rows.reduce((n,i) => n + i.examples.length,0), variants: rows.length * 2 }];
}));
const followupCases = [
  ['Who is she?', 'q_anna_identity'], ['What happened to her?', 'q_anna_incident'], ['When?', 'q_incident_date'], ['Why?', 'q_not_disconnected'], ['Who approved it?', 'q_trial_authority'], ['What happened next?', 'q_intervention_history'], ['Are you sure?', 'q_anna_identity'], ['Explain that simply', 'q_anna_identity'], ['Can you repeat?', 'q_anna_identity'], ['Tell me more simply', 'q_anna_identity'], ['Use plain language', 'q_anna_identity'], ['What does that mean?', 'q_anna_identity'], ['Explain that', 'q_anna_identity'], ['I missed the reply', 'q_anna_identity'], ['Again please', 'q_anna_identity'], ['What did you just say?', 'q_anna_identity'],
];
for (const [input, expected] of followupCases) {
  if (g.classify(input, { lastIntent: 'q_anna_identity', lastTopic: 'Anna Voss' }).intent !== expected) errors.push(`Follow-up failed: ${input}`);
}
const missingLateVariants = g.DIALOGUE.filter(i => !i.revealed || i.gate && !explored.knowledge.includes(i.gate)).map(i => i.id);
if (missingLateVariants.length) errors.push('Unreachable late replies: ' + missingLateVariants.join(', '));
const report = { scope:'Legacy prototype dialogue and paths only; fresh coverage is IMPLEMENTATION_05_CONVERSATION_INVENTORY.json and IMPLEMENTATION_05_EVALUATION_AFTER.json', intents: new Set(legacyExamples.map(i => i.intent)).size, recognitionExamples: legacyExamples.length, legacyAuthoredVariants: g.DIALOGUE.length * 2, totalModelIntents:new Set(g.SEMANTIC_EXAMPLES.map(i=>i.intent)).size,totalModelExamples:g.SEMANTIC_EXAMPLES.length,retainedOpeningIntentDefinitions: new Set(legacyExamples.filter(i => !i.intent.startsWith('q_')).map(i => i.intent)).size, records: g.FILES.length, operations: g.OPERATION_DEFINITIONS.length, easterEggTriggers: g.DIALOGUE.filter(i => i.easterEgg).length, contextAwareFollowupCases: followupCases.length, families, ambiguous, deterministicMismatches: mismatches, missingLateVariants, errors };
await writeAuthorFile('docs/DIALOGUE_COVERAGE.json', JSON.stringify(report, null, 2) + '\n');
await writeFile('tmp/game-validation/playthroughs.json', JSON.stringify(transcripts, null, 2) + '\n');
const lines = ['# Legacy prototype dialogue coverage — author reference', '', 'Generated by `npm run game:validate`. Contains spoilers. The 378 early/revealed variants below belong to legacy sessions; they are not fresh v1.0 dialogue. See IMPLEMENTATION_05_CONVERSATION_INVENTORY.json and IMPLEMENTATION_05_EVALUATION_AFTER.json for current fresh coverage.', '',
  `- Legacy intent definitions: **${report.intents}** (including unknown).`, `- Legacy recognition examples: **${report.recognitionExamples}**.`, `- Legacy authored response variants: **${report.legacyAuthoredVariants}**.`, `- Legacy unorthodox/easter egg intent triggers: **${report.easterEggTriggers}**.`, `- Explicit legacy follow-up cases checked: **${followupCases.length}**.`, `- Missing legacy late variants: **${report.missingLateVariants.length}**.`, '',
  '| New subject family | Intents | Examples | Authored variants |', '| --- | ---: | ---: | ---: |',
  ...Object.entries(families).map(([f,n]) => `| ${f} | ${n.intents} | ${n.examples} | ${n.variants} |`), '',
  'The opening catalogue is retained separately, with duplicate phrases reassigned to the more specific new intent. Exact examples are regression data, not evidence of performance on unfamiliar wording.', '',
  `## Ambiguity and deterministic coverage`, '', `${ambiguous.length} catalogue phrases request clarification without context. ${mismatches.length} other opening examples use the retained broad keyword parser differently from their semantic label; the optional local model provides the additional route. See the machine-readable report for every case. New dialogue examples and contextual follow-ups are checked independently.`, '',
  ...ambiguous.map(i => `- ${i.text} → ${i.clarification ?? 'name the subject'}`), '',
  '## Validation', '', `Golden paths: ${Object.keys(transcripts).length}. Reducer/save errors: ${errors.length}. Each step uses the same runInput reducer as the UI, with the optional model absent. Full step outputs are written to tmp/game-validation/playthroughs.json.`, '',
  'Human playtime, narrative engagement and physical-device usability remain unmeasured. No 90–120-minute duration is claimed.', '',
];
await writeAuthorFile('docs/DIALOGUE_COVERAGE.md', lines.join('\n'));
const catalogue = ['# Legacy prototype question catalogue — author reference', '', 'Historical authored source, preserved for legacy saves. These are not current fresh v1.0 answers. See IMPLEMENTATION_05_CONVERSATION_INVENTORY.json for the bounded current expansion. Contains spoilers.', ''];
for (const i of g.DIALOGUE) catalogue.push(`## ${i.label} (${i.id})`, '', `Family: ${i.family}. Reveal condition: ${i.gate ?? 'always'}.`, '', `Before: ${i.early}`, '', `After: ${i.revealed}`, '', ...i.examples.map(e => `- ${e}`), '');
for (const i of g.SEMANTIC_CATALOG.filter(i => !i.intent.startsWith('q_') && i.examples.length)) catalogue.push(`## Retained opening: ${i.label} (${i.intent})`, '', 'Authored answers remain in engine/game.ts; these examples also work through deterministic recognition.', '', ...i.examples.map(e => `- ${e}`), '');
await writeAuthorFile('docs/QUESTION_CATALOG.md', catalogue.join('\n'));
console.log(JSON.stringify({ ...report, families: undefined, ambiguous: ambiguous.length, deterministicMismatches: mismatches.length }));
if (errors.length) process.exitCode = 1;
await import('./validate-scenario.mjs');
