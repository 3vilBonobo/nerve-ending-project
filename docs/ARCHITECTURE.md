# Architecture

Nerve Ending is an Angular 21 standalone application using strict TypeScript, signals, browser storage, and ordinary CSS. It has no application backend. Hosting is static; a local HTTP server is used only to serve the compiled assets during preview.

## Data and state flow

```text
Terminal input ── explicit command parser ───────────────┐
         └────── optional intent provider → validation ─┤
                      └──── offline fallback ──────────┤
                                                       ↓
Mouse / file navigation ─────────────────────────── pure game engine
                                                       ↓
                                              immutable next state
                                                       ↓
                                     Session signal → UI → local save
```

`core/models.ts` contains evidence and intent enumerations, world state, archive files, provider contracts, and structured output. `content.ts` holds immutable, authored original records with stable IDs, dated provenance, and evidence grants. Original records never change after a question; displayed interpretations are separate terminal outputs with a `truth` classification. No future-act story graph or secret narrative is sent to interpreters.

`engine/commands.ts` parses case-insensitive commands before language interpretation, handles quotes, and normalizes virtual paths. These paths never access the host filesystem. `engine/game.ts` exposes pure functions: `runInput`, `inspectFile`, `recover`, `deriveKnowledge`, and selectors. Terminal `OPEN`, mouse clicks, and question requests all use `inspectFile`. Searches and directory listings use the same accessibility selector, so locked records cannot leak through a second interface.

`Session` is the Angular boundary. It owns the single `GameState` signal, saves meaningful state changes, and prevents concurrent terminal submissions. Window focus and close operations alter only UI state. It caps scrollback at 80 entries and document windows at five. All output renders through text interpolation; no `innerHTML` is used.

## Three progression tracks

1. **Evidence:** stable IDs for inspected original facts and facts explicitly shown in authored query responses.
2. **Knowledge and capability:** derived from corroborated evidence, never from command count or a supplied password.
3. **Operational state:** `archive006Recovered` and an idempotent action ledger. Recovery restores the archive and original dependency references once. It does not shut down the service.

The batch prefix and destination slot require independently inspecting the ledger and repair notes. Search excerpts direct the player to sources and do not grant evidence. Natural-language responses can establish the activity/retirement contradiction when those facts are actually displayed, but do not grant a routing source merely by referring to it.

Inspecting the restored fragment marks Act 01 complete. The reader explicitly opens the session report after inspecting the document; no modal interrupts the clue. Completion persists, and records remain usable afterward.

## Interpretation boundary

The offline classifier normalizes text, resolves authored aliases and a last-topic context, and maps questions to a small intent enumeration. Ambiguous pronouns request clarification. Unknown queries offer relevant supported vocabulary. It is intentionally limited to the authored investigation.

Optional providers get a small copied `QueryContext`. Provider output must pass `validateInterpretation`; unknown labels, invented entities, inaccessible files, and invalid request fields fail validation. Rejections, malformed output, and timeouts use the offline classifier. A validated intent is still only a request: deterministic engine gates decide its effect. Classifiers have no state mutation interface and cannot issue a recovery command.

`BrowserAIInterpreter` explicitly reports unavailable. The optional Ollama adapter is selectable only in development, only accepts loopback endpoints, uses a six-second abort signal, and has the same validation. `interpretSafely` bounds all optional providers, including those that ignore cancellation.

## Persistence

`persistence/saves.ts` stores schema version 2 under `nerve-ending.save`. It supports migration of the supplied version-1 state shape and old `{input, output}` terminal entries. It validates directories, IDs, display settings, last-topic data, history, and accessibility. Derived capabilities are recalculated rather than trusted from storage.

Unknown versions, corrupt JSON, restricted storage, and quota errors fail gracefully. Loading does not overwrite an unread save. Starting a new session or taking an action deliberately creates a usable current save. Reset removes only this game's key. All storage calls, including acquisition of `window.localStorage`, occur within guarded calls.

## UI

`features/terminal` manages input, scrollback, auto-scroll when near the bottom, and history. `features/files` uses the engine filesystem. `features/documents` renders scrollable records. The app shell manages setup, the skippable 18-second connection sequence, window positions, document tabs, mobile tabs, display settings, install affordance, and the session report.

Windows use simple fixed positions and focus ordering; they are intentionally not draggable. On ordinary desktop widths, a record and restored terminal share the workspace. Mobile replaces overlapping views with tabs. Native dialogs provide focus trapping, Escape dismissal, and return-to-trigger focus. Inputs and controls have visible focus styles. The terminal announces only a concise latest response, rather than flooding a screen reader with the entire scrollback.

## Add a file or act

Add an authored record with a unique ID, normalized absolute virtual path, provenance, and explicit evidence grants. Add its containing directory to `DIRECTORIES` if needed. Files become searchable automatically; locked files require an appropriate accessibility rule. Add tests proving search cannot reveal their content early.

For another act, introduce explicit evidence IDs, derived capabilities, operational transitions, authored responses, and migration tests. Keep later content gated and original records immutable. Do not add a backend unless a future requirement actually needs one. Extend the domain first, then the UI; do not place narrative rules inside components.
