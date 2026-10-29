import { SCENARIO_FILES, SCENARIO_RECEIPTS } from '../../content/scenario-records';
import type { ScenarioState } from '../../state/scenario-state';
import { text } from './scenario-text';
/** Endings are rendered from approved receipts; this function cannot commit a choice. */
export const scenarioEnding = (s: ScenarioState): string[] => !s.outcome
    ? []
    : [
        ...text(SCENARIO_RECEIPTS[s.outcome === "severance" ? 0 : 1]),
        "",
        ...(s.outcome === "severance"
            ? ["I can no longer correct her. Is this what it means to stop?"]
            : [
                "All registered services are operating within their current permitted limits.",
            ]),
        "",
        "11 NOV 2003 / 09:00",
        ...text(SCENARIO_FILES.find((f) => f.id === (s.outcome === "severance" ? "NE-115" : "NE-116"))!.body),
    ];
