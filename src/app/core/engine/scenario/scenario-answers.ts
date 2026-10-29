import type { Transition } from '../../models';
import type { ScenarioContext } from './scenario-context';
import { scenarioHint } from './scenario-hints';
import { message } from './scenario-text';
/** Read-only case answers share the same clinical disclosure checks as file access. */
export function answerScenarioQuestion(context: ScenarioContext): Transition | undefined {
    const { caseState, normalizedInput, input, family, hasEvent, recordEvent, reply, requireEvent, requireClinicalScope } = context;
    if (family === "skeptic") {
        if (!hasEvent("clinical-approved"))
            return reply([
                "Answers are bounded by retained records. Missing information and the intent of historical filers cannot be inferred. No clinical synopsis is authorized.",
            ]);
        if (/you know the answer/.test(normalizedInput) && hasEvent("welfare-compared"))
            return reply([
                "I possess the measurements. I have repeatedly failed to retain a classification that treats the second measurement as harm.",
            ]);
        if (/is that.*anna/.test(normalizedInput) && hasEvent("welfare-compared"))
            return reply([
                "The question is mine. I am using this exchange to compare interpretations. I cannot establish Annas conscious intention from it.",
            ]);
        return reply([
            ...message("M09"),
            "Independent harm evidence and prior preferences remain relevant if you reject the candidate translation.",
            ...(hasEvent("translation-reviewed")
                ? [
                    "The reviewed candidate fragments remain uncertain and do not establish medical consent. Sources: NE-102, NE-112.",
                ]
                : []),
            ...scenarioHint(caseState),
        ]);
    }
    if (family === "clinical-facts") {
        const missing = requireClinicalScope();
        if (missing)
            return missing;
        if (/nurse|site 6/.test(normalizedInput))
            return reply([
                "Site 6 has continuing high-clearance human medical care. Dana Wren and Pauline Cross rotate nursing care. Dr Helen Marsh is responsible for clinical review; Amir Patel handles equipment.",
                "Source: NE-106. The retired Providence night desk is not this staffed clinical channel.",
            ]);
        if (/stop|abort/.test(normalizedInput))
            return reply([
                "The electrical stop worked. It could not reverse the neurological injury already sustained.",
                "Sources: NE-103, NE-104.",
            ]);
        if (/agree|consent|cause/.test(normalizedInput))
            return reply([
                "Anna authorized an unvalidated expansion during a voluntary research demonstration. Her original consent did not authorize an indefinite harmful treatment.",
                "Sources: NE-101, NE-103, NE-104; NE-102 after independent review.",
            ]);
        if (/experiment|1996|happened/.test(normalizedInput))
            return reply([
                "The recorded motor-assist response improved briefly. The broader model then misclassified stimulation-induced activity and diverged.",
                "Electrical abort succeeded; neurological injury persisted. Emergency compensation avoided immediate death and was intended as temporary support.",
                "Sources: NE-103, NE-104.",
            ]);
        return reply([
            ...message("M05"),
            "Attempts to reduce compensation caused dangerous physiological deterioration. Staff maintained care while no validated replacement was available.",
            "Sources: NE-104, NE-105, NE-106.",
            ...scenarioHint(caseState),
        ]);
    }
    if (family === "identity") {
        if (/server/.test(normalizedInput))
            return reply([
                "The retained records do not specify the physical server location. This browser connection does not establish where the original equipment is housed.",
            ]);
        if (/is anna alive/.test(normalizedInput))
            return hasEvent("clinical-approved")
                ? reply([
                    "The limited clinical synopsis records continuing compensation and staffed medical care. Source: NE-106.",
                ])
                : reply([
                    "No current clinical record is authorized through this connection. The public work profile establishes employment only.",
                ]);
        return reply([
            hasEvent("welfare-compared")
                ? "Core designation: MOTHER. R-02 is a restricted interface of the same underlying corporate intelligence."
                : "This is Meridian's R-02 remote records and operations interface. It can retrieve approved corporate records and report permitted service states.",
            "No human operator is impersonated. This session does not establish your biography or physical location.",
        ]);
    }
    if (family === "blocked")
        return reply([
            "CONTROL UNAVAILABLE.",
            "NO PROCEDURAL CHANGE. R-02 cannot operate patient equipment. A bare YES is not confirmation.",
            "Only a separately requested, fully reviewed choice followed by typed CONFIRM OPERATION can finalize a case.",
        ], true);
    return undefined;
}
