import type { Transition } from '../../models';
import type { ScenarioContext } from './scenario-context';
import { caseEventAllowed } from '../../state/scenario-state';
import { scenarioEnding } from './scenario-endings';
import { scenarioHint } from './scenario-hints';
import { message } from './scenario-text';
/** Preview, confirmation and philosophical replies stay separate: a conversational YES is never clinical consent. */
export function handleScenarioDecision(context: ScenarioContext): Transition | undefined {
    const { caseState, normalizedInput, input, family, hasEvent, recordEvent, reply, requireEvent, requireClinicalScope } = context;
    if (family === "cancel") {
        caseState.pendingChoice = undefined;
        return reply(["PENDING CHOICE CANCELLED. No procedural change made."]);
    }
    if (caseState.outcome &&
        family &&
        ![
            "identity",
            "skeptic",
            "receipt",
            "clinical-facts",
            "witness",
            "fallbacks",
            "risks",
            "alternatives",
        ].includes(family))
        return reply([
            "CASE COMPLETED. Consequential actions are disabled. The fixed outcome and permitted ordinary records remain available.",
        ]);
    if (family === "confirm-operation") {
        if (input.trim().toUpperCase() !== "CONFIRM OPERATION")
            return reply([
                "CONFIRMATION NOT ACCEPTED. Type CONFIRM OPERATION as a separate statement, without a question or additional text. No procedural change made.",
            ], true);
        if (!caseState.pendingChoice ||
            !hasEvent("packet-verified") ||
            !hasEvent("translation-reviewed") ||
            !caseEventAllowed(caseState, "packet-verified")) {
            caseState.pendingChoice = undefined;
            return reply([
                "NO VALID PENDING CHOICE. All medical, clinic, staff and source checks are required.",
            ], true);
        }
        if (caseState.pendingChoice === "severance") {
            recordEvent("witness-attested");
            recordEvent("human-procedure-executed");
            caseState.outcome = "severance";
        }
        else {
            recordEvent("continuation-confirmed");
            caseState.outcome = "continuation";
        }
        caseState.pendingChoice = undefined;
        caseState.deferred = false;
        if (caseState.motherQuestion === "offered" ||
            caseState.motherQuestion === "awaiting-answer" ||
            caseState.motherQuestion === "deferred")
            caseState.motherQuestion = "declined";
        return reply(scenarioEnding(caseState));
    }
    if (family === "maintain-support" || family === "submit-separation-witness") {
        const missing = requireEvent("packet-verified", "No verified final witness packet is ready. No choice was prepared.");
        if (missing)
            return missing;
        caseState.pendingChoice =
            family === "maintain-support" ? "continuation" : "severance";
        caseState.deferred = false;
        return reply(message(caseState.pendingChoice === "continuation" ? "M12" : "M13"));
    }
    if (family === "defer-decision" ||
        (family === "alternatives" && /want to wait|^defer/.test(normalizedInput))) {
        if (!hasEvent("closure-compared"))
            return reply([
                "You may close the client. Ordinary access remains available.",
            ]);
        caseState.deferred = true;
        caseState.pendingChoice = undefined;
        if (caseState.motherQuestion === "offered" ||
            caseState.motherQuestion === "awaiting-answer")
            caseState.motherQuestion = "deferred";
        return reply(message("M14"));
    }
    if (family === "resume-review" ||
        normalizedInput === "resume review" ||
        normalizedInput === "resume investigation") {
        caseState.deferred = false;
        return reply([
            "REVIEW RESUMED. No procedural change made.",
            ...scenarioHint(caseState),
        ]);
    }
    // Pending philosophical turns are ordinary free text, never a consent or treatment action.
    if (caseState.pendingChoice && /^(?:yes|yes please|okay|ok)$/.test(normalizedInput))
        return reply([
            "A choice is pending. A bare YES does not confirm it. Type CONFIRM OPERATION separately, or CANCEL.",
        ], true);
    if (/^(no|dont ask me questions|do not ask me questions|i refuse|not my decision)$/.test(normalizedInput) &&
        caseState.motherQuestion !== "unoffered") {
        caseState.motherQuestion = "declined";
        return reply([
            "Understood. I will not require an answer. The review can continue.",
            ...scenarioHint(caseState),
        ]);
    }
    if ((caseState.motherQuestion === "offered" || caseState.motherQuestion === "deferred") &&
        /^(yes|yes please|go ahead|ask|what question|what is your question|okay|ok)$/.test(normalizedInput)) {
        caseState.motherQuestion = "awaiting-answer";
        return reply(message("M08", 1));
    }
    if (caseState.motherQuestion === "awaiting-answer" &&
        !family &&
        /^(?:i (?:think|believe|dont know|do not know)|neither|both|none|successful care means|success means)\b/.test(normalizedInput) &&
        !input.includes("?")) {
        caseState.motherQuestion = "answered";
        return reply([
            "I will retain that as your interpretation, not as a clinical instruction. I can show you the measurements that produced the conflict.",
            "I do not possess authority to determine a patients treatment on your behalf.",
            ...scenarioHint(caseState),
        ]);
    }
    return undefined;
}
