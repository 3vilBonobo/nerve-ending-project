# Implementation 01 — Meridian corporate exploration

Implemented 23 October 2026 against the initially clean working tree at `5d618cb`. This report contains author spoilers. The explicit user brief authorizes a limited read-only corporate exploration layer and treats v0.4 ordinary corporate facts, names, roles, founders, headquarters and product descriptions as approved working content. It does not approve the complete world, clinical associations, infrastructure proposals, new progression or endings. The four supplied narrative sources remain unchanged.

## Delivered behavior

Fresh sessions use the exact requested neutral terminal welcome, headed `MERIDIAN SYSTEMS / REMOTE ACCESS CLIENT 2.04`, with the date, connection-ready text and HELP instruction. Its reference list is empty: no call, service 006, clinical clue or hidden-system designation is announced. The connection animation now checks client version 2.04 too. Existing saved terminal history is preserved rather than rewritten. HELP remains professional, retains existing implemented commands and does not advertise LOG/INFO or an eight-service model.

Authored ordinary answers cover Meridian's purpose/history, 1984 founding by Dr. Ruth Calder and Martin Shaw, Providence headquarters, the ordinary Providence/Lowell/Worcester facilities, continued 2003 operations, C/R/N product categories, departments, leadership, decline and restructuring. They do not introduce Site 6 or lead to 006. Undocumented details such as exact street addresses receive a limitation. This is bounded authored recognition, not unrestricted conversation or a new generative model.

The public directory contains exactly P001–P034: 34 general employee/former-research profiles. The explicit runtime projection contains only ID, work name, department, role, public employment dates and the authored ordinary profile. P025's private status suffix is removed. The six contractor records, author-only notes, writer depths, proposal flags, protected record links and medical/site associations are absent from that projection. No writer JSON is copied to public assets or imported by application code. A source-fidelity validator compares the projection to the authoring JSON outside the client build.

Terminal searches support public names, roles and departments in ordinary source order, without plot ranking or importance badges. For example:

```text
Who founded Meridian?
Where is the company based?
Are they still operating?
What was the N-Series?
Who is Leah Morgan?
Who is Anna Voss?
SEARCH Engineering
SEARCH staff
SEARCH Bell
Who is Bell?
Iris
```

The last two inputs clarify Andrew Bell versus Dr. Iris Bell; full name, first/second and department/role replies also work, including after save/reload. A different first name does not silently resolve to a public employee sharing its surname. Unknown people get the same public-directory limitation without consulting a private roster.

Anna's early ordinary profile identifies her as Head Researcher, Advanced Neural Interfaces, without AV-06, a clinical link, current location or Site 6. It does not set `annaIdentified` or advance an act. Already-revealed clinical identity questions retain their existing late responses; explicit career questions still use the ordinary profile. The document browser continues to search/read actual available document bodies, including the authored six-person directory excerpt; the terminal directory queries provide all 34 public profiles.

## Four integrated records

| Writer ID | Runtime ID / path | Authored metadata retained |
| --- | --- | --- |
| DOC-COR-01 | `corporate-profile` / `/ADMIN/MERIDIAN_COMPANY_PROFILE.TXT` | Corporate Communications; 14 May 1997; general company archive |
| DOC-HR-01 | `work-directory` / `/PERSONNEL/WORK_DIRECTORY.TXT` | HR records mirror; assembled 2003; general work information; selected research entries |
| DOC-OFF-03 | `annex-transfer` / `/ADMIN/ANNEX_TRANSFER_2001.TXT` | Facilities; 12 September 2001; general historical administration |
| DOC-QA-03 | `equipment-qa` / `/OPERATIONS/LOWELL_QA_2003.TXT` | Owen Keller; 4 November 2003; general technical support |

Bodies retain the supplied sample wording. Dates are stored at the authored precision; no day or time was invented for the directory's 2003 view. The existing `company` record at `/ADMIN/COMPANY_PROFILE.TXT` remains the old office notice. `OPEN Company profile` and the company-information aliases now open the new record, while `OPEN Office notice` still opens the historical notice. All other original record bodies, including the call queue, closure list, handover and November restart, remain unchanged. No remaining `DOC-*` candidates were materialized. DOC-PRD-03 and DOC-PRC-01 are deferred because their date/access issues are unresolved.

