import {build} from 'esbuild';
import {mkdir} from 'node:fs/promises';
await mkdir('tmp/implementation07',{recursive:true});
await build({stdin:{contents:[
  "export * from './src/app/core/engine/game';",
  "export * from './src/app/core/scenario-state';",
  "export * from './src/app/core/interpretation/semantic';",
  "export * from './src/app/core/interpretation/semantic-catalog';",
  "export * from './src/app/core/interpretation/fallback';",
  "export * from './src/app/core/persistence/saves';",
  "export * from './src/app/core/content';",
  "export * from './src/app/core/qa/events';",
].join('\n'),resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',outfile:`tmp/implementation07/${process.argv.includes('--before')?'before':'current'}.mjs`});
