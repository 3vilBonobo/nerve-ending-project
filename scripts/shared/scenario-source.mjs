import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
export const scenarioSource = readFileSync('docs/narrative/NERVE_ENDING_PLAYABLE_SCENARIO_SPEC_v1_0.md', 'utf8');
const sections = prefix => [...scenarioSource.matchAll(new RegExp(`^### (${prefix}${prefix === 'M' ? '' : '-'}\\d+) — (.+)\\r?\\n([\\s\\S]*?)(?=^### |^## |$(?![\\s\\S]))`, 'gm'))];
const blocks = text => [...text.matchAll(/```text\r?\n([\s\S]*?)\r?\n```/g)].map(m => m[1].replaceAll('\r\n','\n'));
export const records = sections('NE').map(m => {
  const meta = m[3].match(/\*\*Path:\*\* `([^`]+)`; \*\*Creator\/date:\*\* (.+?); \*\*Access:\*\* ([^;]+)/);
  assert(meta, m[1]);
  return { id:m[1], path:meta[1], title:m[2], author:meta[2], modified:meta[2].match(/\d{2} [A-Z]{3} \d{4}/)?.[0] ?? '', scenarioScope:meta[3].startsWith('ending') ? (m[1] === 'NE-115' ? 'severance' : 'continuation') : meta[3][0], body:blocks(m[3])[0], evidence:[], provenance:'Minimum-necessary witness projection; full clinical chart excluded.' };
});
export const messages = Object.fromEntries(sections('M').map(m => [m[1], blocks(m[3])]));
const endingsSection = scenarioSource.split('## 6. Ending scripts')[1].split('## 7.')[0];
export const receipts = blocks(endingsSection);
assert.equal(records.length,16); assert.equal(Object.keys(messages).length,14); assert.equal(receipts.length,2);
assert(records.every(r => r.body && r.modified));
if (process.argv.includes('--write')) writeFileSync('src/app/core/content/scenario-records.ts', '// Generated from the controlling scenario by scripts/shared/scenario-source.mjs. Do not paraphrase literal bodies.\nimport type { ArchiveFile } from "../models";\nexport const SCENARIO_FILES: readonly ArchiveFile[] = '+JSON.stringify(records,null,2)+';\nexport const SCENE_MESSAGES: Record<string,string[]> = '+JSON.stringify(messages,null,2)+';\nexport const SCENARIO_RECEIPTS: string[] = '+JSON.stringify(receipts,null,2)+';\n');