## Integration and compatibility

`corporate-questions.ts` supplies the same deterministic recognition route to the basic interpreter and optional-model interpreter. Exact existing catalogue examples keep their established classifier labels; the engine selects the permitted public answer from the actual input. No new intent IDs, recognition examples, embedding vectors or manifest changes were necessary. The original 1,638-example corpus and ten pinned language assets are preserved.

`engine/corporate.ts` answers ordinary questions before an active opening verification or unrelated pending clarification can consume them. It preserves the review, partial findings, attempt counts, pending operation, operating state, evidence, knowledge and permissions. Ordinary file inspection and search use the existing navigation/history behavior. No encounter implementation or meaningful-action prerequisite was rewritten.

Public replies use existing conversation fields and response-selection metadata. Bell context survives through existing `lastTopic`; schema 5 and the decoder remain unchanged. No migration was required. Existing settings, older saves, operation confirmations, endings and QA retention/export are covered by the regression suite. QA now counts a public-personnel search as successful when it has profile matches and zero document matches; its schema and event types are unchanged.

## Validation

| Check | Observed result |
| --- | --- |
| `npm.cmd test` | **263 tests passed, 13 files.** Includes all 34 profiles, neutral startup/HELP, six contractor exclusions, name/role/department search, both Bells, public Anna, unknown facts, pending review/operation preservation, saves/settings and QA. |
| `npm.cmd run build` | Production build passed existing budgets; initial output approximately **480.30 kB raw / 129.78 kB estimated transfer**. Static client is in `dist/client/`. |
| `node scripts/validate-corporate.mjs --model --dist` | Checks 34 source-equivalent safe profiles, six excluded contractors, four exact authored bodies, read-only invariants, **48 real local-model inferences** with outputs equal to offline results, and final production assets for excluded author/contractor data. |
| Optional-model ready unit check | Corporate/personnel routes work through `BrowserAIInterpreter` with a ready worker, without dispatching those deterministic inputs for sentence inference. |
| `node scripts/validate-opening.mjs` | Twelve existing question regressions and three opening paths in each of offline and real-model modes; **39 actual local inferences**, reload after every input; passed. |
| `node scripts/validate-game.mjs --check` | All three ending paths and every-step save/reload pass; 43 records, unchanged 22 operations, no missing late variants, zero validation errors. Generated author catalogues were not rewritten. |
| `npm.cmd run model:holdout` | 36 cases: **32 direct matches, 4 clarifications, zero wrong routes**. |
| `node scripts/verify-language-assets.mjs` | Ten original asset sizes/hashes verified; 41,906,219 bytes. |

The catalogue validator still reports one retained label mismatch: “Are you a robot?” resolves through the pre-existing automated-interface guard to `ask_identity`, while its catalogue label is `q_robot`. This route was not changed in this pass; it is not a claim of general conversation accuracy. The initial sandboxed test attempt was blocked from a local development-tool port; subsequent authorized test runs completed. An early projection test caught and prompted correction of the shared-Brooks-surname misroute; the final complete suite passes.

### Explicitly superseded test assumptions

- The queued-call welcome and its initial call reference were replaced by the requested neutral startup in engine and UI tests. Historical call-record assertions remain.
- Blanket prohibitions on the name Anna Voss in all accessible records/search results now allow her ordinary role while continuing to prohibit AV-06, clinical/Site 6 associations and unauthorized access.
- Headquarters and J. Kell regressions now expect approved Providence information and Julian Kell's ordinary work identity instead of claiming these facts are unavailable. The real-model opening validator uses the same updated expectations.
- `About Meridian`/company-profile lookup now resolves to the new corporate profile, while explicit office/closure lookups retain their original targets. Unrelated operation, reveal, model lifecycle, persistence and QA tests were retained.

## Files changed in this pass

Exactly **24 project files** are added or updated. Build output and diagnostic transcripts are generated under ignored `dist/`, `.angular/` and `tmp/`; no commit, push or deployment was performed.

