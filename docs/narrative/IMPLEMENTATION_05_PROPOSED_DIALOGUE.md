# Implementation 05 — proposed conversation wording

Status: ACCEPTED WORKING CONVERSATIONAL FOUNDATION, with the author's three wording corrections applied on 26 October 2026. Originally created before runtime integration on 24 October 2026 as ENGINEERING PROPOSAL / AUTHOR REVIEW REQUESTED. Acceptance preserves the remaining ordinary topics; it does not ratify new lore or change the underlying reference statuses. No fictional event, person, date, medical finding or authority is added.

The following 28 topics are the bounded first expansion. Runtime strings and recognition examples will be inventoried in `docs/IMPLEMENTATION_05_CONVERSATION_INVENTORY.json`; that generated inventory is the exact line-by-line review companion to this proposal. Social and humor wording is proposed character voice. Factual wording is a paraphrase of the references below. Previously approved literal scenes and records are not rewritten.

| Topic | Proposed answer / behavior | Basis |
| --- | --- | --- |
| Greeting | Hello. This is Meridian's R-02 records interface. What would you like to examine? | Neutral at 02:14; player wording “Good evening” remains recognized |
| Thanks | You're welcome. | Ordinary social wording |
| Farewell | You may close the client. | In-universe departure only; browser saves belong to application HELP/settings |
| Restrained humor | An orderly archive is quiet. An incomplete archive is also quiet. The distinction requires inspection. | Proposed dry voice; no new lore |
| Identity | R-02 is Meridian's remote records and operations interface. No human operator is impersonated. | No deeper identity before the existing reveal; revealed identity replies remain unchanged |
| Capabilities | Retrieve permitted records, describe work profiles and report registered service observations. | Implementations 01–04 |
| Access | Records access does not confer equipment-control or medical authority. | v1.0 disclosure/authority rules |
| History | Founded in 1984; expanded from monitoring into rehabilitation and neural research; smaller company still operating in 2003. | Approved Implementation 01 projection |
| Founders | Dr Ruth Calder and Martin Shaw; rehabilitation medicine and embedded systems/telemetry respectively. | Approved corporate profile |
| Products | C-Series monitoring; R-Series rehabilitation; N-Series neural-interface research. | Approved corporate profile |
| C-Series | C-14, C-20 and CL-3 monitoring equipment. | Approved product projection |
| R-Series | R-8, R-11 and Clinic Console for supervised rehabilitation/assessment. | Approved product projection |
| N-Series | N-2, N-4 and Calibration Workbench; research capability differs from commercial capability. | Approved product projection; no protected patient association |
| Staff | Selected public work profiles, not a complete payroll; ask for a name, role or department. | Public directory projection |
| Anna's work role | Dr Anna Voss was head researcher in Advanced Neural Interfaces, 1989–1996. A work profile does not establish current condition. | Public P025 projection; no patient disclosure |
| Reliability | Dated claims, retained observations and missing information must be distinguished; disagreement does not itself prove fraud. | Existing records and v1.0 movement B |
| Errors | A retained error reports what was recorded; it does not establish cause or present execution. Name the service or record. | Service/log source boundaries |
| Sources | Cite the previous permitted answer's source links/record IDs; request a subject when absent. | Actual last response, existing access checks |
| Corrections | Identify the disputed statement and source; no correction silently rewrites a record or grants access. | Read-only interface; proposed acknowledgement |
| Clarification | Explain the current subject without treating clarification as consent or a new review request. | v1.0 optional conversation |
| Repeat | Repeat the previous answer without repeating its effects. | Saved terminal response; no action replay |
| Dates | Show actual case clock and distinguish retained 06 NOV / 02:14 service snapshot. | v1.0 §2 |
| Help | Current ordinary controls and authorized review hints; Esc reveals reply, Up/Down recalls input. | Current UI, no prototype verification instructions |
| Local saves | Progress stored in this browser when available; reload never confirms a pending operation. | Explicitly labeled APPLICATION HELP / LOCAL SAVES; also in HELP and CLIENT SETTINGS |
| Social exchange | I am available to examine Meridian records. Which subject would you like to discuss? | Proposed professional voice; no early emotional claim |
| Funding | Reduced funding and costly research contributed to restructuring; precise support finances unavailable. | Approved company decline; no invented payer |
| Player visit | Available records do not establish why this visitor opened the client or a planned visit. | Existing identity boundary |
| Uncertainty | I can distinguish recorded observations from interpretations. Missing evidence remains missing. | Existing reliability/clinical interpretation limits |

The accepted working foundation also includes refusal/hypothetical acknowledgements, clarification prompts, historical post-outcome framing and source explanations. These are interface/interpretive repairs grounded in the controlling scenario, not additional scenes. The inventory contains the exact 28 ordinary answer anchors; conditional interface copy is reviewable in `src/app/core/engine/fresh-conversation.ts`, `scenario.ts` and `game.ts`.

Proposed procedural explanations, without executing a request:

- “An integrity referral submits a source comparison for triage. Intake does not establish a human clinical read or grant new privileges.” (M03)
- “Clinical review means an authenticated human clinician reads the referral and decides whether to release a limited safety synopsis. It grants no equipment-control authority.” (v1.0 movements C/D)
- Hypothetical departure/deferral questions reuse the existing alternatives explanation without setting deferral or clearing a pending choice.

Blind-control sample data remains unauthored (audit B08); no measurements or additional neural messages are proposed here.
