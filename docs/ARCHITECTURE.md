# Architecture

Nerve Ending is a static Angular standalone application using strict TypeScript, signals, ordinary CSS, and browser storage. There is no application backend or required model download.

## Records and domain

core/content.ts holds immutable authored records with stable IDs, virtual paths, short bodies, observation grants, attachment references, and an optional backup action. Eight records are immediately accessible; one receipt body is available only after a deliberate backup read. References represent source relationships rather than a quest checklist.

engine/commands.ts parses commands and virtual paths. engine/game.ts handles inspection, search, authored interpretations and idempotent backup reading. Commands, questions and mouse controls share these rules. Search excludes the backup body until it has been loaded.

The split-prefix and slot reconstruction and evidence prerequisites no longer exist. Backup reading is an ordinary permission. deriveKnowledge retains its compatibility name but normalises this permission instead of unlocking it from reading counts. Evidence records observations only. The archive006Recovered flag tracks the loaded copy and legacy references. No real external connection is created and service 006 is not stopped.

## Query boundary

The deterministic interpreter covers the call, recipient, office, services, records and backup. It understands readable titles, aliases and limited pronouns. Unknown questions can match words in accessible records; no story facts are generated.

Optional provider results are validated against known intents, services and accessible files. They receive copied context and no mutation API. Even a validated request_backup is checked against the actual user input before restoring the copy. An informational question cannot become a restore because of an incorrect classifier.

Browser AI is unavailable. The development-only Ollama adapter uses a selected local daemon. Public play uses the bundled interpreter.

## Session and presentation

Session owns Angular state and persistence. Documents open once without echoing their bodies into the terminal. Mouse backup reads and explicit terminal requests use the same transition.

presentation/terminal-playback.ts separates processing and character reveal from saved state. A short minimum pause runs alongside interpretation. Complete replies are saved before printing finishes. Esc or SHOW FULL REPLY skips artificial pacing; an actual pending provider still has to return. Reduced motion receives instant replies. Request tokens prevent late results from changing a reset session.

Auto-scroll follows output only near the bottom. The older monochrome appearance and large local VT323 font remain. Records have closer line spacing and persistent attachment controls. Connection is skippable and lasts about 2.4 seconds.

## Save revisions

Schema 3 uses nerve-ending.save.v3. The previous prototype's nerve-ending.save remains unchanged. Its display preferences are imported, but its old instructions and completed puzzle progress are not replayed into the rewritten opening.

Current saves preserve observation order, documents, queries, completion and display preferences. Loading validates IDs, paths, bounds and availability. Reset affects the current opening only and preserves the previous key. Restricted storage permits in-memory play with a warning.

## Extension

Add source records and supported questions to the domain before presentation. Keep dated source facts distinct from system interpretation. A missing record should have a plausible availability condition or a native operation; reading unrelated files must not act as authorisation. Future acts can add facts and effects without converting observation IDs into a mandatory sequence.
