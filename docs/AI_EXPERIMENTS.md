# Local language model — implementation and verification

## Complete-game revision — 20 October 2026

The current catalogue has 205 intent definitions, 1,638 examples and 378 new early/revealed reply variants. Ten local assets total 41,906,219 bytes. Current checks: 50/50 development answers, 32 direct answers plus four clarifications in 36 retained holdout cases, 24/24 continuation regression cases, and 1,638/1,638 catalogue cases with context for short pronouns. `npm run model:continuation` runs the added suite. See [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) for scope and limitations. The sections below retain the original opening's measurements as development history, not current coverage totals.

The game always includes its basic interpreter. The optional browser model is implemented and was exercised in the Chromium in-app browser. No model server, API key or Ollama installation is required by players.

## Model and assets

- Model: Xenova/all-MiniLM-L6-v2, revision 751bff37182d3f1213fa05d7196b954e230abad9.
- Quantization: q8, mean-pooled normalized 384-dimensional sentence vectors.
- Runtime: Transformers.js 3.8.1 with the CPU-only ONNX Runtime Web WASM backend; one thread, no WebGPU requirement.
- Download: 36,551,569 bytes for the ten manifest assets, including about 23 MB of model weights, WASM, runtime and recognition vectors. The small manifest and app worker are additional overhead.
- Licences: model and Transformers.js Apache 2.0; ONNX Runtime MIT. Licence files and upstream model card are retained under public/language/v1/.
- Player requests use same-origin static assets. Questions are never sent to an inference server. Developer-only Ollama controls remain a separate comparison option.

All assets are committed. A normal build needs no model-hub connection. To recreate them, run npm run model:prepare, then npm run model:references, then npm run model:catalogue. Preparation pins the model revision, checks the upstream weight checksum and records asset hashes. npm run model:verify checks the supplied bytes before packaging.

## Download and runtime behavior

The first download requires explicit enablement on the start page or in Settings. Both show a percentage based on real bytes prepared, byte totals, cancellation and a distinct initialization stage. Start/resume stays available. The preference is remembered separately from investigation saves. Later visits initialize the enabled model again, using cached bytes where present. Browser eviction can require a new download.

The worker uses a versioned Cache API store. Denied storage permits in-memory use for the current visit. A cached manifest can be used after a network failure. Runtime and WASM modules are created from saved bytes, so inference does not depend on a model CDN. The WASM module uses explicit module and binary URLs; an inline binary override with a blob module did not initialize in the reviewed browser and was replaced. Temporary buffers and URLs are released after warmup.

Ready means the runtime, tokenizer, model, catalogue and first inference have all completed. Failed loading or inference returns control to the basic interpreter. Loading can be cancelled; inference has a five-second timeout. A terminated worker cannot complete a stale request.

## Recognition and answers

semantic-catalog.ts contains 298 recognition examples across identity, place/company, staff, calls, recipients, office, running services, shutdown, records, backups, approval, dates, access, record reliability, controls and unsupported subjects. The developer-only QUESTION_CATALOG.md lists their actual initial answers. Player HELP remains short and does not expose that catalogue.

The model compares meaning against these examples. Similarity is not a calibrated probability. A threshold and a margin between distinct meanings decide whether to answer or clarify. Restricted spelling repair preserves codes and paths. Context contains the last subject, selected document and previous question category. Explicit file operations and backup requests remain deterministic; asking what a receipt shows does not open it.

The model never generates story text. engine/game.ts selects short authored replies and source links. Missing facts stay missing. Initial identity/place questions describe the records interface and company without exposing later identity. The backup-read state gates protected receipt fields; opening the backup does not unlock later acts or the hidden full identity.

## Measurements and evaluation limits

The real cached browser load displayed 0.6 seconds; an actual semantic question displayed 17 ms inference in Settings. These are single observations on this machine, not promised device performance. The first download was observed progressing through byte percentages before initialization. Cancel/retry and responsive rendering are part of browser QA.

The current catalogue coverage run routes 298/298 examples as intended. This is a self-coverage check, not generalization. Fifty development examples pass. The separate 36-question wording set returns 33 intended direct answers and three clarifications, with no wrong factual route in that set. The rules-only interpreter recognizes 18/36 in that set. The additional wording set was inspected during implementation and is now a regression suite, not an independent blind benchmark. Node timing in its generated report is not a browser performance claim.

Commands: npm run model:evaluate, npm run model:holdout and npm run model:catalogue. Full reports are written under ignored tmp/. Evaluation fails on wrong factual routes or direct accuracy below 85%; legitimate clarification is reported separately. Unit/component checks cover byte progress, warmup readiness, cancellation, late results, timeouts, unknown queries, context, vocabulary repair, operation boundaries and protected story facts.

Physical mobile devices, a disconnected browser session, cache eviction, storage denial in a real browser and a complete assistive-technology audit have not been verified. No independent human engagement playtest has been performed. The model currently supports English questions about the implemented preview; future acts require new authored answers and recognition examples. It is not an unrestricted conversation generator.
