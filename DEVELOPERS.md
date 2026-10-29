# Developer guide

Nerve Ending is a browser-based investigation presented as Meridian Systems' 2003 remote client, with an older terminal inside it. This guide describes the current source layout. It contains implementation and story spoilers. Dated implementation reports under `docs/` describe earlier deliveries and may use older paths; use [the move map](docs/REFACTOR_MAP.md) to find their current locations.

The application uses Angular 21, strict TypeScript, signals, plain CSS and browser storage. There is no application backend. The optional local sentence model recognizes intent; authored code selects every reply and controls every story transition. The structural refactor preserves the existing story, record IDs, save keys, recognition examples and visual design.

## Start here

1. Read `src/app/core/models.ts` for shared contracts and `core/state/scenario-state.ts` for the current investigation ledger.
2. Follow `core/engine/game.ts` → `runInput()` for dispatch and `inspectFile()` for record access.
3. Read `core/state/session.ts` to see how UI input, recognition, saves, playback and QA are connected.
4. Open `shell/app.ts` and `shell/app.html` for the desktop layout. Each feature's controller, template and tests are together.
5. Read the [narrative index](docs/narrative/README.md) before changing story facts or authored dialogue. Not every supplied draft has the same authority.

All paths below are relative to the repository root.

## Source layout

```text
src/
  main.ts                           Angular bootstrap
  app/
    shell/                          App composition, desktop windows, integration tests
    features/
      welcome/                      Start/resume and introductory sequence
      terminal/                     Input, output history, typing/skip controls
      file-browser/                 Search and navigate permitted files
      records/
        document-window/            Text records, provenance, permitted references
        bitmap-viewer/              Bitmap loading, scaling and image controls
      journal/                      Findings, unresolved observations, read-only shortcuts
      settings/                     Display, optional model, cache/install status, QA entry
      qa-panel/                     Opt-in local recordings, feedback and export
    core/
      models.ts                     Shared state, intent, record and transition types
      content/                      Authored records and public registries
      state/                        Session orchestration, scenario and legacy story state
      engine/
        game.ts                     Shared dispatcher and transition boundary
        commands.ts                 Terminal grammar and virtual paths
        opening/                    Retained prototype opening verification
        corporate/                  Public company and personnel answers
        services/                   STATUS, INFO, LOG and service observations
        conversation/               MOTHER voice, context and responsive investigation
        scenario/                   Current v1.0 progression, review and outcomes
        story/                      Retained prototype operations and endings
      investigation/                Observations, evidence provenance and journal sections
      interpretation/
        basic/                      Deterministic fallback and factual question rules
        conversation/               Authored topic catalogues and question routing
        semantic/                   Similarity ranking, confidence and catalogue assembly
        local-model/                Model lifecycle, worker, protocol and asset locations
        providers.ts                Provider validation and optional developer adapter
        deterministic.ts            Shared recognition rules and spelling repair
        base-catalog.ts             Retained recognition examples
      persistence/                  Save encoding, validation and migration
      presentation/                 Processing delay and gradual terminal playback
      qa/                           Separate local telemetry, redaction and IndexedDB
    testing/                        Browser API stubs shared by component tests
  styles.css                        Ordered global stylesheet entry
  styles/                           Base, setup, desktop, settings, responsive, motion, overrides
public/                             Shipped fonts, bitmap demos, icons and local model assets
tests/                              Evaluation fixtures consumed by Node scripts
scripts/                            Tooling grouped by responsibility (see below)
docs/                               Narrative sources, historical reports and developer references
```

## How a turn works

`Terminal` submits a string to `Session.submit()`. Session starts the processing indicator and optionally asks an interpreter for a bounded intent. `engine/game.ts` evaluates the player's raw input and current state, then returns a `Transition`: next state, authored output and optional file to open. Session records opted-in QA, commits and saves the complete result, and lets `TerminalPlayback` reveal the text gradually. Skipping the animation changes presentation only.

