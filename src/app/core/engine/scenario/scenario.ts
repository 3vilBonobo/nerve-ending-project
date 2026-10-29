import { scenarioFamily, nonActionDiscussion } from './scenario-routing';
import { scenarioHint } from './scenario-hints';
import { normal, text, message } from './scenario-text';
import { handleScenarioDecision } from './scenario-decisions';
import { handleScenarioReview } from './scenario-review';
import { answerScenarioQuestion } from './scenario-answers';
import type { GameState, Transition } from "../../models";
import { SCENARIO_FILES } from "../../content/scenario-records";
import { addCaseEvent, caseClock, caseMilestone, hasCaseEvent, ScenarioState } from "../../state/scenario-state";

import { BITMAP_FILES } from "../../content/bitmap-records";
import { observeSource, fileObservation, serviceObservation, observationLines, observations, } from "../../investigation/observations";
export { scenarioEnding } from './scenario-endings';
export { scenarioFamily, nonActionDiscussion } from './scenario-routing';
export { scenarioHint } from './scenario-hints';
/** Keep discussion and completed-case replies ahead of requests that can advance a review. */
export function scenarioInteraction(state: GameState, input: string): Transition | undefined {
    if (!state.scenario)
        return undefined;
    const original = state.scenario;
    // Work on a per-input draft so evaluating a request never mutates the caller's save.
    // These closures must read the latest draft: comparison handlers can replace it.
    let caseState: ScenarioState = {
        ...original,
        events: [...original.events],
        originalSources: [...original.originalSources],
    };
    const normalizedInput = normal(input);
    let family = scenarioFamily(input);
    const hasEvent = (e: Parameters<typeof hasCaseEvent>[1]): boolean => hasCaseEvent(caseState, e);
    const recordEvent = (e: Parameters<typeof addCaseEvent>[1]): void => addCaseEvent(caseState, e);
    const reply = (lines: string[], denied = false): Transition => ({
        state: {
            ...state,
            scenario: caseState,
            lastTopic: family?.startsWith("clinical")
                ? "case-patient"
                : family
                    ? "case-" + family
                    : state.lastTopic,
            lastIntent: family
                ? `q_case_${family.replaceAll("-", "_")}`
                : state.lastIntent,
        },
        output: {
            lines,
            links: family === "identity"
                ? [{ fileId: "readme", label: "/SYSTEM/READ_FIRST.TXT" }]
                : [],
            code: denied ? "denied" : "ok",
            truth: denied ? "withheld" : "record",
        },
        resolvedInterpretation: family
            ? {
                intent: `q_case_${family.replaceAll("-", "_")}`,
                needsClarification: false,
                provider: "fallback",
                method: "deterministic",
            }
            : undefined,
    });
    const requireEvent = (e: Parameters<typeof hasCaseEvent>[1], explanation: string): Transition | undefined => hasEvent(e) ? undefined : reply([explanation, ...scenarioHint(caseState)], true);
    const requireClinicalScope = (): Transition | undefined => requireEvent("clinical-approved", "No clinical witness projection has been authorized. Knowing a name or path does not grant access.");
    const processQuestion = family &&
        ["clinical", "report", "harbor", "elm"].includes(family) &&
        /^(?:what (?:is|does)|how (?:does|would)|does .* mean|should)\b/.test(normalizedInput);
    if (caseState.outcome && family && !(family === "identity" && !/anna.*alive/.test(normalizedInput)))
        return reply([
            "CASE COMPLETED / HISTORICAL FOLLOW-UP. No new operation or deferral is available.",
            ...text(SCENARIO_FILES.find((f) => f.id === (caseState.outcome === "severance" ? "NE-115" : "NE-116"))!.body),
        ]);
    if (family &&
        (nonActionDiscussion(input) || processQuestion) &&
        ![
            "identity",
            "skeptic",
            "clinical-facts",
            "witness",
            "images",
            "evidence",
        ].includes(family))
        return reply([
            "DISCUSSION ONLY. No review, disclosure or procedural change requested.",
            ...(family === "report"
                ? [
                    "An integrity referral submits a source comparison for triage. Intake does not establish a human clinical read or grant new privileges.",
                ]
                : family === "clinical"
                    ? [
                        "Clinical review means an authenticated human clinician reads the referral and decides whether to release a limited safety synopsis. It grants no equipment-control authority.",
                    ]
                    : family === "alternatives" && !caseState.outcome
                        ? [
                            hasEvent("clinical-approved")
                                ? "Keeping her alive while a replacement is sought is an actual option. It also continues the documented harm. No replacement is validated during this review."
                                : "You may close the client.",
                        ]
                        : []),
            "Please make a separate affirmative request if you want an available review performed.",
        ]);
    if (family === "images") {
        const r = reply([
            "ORDINARY DEMONSTRATION BITMAPS",
            "These are noncanonical placeholders, not actual employee or clinical photographs.",
            ...BITMAP_FILES.map((f) => `${f.title} / ${f.path}`),
        ]);
        r.output.links = BITMAP_FILES.map((f) => ({ fileId: f.id, label: f.path }));
        return r;
    }
    if (family === "evidence")
        return reply([
            "SESSION FINDINGS",
            ...(caseState.liveService006Observed
                ? ["06 NOV / 02:14 controller observation retained."]
                : []),
            ...(caseState.historicClosureObserved
                ? ["18 SEP 2001 administrative closure observed."]
                : []),
            ...(hasEvent("closure-compared")
                ? [
                    "Administrative closure and technical stop are distinct; source comparison retained.",
                ]
                : []),
            ...(hasEvent("clinical-approved")
                ? [
                    "Purpose-limited clinical witness review authorized; no equipment-control authority.",
                ]
                : []),
            ...(hasEvent("dependency-reviewed")
                ? ["Both external clinics acknowledged the dependency review."]
                : []),
            ...(hasEvent("translation-reviewed")
                ? [
                    "Independent signal interpretation reviewed; exact language and consent remain unestablished.",
                ]
                : []),
            ...(caseState.outcome ? [`Completed outcome: ${caseState.outcome}.`] : scenarioHint(caseState)),
        ]);
    if (caseState.outcome &&
        (family === "clinical-facts" ||
            family === "risks" ||
            (family === "identity" && /anna.*alive/.test(normalizedInput))))
        return reply([
            "RECORDED FOLLOW-UP / 11 NOV 2003 / 09:00",
            ...text(SCENARIO_FILES.find((f) => f.id === (caseState.outcome === "severance" ? "NE-115" : "NE-116"))!.body),
        ]);
    if (caseState.outcome && family === "witness")
        return reply([
            "CASE COMPLETED. The external witness had source-integrity scope only. No further procedural action is available in this session.",
        ]);
    const handleScenarioDecisionResult = handleScenarioDecision({
        caseState, normalizedInput, input, family,
        hasEvent, recordEvent, reply, requireEvent, requireClinicalScope,
    });
    if (handleScenarioDecisionResult)
        return handleScenarioDecisionResult;
    if (family === "compare") {
        if (caseState.outcome)
            return reply([
                "The retained 2001 filing and pre-review 06 NOV / 02:14 snapshot remain distinct historical sources.",
            ]);
        // The explicit comparison retrieves both real public projections, retaining their complete context.
        let read = observeSource({ ...state, scenario: caseState }, fileObservation("authorization"));
        read = observeSource(read, serviceObservation("INFO", "006"));
        caseState = read.scenario!;
        caseState.originalSources = [
            "authorization:18-SEP-2001",
            "controller-006:06-NOV-2003/02:14",
        ];
        recordEvent("closure-compared");
        caseState.hypotheses = [
            ...(caseState.hypotheses ?? []).filter((hasEvent) => hasEvent.id !== "closure"),
            {
                id: "closure",
                sourceIds: observations(caseState)
                    .filter((o) => o.facts.some((f) => f === "closure-006" || f === "running-006"))
                    .map((o) => o.sourceId),
            },
        ];
        const lines = message("M01");
        if (/004|stop events/.test(normalizedInput))
            lines.push("004 has an observed shutdown confirmation in 2001. The available 006 records do not show an equivalent completed stop.");
        if (/lie|fraud|fals/.test(normalizedInput))
            lines.push("I do not have evidence that the filer knowingly made a false statement.");
        const r = reply([
            ...(caseMilestone(caseState) > 0
                ? [
                    "COMPARISON USES THE RETAINED PRE-REVIEW 06 NOV / 02:14 CONTROLLER SNAPSHOT.",
                ]
                : []),
            ...observationLines(fileObservation("authorization")!),
            ...observationLines(serviceObservation("INFO", "006")!),
            ...lines,
            "Sources: STATUS / INFO 006 (06 NOV 02:14 controller observation); /ADMIN/CLOSURE_LIST.TXT (18 SEP 2001).",
        ]);
        r.state.viewedFileIds = read.viewedFileIds;
        r.output.links = [
            { fileId: "authorization", label: "/ADMIN/CLOSURE_LIST.TXT" },
        ];
        return r;
    }
    if (family === "trace") {
        if (!hasEvent("closure-compared"))
            return reply([
                "EXT 214 belonged to the Providence Operations Annex night desk. That office closed in 2001.",
                "The old destination did not acknowledge the notification.",
                "Compare independent service and closure sources before requesting an ownership audit.",
            ]);
        let read = { ...state, scenario: caseState };
        const sources = [
            serviceObservation("LOG", "003")!,
            serviceObservation("LOG", "006")!,
            fileObservation("call")!,
            fileObservation("maintenance")!,
        ];
        for (const source of sources)
            read = observeSource(read, source) as typeof read;
        caseState = read.scenario;
        recordEvent("notifications-traced");
        caseState.hypotheses = [
            ...(caseState.hypotheses ?? []).filter((hasEvent) => hasEvent.id !== "routing"),
            { id: "routing", sourceIds: sources.map((o) => o.sourceId) },
        ];
        const r = reply([
            ...sources.flatMap(observationLines),
            ...message("M02"),
            "Sources: LOG 003; LOG 006; CALL_QUEUE.LOG; last shift note.",
        ]);
        r.state.viewedFileIds = read.viewedFileIds;
        r.output.links = [
            { fileId: "call", label: "/OPERATIONS/CALL_QUEUE.LOG" },
            { fileId: "maintenance", label: "/OPERATIONS/SHIFT_HANDOVER.TXT" },
        ];
        return r;
    }
    if (family === "report") {
        const missing = requireEvent("closure-compared", "An integrity referral requires an independent source comparison. No clinical access was granted.");
        if (missing)
            return missing;
        const repeated = hasEvent("audit-accepted");
        recordEvent("audit-queued");
        recordEvent("audit-accepted");
        return reply([
            ...(repeated ? ["Existing referral retained; no duplicate intake."] : []),
            ...message("M03"),
            `Case clock: ${caseClock(caseState)}`,
            ...scenarioHint(caseState),
        ]);
    }
    if (family === "receipt")
        return reply([
            "AUDIT RECEIPT",
            `INTAKE: ${hasEvent("audit-accepted") ? "ACCEPTED FOR TRIAGE" : "NOT SUBMITTED"}`,
            `HUMAN READ: ${hasEvent("human-read") ? "AUTHENTICATED" : "NOT YET CONFIRMED"}`,
            `CLINICAL REVIEW: ${hasEvent("clinical-approved") ? "LIMITED SYNOPSIS APPROVED" : "NOT APPROVED"}`,
            ...scenarioHint(caseState),
        ]);
    if (family === "clinical") {
        const missing = requireEvent("audit-accepted", "The staffed clinical-review route requires an accepted source-integrity referral. No doctor has reviewed this session yet.") ??
            requireEvent("notifications-traced", "Trace the unresolved notification source before the reviewer can verify its clinical support obligation.");
        if (missing)
            return missing;
        const repeated = hasEvent("clinical-approved");
        recordEvent("human-read");
        recordEvent("clinical-approved");
        return reply([
            ...(repeated
                ? [
                    "Retained authenticated correspondence; no new live conversation claimed.",
                ]
                : []),
            ...message("M04"),
            "",
            ...message("M05"),
            `Case clock: ${caseClock(caseState)}`,
            "Permitted extracts: NE-101, NE-103, NE-104, NE-105, NE-106. OPEN their titles or paths in the records browser.",
            ...scenarioHint(caseState),
        ]);
    }
    if (["dependency", "fallbacks", "harbor", "elm"].includes(family ?? "")) {
        const missing = requireClinicalScope();
        if (missing)
            return missing;
        if (family === "harbor" || family === "elm") {
            recordEvent(family === "harbor" ? "harbor-acknowledged" : "elm-acknowledged");
            return reply([
                `${family === "harbor" ? "HARBOR REACH" : "ELM VALE"}: AUTHENTICATED CLINICAL CONTINGENCY ACKNOWLEDGED.`,
                "This clinical liaison receipt is separate from Service 003.",
                ...scenarioHint(caseState),
            ]);
        }
        // The requested external review completes actual liaison work, rather than reading an old router state.
        recordEvent("harbor-acknowledged");
        recordEvent("elm-acknowledged");
        recordEvent("dependency-reviewed");
        return reply([
            ...message("M07"),
            ...(family === "fallbacks"
                ? [
                    "A stored copy reproduces old parameters, not an independently validated evolving neural reference. A 2001 extraction failed later revalidation.",
                    "Local devices continue on their last state, but patient-specific adaptation may become unsafe or ineffective as conditions change.",
                    "The specific clinical adaptive reference used by the three controllers and Annas compensation is mutually dependent. Ordinary corporate records and other products would continue.",
                ]
                : []),
            "Sources: NE-107, NE-108, NE-109, NE-110. Both clinics independently acknowledged their contingency review.",
            `Case clock: ${caseClock(caseState)}`,
            ...scenarioHint(caseState),
        ]);
    }
    if (family === "welfare") {
        const missing = requireEvent("dependency-reviewed", "The limited clinical and external case review must be assembled before the core comparison.");
        if (missing)
            return missing;
        recordEvent("welfare-compared");
        const lines = [
            ...message("M06"),
            "Source: NE-111 / Dr Helen Marsh, 07 NOV 2003.",
            "Core designation: MOTHER. R-02 is a restricted interface of the same corporate intelligence.",
        ];
        if (caseState.motherQuestion === "unoffered") {
            caseState.motherQuestion = "offered";
            lines.push(...message("M08"));
        }
        return reply(lines);
    }
    if (["controls", "raw", "repeat"].includes(family ?? "")) {
        const missing = requireEvent("welfare-compared", "Observational comparison requires supervised case-review access. No test started.");
        if (missing)
            return missing;
        const repeated = hasEvent("controls-observed");
        recordEvent("controls-observed");
        const lines = message("M09", 1);
        if (family === "repeat") {
            if (hasEvent("controls-repeated"))
                lines.push("Alternate stored contrast already reviewed. No additional protocol was run.");
            else {
                recordEvent("controls-repeated");
                lines.push("Alternate predefined blinded contrast compared. The uncertainty and false-positive limit remain.");
            }
        }
        if (family === "raw")
            lines.push("RAW COMPARISON / RETAINED OBSERVATIONS", "Origin: instrumented patient signal; silent-control and blinded prompt-pair windows.", "Classification disagreement: the same variation may reflect instability or limited intention.", "Expected-answer cues were withheld. Repeatable differences persist; silence controls do not eliminate false positives.", "No exact words or consent can be established by these observations alone.");
        if (repeated && family === "controls")
            lines.unshift("Existing completed observation retained; no treatment action repeated.");
        return reply([...lines, ...scenarioHint(caseState)]);
    }
    if (family === "review") {
        const missing = requireEvent("controls-observed", "Request or inspect the controlled observational comparison before independent medical interpretation.");
        if (missing)
            return missing;
        const repeated = hasEvent("translation-reviewed");
        recordEvent("translation-reviewed");
        return reply([
            ...message("M10"),
            ...(!repeated
                ? [
                    "I did not know how to assign this response to anything I was permitted to stop.",
                ]
                : []),
            "Independent review: Dr Helen Marsh and Dr Elise Navarro. Sources: NE-102, NE-112.",
            `Case clock: ${caseClock(caseState)}`,
            ...scenarioHint(caseState),
        ]);
    }
    const handleScenarioReviewResult = handleScenarioReview({
        caseState, normalizedInput, input, family,
        hasEvent, recordEvent, reply, requireEvent, requireClinicalScope,
    });
    if (handleScenarioReviewResult)
        return handleScenarioReviewResult;
    if (family === "witness") {
        const missing = requireClinicalScope();
        if (missing)
            return missing;
        if (/why ask me/.test(normalizedInput) && hasEvent("welfare-compared"))
            return reply([
                "You compared independent measurements that my existing classification treated as compatible. I can record your objection; it does not confer medical authority.",
            ]);
        return reply([
            "You are not deciding treatment. We reviewed that responsibility. You can verify what this system showed you before we opened the case. I will not let an inconsistent machine supply its own independent witness.",
            "Source: Dr Marsh / authenticated case correspondence.",
            "The attestation verifies independent source consistency. It enables staff to act on an already authorized plan; R-02 cannot operate patient hardware.",
            "If you decline, clinicians continue care and can seek another independent witness. You may close or defer this session.",
            ...scenarioHint(caseState),
        ]);
    }
    if (family === "alternatives")
        return reply(hasEvent("clinical-approved")
            ? [
                "Keeping her alive while a replacement is sought is an actual option. It also continues the documented harm. No replacement is validated during this review.",
                "Clinical staff retain their professional obligations. You may DEFER DECISION or continue the review.",
                ...scenarioHint(caseState),
            ]
            : ["You can close this client. Ordinary records remain available."]);
    const answerScenarioQuestionResult = answerScenarioQuestion({
        caseState, normalizedInput, input, family,
        hasEvent, recordEvent, reply, requireEvent, requireClinicalScope,
    });
    if (answerScenarioQuestionResult)
        return answerScenarioQuestionResult;
    if (/^(help|explain|what next|what can i do|how do i proceed|what should i do)(?:\b|$)/.test(normalizedInput) &&
        hasEvent("closure-compared") &&
        !/^help (?:recover)/.test(normalizedInput))
        return reply(["PERMITTED REVIEW ACTIONS", ...scenarioHint(caseState)]);
    if (/^(why|explain that|tell me more|are you sure|what does that mean)$/.test(normalizedInput) &&
        caseState.motherQuestion === "awaiting-answer")
        return reply([
            "You compared independent measurements that my existing classification treated as compatible. I can record your objection; it does not confer medical authority.",
            "You may answer, decline, ask another question or continue the independent review.",
        ]);
    return undefined;
}
export function scenarioFallback(state: GameState, input: string): Transition {
    const caseState = state.scenario!;
    return {
        state,
        output: {
            lines: [
                caseState.outcome
                    ? "CASE COMPLETED. No further intervention can be made."
                    : "I dont have a verified record that answers that. You can ask about the sources already available to this connection.",
                ...(/\b(next|help|proceed)\b/i.test(input) ? scenarioHint(caseState) : []),
            ],
            links: [],
            code: "notice",
            truth: "withheld",
        },
    };
}
