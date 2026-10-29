import { hasCaseEvent, type ScenarioState } from '../../state/scenario-state';
/** Guidance describes permitted next reviews; it never grants an event or permission. */
export function scenarioHint(s: ScenarioState): string[] {
    if (s.outcome)
        return [
            "Completed case. Ordinary records and the outcome audit remain readable. A different outcome requires a new session.",
        ];
    if (!hasCaseEvent(s, "closure-compared"))
        return [
            "Use records, STATUS, INFO and LOG to examine company information.",
        ];
    if (!hasCaseEvent(s, "notifications-traced"))
        return [
            "TRACE NOTIFICATIONS compares the available origin and delivery records.",
        ];
    if (!hasCaseEvent(s, "audit-accepted"))
        return ["REPORT DISCREPANCY submits a read-only integrity referral."];
    if (!hasCaseEvent(s, "clinical-approved"))
        return [
            "CHECK REPORT / REQUEST CLINICAL REVIEW checks for authenticated human review.",
        ];
    if (!hasCaseEvent(s, "dependency-reviewed"))
        return [
            "REVIEW ADAPTIVE REFERENCE / REVIEW FALLBACKS requests the authorized technical and clinic review.",
        ];
    if (!hasCaseEvent(s, "welfare-compared"))
        return [
            "COMPARE SURVIVAL AND DISTRESS examines the documented clinical disagreement.",
        ];
    if (!hasCaseEvent(s, "controls-observed"))
        return [
            "RUN BLIND CONTROLS / VIEW RAW COMPARISON requests read-only observations. No answer to MOTHER is required.",
        ];
    if (!hasCaseEvent(s, "translation-reviewed"))
        return ["REQUEST INDEPENDENT REVIEW obtains the medical interpretation."];
    if (!hasCaseEvent(s, "packet-verified"))
        return [
            "SHOW SIGNATURES requests the medical/technical readiness review; REVIEW RISKS compares the witness packet.",
        ];
    return [
        "MAINTAIN SUPPORT / SUBMIT SEPARATION WITNESS opens a full risk preview. Separately type CONFIRM OPERATION or CANCEL. DEFER DECISION leaves the review open.",
    ];
}
