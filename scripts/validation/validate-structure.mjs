import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path)); else result.push(path);
  }
  return result;
}
async function exists(path) { try { await access(path); return true; } catch { return false; } }
const app = await walk('src/app');
const components = [];
const componentFolders = new Set();
for (const path of app.filter(path => path.endsWith('.ts') && !path.endsWith('.spec.ts'))) {
  const source = await readFile(path, 'utf8');
  if (!/@Component\s*\(/.test(source)) continue;
  const directory = dirname(path);
  assert.ok(!componentFolders.has(directory), `Two component controllers share ${directory}`);
  componentFolders.add(directory);
  const name = basename(path, '.ts');
  assert.ok(await exists(resolve(directory, `${name}.spec.ts`)), `Missing component tests: ${path}`);
  const template = source.match(/templateUrl:\s*['"]([^'"]+)['"]/)?.[1];
  assert.ok(template && await exists(resolve(directory, template)), `Missing component template: ${path}`);
  const style = source.match(/styleUrl:\s*['"]([^'"]+)['"]/)?.[1];
  if (style) assert.ok(await exists(resolve(directory, style)), `Missing component stylesheet: ${path}`);
  components.push(path.replace(resolve('.') + '\\', '').replaceAll('\\', '/'));
}
// Node validators bundle TypeScript entry strings separately from Angular's import graph.
let toolEntries = 0;
for (const path of (await walk('scripts')).filter(path => path.endsWith('.mjs'))) {
  const source = await readFile(path, 'utf8');
  for (const match of source.matchAll(/['"](\.\/src\/[^'"\s]+)['"]/g)) {
    assert.ok(await exists(`${match[1]}.ts`) || await exists(match[1]), `Stale bundled entry in ${path}: ${match[1]}`);
    toolEntries++;
  }
  for (const match of source.matchAll(/\bfrom\s*['"](\.[^'"\n]+)['"]/g)) {
    // Ignore generated TypeScript text embedded in the record-authoring tool.
    if (!match[1].endsWith('.mjs')) continue;
    assert.ok(await exists(resolve(dirname(path), match[1])), `Stale helper import in ${path}: ${match[1]}`);
  }
}
const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
for (const [name, command] of Object.entries(packageJson.scripts)) {
  for (const match of command.matchAll(/\bnode\s+(scripts\/[^\s]+\.mjs)/g)) assert.ok(await exists(match[1]), `Stale npm script ${name}: ${match[1]}`);
}
assert.deepEqual((await readdir('src/app/core', { withFileTypes: true })).filter(entry => entry.isFile()).map(entry => entry.name), ['models.ts'], 'Shared core root should only hold the common type contract.');
console.log(JSON.stringify({ componentFolders: components.length, colocatedComponentTests: components.length, toolEntries, components }, null, 2));