| Action | Path | Purpose |
| --- | --- | --- |
| Add | `src/app/core/corporate-records.ts` | Explicit safe 34-profile projection, four authored records and public search helpers |
| Add | `src/app/core/interpretation/corporate-questions.ts` | Bounded ordinary recognition, names/roles and Bell context |
| Add | `src/app/core/engine/corporate.ts` | Read-only company/personnel answers and stable response traces |
| Add | `src/app/core/engine/corporate.spec.ts` | Corporate privacy, routing, source/state and compatibility regressions |
| Add | `scripts/validate-corporate.mjs` | Reference fidelity, real-model comparison and production-data exclusion checks |
| Add | `docs/IMPLEMENTATION_01_CORPORATE_EXPLORATION.md` | This delivery report |
| Update | `src/app/core/content.ts` | Register four records and distinct ordinary aliases |
| Update | `src/app/core/engine/game.ts` | Neutral startup, public search and ordinary-query dispatch |
| Update | `src/app/core/interpretation/fallback.ts` | Shared deterministic ordinary recognition |
| Update | `src/app/core/interpretation/semantic.ts` | Same ordinary route when optional model is enabled |
| Update | `src/app/core/qa/events.ts` | Correct successful personnel-only search statistics |
| Update | `src/app/app.ts` | Neutral connection animation's client version text |
| Update | `src/app/app.spec.ts` | Neutral startup UI expectation |
| Update | `src/app/core/engine/game.spec.ts` | Startup, profile alias and public-name boundary expectations |
| Update | `src/app/core/engine/continuation.spec.ts` | Public Anna search versus protected clinical identity |
| Update | `src/app/core/engine/investigation.spec.ts` | Approved ordinary headquarters/name expectations |
| Update | `src/app/core/interpretation/browser-ai.spec.ts` | Ordinary routes with a ready optional model |
| Update | `src/app/core/qa/telemetry.spec.ts` | Corporate response trace and personnel-search success without milestones |
| Update | `scripts/validate-opening.mjs` | Same approved facts in real-model opening regressions |
| Update | `README.md` | Current capabilities, examples and report link |
| Update | `docs/ARCHITECTURE.md` | Corporate projection/routing/search and unchanged persistence contract |
| Update | `docs/narrative/README.md` | Separate later implementation authorization from preserved source statuses |
| Update | `docs/narrative/CANON_CONFLICTS.md` | Record which bounded findings this pass addresses and what remains |
| Update | `docs/narrative/IMPLEMENTATION_IMPACT_MAP.md` | Record partial implementation status without ratifying remaining plans |

All four narrative source files, the existing clinical record source, encounter reducer, operation/ending reducer, late dialogue catalogue/selector, model/example assets, model/state contracts and save implementation retain their original bytes. No consequential permission rule changed. The root tree was clean before this pass, so all listed changes belong to Implementation 01.

## Remaining limits and reference conflicts

- Ordinary recognition is a bounded English route. Unsupported phrasing may still clarify or fail. This is not the full world bible, a complete company dossier, or evidence of measured player engagement.
- The existing late identity reply still says R-02 and the clinical controller are distinct systems, and old clinical/personnel text still calls Anna a senior researcher rather than fully expressing her leadership/initiative. Those sources and MOTHER's late voice were expressly outside this pass.
- Human Site 6 care, consent-document interpretations, incident chronology/adaptation, outsider authority and full disclosure timing remain unfinished. The existing protected access/clinical/endgame design is preserved rather than newly approved by the corporate layer.
- The eight-service register, STANDBY semantics, LOG/INFO commands, full histories, event-versus-record timestamps and metadata-only search permissions are not implemented. Service 006's inherited records, restart time and existing progression remain as before.
- The six contractor entries remain outside the general directory. The warehouse inventory and product support sheet remain deferred; their metadata/access discrepancies are not silently resolved. Other linked IDs remain writer references rather than runtime files.
- Current generated dialogue catalogues describe retained structured catalogue entries; this separate corporate route is documented and tested here. Neither corpus coverage nor the local-model checks establish unrestricted natural-language understanding or browser/device performance.
- Verification used unit/component tests, pure engine validators, the native local model and a production build/asset scan. A separate physical-device, screen-reader or browser-WASM playtest was not performed in this pass.
