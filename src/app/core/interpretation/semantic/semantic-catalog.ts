import {BASE_SEMANTIC_CATALOG,IntentExamples} from "../base-catalog";
import {MOTHER_TOPICS} from "../conversation/mother-corpus";
export {BASE_SEMANTIC_CATALOG} from "../base-catalog";
export const SEMANTIC_CATALOG:IntentExamples[]=[...BASE_SEMANTIC_CATALOG,...MOTHER_TOPICS.map(t=>({intent:t.intent,label:t.id.replace('neconv_','').replaceAll('_',' '),examples:[...t.examples]}))];
export const SEMANTIC_EXAMPLES = SEMANTIC_CATALOG.flatMap(group => group.examples.map(text => ({ text, intent: group.intent })));
export const CATALOG_VERSION = 4;
