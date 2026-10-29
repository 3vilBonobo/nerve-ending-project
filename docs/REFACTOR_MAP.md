# Source refactor map

Local structural refactor, 29 October 2026. Use this map when a dated implementation report refers to an older path. No compatibility re-export files are left at old locations; imports, build helpers, npm commands and CI references use the new locations. See [the developer guide](../DEVELOPERS.md) for responsibilities and the current source tree.

The pre-existing local changes are carried into the new folders. The reorganization does not change archive IDs, literal scenario bodies, save keys, model examples or the story's consent/disclosure rules.

## App shell and UI

| Previous path | Current path |
| --- | --- |
| `src/app/app.ts` | [src/app/shell/app.ts](../src/app/shell/app.ts) |
| `src/app/app.html` | [src/app/shell/app.html](../src/app/shell/app.html) |
| `src/app/app.spec.ts` | [src/app/shell/app.spec.ts](../src/app/shell/app.spec.ts) |
| `src/app/app-welcome.spec.ts` | [src/app/shell/app-welcome.spec.ts](../src/app/shell/app-welcome.spec.ts) |
| `src/app/app-scenario.spec.ts` | [src/app/shell/app-scenario.spec.ts](../src/app/shell/app-scenario.spec.ts) |
| `src/app/app-bitmaps.spec.ts` | [src/app/shell/app-bitmaps.spec.ts](../src/app/shell/app-bitmaps.spec.ts) |
| `src/app/features/files/file-browser.ts` | [src/app/features/file-browser/file-browser.ts](../src/app/features/file-browser/file-browser.ts) |
| `src/app/features/documents/document.ts` | [src/app/features/records/document-window/document.ts](../src/app/features/records/document-window/document.ts) |
| `src/app/features/documents/bitmap-viewer.ts` | [src/app/features/records/bitmap-viewer/bitmap-viewer.ts](../src/app/features/records/bitmap-viewer/bitmap-viewer.ts) |
| `src/app/features/documents/bitmap-viewer.html` | [src/app/features/records/bitmap-viewer/bitmap-viewer.html](../src/app/features/records/bitmap-viewer/bitmap-viewer.html) |
| `src/app/features/documents/bitmap-viewer.css` | [src/app/features/records/bitmap-viewer/bitmap-viewer.css](../src/app/features/records/bitmap-viewer/bitmap-viewer.css) |
| `src/app/features/documents/bitmap-viewer.spec.ts` | [src/app/features/records/bitmap-viewer/bitmap-viewer.spec.ts](../src/app/features/records/bitmap-viewer/bitmap-viewer.spec.ts) |
| `src/app/features/qa/qa-panel.ts` | [src/app/features/qa-panel/qa-panel.ts](../src/app/features/qa-panel/qa-panel.ts) |
| `src/app/features/qa/qa-panel.html` | [src/app/features/qa-panel/qa-panel.html](../src/app/features/qa-panel/qa-panel.html) |
| `src/app/features/qa/qa-panel.spec.ts` | [src/app/features/qa-panel/qa-panel.spec.ts](../src/app/features/qa-panel/qa-panel.spec.ts) |

## Core content and state

| Previous path | Current path |
| --- | --- |
| `src/app/core/content.ts` | [src/app/core/content/record-registry.ts](../src/app/core/content/record-registry.ts) |
| `src/app/core/corporate-records.ts` | [src/app/core/content/corporate-records.ts](../src/app/core/content/corporate-records.ts) |
| `src/app/core/service-records.ts` | [src/app/core/content/service-records.ts](../src/app/core/content/service-records.ts) |
| `src/app/core/bitmap-records.ts` | [src/app/core/content/bitmap-records.ts](../src/app/core/content/bitmap-records.ts) |
| `src/app/core/story-records.ts` | [src/app/core/content/story-records.ts](../src/app/core/content/story-records.ts) |
| `src/app/core/scenario-records.ts` | [src/app/core/content/scenario-records.ts](../src/app/core/content/scenario-records.ts) |
| `src/app/core/session.ts` | [src/app/core/state/session.ts](../src/app/core/state/session.ts) |
| `src/app/core/story-state.ts` | [src/app/core/state/story-state.ts](../src/app/core/state/story-state.ts) |
| `src/app/core/scenario-state.ts` | [src/app/core/state/scenario-state.ts](../src/app/core/state/scenario-state.ts) |
| `src/app/core/observations.ts` | [src/app/core/investigation/observations.ts](../src/app/core/investigation/observations.ts) |
| `src/app/core/investigation-journal.ts` | [src/app/core/investigation/investigation-journal.ts](../src/app/core/investigation/investigation-journal.ts) |

