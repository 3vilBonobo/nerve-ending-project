import type { Transition } from '../../models';
import type { CaseEvent, ScenarioState } from '../../state/scenario-state';
/** A per-input draft. Handlers may change this draft, but only the session commits a transition. */
export interface ScenarioContext {
    caseState: ScenarioState;
    normalizedInput: string;
    input: string;
    family: string | undefined;
    hasEvent(event: CaseEvent): boolean;
    recordEvent(event: CaseEvent): void;
    reply(lines: string[], denied?: boolean): Transition;
    requireEvent(event: CaseEvent, explanation: string): Transition | undefined;
    requireClinicalScope(): Transition | undefined;
}
