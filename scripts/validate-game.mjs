import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { isDeepStrictEqual } from 'node:util';

await mkdir('tmp/game-validation', { recursive: true });
const bundle = resolve('tmp/game-validation/game.mjs');
await build({ stdin: { contents: [
  "export * from './src/app/core/engine/game';", "export * from './src/app/core/engine/continuation';",
  "export * from './src/app/core/engine/dialogue';", "export * from './src/app/core/engine/playthroughs';",
  "export * from './src/app/core/interpretation/dialogue-catalog';", "export * from './src/app/core/interpretation/semantic-catalog';",
  "export * from './src/app/core/interpretation/fallback';", "export * from './src/app/core/persistence/saves';",
  "export * from './src/app/core/story-state';", "export * from './src/app/core/content';",
].join('\n'), resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile: bundle });
const g = await import(pathToFileURL(bundle).href);
const errors = []; const ambiguous = []; const mismatches = [];
const key = s => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const seen = new Map();
const late = g.GOLDEN_PATHS.SEVERANCE_COSTLY_COMPASSION.reduce((s,input) => g.runInput(s,input).state, g.newGame());
for (const e of g.SEMANTIC_EXAMPLES) {
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
const report = { intents: new Set(g.SEMANTIC_CATALOG.map(i => i.intent)).size, recognitionExamples: g.SEMANTIC_EXAMPLES.length, newAuthoredVariants: g.DIALOGUE.length * 2, existingOpeningCategories: g.INTENTS?.length ?? 22, easterEggTriggers: g.DIALOGUE.filter(i => i.easterEgg).length, contextAwareFollowupCases: followupCases.length, families, ambiguous, deterministicMismatches: mismatches, missingLateVariants: g.DIALOGUE.filter(i => !i.revealed).map(i => i.id), errors };
await writeFile('docs/DIALOGUE_COVERAGE.json', JSON.stringify(report, null, 2) + '\n');
await writeFile('tmp/game-validation/playthroughs.json', JSON.stringify(transcripts, null, 2) + '\n');
const lines = ['# Dialogue coverage — author reference', '', 'Generated by `npm run game:validate`. Contains spoilers. Authored variant count below counts only new structured early/revealed replies; existing opening replies and live-state variations are additional.', '',
  `- Intent definitions: **${report.intents}** (including the unknown-input category).`, `- Recognition examples: **${report.recognitionExamples}**.`, `- New substantive authored response variants: **${report.newAuthoredVariants}**.`, `- Unorthodox/easter egg intent triggers: **${report.easterEggTriggers}**.`, `- Explicit context-aware follow-up cases checked: **${followupCases.length}**.`, `- Missing late variants: **${report.missingLateVariants.length}**.`, '',
  '| New subject family | Intents | Examples | Authored variants |', '| --- | ---: | ---: | ---: |',
  ...Object.entries(families).map(([f,n]) => `| ${f} | ${n.intents} | ${n.examples} | ${n.variants} |`), '',
  'The opening catalogue is retained separately, with duplicate phrases reassigned to the more specific new intent. Exact examples are regression data, not evidence of performance on unfamiliar wording.', '',
  `## Ambiguity and deterministic coverage`, '', `${ambiguous.length} catalogue phrases request clarification without context. ${mismatches.length} other opening examples use the retained broad keyword parser differently from their semantic label; the optional local model provides the additional route. See the machine-readable report for every case. New dialogue examples and contextual follow-ups are checked independently.`, '',
  ...ambiguous.map(i => `- ${i.text} → ${i.clarification ?? 'name the subject'}`), '',
  '## Validation', '', `Golden paths: ${Object.keys(transcripts).length}. Reducer/save errors: ${errors.length}. Each step uses the same runInput reducer as the UI, with the optional model absent. Full step outputs are written to tmp/game-validation/playthroughs.json.`, '',
  'Human playtime, narrative engagement and physical-device usability remain unmeasured. No 90–120-minute duration is claimed.', '',
];
await writeFile('docs/DIALOGUE_COVERAGE.md', lines.join('\n'));
const catalogue = ['# Player question catalogue — author reference', '', 'Generated from authored source. Contains spoilers. The optional model classifies meaning; it does not write these replies.', ''];
for (const i of g.DIALOGUE) catalogue.push(`## ${i.label} (${i.id})`, '', `Family: ${i.family}. Reveal condition: ${i.gate ?? 'always'}.`, '', `Before: ${i.early}`, '', `After: ${i.revealed}`, '', ...i.examples.map(e => `- ${e}`), '');
await writeFile('docs/QUESTION_CATALOG.md', catalogue.join('\n'));
console.log(JSON.stringify({ ...report, families: undefined, ambiguous: ambiguous.length, deterministicMismatches: mismatches.length }));
if (errors.length) process.exitCode = 1;