## Gameplay engine

| Previous path | Current path |
| --- | --- |
| `src/app/core/engine/investigation.ts` | [src/app/core/engine/opening/investigation.ts](../src/app/core/engine/opening/investigation.ts) |
| `src/app/core/engine/investigation.spec.ts` | [src/app/core/engine/opening/investigation.spec.ts](../src/app/core/engine/opening/investigation.spec.ts) |
| `src/app/core/engine/corporate.ts` | [src/app/core/engine/corporate/corporate.ts](../src/app/core/engine/corporate/corporate.ts) |
| `src/app/core/engine/corporate.spec.ts` | [src/app/core/engine/corporate/corporate.spec.ts](../src/app/core/engine/corporate/corporate.spec.ts) |
| `src/app/core/engine/services.ts` | [src/app/core/engine/services/services.ts](../src/app/core/engine/services/services.ts) |
| `src/app/core/engine/services.spec.ts` | [src/app/core/engine/services/services.spec.ts](../src/app/core/engine/services/services.spec.ts) |
| `src/app/core/engine/continuation.ts` | [src/app/core/engine/story/continuation.ts](../src/app/core/engine/story/continuation.ts) |
| `src/app/core/engine/continuation.spec.ts` | [src/app/core/engine/story/continuation.spec.ts](../src/app/core/engine/story/continuation.spec.ts) |
| `src/app/core/engine/playthroughs.ts` | [src/app/core/engine/story/playthroughs.ts](../src/app/core/engine/story/playthroughs.ts) |
| `src/app/core/engine/scenario.ts` | [src/app/core/engine/scenario/scenario.ts](../src/app/core/engine/scenario/scenario.ts) |
| `src/app/core/engine/scenario.spec.ts` | [src/app/core/engine/scenario/scenario.spec.ts](../src/app/core/engine/scenario/scenario.spec.ts) |
| `src/app/core/engine/scenario-playthroughs.ts` | [src/app/core/engine/scenario/scenario-playthroughs.ts](../src/app/core/engine/scenario/scenario-playthroughs.ts) |
| `src/app/core/engine/dialogue.ts` | [src/app/core/engine/conversation/dialogue.ts](../src/app/core/engine/conversation/dialogue.ts) |
| `src/app/core/engine/mother-conversation.ts` | [src/app/core/engine/conversation/mother-conversation.ts](../src/app/core/engine/conversation/mother-conversation.ts) |
| `src/app/core/engine/mother-conversation.spec.ts` | [src/app/core/engine/conversation/mother-conversation.spec.ts](../src/app/core/engine/conversation/mother-conversation.spec.ts) |
| `src/app/core/engine/fresh-conversation.ts` | [src/app/core/engine/conversation/fresh-conversation.ts](../src/app/core/engine/conversation/fresh-conversation.ts) |
| `src/app/core/engine/responsive-investigation.ts` | [src/app/core/engine/conversation/responsive-investigation.ts](../src/app/core/engine/conversation/responsive-investigation.ts) |
| `src/app/core/engine/response-trace.ts` | [src/app/core/engine/conversation/response-trace.ts](../src/app/core/engine/conversation/response-trace.ts) |
| `src/app/core/engine/conversation.spec.ts` | [src/app/core/engine/conversation/conversation.spec.ts](../src/app/core/engine/conversation/conversation.spec.ts) |
| `src/app/core/engine/responsive-investigation.spec.ts` | [src/app/core/engine/conversation/responsive-investigation.spec.ts](../src/app/core/engine/conversation/responsive-investigation.spec.ts) |

## Question interpretation

