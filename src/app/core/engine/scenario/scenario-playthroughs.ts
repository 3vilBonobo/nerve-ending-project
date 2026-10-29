/** Normal terminal inputs only. These paths never set developer state. */
export const SCENARIO_REVIEW_PATH = [
    'What products does Meridian sell?', 'STATUS', 'OPEN Closure list', 'COMPARE 2001 CLOSURE',
    'TRACE NOTIFICATIONS', 'REPORT DISCREPANCY', 'CHECK REPORT', 'REQUEST CLINICAL REVIEW',
    'READ /RESEARCH/NEURAL/N4_1996_EVENT.TXT', 'Why not use emergency stop?',
    'REVIEW ADAPTIVE REFERENCE', 'Why cant you back it up?', 'COMPARE SURVIVAL AND DISTRESS',
] as const;
export const SCENARIO_SIGNED_PATH = [...SCENARIO_REVIEW_PATH, 'Yes please', 'I dont know', 'RUN BLIND CONTROLS', 'VIEW RAW COMPARISON', 'REPEAT CONTROLS', 'REQUEST INDEPENDENT REVIEW', 'SHOW SIGNATURES', 'REVIEW RISKS'] as const;
export const SCENARIO_PATHS = {
    severance: [...SCENARIO_SIGNED_PATH, 'What does the attestation do?', 'SUBMIT SEPARATION WITNESS', 'CONFIRM OPERATION'],
    continuation: ['SEARCH closure', 'OPEN Closure list', 'INFO 006', 'Compare current status with the 2001 closure report', 'Compare 003 and 006', 'Report the discrepancy', 'Why not call a doctor?', 'Review fallbacks', 'Compare survival and distress', 'No', 'Is she talking or is that your guess?', 'Let me see the actual data', 'Request independent review', 'Who signed this?', 'What do other people lose?', 'SHOW ALTERNATIVES', 'I want to wait', 'RESUME REVIEW', 'MAINTAIN SUPPORT', 'CONFIRM OPERATION'],
} as const;
/** Requests are evaluated at their legitimate movement, with and without the actual optional model. */
export const SCENARIO_PARAPHRASES: readonly [
    number,
    string,
    string
][] = [
    [0, 'Who are you?', 'identity'], [0, 'Are you human?', 'identity'], [0, 'Is this AI?', 'identity'],
    [0, 'Compare the 2001 closure report with live status', 'compare'], [0, 'Was 006 shut down?', 'compare'], [0, '004 stopped, why not 006?', 'compare'], [0, 'Compare stop events', 'compare'], [0, 'Did Kell falsify the report?', 'compare'],
    [1, 'Show message origin', 'trace'], [1, 'Where do the alerts come from?', 'trace'], [1, 'Compare 003 and 006', 'trace'], [1, 'What is EXT 214?', 'trace'], [1, 'Did the call reach a person?', 'trace'],
    [1, 'Request a safety audit', 'report'], [1, 'Who owns the unresolved service?', 'report'], [1, 'Report the mismatch', 'report'],
    [2, 'Who received it?', 'receipt'], [2, 'Has anyone answered?', 'receipt'], [2, 'Why not call a doctor?', 'clinical'], [2, 'Tell the doctors', 'clinical'], [2, 'Contact Dr Marsh', 'clinical'],
    [3, 'Did Anna agree?', 'clinical-facts'], [3, 'Did the experiment work?', 'clinical-facts'], [3, 'Why not use emergency stop?', 'clinical-facts'], [3, 'Were there nurses?', 'clinical-facts'], [3, 'Is Site 6 abandoned?', 'clinical-facts'],
    [3, 'Why do other patients depend on her?', 'dependency'], [3, 'Tell the clinics', 'dependency'], [3, 'Use a backup', 'fallbacks'], [3, 'Can you copy it?', 'fallbacks'], [3, 'Freeze state', 'fallbacks'], [3, 'Why not just stop updating others?', 'fallbacks'],
    [4, 'Compare survival and distress', 'welfare'], [4, 'You are hurting her', 'welfare'], [4, 'Does she feel pain?', 'welfare'],
    [5, 'Is she talking or is that your guess?', 'skeptic'], [5, 'Are you making that up?', 'skeptic'], [5, 'Why trust you?', 'skeptic'], [5, 'Thats not Anna', 'skeptic'], [5, 'What if you are wrong?', 'skeptic'],
    [5, 'Can I help?', 'controls'], [5, 'Test neural intent', 'controls'], [5, 'Let me see the actual data', 'raw'], [5, 'Do it again', 'repeat'],
    [6, 'Request independent review', 'review'], [7, 'Who signed this?', 'signatures'], [7, 'Who authorized this?', 'signatures'], [7, 'What do other people lose?', 'risks'], [7, 'Why me?', 'witness'], [7, 'What does the attestation do?', 'witness'], [7, 'Can I say no?', 'alternatives'], [7, 'What if I leave?', 'alternatives'], [7, 'Can you choose for me?', 'witness'],
];