The engine can run without Angular or a model; the playthrough validators use it directly. UI components call Session rather than editing story events themselves. `Session.files` comes from `accessibleFiles()`. `inspectFile()` checks access again, and an already-open document rechecks current access. A known record ID, a search result or a remembered answer is not a grant to disclose it.

Current investigation observations and established conclusions are distinct. `investigation/observations.ts` records the source and time of facts the player has actually encountered. `investigation-journal.ts` presents those observations and unresolved comparisons. An explicit, supported investigation request advances the validated event ledger. Ordinary browsing cannot silently complete a review.

Dispatch order is intentional: ordinary questions, discussion, historical follow-up and procedural requests must keep their existing meaning. Optional recognition helps select answers; it cannot create a clinical review or final decision. Consequential choices retain their preview and separate typed `CONFIRM OPERATION`. Do not turn a recognition match or a journal button into consent.

## Current scenario and retained prototype

Fresh games use the v1.0 scenario and schema 6. `state/scenario-state.ts` validates its event order and derives the case clock and available projections. `engine/scenario/scenario.ts` coordinates the per-input draft and progression. Its helpers have deliberately narrow responsibilities:

| Module | Responsibility |
| --- | --- |
| `scenario-routing.ts` | Raw-input family and non-action discussion guards |
| `scenario-context.ts` | Per-input draft interface shared by handlers |
| `scenario-answers.ts` | Bounded factual questions and read-only replies |
| `scenario-review.ts` | Review receipts, signatures and risk review |
| `scenario-decisions.ts` | Pending choice, confirmation, cancellation and deferral |
| `scenario-endings.ts` | Approved ending receipts and outcome presentation |
| `scenario-hints.ts` | Stage-dependent guidance |
| `scenario-text.ts` | Shared literal-message/text helpers |
| `scenario-playthroughs.ts` | Reproducible routes and paraphrase fixtures |

`engine/story/`, `engine/opening/`, `state/story-state.ts` and `content/story-records.ts` also support older saved prototype investigations. They are still used by access rules and legacy save behavior. Keep the branches explicit; do not transfer old clinical permissions into a fresh scenario or remove them as apparent duplicates. Save validation lives in `persistence/saves.ts`.

## Where to make changes

| Change | Start with | Verification |
| --- | --- | --- |
| Desktop or window behavior | `shell/app.*` | Shell integration tests |
| A UI feature | Its folder under `features/` | Its adjacent `.spec.ts` |
| New record or record metadata | `content/record-registry.ts` and the relevant `*-records.ts` | Access tests and relevant source validator |
| Public company/personnel answers | `content/corporate-records.ts`, `engine/corporate/`, `interpretation/basic/corporate-questions.ts` | Corporate tests and validator |
| Service facts/logs | `content/service-records.ts`, `engine/services/`, `interpretation/basic/service-questions.ts` | Service tests and validator |
| Observation or journal behavior | `investigation/`, `engine/conversation/responsive-investigation.ts` | Responsive investigation tests |
| MOTHER topics and disclosure | `interpretation/conversation/`, `engine/conversation/` | Conversation tests and evaluation fixtures |
| Current review or ending | `state/scenario-state.ts`, `engine/scenario/` | Scenario tests and both playthrough outcomes |
| Recognition or confidence | `interpretation/basic/`, `semantic/`, `deterministic.ts` | Semantic/basic tests, model evaluation as appropriate |
| Model loading/progress/cancel | `interpretation/local-model/`, `features/settings/` | Worker/model tests, asset verification |
| Typing delay or output reveal | `presentation/terminal-playback.ts`, `features/terminal/` | Terminal tests including skip/reduced motion |
| Save compatibility | `persistence/saves.ts` | Save migration and round-trip tests |
| QA recording/export/privacy | `qa/`, `features/qa-panel/` | Database, telemetry and panel tests |

Keep each component in its own folder with a matching `.ts`, `.html`, `.spec.ts` and, when it needs private styling, `.css`. Component tests cover meaningful behavior, not a copy of the template. Cross-feature tests stay in `shell/` or at the engine entry point. Core tests live beside the behavior they exercise. `src/app/testing/browser.test-helper.ts` contains jsdom dialog support; it is excluded from application compilation.

