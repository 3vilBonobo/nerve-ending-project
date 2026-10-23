# Verification record

## Complete continuation — 20 October 2026

Current results and limitations: [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) and [DIALOGUE_COVERAGE.md](DIALOGUE_COVERAGE.md). The game passes 124 unit/component checks, three golden-path endings, every-step save round trips and the production build. Model results: 50/50 development, 32 answers plus four clarifications in 36 holdout cases, 24/24 continuation regressions, 1,638/1,638 catalogue cases. The 42 MB manifest is verified. Desktop and 390 × 844 viewport checks include loading, search, confirmation focus and cancellation. Playtime and physical-device usability are unmeasured.

The remaining sections are historical opening-preview verification. Their old counts and scope do not describe the continuation.

Revision date: 20 October 2026. Windows, Node 20.19, Angular 21, strict TypeScript.

## Revised investigation

The source-packaging workflow runs npm test and the production build before committing and publishing this revision. The locally cached font and offline service worker are included in the production output.

Checks cover ordinary questions, neutral help, dated source relationships, short record bodies, mouse attachment/backup access, backup access without reading gates, idempotence, classifier action restrictions, hidden-record search exclusion, earlier-save preservation, state round trips, processing/reveal/skip, reduced motion, reset cancellation, and component rendering.

The test runner needs host localhost access for the locally installed Console Ninja hook. This is an environment detail, not a game dependency.

## Browser review

The revised production build was reviewed in the available Chromium in-app browser at 1280 × 720 and 390 × 844. The review covered a fresh revision entry, the queued-call opening, source records, ordinary questions, attached records, backup reading, the explicit session report and continued browsing. At the smaller viewport, the records view and backup control remained usable without horizontal page overflow; the open-record tabs have their own horizontal scroll.

## Limits

No independent human engagement playtest has been performed. A scripted walkthrough does not establish that the story is compelling or establish a play duration. Physical touch devices, a complete assistive-technology audit, disconnected offline cache behaviour and live Ollama were not tested. Later acts remain unimplemented.

## Local model revision

The optional all-MiniLM-L6-v2 q8 browser model is self-hosted with its CPU WASM runtime and runs in a background worker. Ten manifest assets total 36,551,569 bytes; hashes and individual file sizes are checked before publication. The start page and Settings display real byte progress, a percentage, cancellation, preparation and Ready states. Play remains available during loading. Cached loading, cancellation, re-enabling and entering play while loading were verified in Chromium. The model controls were reviewed at 1280 × 720 and 390 × 844 without horizontal page overflow. An actual semantic question displayed 17 ms inference; cached initialization displayed 0.6 seconds on this machine.

The full unit/component suite passes 103 checks. It includes human questions, protected identity/receipt fields, stale workers, timeout fallback and the start-page percentage. Real-model catalogue coverage is 298/298. The 50 development cases pass; 36 additional wording cases produce 33 intended direct answers and three clarifications, without a wrong factual route in that set. These are development/regression measurements, not an independent generalization benchmark. See AI_EXPERIMENTS.md for commands, scope and limits; QUESTION_CATALOG.md lists actual replies without adding examples to player help.

Visual reference and font licence details remain in VISUAL_REFERENCES.md and public/fonts/OFL.txt.
