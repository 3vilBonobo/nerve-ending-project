# AI experiments and actual implementation status

## Shipped behavior

The deterministic offline interpreter is implemented and tested with 31 varied question examples plus ambiguity and failure handling. It performs no network requests, needs no weights, and is sufficient to finish Act 01. It normalizes case, apostrophes and punctuation, resolves authored file aliases and service-six variations, and retains a small last-topic/last-intent context.

It is a topic classifier rather than an open-ended conversational system. The game engine selects every answer from authored text and validates all transitions. Original evidence does not change when it is queried.

## Browser AI — not implemented

No WebLLM or Transformers.js runtime has been integrated. No model has been selected, downloaded, licensed for this distribution, loaded, benchmarked, or tested in a target browser. There is therefore **no tested model ID, model download size, model license, load time, or inference timing** to report.

`BrowserAIInterpreter.isAvailable()` returns false and its inference method raises an explicit unavailable error. Setup and settings show **UNAVAILABLE**, and no download button imitates an installer. WebGPU detection is informational only; the app correctly states that this does not prove model compatibility. The initial bundle contains no AI runtime or weights.

Concrete next steps:

1. Select a small classification-capable model with a verified redistribution license and documented runtime support. Evaluate actual download bytes, memory, initialization, and latency before deciding it is practical.
2. Add its runtime via a lazy import inside a provider, leaving the initial app and game engine independent.
3. Add explicit opt-in with the actual model ID, download estimate, honest progress from the runtime, and cancellation/error handling. Never start a weight download on page render.
4. Test cold download, browser cache recovery/eviction, denied persistent storage, WebGPU adapter/device failures, and a representative question corpus on real desktop and mobile targets.
5. Feed only validated intent JSON through `interpretSafely`. Measure model load time separately from inference and document unsupported browsers. Retain the deterministic fallback and complete-game regression tests.

## Ollama developer comparison

The HTTP adapter is implemented, with explicit model/endpoint selection in **development settings only**. No real Ollama daemon/model was available during this implementation, so live network/CORS compatibility and classification quality are **unverified**. Tests cover the provider boundary, rejection, unavailable providers, malformed output, unknown labels, timeout, and copied context.

To try it:

1. Run Ollama as a separate local service using its official installation instructions and install a model appropriate for your device.
2. Configure that daemon to allow the specific development origin (`http://127.0.0.1:4200` or `http://localhost:4200`) as required by its CORS settings; consult the current [Ollama FAQ](https://docs.ollama.com/faq).
3. Run `npm start`, open **DISPLAY & SETTINGS → DEVELOPER / INTENT CLASSIFIER**, enter the actual installed model name, and select **USE OLLAMA**.
4. Ask a question. Commands bypass classification. Diagnostics show observed query count, mean interpretation time, and fallback rate. Failed requests revert to the offline classifier; **USE OFFLINE** selects it explicitly.

The adapter POSTs to `/api/chat` using `stream: false`, `format: 'json'`, a classification-only system prompt, and a six-second request abort. The outer boundary has a 6.5-second timeout. It restricts endpoints to HTTP(S) loopback addresses. It does not discover or download models. Do not expose raw Ollama to the internet or allow arbitrary remote origins.

The prompt contains allowed labels, accessible initial file IDs, small topic context, and user input. It excludes hidden later-act story content. Validation strips unrecognized fields and rejects invented entities, inaccessible records, unsupported intents, or invalid request fields. An AI request cannot directly mutate state, issue commands, or generate in-world prose.

## Measurements

Production build size is recorded in `VERIFICATION.md`. Runtime development diagnostics measure the complete interpretation boundary using `performance.now()`; fallback timing includes failed provider time where applicable. They are not model benchmarks. No analytics or telemetry is transmitted.
