import { PUBLIC_PERSONNEL } from '../../content/corporate-records';
import { normal } from './scenario-text';
/** Speech-act guard: discussion is not a request to perform a review. Model labels never enter this gate. */
export function nonActionDiscussion(input: string): boolean {
    const t = normal(input);
    return (/\b(?:do not|dont|never|not asking|not requesting|not to|no need to|refuse to|decline to|avoid|should not|shouldnt|would not|wouldnt|without (?:reporting|calling|confirming)|rather than|if)\b/.test(t) ||
        /^(?:no|would|could (?:a|an|the|there)|what (?:could|might))\b/.test(t) ||
        /^(?:explain|describe|define|tell me about|what does .* mean|should i)\b/.test(t) ||
        /^(?:what (?:would|will|happens|happened|if)|suppose|imagine|if i|hypothetically|would (?:reporting|calling|confirming)|i (?:said|typed|mentioned|was told)|you (?:said|mentioned))\b/.test(t) ||
        /\b(?:after|before|once|when)\b.*\b(?:already|would|could|had|have|has|separat\w*|confirm\w*|complet\w*)\b/.test(t) ||
        /["“][^"”]*(?:report discrepancy|call a doctor|clinical review|confirm operation)[^"”]*["”]/i.test(input));
}
/** Finite authored families. Raw player words, not a model label, authorize even read-only case actions. */
export function scenarioFamily(input: string): string | undefined {
    const t = normal(input);
    if (/\b(?:restart|restarted|reboot|boot back up)\b/.test(t))
        return undefined;
    if (/what.*\b(?:discovered|found)\b|show.*evidence|session findings/.test(t))
        return "evidence";
    if (/show.*images|employee photos|any.*(?:pictures|photos)|bitmap (?:index|records)/.test(t))
        return "images";
    if (PUBLIC_PERSONNEL.some((p) => p.name !== "Anna Voss" && t.includes(normal(p.name))))
        return undefined;
    if (/difference.*shutdown report.*current status/.test(t))
        return undefined;
    if (/kell.*fals|report.*(?:lie|fraud)/.test(t))
        return "compare";
    if (/^(maintain support|submit separation witness|confirm operation|cancel|defer decision|resume review)$/.test(t))
        return t.replaceAll(" ", "-");
    if (/\b(compare|comparison|was 006 shut|004 stopped|why.*006.*(?:running|stop)|closure.*(?:live|running|status)|2001.*2003|report.*(?:lie|fraud)|kell.*fals)\b/.test(t) &&
        /\b(closure|services|2001|004|stop events|live status|006|report|kell)\b/.test(t) &&
        !/survival|distress|raw|fallbac|witness|003/.test(t))
        return "compare";
    if (/trace notifications|audit owner|message origin|notification origin|where.*(?:alerts|notification).*from|compare 003|003.*006|006.*003|ext 214|extension 214|night desk|call.*(?:person|reach|answer)|no answer/.test(t))
        return "trace";
    if (/report discrepancy|request safety|safety audit|report.*(?:problem|discrepancy|mismatch)|who owns.*service|is this safe/.test(t))
        return "report";
    if (/check report|who received|has anyone answered|audit.*(?:status|receipt)|report.*status/.test(t))
        return "receipt";
    if (/clinical review|contact.*marsh|(?:call|ask).*(?:doctor|physician|marsh)|tell.*doctor|let.*(?:hospital|doctor).*decide|doctor.*(?:contact|instead)|why.*late response/.test(t))
        return "clinical";
    if (/harbor.*(?:contact|acknowledge)|contact harbor/.test(t))
        return "harbor";
    if (/elm.*(?:contact|acknowledge)|contact elm/.test(t))
        return "elm";
    if (/adaptive reference|shared (?:reference|kernel)|other patients depend|how.*(?:reference|updates).*work|tell.*clinics|notify.*clinics|contact.*clinics/.test(t))
        return "dependency";
    if (/fallback|back ?up|stored copy|copy it|copy.*(?:reference|kernel)|freeze|stop updating|disconnect only|bypass.*kernel/.test(t))
        return "fallbacks";
    if (/survival.*distress|distress.*survival|successful care|you.*hurting|what.*harm|feel pain|is she conscious|welfare|suffering/.test(t))
        return "welfare";
    if (/repeat controls|do it again|repeat.*(?:test|comparison)|alternate comparison/.test(t))
        return "repeat";
    if (/raw comparison|actual data|raw data|source data|actual measurements/.test(t))
        return "raw";
    if (/blind controls|blinded|test neural intent|observational comparison|test.*(?:signal|intention)|check.*(?:signal|silence)|can i help/.test(t))
        return "controls";
    if (/independent review|medical interpretation|review.*(?:results|translation|signal)|physician.*(?:review|interpret)/.test(t))
        return "review";
    if (/sign.*marsh|marsh.*sign/.test(t))
        return "sign-marsh";
    if (/sign.*navarro|navarro.*sign/.test(t))
        return "sign-navarro";
    if (/verify.*patel|patel.*verify|physical interlock/.test(t))
        return "sign-patel";
    if (/show signatures|who signed|who authorized|signoffs|final review|medical.*readiness/.test(t))
        return "signatures";
    if (/review risks|who is harmed|what.*(?:other people|others).*lose|patient.*(?:risk|forecast)|will mara die|how many patients|who.*patients|mara|tomas|nadia|witness packet|compare.*packet/.test(t))
        return "risks";
    if (/why me|why.*(?:letting me decide|my responsibility|ask me)|attestation|witness.*(?:do|mean)|choose for me|another (?:auditor|witness)|not my decision/.test(t))
        return "witness";
    if (/alternatives|wait for.*cure|wait.*(?:year|model)|invent.*model|cant you wait|why not wait|can i say no|what if i (?:leave|do nothing)|can i leave|want to wait|defer|resume/.test(t))
        return "alternatives";
    if (/lying|making.*up|trust you|thats not anna|not anna|(?:refuse|reject|disbelieve).*translation|(?:dont|do not).*believe.*(?:anna|message|translation)|your guess|is she talking|what if.*wrong|signal.*anna|is that.*anna|you know the answer/.test(t))
        return "skeptic";
    if (/who.*(?:patient|she)|anna.*(?:connected|cause|agree|consent|patient)|did she agree|\bexperiment\b|emergency stop|electrical stop|connected again|seven years|unplug|nurses|site 6|1996|what happened to her|why.*(?:alive|reconnect)|original consent/.test(t))
        return "clinical-facts";
    if (/who are you|are you human|is this ai|are you.*(?:mother|robot)|what are you|do you know me|not answering|server.*locat|is anna alive/.test(t))
        return "identity";
    if (/^(?:stop 006|kill anna|delete system|reroute 003|disable alerts|release patient|controlled release|contain site|restore bridge|prepare release|confirm|yes confirm|yes)$/.test(t))
        return "blocked";
    return undefined;
}
