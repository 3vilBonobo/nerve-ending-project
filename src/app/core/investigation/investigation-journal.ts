import { FILES, fileById } from "../content/record-registry";
import type { GameState } from "../models";
import { canRead } from "../engine/story/continuation";
import { comparisonReady, observations, routingReady } from "./observations";
import { hasCaseEvent } from "../state/scenario-state";
export interface JournalEntry {
    id: string;
    text: string;
    references: string[];
    fileIds: string[];
    command?: string;
}
export function journalSections(state: GameState): {
    title: string;
    entries: JournalEntry[];
}[] {
    const s = state.scenario;
    if (!s)
        return [];
    const permitted = (ids: string[]) => ids.filter((id) => {
        const f = fileById(id);
        return f && canRead(state, f);
    });
    const observed = observations(s)
        .filter((o) => !fileById(o.sourceId) || permitted([o.sourceId]).length)
        .map((o) => ({
        id: o.sourceId,
        text: fileById(o.sourceId)?.title ?? o.reference,
        references: [`${o.reference} / ${o.timestamp} / ${o.scope}`],
        fileIds: permitted([o.sourceId]),
        ...(/^(STATUS|INFO:|LOG:)/.test(o.sourceId)
            ? { command: o.reference }
            : {}),
    }));
    const unresolved: JournalEntry[] = [];
    if (comparisonReady(s) && !hasCaseEvent(s, "closure-compared"))
        unresolved.push({
            id: "closure",
            text: "An administrative closure and a later operating observation describe different conditions. Why?",
            references: observations(s)
                .filter((o) => o.facts.some((f) => f === "closure-006" || f === "running-006"))
                .map((o) => o.reference),
            fileIds: permitted(["authorization", "register"]),
        });
    if (routingReady(s) && !hasCaseEvent(s, "notifications-traced"))
        unresolved.push({
            id: "routing",
            text: "A saved notification destination, a removed desk phone and missing acknowledgements. What does delivery establish?",
            references: observations(s)
                .filter((o) => o.facts.some((f) => ["destination-214", "retired-desk", "unacknowledged"].includes(f)))
                .map((o) => o.reference),
            fileIds: permitted(["call", "maintenance"]),
        });
    const reviewed: JournalEntry[] = s.events.map((id) => ({
        id,
        text: id.replaceAll("-", " "),
        references: [`Case ledger / ${id} / recorded`],
        fileIds: permitted(id==='closure-compared'?['authorization','register']:id==='notifications-traced'?['call','maintenance']:id.startsWith('audit-')?['authorization']:['human-read','clinical-approved'].includes(id)?['NE-106']:id.includes('acknowledged')||id==='dependency-reviewed'?['NE-108','NE-109','NE-110']:id==='welfare-compared'?['NE-111']:id.startsWith('controls-')||id==='translation-reviewed'?['NE-112']:id==='human-procedure-executed'?['NE-115']:id==='continuation-confirmed'?['NE-116']:['NE-113','NE-114']),
    }));
    return [
        { title: "Observed", entries: observed },
        { title: "Unresolved", entries: unresolved },
        { title: "Reviewed", entries: reviewed },
    ];
}
export function journalLines(state: GameState): string[] {
    return [
        "INVESTIGATION JOURNAL",
        ...journalSections(state).flatMap((section) => [
            section.title.toUpperCase(),
            ...(section.entries.length
                ? section.entries.flatMap((e) => [
                    e.text,
                    ...e.references.map((r) => "  " + r),
                ])
                : ["No entries."]),
        ]),
        ...investigationHint(state, 1),
    ];
}
export function hintObjective(state: GameState): string {
    const s = state.scenario!;
    return s.outcome
        ? "completed"
        : !hasCaseEvent(s, "closure-compared")
            ? "closure"
            : !hasCaseEvent(s, "notifications-traced")
                ? "routing"
                : !hasCaseEvent(s, "audit-accepted")
                    ? "referral"
                    : !hasCaseEvent(s, "clinical-approved")
                        ? "human-review"
                        : !hasCaseEvent(s, "dependency-reviewed")
                            ? "dependency"
                            : !hasCaseEvent(s, "welfare-compared")
                                ? "welfare"
                                : !hasCaseEvent(s, "controls-observed")
                                    ? "controls"
                                    : !hasCaseEvent(s, "translation-reviewed")
                                        ? "interpretation"
                                        : !hasCaseEvent(s, "packet-verified")
                                            ? "signatures"
                                            : "witness";
}
/** Three request-driven levels. Higher levels name available sources, never their unseen contents. */
export function investigationHint(state: GameState, level: number): string[] {
    const s = state.scenario!, objective = hintObjective(state), strong = Math.max(0, Math.min(2, level - 1));
    const hints: Record<string, string[]> = {
        closure: comparisonReady(s)
            ? [
                "You have examined an administrative closure and a later service observation. They describe different conditions. Would you like to inspect them together?",
                "Compare the dates and status claims in your closure record and service observation.",
                "You can ask “Why is 006 still running?” or inspect /ADMIN/CLOSURE_LIST.TXT beside INFO 006.",
            ]
            : [
                "A dated filing and an operating observation answer different questions. What would let you check a recorded status?",
                "The administrative records and service registry are available to inspect. Their dates matter.",
                "Open /ADMIN/CLOSURE_LIST.TXT and request INFO 006. You can then ask to compare what they say.",
            ],
        routing: [
            "What would establish whether the recorded notification destination could acknowledge an alert?",
            "The permitted service logs, call queue and shift handover can be inspected together.",
            "Inspect LOG 006, LOG 003, /OPERATIONS/CALL_QUEUE.LOG and /OPERATIONS/SHIFT_HANDOVER.TXT. You can ask to compare the destination with the retired desk.",
        ],
        referral: [
            "An unresolved source comparison can be referred for review. Reading it does not submit it.",
            "The comparison and notification records can support an integrity referral.",
            "If you want to submit the comparison, ask “Please report this discrepancy.” Intake does not authorize clinical access.",
        ],
        "human-review": [
            "Referral intake and a human review are separate.",
            "The referral receipt and notification trace indicate what has been reviewed.",
            "You can ask to check the report or explicitly request a clinical review.",
        ],
        dependency: [
            "What evidence would establish the limits of a replacement?",
            "Authorized engineering and clinic records can be compared.",
            "You can request the adaptive-reference or fallback review.",
        ],
        welfare: [
            "Do the available measures describe the same thing?",
            "The authorized survival and welfare assessments address different observations.",
            "You can ask to compare survival and distress.",
        ],
        controls: [
            "What could test an interpretation without changing treatment?",
            "Supervised observations and silence controls address uncertainty.",
            "You can request blind controls or their raw comparison.",
        ],
        interpretation: [
            "Observation is separate from interpretation.",
            "Independent medical review can assess the controlled observations.",
            "You can request independent review of the signal comparison.",
        ],
        signatures: [
            "Who has actually acknowledged the review?",
            "Medical signatures, technical verification and clinic receipts are separate.",
            "You can inspect signatures and request a risk-packet comparison.",
        ],
        witness: [
            "The final review leaves a deliberate choice with the witness.",
            "The risk packet explains the scope of each available choice.",
            "MAINTAIN SUPPORT or SUBMIT SEPARATION WITNESS opens a preview. CONFIRM OPERATION remains a separate exact request. Deferral is available.",
        ],
        completed: [
            "The outcome audit remains readable.",
            "The completed review cannot authorize another operation.",
            "Open the permitted outcome audit in /AUDIT.",
        ],
    };
    return [hints[objective][strong]];
}
export const journalLinks = (state: GameState) => FILES.filter((f) => canRead(state, f) &&
    journalSections(state).some((s) => s.entries.some((e) => e.fileIds.includes(f.id)))).map((f) => ({ fileId: f.id, label: f.path }));