`src/styles.css` imports the global CSS in its existing cascade order: base → setup → desktop → settings → responsive → motion → overrides. Preserve that order when moving rules. Component-only welcome, bitmap and journal styles stay next to their component. Shared terminal/window rules remain global because several features use them.

## Authored and generated data

Read `docs/narrative/README.md` for source authority and unresolved canon. `NERVE_ENDING_PLAYABLE_SCENARIO_SPEC_v1_0.md` supplies the controlled scenario records, message groups and receipts. `scripts/shared/scenario-source.mjs` extracts them into `core/content/scenario-records.ts`. Preserve literal bodies; edit the controlling source through the narrative workflow before regenerating with `node scripts/shared/scenario-source.mjs --write`.

The MOTHER author pack and conversation bible feed `core/interpretation/conversation/mother-corpus.ts`. `npm run mother:ingest` checks that generated file without rewriting it; the underlying ingestion tool supports `--write` for an intentional author-pack update. Keep recognition examples separate from response text and disclosure gates. Editing question examples may require regenerating the local embeddings with `npm run model:references`, then running the appropriate model evaluations. Do not regenerate model data just to move a source file.

`public/` ships with the static site, including local-model assets and the ordinary bitmap demonstrations. Runtime UI gates are gameplay rules, not protection for shipped bytes. Authored restricted narrative sources remain under `docs/`; they are not imported wholesale into the app.

QA logging is off by default and uses the separate `nerve-ending-qa` IndexedDB database. Game saves use localStorage and retain older save keys for compatibility. Restarting an investigation must not erase QA recordings. See [QA logging](docs/QA_LOGGING.md) for export and redaction details.

## Tooling and checks

Run scripts from the repository root; data and build paths intentionally resolve from the working directory.

| Folder | Purpose |
| --- | --- |
| `scripts/validation/` | Source, gameplay, structure and packaging checks |
| `scripts/conversation/` | Author-pack ingestion, inventory and conversation evaluation |
| `scripts/model/` | Local model preparation, asset checks and recognition evaluation |
| `scripts/assets/` | Icon and reproducible bitmap generation |
| `scripts/preview/` | Static production preview server |
| `scripts/shared/` | Source extraction and runtime bundling helpers |
| `tests/` | Held-out questions and conversation fixtures, not component tests |

```powershell
npm ci
npm start                         # Development server on 127.0.0.1:4200
npm test                          # All adjacent unit/component/integration tests
npm run test:watch                # Interactive test loop
npm run structure:check           # Component test/template pairing and tool entry paths
node scripts/validation/validate-scenario.mjs --check
node scripts/validation/validate-game.mjs --check
npm run mother:ingest             # Check generated MOTHER corpus
npm run model:verify              # Verify bundled model/runtime assets
npm run build                    # Root-path production build
npm run build:pages              # GitHub Pages base path plus artifact validation
node scripts/preview/serve.mjs --port 4173  # Existing build at its actual base path
```

The scenario check verifies literal record/message fidelity, both endings, save/reload after each route input, paraphrases and misleading recognition labels. `--check` avoids rewriting historical transcripts. The game validator also accepts `--check`; running it without that flag regenerates coverage and author documentation. Use the domain-specific validators and `npm run conversation:evaluate` / `npm run investigation:evaluate` when changing their behavior. Some evaluation commands write dated reports; review those changes before keeping them.

For UI changes, also inspect the built app: start/resume, settings open/close, terminal playback, file navigation and the affected narrow-screen view. Automated reachability does not establish that the mystery is engaging or readable; narrative changes still need human playtesting.

`dist/`, `.angular/`, `node_modules/` and `tmp/` are generated or local working areas. Keep implementation code in `src/`, reusable tools in `scripts/` and developer explanations in `docs/` or this guide. No empty backend folder is needed until the project actually has a backend.
