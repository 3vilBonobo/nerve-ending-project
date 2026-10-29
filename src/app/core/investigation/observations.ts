import type { GameState } from "../models";
import { fileById } from "../content/record-registry";
import { SERVICE_OBSERVATION, permittedServiceEvents, serviceById, } from "../content/service-records";
import type { ScenarioState } from "../state/scenario-state";
export type SourceFact = "closure-006" | "running-006" | "destination-214" | "retired-desk" | "unacknowledged" | "backup-identifiers";
export interface SourceObservation {
    sourceId: string;
    reference: string;
    timestamp: string;
    scope: "public-record" | "service-snapshot" | "service-events" | "authorized-extract";
    facts: SourceFact[];
}
const fileFacts: Record<string, SourceFact[]> = {
    authorization: ["closure-006"],
    register: ["running-006", "destination-214"],
    call: ["destination-214", "unacknowledged"],
    maintenance: ["retired-desk"],
    fragment: ["backup-identifiers", "unacknowledged"],
};
export const observations = (s: ScenarioState): readonly SourceObservation[] => s.observations ?? [];
export const observedFact = (s: ScenarioState, fact: SourceFact): boolean => observations(s).some((o) => o.facts.includes(fact));
export function fileObservation(id: string): SourceObservation | undefined {
    const f = fileById(id);
    if (!f)
        return undefined;
    return {
        sourceId: id,
        reference: f.path,
        timestamp: f.modified,
        scope: f.scenarioScope ? "authorized-extract" : "public-record",
        facts: fileFacts[id] ?? [],
    };
}
export function serviceObservation(kind: "STATUS" | "INFO" | "LOG", id = "006"): SourceObservation | undefined {
    if (!serviceById(id))
        return undefined;
    return {
        sourceId: kind === "STATUS" ? "STATUS" : `${kind}:${id}`,
        reference: kind === "STATUS" ? "STATUS" : `${kind} ${id}`,
        timestamp: SERVICE_OBSERVATION.label,
        scope: kind === "LOG" ? "service-events" : "service-snapshot",
        facts: kind === "LOG"
            ? ["003", "006"].includes(id)
                ? ["destination-214", "unacknowledged"]
                : []
            : id === "006"
                ? ["running-006"]
                : [],
    };
}
/** Called only after an actual successful read. Listings, guesses and links do not call this. */
export function observeSource(state: GameState, o: SourceObservation | undefined): GameState {
    const s = state.scenario;
    if (!s || !o || observations(s).some((old) => old.sourceId === o.sourceId))
        return state;
    return {
        ...state,
        ...(fileById(o.sourceId) ? { viewedFileIds: [...new Set([...state.viewedFileIds, o.sourceId])] } : {}),
        scenario: {
            ...s,
            observations: [...observations(s), o],
            historicClosureObserved: s.historicClosureObserved || o.facts.includes("closure-006"),
            liveService006Observed: s.liveService006Observed ||
                (o.scope === "service-snapshot" && o.facts.includes("running-006")),
        },
    };
}
export function comparisonReady(s: ScenarioState): boolean {
    return observedFact(s, "closure-006") && observedFact(s, "running-006");
}
export function routingReady(s: ScenarioState): boolean {
    return ["destination-214", "retired-desk", "unacknowledged"].every((f) => observedFact(s, f as SourceFact));
}
export function observationLines(o: SourceObservation): string[] {
    const f = fileById(o.sourceId);
    if (f)
        return [f.path, `SOURCE DATE: ${f.modified}`, ...f.body.split("\n")];
    const [kind, id] = o.sourceId === "STATUS" ? ["INFO", "006"] : o.sourceId.split(":");
    if (kind === "LOG")
        return [
            o.reference,
            ...permittedServiceEvents(id as '003' | '006').map((e) => `${e.timestamp} / ${e.message} / ${e.id}`),
        ];
    const service = serviceById(id);
    return service
        ? [
            o.reference,
            `OBSERVED: ${o.timestamp}`,
            `${id} / ${service.name} / ${service.state}`,
            service.purpose,
            service.limitations,
        ]
        : [];
}
/** Decode source identities against actual manifests. Never trust saved prose/fact flags. */
export function restoreObservations(s: ScenarioState, value: unknown, viewed: readonly string[], allowed: readonly string[]): void {
    const sources = Array.isArray(value) ? value.slice(0, 160) : [];
    const restored: SourceObservation[] = [];
    for (const raw of sources) {
        const id = raw && typeof raw === "object"
            ? (raw as {
                sourceId?: unknown;
            }).sourceId
            : undefined;
        if (typeof id !== "string")
            continue;
        const match = id.match(/^(INFO|LOG):(00[1-8])$/);
        const o = id === "STATUS"
            ? serviceObservation("STATUS")
            : match
                ? serviceObservation(match[1] as "INFO" | "LOG", match[2])
                : allowed.includes(id) && viewed.includes(id)
                    ? fileObservation(id)
                    : undefined;
        if (o && !restored.some((old) => old.sourceId === id))
            restored.push(o);
    }
    // Old v6 saves retain their real opened public records without requiring another read.
    for (const id of viewed) {
        const o = allowed.includes(id) ? fileObservation(id) : undefined;
        if (o && !restored.some((old) => old.sourceId === id))
            restored.push(o);
    }
    s.observations = restored;
}
