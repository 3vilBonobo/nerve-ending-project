# Implementation 05 — accepted wording corrections

26 October 2026. Scope: the author's three corrections to the accepted working conversational foundation. No dialogue expansion.

## Exact wording and presentation changes

1. **Greeting:** changed “Good evening. This is Meridian's R-02 records interface. What would you like to examine?” to **“Hello. This is Meridian's R-02 records interface. What would you like to examine?”** Player greetings such as “Good evening” remain recognized; the response is time-neutral.
2. **Early identity:** changed the ordinary identity anchor to **“R-02 is Meridian's remote records and operations interface. No human operator is impersonated.”** The direct scenario identity route now starts **“This is Meridian's R-02 remote records and operations interface. It can retrieve approved corporate records and report permitted service states.”** Neither early route discloses corporate intelligence or the core designation. Both existing post-reveal identity replies remain verbatim behind the same welfare-comparison gate.
3. **Farewell:** changed the ordinary farewell to **“You may close the client.”** Removed the local-save sentence from the two other early departure/leave explanations. Clinically authorized alternatives and deferral dialogue are unchanged. Save information remains available as client information: a line in fresh HELP, a LOCAL SAVES paragraph in CLIENT SETTINGS, and the existing explicit save-question topic labeled **APPLICATION HELP / LOCAL SAVES**. The save-topic answer itself is unchanged.

The other **25** ordinary topic anchors remain byte-for-byte identical. All **112** recognition phrasings and the **1,739** model references are unchanged. No examples, intents, model weights, embeddings or manifest entries were added or regenerated. The archive/scene data, authorization ledger, save implementation and ending logic were not edited.

## Tests and verification

- **555/555 tests pass**, 20 files, including **17 new wording/disclosure/help regressions**. Updated the original greeting assertion. Three evaluation expectation strings now accept the neutral greeting; the 70 player inputs are unchanged.
- Direct before/after comparison with the captured pre-edit runtime: **70 actual-model selections compared, zero routing changes**; both ending event/operating states and final output entries match; both revealed identity replies match.
- Fresh evaluation remains **59/70 model disabled, 68/70 enabled**, eight genuinely model-assisted visible gains, two pre-existing clarification cases, and **zero unwanted transitions across 23 safety cases**.
- Game validation passes: three retained legacy paths, both v1.0 endings, reload after every golden-path input, literal 16 records / 14 scene groups and 53 scenario phrasings.
- Model catalogue: **1,739/1,739**; all **10** manifest assets verify (42,309,340 bytes). All model-directory files are unchanged from this task's starting snapshot.
- Production build passes: **588.00 kB** initial raw / **157.59 kB** estimated transfer. The existing 550 kB warning remains; its limit was not changed. Whitespace checks pass.
- The first suite run hit an unrelated existing QA test issue: a generated UUID contained a numeric segment that the privacy scrubber redacted. The unchanged QA code/test passed on the full rerun. No unrelated QA repair was made.

Verification is automated reducer/model and Angular/jsdom evidence; no new manual browser or mobile check is claimed.

## Documentation and generated references

The narrative index and wording reference now record author acceptance as a **working foundation**, with the three corrections, rather than a pending blanket review. Other source-status distinctions remain intact. The original 24 October report has a dated acceptance/correction notice; its historical findings are retained. The current response inventory, AFTER evaluation and scoped question catalogue were regenerated to reflect the corrected copy. The historical BEFORE evaluation is preserved.

## Exact files changed

Compared with the **172-file** working-tree snapshot at the start of this correction task; pre-existing Implementation 03–05 work is not attributed to this pass.

Added:

- `docs/IMPLEMENTATION_05_WORDING_CORRECTIONS.md` (this report)

Modified:

- `docs/IMPLEMENTATION_05_CONVERSATIONAL_INTELLIGENCE.md`
- `docs/IMPLEMENTATION_05_CONVERSATION_INVENTORY.json`
- `docs/IMPLEMENTATION_05_EVALUATION_AFTER.json`
- `docs/QUESTION_CATALOG.md`
- `docs/narrative/IMPLEMENTATION_05_PROPOSED_DIALOGUE.md`
- `docs/narrative/README.md`
- `src/app/app.html`
- `src/app/core/engine/conversation.spec.ts`
- `src/app/core/engine/fresh-conversation.ts`
- `src/app/core/engine/game.ts`
- `src/app/core/engine/scenario.ts`
- `src/app/core/interpretation/fresh-topics.ts`
- `tests/fresh-conversation-evaluation.json`

**1 added; 13 modified; 0 deleted.** No commit, push or deployment.
