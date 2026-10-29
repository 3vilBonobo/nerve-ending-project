import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('tmp/implementation07',{recursive:true});
await build({stdin:{contents:[
  "export * from './src/app/core/engine/game';",
  "export * from './src/app/core/state/scenario-state';",
  "export * from './src/app/core/interpretation/semantic/semantic';",
  "export * from './src/app/core/interpretation/semantic/semantic-catalog';",
  "export * from './src/app/core/interpretation/basic/fallback';",
  "export * from './src/app/core/persistence/saves';",
  "export * from './src/app/core/content/record-registry';",
  "export * from './src/app/core/qa/events';",
].join('\n'),resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:`tmp/implementation07/${process.argv.includes('--before')?'before':'current'}.mjs`});
