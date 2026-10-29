import type { Transition } from '../../models';
import type { ScenarioContext } from './scenario-context';
import { caseClock } from '../../state/scenario-state';
import { scenarioHint } from './scenario-hints';
import { message } from './scenario-text';
/** Signature and risk reviews may update readiness, but never execute a final operation. */
export function handleScenarioReview(context: ScenarioContext): Transition | undefined {
    const { caseState, normalizedInput, input, family, hasEvent, recordEvent, reply, requireEvent, requireClinicalScope } = context;
    if (["signatures", "sign-marsh", "sign-navarro", "sign-patel"].includes(family ?? "")) {
        const missing = requireClinicalScope();
        if (missing)
            return missing;
        if (hasEvent("translation-reviewed")) {
            if (family === "signatures" || family === "sign-marsh")
                recordEvent("marsh-signed");
            if (family === "signatures" || family === "sign-navarro")
                recordEvent("navarro-signed");
            if (family === "signatures" || family === "sign-patel")
                recordEvent("patel-verified");
            if (family === "signatures")
                recordEvent("onsite-staff-acknowledged");
        }
        const lines = message("M11").map((line) => {
            const pairs: [
                string,
                Parameters<typeof hasEvent>[0]
            ][] = [
                ["DR MARSH", "marsh-signed"],
                ["DR NAVARRO", "navarro-signed"],
                ["AMIR PATEL", "patel-verified"],
                ["HARBOR REACH", "harbor-acknowledged"],
                ["ELM VALE", "elm-acknowledged"],
            ];
            const p = pairs.find(([prefix]) => line.startsWith(prefix));
            return p && !hasEvent(p[1])
                ? line.replace(/SIGNED|VERIFIED|ACKNOWLEDGED/, "PENDING")
                : line.startsWith("SOURCE INTEGRITY") && !hasEvent("packet-verified")
                    ? "SOURCE INTEGRITY PACKET: COMPARISON PENDING"
                    : line;
        });
        lines.push(`ON-SITE HUMAN STAFF: ${hasEvent("onsite-staff-acknowledged") ? "ACKNOWLEDGED" : "PENDING"}`, ...scenarioHint(caseState));
        return reply(lines);
    }
    if (family === "risks") {
        const missing = requireEvent("dependency-reviewed", "No identifying external case synopsis has been released.");
        if (missing)
            return missing;
        if (hasEvent("translation-reviewed"))
            recordEvent("packet-verified");
        return reply([
            "RISK FORECAST / AUTHORIZED CLINIC REVIEW",
            "Anna: compensation prevents regulatory failure while distress-linked responses persist. Withdrawal is expected to cause death.",
            "Mara Hales: high risk of critical illness or death despite prepared intensive support; death is not certain.",
            "Tomas Ibarra: expected survival with loss of supported hand/arm function.",
            "Nadia Bellamy: serious recurrence and hospitalization risk; survival is more likely.",
            "Sources: NE-109, NE-110, NE-113 when signed. These are forecasts, not observed outcomes.",
            ...(hasEvent("packet-verified")
                ? [
                    "SOURCE INTEGRITY PACKET VERIFIED: pre-review 2001 original, 06 NOV / 02:14 controller snapshot and independent clinical/clinic sources compared.",
                    "Source: NE-114. This is witness-only evidence consistency, never medical authority.",
                    `Case clock: ${caseClock(caseState)}`,
                ]
                : [
                    "Witness packet remains pending until every physician, clinic, technical and on-site acknowledgement is present.",
                ]),
            ...scenarioHint(caseState),
        ]);
    }
    return undefined;
}