| Previous path | Current path |
| --- | --- |
| `src/app/core/interpretation/fallback.ts` | [src/app/core/interpretation/basic/fallback.ts](../src/app/core/interpretation/basic/fallback.ts) |
| `src/app/core/interpretation/corporate-questions.ts` | [src/app/core/interpretation/basic/corporate-questions.ts](../src/app/core/interpretation/basic/corporate-questions.ts) |
| `src/app/core/interpretation/service-questions.ts` | [src/app/core/interpretation/basic/service-questions.ts](../src/app/core/interpretation/basic/service-questions.ts) |
| `src/app/core/interpretation/opening-questions.ts` | [src/app/core/interpretation/basic/opening-questions.ts](../src/app/core/interpretation/basic/opening-questions.ts) |
| `src/app/core/interpretation/interpretation.spec.ts` | [src/app/core/interpretation/basic/interpretation.spec.ts](../src/app/core/interpretation/basic/interpretation.spec.ts) |
| `src/app/core/interpretation/semantic.ts` | [src/app/core/interpretation/semantic/semantic.ts](../src/app/core/interpretation/semantic/semantic.ts) |
| `src/app/core/interpretation/semantic-catalog.ts` | [src/app/core/interpretation/semantic/semantic-catalog.ts](../src/app/core/interpretation/semantic/semantic-catalog.ts) |
| `src/app/core/interpretation/dialogue-catalog.ts` | [src/app/core/interpretation/conversation/dialogue-catalog.ts](../src/app/core/interpretation/conversation/dialogue-catalog.ts) |
| `src/app/core/interpretation/dialogue-matching.ts` | [src/app/core/interpretation/conversation/dialogue-matching.ts](../src/app/core/interpretation/conversation/dialogue-matching.ts) |
| `src/app/core/interpretation/fresh-topics.ts` | [src/app/core/interpretation/conversation/fresh-topics.ts](../src/app/core/interpretation/conversation/fresh-topics.ts) |
| `src/app/core/interpretation/mother-routing.ts` | [src/app/core/interpretation/conversation/mother-routing.ts](../src/app/core/interpretation/conversation/mother-routing.ts) |
| `src/app/core/interpretation/mother-corpus.ts` | [src/app/core/interpretation/conversation/mother-corpus.ts](../src/app/core/interpretation/conversation/mother-corpus.ts) |
| `src/app/core/interpretation/browser-ai.ts` | [src/app/core/interpretation/local-model/browser-ai.ts](../src/app/core/interpretation/local-model/browser-ai.ts) |
| `src/app/core/interpretation/browser-ai.spec.ts` | [src/app/core/interpretation/local-model/browser-ai.spec.ts](../src/app/core/interpretation/local-model/browser-ai.spec.ts) |
| `src/app/core/interpretation/language.worker.ts` | [src/app/core/interpretation/local-model/language.worker.ts](../src/app/core/interpretation/local-model/language.worker.ts) |
| `src/app/core/interpretation/language-protocol.ts` | [src/app/core/interpretation/local-model/language-protocol.ts](../src/app/core/interpretation/local-model/language-protocol.ts) |
| `src/app/core/interpretation/language-location.ts` | [src/app/core/interpretation/local-model/language-location.ts](../src/app/core/interpretation/local-model/language-location.ts) |
| `src/app/core/interpretation/language-location.spec.ts` | [src/app/core/interpretation/local-model/language-location.spec.ts](../src/app/core/interpretation/local-model/language-location.spec.ts) |
| `src/app/core/interpretation/local-language.ts` | [src/app/core/interpretation/local-model/local-language.ts](../src/app/core/interpretation/local-model/local-language.ts) |

## Developer tools

