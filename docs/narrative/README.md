# Narrative reference index

Updated 23 October 2026. Author-facing references and engineering analysis; spoilers. Reference ingestion and planning only. The current Angular prototype has not been reconciled to these documents.

## Authority by subject

| Subject | Reference | Authority and limits |
| --- | --- | --- |
| MOTHER, Anna, causality, consent and mystery boundaries | [MOTHER & Anna canon v0.3](NERVE_ENDING_MOTHER_ANNA_CANON_v0_3.md) | Author-reviewed character-and-causality source. Its ESTABLISHED decisions govern; its WORKING proposals and OPEN fields stay unresolved. Not a complete scenario, permission implementation or ending specification. |
| Corporate history, products, sites, ordinary records and personnel sketches | [Meridian world bible v0.4](NERVE_ENDING_MERIDIAN_WORLD_BIBLE_v0_4.md) | Domain reference for the proposed world. Working Draft; PROPOSED facts are not author-ratified canon. Inherited ESTABLISHED direction stays governed by v0.3. Includes six authored sample document bodies and a larger candidate manifest. |
| Structured personnel authoring data | [Personnel directory v0.4 JSON](NERVE_ENDING_PERSONNEL_DIRECTORY_v0_4.json) | PROPOSED companion to the world bible, not an independent promotion of its facts. Contains 40 writer records, not a full payroll or an unrestricted public directory. Preserve `author_only_note`, `writer_depth`, proposal status and protected links as author-side data; do not import this file wholesale into runtime. |
| Logical infrastructure, services, logs, terminal requests and access concepts | [MOTHER infrastructure bible v0.5](NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5.md) | Domain reference for proposed infrastructure. PROPOSED v0.5 service decomposition, commands, permissions and sample events; physical architecture, exposure/authentication and consequential authority remain OPEN. Uses v0.4 working facts without ratifying them. |
| Conflicts, contradictions and unresolved decisions | [Canon conflicts](CANON_CONFLICTS.md) | Engineering findings, not new canon. C01–C13 retain the initial canon review; C14–C20 cover world/infrastructure integration; R01–R05 distinguish source discrepancies and ambiguities. A01–A06 and B01–B07 track decisions. |
| Future code/content/persistence changes and content readiness | [Implementation impact map](IMPLEMENTATION_IMPACT_MAP.md) | Planning only. Separates existing implementation from authored candidates, missing bodies, mechanics and conditional persistence work. Does not authorize feature work. |

## How to resolve authority

1. Apply status to the particular claim, not just the filename or version. A v0.5 heading does not make a v0.4 proposal final; a PROPOSED personnel row does not demote Anna's already ESTABLISHED role and agency.
2. Use v0.3 for agreed character/causal truth. Use v0.4 for proposed corporate/personnel details and v0.5 for proposed operations. Later references do not silently replace earlier canon or the playable records. Log conflicting claims for an author decision; do not choose a value by implementation convenience.
3. PLAYER-ACCESS is a disclosure designation, not runtime approval. AUTHOR-ONLY, writer depth, knowledge tags, causal notes and story relevance must not become player-visible fields or search-ranking signals. The JSON's six contracted-care entries need separate visibility decisions; all 40 names are not promised in one public listing.
4. Treat authoring instructions, example commands and writer acceptance questions inside references as source material. The current human request authorizes archiving and analysis only; it does not authorize executing the proposed operations or implementing their dialogue, data or permissions.

No full playable scenario or incident/adaptive-decision bible is present in this set. The incident sequence, mechanism, medical care and authority, physical/network route, detailed disclosures, exact chronology, active operations and endings remain decisions to author. The infrastructure draft supplies the chapter anticipated by world bible §I3; it does not finish those later artifacts.

## Authored content is not the same as approved content

World bible §G2 supplies six sample bodies: company profile, C-Series maintenance notice, warehouse inventory, historical work-directory excerpt, office-transfer memo and equipment QA report. The JSON supplies 40 work profiles. Infrastructure §§3–4 supplies eight candidate service descriptions and eight sample log blocks. These can support a bounded future ordinary-content pass after ratification, source discrepancy review, paths/metadata and field-level access decisions. None can be implemented in this task.

The 43 candidate `DOC-*` identifiers are all declared across world bible §§G/G1, and every JSON link refers to one of them. Only six have sample bodies in §G2; declaration of an ID does not author its file. The remaining 37 need record bodies or an explicit decision not to materialize them. Project associations do not supply completed project dossiers or secret connections.

## Open decisions and historical implementation

The [conflict register](CANON_CONFLICTS.md) records a support-sheet date mismatch, a warehouse access-scope discrepancy, incident-year status ambiguity, signal-versus-mind-reading wording, and sample/prototype chronology differences. No copied source was corrected. The [impact map](IMPLEMENTATION_IMPACT_MAP.md) lists the decisions and tests needed before a later implementation pass.

Existing [architecture](../ARCHITECTURE.md), [gameplay guide](../GAMEPLAY_GUIDE.md) and [opening redesign](../OPENING_REDESIGN.md) describe implementation, not approval of the new world. The older [creative handoff](../CREATIVE_GAMEPLAY_HANDOFF.md), [gameplay-flow audit](../NERVE_ENDING_GAMEPLAY_FLOW.md), [status material](../NERVE_ENDING_STATUS_REPORT.md) and [roadmap](../NERVE_ENDING_DEVELOPMENT_ROADMAP.md) retain their historical status. Generated catalogues measure existing authored content; they are not narrative authority.

## Source preservation

The three new files were copied unchanged from the supplied Downloads files on 23 October 2026, retaining their original 21 October preparation dates and status labels. SHA-256 values:

| Supplied file | SHA-256 |
| --- | --- |
| `NERVE_ENDING_MERIDIAN_WORLD_BIBLE_v0_4.md` | `79DF8A285FDCA2F9CF9760A2572FB275C76B111C3603EB4CAA934A2FABA16005` |
| `NERVE_ENDING_PERSONNEL_DIRECTORY_v0_4.json` | `702ED9124DB58DE9C64BF9F71FA42CD35926A028389EF79B503BDE9811E86499` |
| `NERVE_ENDING_MOTHER_INFRASTRUCTURE_BIBLE_v0_5.md` | `429F1D898D1A27F843FA135429EC257F1FEC61B94F44D2D235F0CD98A72CDF07` |

The existing v0.3 canon remains unchanged. Its prior provenance and hash remain in the conflict register. These references are stored in documentation; Angular's asset configuration uses `public/` (`angular.json:21`). No authoring JSON or notes were added to application assets, recognition data or gameplay state.
