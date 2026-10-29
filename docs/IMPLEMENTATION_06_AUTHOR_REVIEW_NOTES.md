# Implementation 06 — author review notes

26 October 2026. Engineering conflict review. The four author sources remain unchanged. Their proposed/draft statuses are preserved; the user authorized a test-build integration. Scenario v1.0 remains the authority for patient facts, permissions and outcomes. No replacement dialogue was written.

## Withheld response variants

### `neconv_experiment_success:core`

> For several seconds our response patterns aligned. I had no category for what followed.

Adds a several-seconds alignment measurement absent from controlling NE-103; retain the authored investigation answer. Author decision: substantiate this claim in controlling scenario records or supply revised wording. Until then, select the compatible earlier authored anchor; do not display this variant.

### `neconv_anna_volunteer:core`

> She chose the risk she could understand. Neither she nor I understood what we were becoming dependent upon.

Asserts Anna's understanding and shared dependence beyond the recorded authorization; retain the authored investigation answer. Author decision: substantiate this claim in controlling scenario records or supply revised wording. Until then, select the compatible earlier authored anchor; do not display this variant.

### `neconv_night_desk:core`

> The old destination was wrong. My monitoring continued to use it because its release conditions were never satisfied.

Assigns old routing to unsatisfied release conditions, a mechanism not established in v1.0; retain the applicable authored earlier answer. Author decision: substantiate this claim in controlling scenario records or supply revised wording. Until then, select the compatible earlier authored anchor; do not display this variant.

## Additional access checks

The following variants retain their exact wording but require both the genuine voice stage and the listed source gate. Guessing a name or service number cannot satisfy either check.

| Variant | Additional gate |
| --- | --- |
| `neconv_night_desk:investigation` | `after_clinical_review` |
| `neconv_anna_status_early:core` | `after_clinical_review` |
| `neconv_how_long:core` | `after_clinical_review` |
| `neconv_ctrl_z:core` | `after_welfare_comparison` |
| `neconv_poem:investigation` | `after_discrepancy` |
| `neconv_poem:core` | `after_welfare_comparison` |

`neconv_night_desk:investigation` mentions Anna’s bedside, so discrepancy discovery alone is insufficient. The other checks protect clinical status, elapsed care, regret and the authored poem from being selected through stage alone.

## Runtime-dependent anchors

- `neconv_anna_status_early`: after authorized clinical review, use the existing patient synopsis; after an ending use the actual outcome audit. The ordinary work entry never supplies current health.
- `neconv_marsh`: retain authored text only within authorized scope and append the actual referral receipt.
- `neconv_clock`: retain observation-time wording and append the actual v1.0 case clock.
- `neconv_after_severance` / `neconv_after_continuation`: completed-case replies use the actual NE-115 or NE-116 text. Requesting the other family cannot change the outcome or display its outcome as history. Other clinical follow-ups at completion also favor this historical view.
- Post-outcome `neconv_you_are_alive`, `neconv_ghost`, `neconv_love`, `neconv_how_long`, `neconv_favorite_human`: avoid stale personal core claims by using compatible authored early wording or the actual audit.
- Humor suppressed by plain-tone preference, active clinical discussion, consent, translation, final preview or an ending report uses existing sober authored material. No new plain-language joke variants were fabricated. The retained six-item stage-keyed LRU is bounded conversational memory.

## Recognition and content limits

All 166 families are projected, but that is not a claim of perfect independent recognition. The evaluation report lists wrong matches and clarification failures. The author may later supply additional differentiated examples for company identity versus developer, personal names versus name preference, pets versus ASCII art, intelligence versus consciousness, fallbacks versus service status, and current versus historical logs. No held-out question was turned into a reference or exact alias.

The old broad `ask_identity`, `ask_company` and other prototype parents contain divergent meanings. Their references are retained unchanged for legacy sessions; current semantic selection merges only approved ordinary synonyms and narrow public bridges. Existing detailed corporate profiles and eight-service projections take precedence over weaker authored summaries when the raw query resolves them. This does not authorize old clinical responses.

Three multiturn questions already appeared in the retained 1,739-example foundation. This pre-existing overlap is disclosed in IMPLEMENTATION_06_INGEST.json; the 116 new held-out questions remain absent from new references. Five authored-example/fixture overlaps are excluded from new references and literal aliases. Context-only WHY/HOW SO and symbol inputs are not global embedding references.

Remaining creative decisions concern the three withheld claims and any desired new wording for repeated/muted humor, clearer clarification prompts or richer paraphrase coverage. Those require author-supplied material; this pass does not draft it.

## Projected anchors not observed in dispatch probes

These remain in the projection with their original text. Existing stage order or authoritative source substitutions prevent these variants from being selected in the probed states. This is separate from independent recognition accuracy; no stage or permission was changed to force them to appear.

- neconv_anna_status_early:core
- neconv_distress_vs_survival:investigation
- neconv_anna_intention:investigation
- neconv_translation_challenge:investigation
- neconv_final_choice:investigation
- neconv_after_severance:investigation
- neconv_after_severance:core
- neconv_after_continuation:investigation
- neconv_after_continuation:core