| Previous path | Current path |
| --- | --- |
| `scripts/generate-icons.mjs` | [scripts/assets/generate-icons.mjs](../scripts/assets/generate-icons.mjs) |
| `scripts/bitmap-fixtures.mjs` | [scripts/assets/bitmap-fixtures.mjs](../scripts/assets/bitmap-fixtures.mjs) |
| `scripts/serve.mjs` | [scripts/preview/serve.mjs](../scripts/preview/serve.mjs) |
| `scripts/prepare-language-model.mjs` | [scripts/model/prepare-language-model.mjs](../scripts/model/prepare-language-model.mjs) |
| `scripts/verify-language-assets.mjs` | [scripts/model/verify-language-assets.mjs](../scripts/model/verify-language-assets.mjs) |
| `scripts/evaluate-language-model.mjs` | [scripts/model/evaluate-language-model.mjs](../scripts/model/evaluate-language-model.mjs) |
| `scripts/analyze-mother-labels.mjs` | [scripts/conversation/analyze-mother-labels.mjs](../scripts/conversation/analyze-mother-labels.mjs) |
| `scripts/ingest-mother-conversations.mjs` | [scripts/conversation/ingest-mother-conversations.mjs](../scripts/conversation/ingest-mother-conversations.mjs) |
| `scripts/inventory-mother-conversations.mjs` | [scripts/conversation/inventory-mother-conversations.mjs](../scripts/conversation/inventory-mother-conversations.mjs) |
| `scripts/evaluate-mother-conversations.mjs` | [scripts/conversation/evaluate-mother-conversations.mjs](../scripts/conversation/evaluate-mother-conversations.mjs) |
| `scripts/evaluate-fresh-conversation.mjs` | [scripts/conversation/evaluate-fresh-conversation.mjs](../scripts/conversation/evaluate-fresh-conversation.mjs) |
| `scripts/evaluate-investigation07.mjs` | [scripts/conversation/evaluate-investigation07.mjs](../scripts/conversation/evaluate-investigation07.mjs) |
| `scripts/validate-services.mjs` | [scripts/validation/validate-services.mjs](../scripts/validation/validate-services.mjs) |
| `scripts/validate-scenario.mjs` | [scripts/validation/validate-scenario.mjs](../scripts/validation/validate-scenario.mjs) |
| `scripts/validate-pages-artifact.mjs` | [scripts/validation/validate-pages-artifact.mjs](../scripts/validation/validate-pages-artifact.mjs) |
| `scripts/validate-opening.mjs` | [scripts/validation/validate-opening.mjs](../scripts/validation/validate-opening.mjs) |
| `scripts/validate-game.mjs` | [scripts/validation/validate-game.mjs](../scripts/validation/validate-game.mjs) |
| `scripts/validate-corporate.mjs` | [scripts/validation/validate-corporate.mjs](../scripts/validation/validate-corporate.mjs) |
| `scripts/validate-bitmaps.mjs` | [scripts/validation/validate-bitmaps.mjs](../scripts/validation/validate-bitmaps.mjs) |
| `scripts/scenario-source.mjs` | [scripts/shared/scenario-source.mjs](../scripts/shared/scenario-source.mjs) |
| `scripts/implementation07-runtime.mjs` | [scripts/shared/implementation07-runtime.mjs](../scripts/shared/implementation07-runtime.mjs) |

## Extracted responsibilities

| Former location | Current owner |
| --- | --- |
| Browser/model/cache/install settings inside the app shell | [features/settings/](../src/app/features/settings/) with its own template and tests |
| Inline file browser template | [file-browser.html](../src/app/features/file-browser/file-browser.html) |
| Inline text record template | [document.html](../src/app/features/records/document-window/document.html) |
| Inline journal markup/styles | [journal.html](../src/app/features/journal/journal.html) and [journal.css](../src/app/features/journal/journal.css) |
| Routing, facts, review, decisions, hints and ending rendering in the large scenario module | Separate helpers in [engine/scenario/](../src/app/core/engine/scenario/); scenario.ts remains the orchestrator and preserves its exports |
| Semantic ranking tests in browser-ai.spec.ts | [semantic.spec.ts](../src/app/core/interpretation/semantic/semantic.spec.ts); worker tests remain beside browser-ai.ts |
| Monolithic global src/styles.css | Ordered imports of base, setup, desktop, settings, responsive, motion and overrides under [src/styles/](../src/styles/) |

New component tests cover the welcome, file browser, document window and extracted settings. Every current Angular component has an adjacent test file. Shared dialog test support lives in [browser.test-helper.ts](../src/app/testing/browser.test-helper.ts). [validate-structure.mjs](../scripts/validation/validate-structure.mjs) checks component pairing, npm tool paths and the TypeScript entry paths bundled by Node validators.
