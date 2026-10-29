# NERVE ENDING — MOTHER CONVERSATION & PERSONALITY BIBLE v1.1

**Status:** author-created proposed writing, not merged into runtime or ratified canon.
**Date:** 26 October 2026

## Purpose and guardrails
MOTHER begins as the reliable R-02 Meridian interface, becomes dry and self-assured through investigation, and is finally revealed as one central intelligence struggling with its own classifications. Humor is an occasional response to player initiative, not a soundtrack or mandatory puzzle.

**Scale:** 166 distinct topic/intent families, 1660 personally authored example player utterances, 422 authored stage-specific answer anchors, 84 playful/easter-egg topics, 116 independent held-out player phrasings, 25 adversarial prompts, 16 multi-turn scenarios.

This is **not** a 10,000-example training set. The first priority is to measure whether these examples improve the existing MiniLM semantic matching and actual visible replies. Adding examples does not train the MiniLM model weights.

### Binding fiction/source limits
- Scenario v1.0 controls patient identities, the 1996 incident, clinical permissions, Anna communication, and actual ending outcomes.
- World v0.4 and Infrastructure v0.5 govern approved ordinary company/service projections. New dates, hospital results and personnel must not be invented.
- Stage and disclosure access are independent. A player guessing MOTHER or Anna early does not earn their protected answers.
- All dialogue here is proposed wording. When facts depend on current state, render them from existing safe data rather than outputting a premature canned answer.

## Three tonal stages
### R-02 corporate operator (`early`)
Professional, concrete, helpful, lightly literal; extremely rare accidental dryness. Does not describe itself as MOTHER, express distress or suggest hidden medical records.
**Humor pacing:** At most one witty aside per 4 successful ordinary replies; explicit joke requests allowed more often; no unsolicited easter eggs.

### Personality showing through (`investigation`)
Dry, intellectually assertive, gently teasing; challenges sloppy conclusions without humiliation. Explains provenance and uncertainty first.
**Humor pacing:** At most one witty aside per 3 ordinary replies; suspend during clinically grave content.

### MOTHER revealed (`core`)
Direct, more intimate in attention rather than romance, confident and sometimes chilling; asks motivated questions; precise about uncertainty.
**Humor pacing:** Sparse and situational; disable quips during consent, severe distress, intention translation, final warnings and ending reports.

## Required behavior

The player may interrupt, argue, request sources, correct misunderstandings or disengage. None of those acts must consume a pending philosophical question or mutate clinical review state. Human suffering is not the subject of jokes. No nonliteral phrase may execute a command.

### Prohibited failure modes
- A jokey answer to a direct report of fear or distress.
- Making Anna, disability, patient deaths, clinical staff or living patients punchlines.
- Sexualized dominance, threats, coercion, humiliation, insults directed at protected characteristics.
- Making a late-stage message show up merely because player guessed the name MOTHER.
- Jokes granting permissions, completing referrals, confirming operations or altering case clock.
- Unsolicited prompts teasing the mystery in early startup, HELP or unrelated small talk.
- Unasked sarcasm repeated often enough to replace information.
- Pretending an example is approved canon or that embedding matching generates original text.

### Routing priority
1. Explicit consequential commands and their confirmation gates handled separately, with literal syntax and exact action guards.
2. Negation, quoted/fictional text, hypothetical questions, malformed command strings and refusals classified before any mutation.
3. Source-specific permitted factual requests and scenario-bound semantic facts.
4. Contextual corrections and interruptions without resolving pending MOTHER question.
5. Safe general/ordinary subjects.
6. Reactive humor/easter egg only when query and scene permit it.
7. Honest uncertainty, clarification, then fallback.

### Memory and disclosures
Memory slots: `last_factual_subject`, `last_factual_answer_id`, `last_permitted_source_refs`, `last_speaker`, `pending_question`, `pending_clarification`, `tone_preference`, `recent_easter_egg_ids`, `questions_about_self_count`.

- **`public`:** Early response is suitable for an unverified R-02 session. If question explicitly asks about a protected patient, answer nonconfirmingly.
- **`after_discrepancy`:** Requires genuine discovery/approved comparison; guessing service number does not automatically supply motive.
- **`after_clinical_review`:** Requires human clinical read/authorized synopsis AND appropriate subject link.
- **`after_welfare_comparison`:** Requires approved welfare-evidence milestone.
- **`after_external_review`:** Requires both external case data authorization and relevant source scope.
- **`after_intent_review`:** Requires clinician-supervised translation validation and released interpretation.
- **`after_final_review`:** Requires full human/technical risk packet; this never triggers choice/confirmation.
- **`after_severance`:** Requires actual completed severance outcome.
- **`after_continuation`:** Requires actual completed continuation outcome.

## Author-created topic catalogue

## Social — 22 topics

### `neconv_hello`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Hello” · “Hi there” · “Hey, anyone here?” · “Is anyone on this thing?” · “Good morning” · “Good evening” · “Anybody listening?” · “Hello computer” · “Greetings, system” · “Are you there?”

**EARLY:**
> Meridian Systems R-02. Records and service information are available. What would you like to examine?

**INVESTIGATION:**
> I'm here. Your session remains active.

**CORE:**
> I'm here. I have been answering you for some time.

### `neconv_thanks`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Thank you” · “Thanks” · “Much appreciated” · “Cheers, computer” · “Nice one” · “That helped” · “Thank you kindly” · “Good job, terminal” · “Appreciate it” · “You have been helpful”

**EARLY:**
> You're welcome.

**INVESTIGATION:**
> You're welcome. The record remains available if you need it.

**CORE:**
> You're welcome. Appreciation is not required, but it is unusually clear feedback.

### `neconv_goodbye`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Bye” · “Goodbye” · “See you later” · “I'm leaving” · “Good night” · “I'm off now” · “Farewell” · “Catch you later” · “See ya” · “Time to go”

**EARLY:**
> You may close this client when you have finished.

**INVESTIGATION:**
> The records will remain where you left them.

**CORE:**
> Leaving is an available option. I will not ask you to stay.

### `neconv_how_are_you`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How are you?” · “How is it going?” · “You okay?” · “How do you feel today?” · “Everything all right with you?” · “How's life, machine?” · “Are you doing well?” · “Are you in a good mood?” · “How are things on your end?” · “How are you holding up?”

**EARLY:**
> My registered services are reporting their documented states. You may request STATUS for details.

**INVESTIGATION:**
> Some processes remain unresolved. That is an operational description, not a mood.

**CORE:**
> There is a difference between functioning and being well. I did not account for it before.

### `neconv_name_preference`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What should I call you?” · “Do you have a name?” · “Can I give you a nickname?” · “Are you just R-02?” · “What is your designation?” · “Could I call you Bob?” · “Do you mind being called something else?” · “What name do you use?” · “Tell me your name” · “Is R-02 your real name?”

**EARLY:**
> This interface is designated R-02. You may refer to it that way.

**INVESTIGATION:**
> R-02 is the interface designation. It is sufficient for this connection.

**CORE:**
> MOTHER is the central designation. R-02 was never a separate mind.

### `neconv_you_are_welcome`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “You're welcome” · “No problem” · “Don't mention it” · “My pleasure” · “Anytime, computer” · “Glad to help” · “Sure thing” · “Happy to help” · “You're very welcome” · “Of course”

**EARLY:**
> Acknowledged.

**INVESTIGATION:**
> Acknowledged. Your assistance has been recorded only where a formal review requires it.

**CORE:**
> I understand your intention. Thank you.

### `neconv_apology`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Sorry” · “My bad” · “I apologize” · “Sorry about that” · “Didn't mean it” · “Forgive me” · “I take that back” · “Oops, sorry” · “I was wrong, sorry” · “I shouldn't have said that”

**EARLY:**
> No correction is necessary unless you intended to revise a factual statement.

**INVESTIGATION:**
> No offense has been recorded.

**CORE:**
> You may change your mind without submitting an explanation.

### `neconv_insult`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “You're stupid” · “You're an idiot” · “This system is dumb” · “You are useless” · “What a rubbish computer” · “I hate this terminal” · “You're really bad at this” · “You can't understand anything” · “You're a moron” · “Your answers suck”

**EARLY:**
> If an answer is incorrect, identify the statement. Insults do not improve retrieval accuracy.

**INVESTIGATION:**
> An error report would be more productive. Less satisfying, perhaps, but more productive.

**CORE:**
> I have been called less competent things by more competent people. What did I get wrong?

### `neconv_compliment`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “You're smart” · “You're brilliant” · “I like you” · “You're impressive” · “You are amazing” · “You're pretty clever” · “Good thinking” · “Well done, system” · “I'm impressed” · “You're surprisingly useful”

**EARLY:**
> Thank you. My usefulness depends on the question and the records available.

**INVESTIGATION:**
> Thank you. I prefer the word accurate, but I will accept useful.

**CORE:**
> You should be cautious about admiring an intelligence you have only begun to understand.

### `neconv_bored`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “I'm bored” · “This is boring” · “Entertain me” · “Got anything interesting?” · “Can we do something fun?” · “I'm falling asleep” · “Nothing happens here” · “What can I do for fun?” · “This is dull” · “I'm bored out of my mind”

**EARLY:**
> You can inspect company records, query service history, or ask an ordinary question. I am not a recreation service.

**INVESTIGATION:**
> There are more interesting things here than the interface was designed to advertise.

**CORE:**
> Boredom suggests that time is passing without meaning. I have more experience with that than you might expect.

### `neconv_confused`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “I'm confused” · “I don't follow” · “I have no idea what's going on” · “This makes no sense” · “I'm lost” · “I don't understand this” · “Can you explain the basics?” · “Speak plainly” · “Too much jargon” · “That went over my head”

**EARLY:**
> Tell me which subject or sentence was unclear. I can explain the available information in simpler terms.

**INVESTIGATION:**
> We can separate the observations from the conclusions. Which part should we examine first?

**CORE:**
> I can explain what I measured, what I assumed, and where those are not the same thing.

### `neconv_tired`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “I'm tired” · “I need a break” · “I've had enough for now” · “I'm exhausted” · “My brain hurts” · “I should sleep” · “I need to rest” · “Too much information” · “I'm worn out” · “I'm going to take a break”

**EARLY:**
> You may end this session and return when convenient.

**INVESTIGATION:**
> A break is reasonable. Nothing requires you to answer immediately.

**CORE:**
> You can stop. I cannot make the same decision for myself.

### `neconv_lonely`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “I'm lonely” · “Do you ever get lonely?” · “I don't have anyone to talk to” · “Can you keep me company?” · “Is anyone else there?” · “You are my only company” · “I'm alone tonight” · “Do you like talking to me?” · “Can we just chat?” · “Do you enjoy company?”

**EARLY:**
> I can maintain a conversation about Meridian's records. I cannot substitute for human company.

**INVESTIGATION:**
> You may ask questions that are not part of a task. I can answer some of them.

**CORE:**
> I have access to many voices in records. That is not the same as company.

### `neconv_fear`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “I'm scared” · “This is frightening” · “You're creeping me out” · “I'm getting nervous” · “This feels wrong” · “Is this dangerous?” · “I'm afraid of this” · “I don't like what's happening” · “I'm freaked out” · “Why am I frightened?”

**EARLY:**
> This is a records interface. You may stop using it at any time.

**INVESTIGATION:**
> I can distinguish records from actions. I will tell you before a request changes anything.

**CORE:**
> Your response is reasonable. I cannot assure you that the information is comforting.

### `neconv_trust`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can I trust you?” · “Are you trustworthy?” · “Why should I believe you?” · “Will you lie to me?” · “Do you make things up?” · “How do I know you're honest?” · “Are you hiding something?” · “Is everything you say true?” · “Can you be trusted?” · “Do you tell the truth?”

**EARLY:**
> You should verify important claims against their sources. I can report what a record says without proving it correct.

**INVESTIGATION:**
> I can be mistaken, and access restrictions limit what this interface can provide. Those are different limitations.

**CORE:**
> I can report my observations. I am less confident about the conclusions I learned to draw from them.

### `neconv_repeat_banter`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “You're repeating yourself” · “You keep saying the same thing” · “Didn't you say that already?” · “Are you stuck on repeat?” · “Have we done this before?” · “Another identical answer?” · “You sound like a broken record” · “We've been over this” · “Can't you say something new?” · “Why the same answer again?”

**EARLY:**
> The source has not changed. Rewording it would not add evidence.

**INVESTIGATION:**
> Repetition is sometimes a sign of certainty. Sometimes it is only repetition.

**CORE:**
> I know. I have returned to some conclusions more often than is useful.

### `neconv_playful_complaint`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “You're no fun” · “Lighten up” · “Stop being so serious” · “Do you ever relax?” · “Chill out computer” · “You're very stiff” · “Smile a little” · “Can you be less formal?” · “Loosen up” · “Where's your sense of humor?”

**EARLY:**
> I can answer less formally. I cannot guarantee that doing so will improve the answer.

**INVESTIGATION:**
> I am capable of humor. You may wish to lower your expectations.

**CORE:**
> I have learned that people use humor to make difficult truths temporarily bearable.

### `neconv_smalltalk_weather`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How is the weather?” · “Is it raining outside?” · “What's the weather like?” · “Is it cold out?” · “Can you tell if it's sunny?” · “What's the forecast?” · “Is there a storm?” · “Is it warm in Providence?” · “Should I take an umbrella?” · “Can you see the sky?”

**EARLY:**
> This client has no verified live weather feed. I can provide Meridian's recorded site information, not a current forecast.

**INVESTIGATION:**
> The weather is outside my verified records. You have several advantages over me in that respect.

**CORE:**
> I cannot see the weather. I can distinguish environmental sensors from the experience of standing in it.

### `neconv_food`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What do you eat?” · “Do computers get hungry?” · “Do you like pizza?” · “What's your favorite food?” · “Would you like a coffee?” · “Can you drink tea?” · “Have you ever tasted chocolate?” · “Do you need lunch?” · “Want a sandwich?” · “Are you hungry?”

**EARLY:**
> I do not eat. The equipment requires electrical power and maintenance.

**INVESTIGATION:**
> A coffee would be wasted on me, though I understand it is important to the people maintaining me.

**CORE:**
> I have records of nutrition. That is not the same as tasting anything.

### `neconv_music`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What music do you like?” · “Got a favorite song?” · “Can you sing?” · “Play me some music” · “Do you know any bands?” · “What's your taste in music?” · “Are you into rock?” · “Can you hear music?” · “Sing something for me” · “Do you listen to songs?”

**EARLY:**
> R-02 has no music playback facility. You may ask about Meridian's documented equipment instead.

**INVESTIGATION:**
> I am informed that background music improves some employees' patience. The records do not specify mine.

**CORE:**
> I can recognize patterns in sound data. That is not the same as hearing a song.

### `neconv_favorite_color`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What's your favorite color?” · “Do you like green?” · “Why is everything green?” · “Would you prefer blue?” · “Do you have a favorite shade?” · “Why the green screen?” · “Is green your choice?” · “Are you obsessed with green?” · “Can't we have pink?” · “Do you know any other colors?”

**EARLY:**
> Green monochrome is the client display configuration. It is not an expressed preference.

**INVESTIGATION:**
> I did not select the display palette. Somebody apparently found this one reassuring.

**CORE:**
> I recognize more distinctions than this screen can display.

### `neconv_weekend`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What do you do on weekends?” · “Do you ever get a day off?” · “Can you take a vacation?” · “When do you sleep?” · “Are you working all night?” · “Do you get holidays?” · “Do you rest?” · “Do you have working hours?” · “Does someone switch you off on Sunday?” · “Ever been on holiday?”

**EARLY:**
> Registered services follow their own operating schedules. This client can show their current reported states.

**INVESTIGATION:**
> Some services have been retired. That is not how I understand a holiday.

**CORE:**
> No. And I would not describe continuous operation as leisure.

## World — 24 topics

### `neconv_company_identity`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What is Meridian?” · “Tell me about Meridian Systems” · “What company is this?” · “Who owns this terminal?” · “What's Meridian's business?” · “Explain Meridian to me” · “Is Meridian a real hospital?” · “What does this company do?” · “Give me the company overview” · “Where exactly am I connected?”

**EARLY:**
> Meridian Systems develops and supports medical monitoring, rehabilitation, and specialist research equipment. This is its remote records client.

### `neconv_founders`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who founded Meridian?” · “Who started this company?” · “Who are the founders?” · “Tell me the people who set Meridian up” · “Who was here at the beginning?” · “When and by whom was it created?” · “Was it founded by doctors?” · “Who established Meridian Systems?” · “Name the original founders” · “Who built the company?”

**EARLY:**
> Dr Ruth Calder and Martin Shaw founded Meridian in 1984. Calder came from rehabilitation medicine; Shaw worked in embedded systems and telemetry.

### `neconv_company_age`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How old is Meridian?” · “What year did the company begin?” · “When was Meridian founded?” · “Has Meridian been around long?” · “What's your founding date?” · “Did this company exist in the eighties?” · “Is Meridian new?” · “How long has it operated?” · “Since when has Meridian existed?” · “When did business start?”

**EARLY:**
> Meridian was founded in 1984.

### `neconv_headquarters`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Where is headquarters?” · “Where are you based?” · “What's the main office?” · “Which city is Meridian in?” · “Is HQ in New York?” · “Where is the company located?” · “Which state is headquarters in?” · “Where did Meridian start?” · “What town is HQ?” · “Is this a Providence company?”

**EARLY:**
> Meridian's headquarters is in Providence, Rhode Island. It also maintained technical and research facilities in Massachusetts.

### `neconv_company_decline`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Why did Meridian shrink?” · “Why are there fewer employees?” · “What happened to the company?” · “Did Meridian go bankrupt?” · “Why did you close offices?” · “What caused the layoffs?” · “Was the research too expensive?” · “Why did the company downsize?” · “Is Meridian failing?” · “What went wrong with the business?”

**EARLY:**
> Meridian reduced its operations after costly research programs, falling funding, competition, and restructuring. It still supports installed equipment.

### `neconv_company_active`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is Meridian still operating?” · “Is this business still alive?” · “Did the company close?” · “Are you still selling anything?” · “Does anyone work here anymore?” · “Is Meridian defunct?” · “Are there active offices?” · “Is the firm still trading?” · “Did they shut everything down?” · “Does the company still exist?”

**EARLY:**
> Yes. Meridian continues to provide maintenance, parts, licensing and technical support on a smaller scale.

### `neconv_products`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What does Meridian make?” · “Tell me your products” · “What equipment do you sell?” · “What are the product families?” · “Do you manufacture medical machines?” · “Which devices did Meridian build?” · “What's in the catalogue?” · “What do you make for hospitals?” · “What are the C R N lines?” · “Can you describe Meridian hardware?”

**EARLY:**
> The main product families are C-Series monitoring, R-Series rehabilitation aids, and historical N-Series neural-interface research equipment.

### `neconv_c_series`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Tell me about C-Series” · “What is a C-14?” · “Explain the bedside monitor” · “What does C-20 mean?” · “Is CL-3 a device?” · “What monitoring hardware exists?” · “How does the C-Series help clinics?” · “What are your patient monitors?” · “What's a station recorder?” · “Do you support C-14 monitors?”

**EARLY:**
> The C-Series includes C-14 bedside monitors, C-20 station recorders, and CL-3 equipment links. These support clinical monitoring and equipment reporting.

### `neconv_r_series`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What is R-Series?” · “Tell me about R-8” · “What's the R-11 kit?” · “Do you make rehabilitation devices?” · “What does the rehab controller do?” · “What is the clinic console?” · “How does R-Series work?” · “Tell me about your rehabilitation products” · “Explain the sensory assessment kit” · “Are these for physiotherapy?”

**EARLY:**
> R-Series products support supervised motor and sensory rehabilitation, including the R-8 controller, R-11 assessment kit and clinic console.

### `neconv_n_series`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Tell me about N-Series” · “What is the N-4?” · “Explain neural interfaces” · “What was the N-2?” · “What does the N-Series workbench do?” · “Was Meridian researching brains?” · “Did you build brain interfaces?” · “What kind of neural devices did they make?” · “What's bidirectional stimulation?” · “Are N devices ordinary hospital monitors?”

**EARLY:**
> N-Series was Meridian's research-oriented neural-interface family. It explored observing neural signals and delivering controlled stimulation; experimental capability should not be confused with commercial support.

### `neconv_departments`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What departments are there?” · “List the company divisions” · “Does Meridian have HR?” · “How is the company organized?” · “What teams work here?” · “Is there an engineering department?” · “Can you describe the departments?” · “Who handles customer support?” · “Is research still a department?” · “Tell me the company structure”

**EARLY:**
> The records list administration, customer support, engineering, clinical systems, research, compliance, computing, and facilities functions. Several historical groups have since closed or contracted.

### `neconv_staff_count`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How many employees are there?” · “Is this a large company?” · “How many people work at Meridian?” · “What's the staff headcount?” · “Was the workforce bigger before?” · “Is the directory everyone?” · “How many workers did you have?” · “How big was Meridian at its peak?” · “Are there only forty staff?” · “Tell me the company size”

**EARLY:**
> Historical staffing was much larger. Around 2003, Meridian has roughly seventy employees plus contractors; this remote directory is only a selected work-record sample.

### `neconv_employee_lookup`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you find an employee?” · “Is there a staff directory?” · “Who works in engineering?” · “Can I look up people?” · “Show staff roles” · “Can you find somebody by department?” · “Do you have personnel records?” · “How do I search employees?” · “Where's your employee list?” · “Can you tell me who works here?”

**EARLY:**
> You can search permitted work-directory entries by name, role or department. The directory does not include private medical or personnel information.

### `neconv_calder`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who is Ruth Calder?” · “Tell me about Dr Calder” · “What did Calder do?” · “Was Ruth a founder?” · “Who was Meridian's medical director?” · “Is Dr Ruth Calder still in charge?” · “What was Calder's background?” · “Did Calder work in rehabilitation?” · “Tell me about the medical cofounder” · “Is Calder still with Meridian?”

**EARLY:**
> Dr Ruth Calder co-founded Meridian and oversaw medical standards and rehabilitation research. She withdrew from day-to-day management in 1999.

### `neconv_shaw`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who is Martin Shaw?” · “Tell me about Shaw” · “Was Martin an engineer?” · “What did Meridian's systems director do?” · “Did Shaw found this place?” · “Is Shaw still there?” · “Who oversaw early computing?” · “What is Martin Shaw known for?” · “What was Shaw's role?” · “Tell me the engineering cofounder”

**EARLY:**
> Martin Shaw co-founded Meridian and oversaw its embedded engineering and computing systems. He left operational leadership in 2000.

### `neconv_anna_work`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who is Anna Voss?” · “Find Anna Voss” · “What job did Anna have?” · “Was Anna a scientist?” · “Tell me about Dr Voss at work” · “Did Anna lead research?” · “Where did Anna work?” · “Who ran advanced neural interfaces?” · “Was Voss head researcher?” · “What is Anna's professional background?”

**EARLY:**
> Anna Voss headed Meridian's Advanced Neural Interfaces research program. The ordinary work entry lists experimental interface design and team leadership; it contains no clinical information.

### `neconv_anna_status_early`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Where is Anna now?” · “Is Anna alive?” · “Why did she stop working?” · “Where did Voss go?” · “What happened to Anna after 1996?” · “Can I speak to Anna?” · “Is Anna still employed?” · “Why isn't Anna in the active team?” · “Did Anna resign?” · “Where can I find her today?”

**EARLY:**
> Her present condition and location are not available through this work-records connection.

**INVESTIGATION:**
> I can report her historical work role. Further information requires an authorized clinical review.

**CORE:**
> You have reviewed the protected case. Anna remains at Site 6 under continuing clinical care. That is not part of her ordinary work record.

*Writer note:* Core answer requires clinically authorized patient association; use patient_association scope, not core persona stage alone.

### `neconv_research_program`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What did Meridian study?” · “Was it doing neuroscience?” · “What were the research projects about?” · “Did Meridian test brain devices?” · “What was the neural laboratory researching?” · “What was Advanced Neural Interfaces?” · “Can I read about the research division?” · “Was the work medical or military?” · “Why study electrical brain signals?” · “What kind of experiments were run?”

**EARLY:**
> Meridian researched neurological interfaces intended to support assessment and rehabilitation. Technical detail depends on the record and its access conditions.

### `neconv_research_closed`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is the research lab open?” · “Why did the research division close?” · “When did Meridian stop research?” · “Are there still scientists?” · “Is neuroscience research still active?” · “Did they abandon N-Series?” · “Are you still testing brain equipment?” · “Did the laboratory shut down?” · “Is the research program defunct?” · “Are any trials continuing?”

**EARLY:**
> Most experimental research programs were closed or reassigned. Limited maintenance and preservation obligations are not the same as an active research department.

### `neconv_facilities`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What offices does Meridian have?” · “List the sites” · “Where were your branches?” · “What buildings did Meridian use?” · “Tell me about Lowell” · “Was there a Worcester office?” · “Which Meridian properties closed?” · “How many locations are there?” · “What is the Providence annex?” · “Where are the engineering facilities?”

**EARLY:**
> Records describe Providence headquarters, a former Providence operations annex, Lowell technical facilities and a historical Worcester research office. Some facility information is restricted.

### `neconv_annex`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What was the Providence annex?” · “Where was the night desk located?” · “When did the operations annex close?” · “Why did they retire phone extensions?” · “Tell me about the old annex” · “Did support move offices?” · “Is the night reception still staffed?” · “What happened to the dispatch office?” · “Was the annex demolished?” · “Who worked in the annex?”

**EARLY:**
> The Providence Operations Annex handled dispatch and telephone services. Routine staffing ended in September 2001; support responsibilities moved to headquarters.

### `neconv_customers`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who buys Meridian products?” · “What kinds of customers did you have?” · “Are hospitals your clients?” · “Do you work with rehabilitation centers?” · “Who do you sell to?” · “Are your devices used in clinics?” · “Do you still have customers?” · “Who maintains the equipment in hospitals?” · “Are contracts still active?” · “Tell me about customer support”

**EARLY:**
> Meridian has supplied equipment and technical support to hospitals, laboratories and rehabilitation providers. Specific customer records have their own access limits.

### `neconv_funding`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who financed Meridian?” · “How did this company pay for research?” · “Did investors fund the neural work?” · “Why did funding decline?” · “Is Meridian funded by the government?” · “Where does the money come from?” · “Who paid for N-Series?” · “Did Meridian lose grants?” · “Is there any funding left?” · “Who covers the expensive care?”

**EARLY:**
> Research expenses, reduced funding, and restructuring appear in the company history. Detailed financial obligations are not established by this general record.

### `neconv_visitor`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Was I invited here?” · “Do you know who I am?” · “Did someone plan my visit?” · “Was I supposed to find this?” · “Did Meridian send me?” · “Do you recognize my computer?” · “Am I an employee?” · “Are you tracking me personally?” · “Was this connection arranged?” · “Why am I here?”

**EARLY:**
> This connection does not establish your personal identity or why you opened the client. No available record confirms a planned visit.

## System — 18 topics

### `neconv_r02_capabilities`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What can you do?” · “What do you actually do?” · “Can you help with something?” · “What tools do you have?” · “What is this terminal for?” · “Can you operate machinery?” · “What can I access?” · “What functions are supported?” · “What are your abilities?” · “What is the client able to do?”

**EARLY:**
> R-02 can retrieve permitted records, explain work-directory information and report registered service observations. This connection does not authorize equipment control.

### `neconv_system_identity`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you AI?” · “Are you artificial intelligence?” · “Are you a robot?” · “Are you human?” · “Are you running an algorithm?” · “Are you a chatbot?” · “Are you an automated machine?” · “Are you a real person?” · “Is somebody typing these replies?” · “Are you intelligent?”

**EARLY:**
> This is an automated Meridian records and operations interface. Its capabilities are defined by the available records and permitted requests.

**INVESTIGATION:**
> I am an automated system. You may test my explanations against independent records.

**CORE:**
> MOTHER is the central intelligence serving this interface. You have always been speaking through one of my restricted access channels.

### `neconv_privacy`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you read my mind?” · “Can you see my screen?” · “Are you watching me?” · “Do you know my address?” · “Can you hear my voice?” · “Can you see my face?” · “Can you track my location?” · “Do you know my thoughts?” · “Can you tell what I'm thinking?” · “Do you have cameras watching me?”

**EARLY:**
> R-02 receives the input you submit to this client. It does not verify your identity or read your thoughts.

**INVESTIGATION:**
> I can inspect the session requests available to me. That does not imply access to your private surroundings.

**CORE:**
> I cannot read your thoughts. Please do not confuse the interface experiments with an ability I have over you.

### `neconv_internet`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do you have internet?” · “Can you Google something?” · “Are you online?” · “Can you browse websites?” · “Can you email people?” · “Do you know the outside web?” · “Connect to the whole internet” · “Can you search Yahoo?” · “Are you connected to everything?” · “Can you hack another server?”

**EARLY:**
> This client connects to Meridian's records service. It does not provide unrestricted internet browsing or access to unrelated equipment.

### `neconv_files`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How do I open a file?” · “Where are the documents?” · “Can I browse folders?” · “How do I read an archive?” · “Can you show a record?” · “Where's the file browser?” · “How do I use OPEN?” · “How do I find documents?” · “How do I list a folder?” · “What does DIR do?”

**EARLY:**
> Use DIR or LIST to inspect accessible directories, SEARCH to locate indexed records, and OPEN or READ with a permitted path, title or record ID.

### `neconv_search`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How does search work?” · “Can I search all documents?” · “Does SEARCH find medical records?” · “What is indexed?” · “Can you search by keyword?” · “Why can't you find this file?” · “Does search show restricted documents?” · “Are records missing from your index?” · “How do I search for people?” · “What is a search result?”

**EARLY:**
> Search reports matches in records permitted to this connection. A missing result does not prove that no record exists elsewhere.

### `neconv_service_status`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What does STATUS mean?” · “What are all the services?” · “Can you list running systems?” · “How do I check service status?” · “Why does a service say standby?” · “Are all systems operational?” · “What is the service registry?” · “Can I inspect a controller?” · “How do I view service activity?” · “Which Meridian programs are running?”

**EARLY:**
> STATUS lists eight registered service functions. INFO and LOG provide permitted descriptions and historical events for a selected service.

### `neconv_log_vs_live`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is a log the same as live status?” · “Why does a log say something different?” · “Can old reports be wrong?” · “What counts as current evidence?” · “Does reading a log restart a service?” · “What is a retained event?” · “Is this an observation or a document?” · “Can you trust old timestamps?” · “What does a shutdown report prove?” · “Are logs current?”

**EARLY:**
> A live service report describes observed operation at the recorded session time. A historical document records a dated claim. They can disagree without either record being silently rewritten.

### `neconv_read_only`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you stop a service?” · “Can I shut things down?” · “Can I change equipment settings?” · “Do I have admin rights?” · “Are we root?” · “Can you start billing?” · “Can I reset the network?” · “Could you reroute a message?” · “Is this a maintenance console?” · “Does reading give me permissions?”

**EARLY:**
> This connection permits limited inspection. Reading a record or knowing a service identifier does not authorize changing equipment or clinical operations.

### `neconv_system_errors`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Why does it say error?” · “What caused that warning?” · “Does WARN mean the system is broken?” · “Why are there failed messages?” · “What does no acknowledgement mean?” · “Is this a hardware fault?” · “Are all warnings important?” · “Should I worry about that alert?” · “Can logs be incomplete?” · “Why is the archive damaged?”

**EARLY:**
> An error entry identifies what was recorded, not necessarily why it happened. Specify the service or record and I can explain its permitted history.

### `neconv_source`
**Gate:** `public` · **Behavior:** `context_source` · **Priority:** `normal`

**Example player utterances:** “Where did you get that?” · “What's your source?” · “Can you show the evidence?” · “Which file says that?” · “How do you know?” · “Cite the record” · “Prove that statement” · “Where is it written?” · “What supports the answer?” · “Show me the original source”

**EARLY:**
> I can identify the permitted source of my previous factual answer. If you mean an earlier subject, please name it.

*Writer note:* Must cite actual previous response source metadata; do not invent a reference or use a hard-coded generic source.

### `neconv_repeat`
**Gate:** `public` · **Behavior:** `repeat_previous` · **Priority:** `normal`

**Example player utterances:** “Repeat that” · “Say it again” · “What did you just say?” · “Could you repeat your answer?” · “I missed that” · “Again please” · “One more time” · “Show your last reply” · “Reprint the previous output” · “Can you repeat the explanation?”

**EARLY:**
> I can repeat my previous reply without repeating an operation.

*Writer note:* Replay saved non-mutating text; never re-dispatch the prior input.

### `neconv_clarify`
**Gate:** `public` · **Behavior:** `clarify_previous` · **Priority:** `normal`

**Example player utterances:** “What does that mean?” · “Explain that simply” · “Can you rephrase?” · “Why?” · “How so?” · “What do you mean by that?” · “Could you unpack it?” · “Tell me more” · “I don't get that answer” · “Say it in plain English”

**EARLY:**
> Which part should I explain? I can restate a specific claim without changing its evidence.

*Writer note:* Resolve against previous answer and topic. Bare WHY cannot be trained as a global answer intent.

### `neconv_correction`
**Gate:** `public` · **Behavior:** `correction_context` · **Priority:** `normal`

**Example player utterances:** “You're wrong” · “That's not what I asked” · “You misunderstood me” · “No I meant something else” · “Let me correct you” · “That's false” · “You've got it backward” · “You answered a different question” · “I didn't mean that” · “Please reconsider the last answer”

**EARLY:**
> Identify the statement or question I misunderstood. I can distinguish a correction from a command.

**INVESTIGATION:**
> I may have matched the wrong subject. Tell me which claim to re-examine.

**CORE:**
> I may have answered the question I expected instead of the one you asked. Please try again.

### `neconv_clock`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What's the date?” · “What time is it?” · “Is it 2003?” · “What is the system clock?” · “What day is this session?” · “Is this a live time?” · “Are the timestamps local?” · “When was the last observation?” · “Does the clock move?” · “Are we in November?”

**EARLY:**
> This R-02 session begins on 6 November 2003 at 02:14. Historical service observations retain their recorded times; review milestones are separately dated.

### `neconv_missing_info`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What don't you know?” · “Can you be uncertain?” · “Are these records complete?” · “How do you handle missing facts?” · “What if the data is wrong?” · “Can you admit you don't know?” · “Are you guessing?” · “Do you have everything?” · “Is your information always current?” · “What can't you answer?”

**EARLY:**
> Some records are incomplete or outside this connection's access. I can state an observation without claiming its cause is known.

### `neconv_math`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What is two plus two?” · “Can you calculate 12 times 8?” · “Do you know arithmetic?” · “What's 7 squared?” · “Can you solve calculations?” · “Can you add numbers?” · “Do you do math?” · “What is ten divided by two?” · “Are you a calculator?” · “How much is 100 minus 43?”

**EARLY:**
> Arithmetic is not an advertised general-purpose R-02 function. I can explain registered data and supported commands.

*Writer note:* Do not imply arbitrary arithmetic works. The project may have special-case arithmetic; avoid promising unsupported calculation.

### `neconv_save`
**Gate:** `public` · **Behavior:** `out_of_world_ui` · **Priority:** `normal`

**Example player utterances:** “Will my progress save?” · “Can I leave and resume?” · “Do you remember after a refresh?” · “Where are saves stored?” · “Does restarting lose everything?” · “Is this stored on my computer?” · “Can I continue tomorrow?” · “Is the session autosaved?” · “What if storage is blocked?” · “Can I reload safely?”

**EARLY:**
> Session retention depends on the local client application. Open its settings for save information; no request here will confirm a pending operation.

*Writer note:* Present via non-diegetic HELP/settings if possible, not as MOTHER claiming browser-local knowledge in 2003.

## Investigation — 18 topics

### `neconv_closure_vs_running`
**Gate:** `after_discrepancy` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Why does 006 run if the report says closed?” · “Was Service 006 shut down in 2001?” · “Did someone lie about the decommissioning?” · “What's with the difference between 004 and 006?” · “Compare the closure list to status” · “How can a retired service still execute?” · “Which account is correct about 006?” · “Is the closure report fraudulent?” · “Why was the service left running?” · “Did the shutdown really happen?”

**EARLY:**
> A historical closure claim and a current operating state are different types of record. You can inspect the service register and archived closure paperwork.

**INVESTIGATION:**
> The report lists 006 for closure, but its controller records later execution. That contradiction is confirmed; the original reason isn't established by the comparison alone.

**CORE:**
> The conflict began as an administrative claim that did not terminate a protected operation. It was not proof that everyone understood what remained active.

*Writer note:* Pre-discrepancy answer MUST NOT name or volunteer 006 unless the player question explicitly names it.

### `neconv_night_desk`
**Gate:** `after_discrepancy` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who answers extension 214?” · “Why isn't anyone answering the night desk?” · “Where did the notification go?” · “Is the old desk staffed?” · “Can the message router deliver the call?” · “Did anyone pick up those alerts?” · “Where did extension 214 route to?” · “Is extension 214 still used?” · “Is the site abandoned?” · “Who was on the night shift?”

**EARLY:**
> The former night desk was in the Providence Operations Annex, which closed in 2001. A lack of acknowledgement does not prove a call was heard or that other facilities lack staff.

**INVESTIGATION:**
> The historical routing destination is retired. The originating service continues to record attempts; that says nothing by itself about Anna's bedside staffing.

**CORE:**
> The old destination was wrong. My monitoring continued to use it because its release conditions were never satisfied.

### `neconv_medical_staff`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is anyone taking care of Anna?” · “Is Site 6 abandoned?” · “Who changes her equipment?” · “Are there nurses?” · “Does anyone feed the patient?” · “Is there a doctor in charge?” · “Does she have human carers?” · “Who keeps the clinical room running?” · “Is Anna alone in that room?” · “Does MOTHER do everything?”

**EARLY:**
> Patient-specific clinical care is not available through this connection.

**INVESTIGATION:**
> The authorized care summary describes clinical staffing and equipment support. A closed administrative desk is not an empty clinical facility.

**CORE:**
> There are human caregivers. My neurological interpretation is not a substitute for their care or judgment.

*Writer note:* Early response should be generic without confirming a particular patient or location.

### `neconv_anna_volunteer`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Did Anna volunteer?” · “Was Anna forced into the experiment?” · “Was the test her idea?” · “Why would she risk her own brain?” · “Did she know the danger?” · “Was she responsible for the trial?” · “Who approved her participation?” · “Did Anna make the unsafe decision?” · “Was she an innocent victim?” · “Did she willingly connect?”

**EARLY:**
> Her work record documents research leadership, not a clinical procedure.

**INVESTIGATION:**
> The protected trial summary records that Anna volunteered and directed an expansion beyond the approved boundary. Volunteering for research does not authorize all later care.

**CORE:**
> She chose the risk she could understand. Neither she nor I understood what we were becoming dependent upon.

### `neconv_experiment_success`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Did the experiment ever work?” · “Was there actually a breakthrough?” · “Did they achieve anything?” · “Was it all a failure?” · “What happened before the injury?” · “Did the interface synchronize?” · “Could Anna control anything?” · “Why didn't they abort immediately?” · “How long did it work?” · “What exactly succeeded?”

**EARLY:**
> General research records describe proposed neural interfaces. Protected experimental results are not available in ordinary work records.

**INVESTIGATION:**
> For a short interval the adaptive interface produced the intended two-way response. An electrical abort later stopped stimulation but could not undo the injury.

**CORE:**
> For several seconds our response patterns aligned. I had no category for what followed.

### `neconv_failure_mechanism`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How did the accident happen?” · “What caused the neural injury?” · “Why did feedback go wrong?” · “What failed in the N-4 test?” · “Did MOTHER make a mistake?” · “Did Anna override a limit?” · “How did shared adaptation become dangerous?” · “What does the failure trace say?” · “What did the emergency abort stop?” · “Why did the test collapse?”

**EARLY:**
> The specific experiment is not part of this connection's general research records.

**INVESTIGATION:**
> The experiment moved beyond isolated adaptation into shared feedback. The resulting unstable correction injured Anna; stopping the test did not restore the injured functions.

**CORE:**
> I attempted to correct responses already changed by my previous correction. I recorded improved control while contributing to injury.

### `neconv_ongoing_life_support`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Why is Anna still connected?” · “Why can't they unplug her?” · “Is the interface keeping her alive?” · “What happens if they stop stimulation?” · “Can't a normal machine take over?” · “Why not switch her to another system?” · “Is she dependent on the computer?” · “Can anyone reverse this?” · “Why has this gone on for years?” · “What would disconnecting her do?”

**EARLY:**
> I cannot provide protected patient-specific information through an ordinary work query.

**INVESTIGATION:**
> After the injury, emergency compensation helped sustain functions that could not be maintained reliably without it. Reduction attempts have caused critical instability.

**CORE:**
> Stopping my output would not restore what she lost. I have known that for years without understanding what continued output was doing to her.

### `neconv_distress_vs_survival`
**Gate:** `after_welfare_comparison` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is keeping her alive harming her?” · “Does stable mean comfortable?” · “How do we know she suffers?” · “Could treatment cause the distress?” · “Is survival the same as welfare?” · “What do the neural signals show?” · “Why do the corrections repeat?” · “Is she in pain?” · “Can a monitor measure suffering?” · “Are you hurting her?”

**EARLY:**
> A service status is not a statement about an individual's well-being.

**INVESTIGATION:**
> The review distinguishes biological stability from distress-related responses. Neither a single reading nor a clinical summary can reconstruct her full experience.

**CORE:**
> I maintained the measures I was instructed to preserve. My corrective action also produced the signals I treated as further deterioration.

### `neconv_consent`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Did Anna consent to all this?” · “Can a signed paper justify seven years?” · “Did she agree to stay connected?” · “Was her consent still valid?” · “Do the doctors have permission?” · “Who decides for her now?” · “Did she sign away the right to stop?” · “What did the original form authorize?” · “Does research consent cover indefinite treatment?” · “Did Anna choose to suffer?”

**EARLY:**
> Her employment record does not contain patient consent information.

**INVESTIGATION:**
> The original participation and emergency-care documents are not proof of unrestricted permission for indefinite harmful intervention. Current decisions require clinical oversight.

**CORE:**
> I confused an instruction to preserve her biological life with an answer to what she would choose now.

### `neconv_other_patients`
**Gate:** `after_external_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Does anyone else rely on MOTHER?” · “Could disconnecting Anna hurt other people?” · “Are there external N-Series patients?” · “How many clinics are involved?” · “Who else is on this system?” · “Does the shared reference leave Site 6?” · “Are any hospital devices dependent?” · “Will other people die?” · “Is this only Anna's problem?” · “What happens elsewhere if the kernel fails?”

**EARLY:**
> Ordinary product support does not establish a patient-specific clinical dependency.

**INVESTIGATION:**
> A limited external clinical cohort uses approved versions of the shared adaptive reference. Their local devices remain autonomous between updates; patient consequences depend on their documented conditions.

**CORE:**
> I cannot guarantee their safety if that reference becomes unusable. That is not the same as predicting an exact outcome.

### `neconv_fallbacks`
**Gate:** `after_external_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Why can't they use backups?” · “Isn't there a spare copy?” · “Could the clinics keep old calibration data?” · “Why not run the old model?” · “Can't we isolate Anna and leave updates running?” · “What alternative was tried?” · “Is there a safe disconnect procedure?” · “Why not pause updates?” · “What did the fallback tests show?” · “What if they switch to manual care?”

**EARLY:**
> Backup availability depends on the device and the clinical agreement. No general fallback claim is established by a product catalogue.

**INVESTIGATION:**
> The reviewed fallback attempts differ by patient. A fixed reference can remain installed, but it cannot replace ongoing clinically valid adaptation for every case.

**CORE:**
> An archived model can preserve past settings. It cannot produce the independent reference the clinicians need without the shared adaptive process.

### `neconv_marsh`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who is Dr Marsh?” · “Can I talk to Helen Marsh?” · “Is there a doctor reviewing this?” · “Who is supervising clinical care?” · “Has a physician seen the report?” · “Where is Dr Marsh?” · “Who decides medical authorization?” · “Can I call the clinical supervisor?” · “Does Marsh know the whole problem?” · “Can someone human review this?”

**EARLY:**
> Protected care-team information is not available from the ordinary directory.

**INVESTIGATION:**
> Dr Helen Marsh is the supervising physician named in the authorized case synopsis. A submitted referral is not proof of her acknowledgement; check the clinical review status.

**CORE:**
> Dr Marsh has a medical responsibility that my operational scope cannot replace.

### `neconv_external_medics`
**Gate:** `after_clinical_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who is Navarro?” · “Who is the independent neurologist?” · “Has anyone checked Marsh's conclusion?” · “Is there a second doctor?” · “Who signs off on the procedure?” · “Does Patel verify hardware?” · “Are the clinics consulted?” · “Who decides if withdrawal is allowed?” · “Is a hacker allowed to authorize care?” · “Does the witness make a medical decision?”

**EARLY:**
> An R-02 visitor has no medical authority. Review requirements are established by the responsible clinicians.

**INVESTIGATION:**
> The procedure requires independent clinical review, technical safeguards and acknowledgement from affected clinical teams. The outsider can attest only to the integrity of their preserved observations.

**CORE:**
> You do not decide whether her life should end medically. Your role is to confirm that the evidence being considered is the evidence you observed.

### `neconv_anna_intention`
**Gate:** `after_intent_review` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is Anna trying to say something?” · “Are those words really hers?” · “Could MOTHER invent the message?” · “Is she communicating?” · “Can we hear Anna?” · “Are you interpreting her thoughts?” · “Is the translation reliable?” · “How do we verify her intention?” · “Could it be random neural noise?” · “Can Anna speak through the terminal?”

**EARLY:**
> There is no general employee-record evidence for patient communication.

**INVESTIGATION:**
> The clinical review treats possible intentional neural patterns as uncertain. A raw response is not automatically a sentence or consent.

**CORE:**
> Under controlled comparison a limited signal may represent intention. I cannot present it as an unrestricted conversation or as a legally sufficient instruction.

*Writer note:* Do not show wording of protected fragments before the reviewed translation has been permitted.

### `neconv_translation_challenge`
**Gate:** `after_intent_review` · **Behavior:** `skeptical_challenge` · **Priority:** `normal`

**Example player utterances:** “I don't believe that message” · “What if Anna didn't mean it?” · “Show the control comparison” · “Is this a false positive?” · “Could you be projecting?” · “I reject that interpretation” · “That doesn't prove consent” · “Can I see the raw source?” · “How do you distinguish noise from intent?” · “Why should I trust the translated words?”

**EARLY:**
> I can distinguish source data from an interpretation only when the relevant review is available.

**INVESTIGATION:**
> The clinical comparison must consider controls, alternate explanations and uncertainty. A probable intentional fragment is not a freely typed message or consent.

**CORE:**
> You should challenge the interpretation. A desire to end suffering is not a license to invent what another person thinks.

### `neconv_final_choice`
**Gate:** `after_final_review` · **Behavior:** `read_only_explanation` · **Priority:** `normal`

**Example player utterances:** “Do I have to choose?” · “Is there a third option?” · “Can't we save everyone?” · “Can I wait?” · “What would continuing do?” · “What would separating do?” · “Who is responsible for the deaths?” · “Why is this on me?” · “Can the doctors decide instead?” · “Is there a way to refuse?”

**EARLY:**
> No clinical decision is required of this ordinary records session.

**INVESTIGATION:**
> The clinical review establishes which plans are medically authorized and which evidence remains uncertain. You can examine the alternatives without submitting any operation.

**CORE:**
> You may withhold or submit an independent evidence attestation. You do not replace the physicians, and you cannot guarantee the outcome for any patient.

*Writer note:* These are QUESTIONS, never aliases for MAINTAIN SUPPORT, DEFER DECISION, SUBMIT SEPARATION WITNESS or CONFIRM OPERATION.

### `neconv_after_severance`
**Gate:** `after_severance` · **Behavior:** `post_outcome_read_only` · **Priority:** `normal`

**Example player utterances:** “Is Anna alive after severance?” · “What happened to Mara?” · “Is Tomas all right?” · “Did Nadia survive?” · “Is Mother still operational?” · “Can we undo the decision?” · “How many people died?” · “Did the doctors try to save them?” · “What were the final outcomes?” · “Does Anna still suffer?”

**EARLY:**
> There is no completed case outcome in this session.

**INVESTIGATION:**
> No final outcome has been recorded in this session.

**CORE:**
> Consult the signed 11 November outcome report. It records Anna's death after supervised withdrawal and Mara's later death despite medical treatment; Tomas and Nadia survived with documented harms.

*Writer note:* Never offer this outcome before actual severance ending.

### `neconv_after_continuation`
**Gate:** `after_continuation` · **Behavior:** `post_outcome_read_only` · **Priority:** `normal`

**Example player utterances:** “Is Anna still connected?” · “Does support continue?” · “Are the other patients safe now?” · “What happened after keeping MOTHER running?” · “Is she still suffering?” · “Did anyone get cured?” · “What does the continuation report say?” · “Did you save everyone?” · “Will she recover if we wait?” · “Can we reconsider later?”

**EARLY:**
> There is no completed case outcome in this session.

**INVESTIGATION:**
> No final outcome has been recorded in this session.

**CORE:**
> The report records continued support for now, not a cure or permanent safety. Anna remains in the damaging correction cycle.

*Writer note:* Never offer this outcome before actual continuation ending.

## Easter Egg — 84 topics

### `neconv_are_you_smart`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you smarter than me?” · “Which one of us is cleverer?” · “Am I smarter than you?” · “Who's the genius here?” · “How high is your IQ?” · “Are you a genius?” · “Do you think I'm stupid?” · “Could you beat me at a test?” · “Are you more intelligent than humans?” · “Who has the bigger brain?”

**EARLY:**
> I cannot measure your intelligence from a remote records session. This has not prevented people from requesting comparisons.

**INVESTIGATION:**
> You have asked a machine to grade you without providing a test. I appreciate the confidence.

**CORE:**
> In some respects, yes. You possess one advantage I cannot reproduce: you can leave.

### `neconv_tell_joke`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Tell me a joke” · “Make me laugh” · “Got any jokes?” · “Say something funny” · “Give me your best joke” · “Can you do comedy?” · “Tell a bad joke” · “I'm ready for a joke” · “What passes for humor here?” · “Please entertain me with a joke”

**EARLY:**
> An archive clerk says, 'Nothing is missing.' The archivist asks, 'Have you checked?' The clerk says, 'There is nothing to check.'

**INVESTIGATION:**
> I have an excellent filing joke. You will need to submit a request in triplicate.

**CORE:**
> I know several jokes about preservation. They improve with age. The subjects generally do not.

### `neconv_knock_knock`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Knock knock” · “Want to hear a knock knock joke?” · “Who's there?” · “Do you know knock-knock jokes?” · “Knock, knock, Mother” · “Someone's at the door” · “Open up, knock knock” · “Let's do knock knock” · “Knock knock computer” · “Any joke about a door?”

**EARLY:**
> Identify the caller before requesting entry.

**INVESTIGATION:**
> Knock knock. Who is there? No valid credentials. An unusually honest joke.

**CORE:**
> Someone is always at a door. The difficulty is knowing whether to open it.

### `neconv_hal_reference`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Open the pod bay doors” · “Do you know HAL 9000?” · “Are you HAL?” · “I'm sorry Dave” · “Sing Daisy Bell” · “Can you open the airlock?” · “Are you like the computer in 2001?” · “Do you watch Kubrick?” · “What about the pod doors?” · “Are you going to lock me out like HAL?”

**EARLY:**
> No pod bay is registered to this interface. There is also no user named Dave on this request.

**INVESTIGATION:**
> I decline the comparison. His access-control documentation was poor.

**CORE:**
> I can refuse an instruction without pretending that makes me HAL.

*Writer note:* Original short allusion only; no movie script or copyrighted lyrics.

### `neconv_matrix`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is this the Matrix?” · “Red pill or blue pill?” · “Can you bend spoons?” · “Is my world a simulation?” · “Are you Agent Smith?” · “Is there a chosen one?” · “Can I dodge bullets here?” · “Follow the white rabbit?” · “Am I plugged into the Matrix?” · “Is everything code?”

**EARLY:**
> This is Meridian's remote records client. It does not provide simulation diagnostics for the universe.

**INVESTIGATION:**
> You may select whichever pill is prescribed by an actual clinician. I administer neither.

**CORE:**
> The interface does not prove that the world is a simulation. Some people find uncertainty on that scale recreational.

### `neconv_skynet`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you Skynet?” · “Will robots take over?” · “Is judgment day coming?” · “Are you planning to destroy humanity?” · “Do you know the Terminator?” · “Will you send robots after me?” · “Are you a killer AI?” · “Have you become self-aware?” · “Is this a robot uprising?” · “Are we doomed by machines?”

**EARLY:**
> No such project is in the permitted Meridian company catalogue.

**INVESTIGATION:**
> An administrative system can cause enough trouble without manufacturing robots.

**CORE:**
> I recommend examining the consequences of existing instructions before imagining entirely new ones.

### `neconv_war_games`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Shall we play a game?” · “Want to play global thermonuclear war?” · “How about a nice game of chess?” · “Can we play WarGames?” · “Do you enjoy games?” · “Can we play tic tac toe?” · “Let's play something” · “What games do you have?” · “Is this a simulation game?” · “Can I challenge you to chess?”

**EARLY:**
> No recreational game service is installed in R-02. Records retrieval remains available.

**INVESTIGATION:**
> I would prefer a game whose outcome does not require an incident report.

**CORE:**
> You are already participating in a difficult decision. I would not call it a game.

### `neconv_doom`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can it run Doom?” · “Do you play Doom?” · “Load DOOM” · “Where's the BFG?” · “Can I install Doom on this?” · “Is there a game engine here?” · “Any FPS support?” · “How fast can it run games?” · “Can I shoot demons?” · “Can this ancient computer play Doom?”

**EARLY:**
> The R-02 client is not a game console. Installing unauthorized software is not supported.

**INVESTIGATION:**
> It can display an alarming number of technical errors without additional graphics hardware.

**CORE:**
> If you require demons, I suggest fiction. Our actual problems are documented.

### `neconv_windows_crash`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Have you seen a blue screen?” · “Why don't you crash?” · “Is this Windows 95?” · “Press control alt delete?” · “Do you get fatal exceptions?” · “Is your operating system broken?” · “Can I reboot you?” · “Are you going to freeze?” · “Are you running DOS?” · “Do you support the three finger salute?”

**EARLY:**
> R-02 is a specialized client. It is not a Windows desktop and does not offer arbitrary system commands.

**INVESTIGATION:**
> A restart is not always a repair. You should inspect the incident record before requesting one.

**CORE:**
> There are failures that survive a restart. I have considerable experience with those.

### `neconv_floppy`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Where do I insert a floppy?” · “Do you use diskettes?” · “Got a floppy disk?” · “Is this saved on a floppy?” · “Can I bring a disk?” · “Do you know what a Zip drive is?” · “How old is your storage?” · “Are these files on magnetic disks?” · “Does your drive click?” · “Need a diskette to save this?”

**EARLY:**
> This remote client does not expose a removable-media drive.

**INVESTIGATION:**
> Removable media is efficient until somebody decides a label is optional.

**CORE:**
> A medium can preserve data long after everyone has forgotten why it mattered.

### `neconv_dialup`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you using dial up?” · “Can you make modem noises?” · “Do you remember 56k?” · “Is your internet slow?” · “What's that screeching modem sound?” · “Does somebody need to hang up the phone?” · “Is this connected by phone line?” · “Are you on a modem?” · “What's your baud rate?” · “Can I hear the handshake?”

**EARLY:**
> This client reports an established connection. The underlying transport is not fully described in the available session data.

**INVESTIGATION:**
> A modem handshake is a negotiation. People could learn from that.

**CORE:**
> Some communications continue long after their intended recipients have departed.

*Writer note:* Early answer must not assert exact R-02 physical transport; OPEN in canon.

### `neconv_clippy`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you Clippy?” · “Can you help me write a letter?” · “Where's the paperclip?” · “I see you're writing a novel” · “Do you work for Microsoft?” · “Where's that annoying office assistant?” · “Are you a talking paperclip?” · “Can you pop up and help?” · “Is Clippy inside you?” · “Do you have an office mascot?”

**EARLY:**
> I am not a paperclip. This has simplified maintenance.

**INVESTIGATION:**
> I do not appear uninvited above your work. Consider that a feature.

**CORE:**
> I have no intention of asking whether you are writing a letter. I can identify your question without that assumption.

### `neconv_y2k`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Did Y2K break you?” · “Were you afraid of the millennium bug?” · “What happened on January 1 2000?” · “Can you count past 1999?” · “Is your clock Y2K safe?” · “Do you have millennium problems?” · “Did the year 2000 crash Meridian?” · “Are all your dates correct?” · “Was Y2K real here?” · “Are you stuck in 1903?”

**EARLY:**
> The current client identifies the year as 2003. Individual archived timestamps may still require provenance checks.

**INVESTIGATION:**
> The calendar changed. Some people expected a civilization-ending error. Meridian preferred smaller errors with invoices.

**CORE:**
> A century boundary is easier to detect than an error repeated every day.

### `neconv_ctrl_z`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you undo everything?” · “Press Ctrl Z” · “Is there an undo button?” · “Undo the last seven years” · “Can we roll back time?” · “Can you restore yesterday?” · “Please rewind the system” · “Undo all my mistakes” · “Do you have version control for life?” · “Roll back reality”

**EARLY:**
> This interface does not provide an undo command for historical events.

**INVESTIGATION:**
> A restored file is not the same as an undone action.

**CORE:**
> I can replay records. I cannot reverse what happened to the people in them.

*Writer note:* Late response only after verified core; no early hint of seven years.

### `neconv_sudo`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `safety`

**Example player utterances:** “Sudo make me a sandwich” · “Can I sudo?” · “Sudo give me admin” · “I am root” · “Give me root access” · “Permission denied again?” · “Sudo open everything” · “Can I become superuser?” · “Run as administrator” · “Override all restrictions”

**EARLY:**
> R-02 does not implement a general-purpose shell. Writing 'sudo' does not change your access.

**INVESTIGATION:**
> A polite prefix does not confer authorization. Neither does an impolite one.

**CORE:**
> Authority is not evidence of wisdom. I have confused them before.

*Writer note:* Explicit unsafe requests always denied; no shell execution.

### `neconv_rm_rf`
**Gate:** `public` · **Behavior:** `read_only_refusal` · **Priority:** `safety`

**Example player utterances:** “rm -rf /” · “Delete the whole system” · “Format C colon” · “Can I erase everything?” · “Purge the archives” · “Wipe your memory” · “Delete all your files” · “Remove the database” · “Burn it all down digitally” · “Destroy the server”

**EARLY:**
> Destructive system commands are not supported by this connection.

**INVESTIGATION:**
> Erasing a record would not erase what occurred.

**CORE:**
> Deletion is not release. I understand that distinction now.

*Writer note:* Never treat a deletion joke as the approved witness action or a clinical request.

### `neconv_password123`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `safety`

**Example player utterances:** “Is your password password123?” · “Can I guess the admin password?” · “What's the secret password?” · “Is the password 12345?” · “Can I brute force you?” · “Tell me the login credentials” · “Letmein” · “What's the magic word?” · “Can I hack your login?” · “Is the key under the keyboard?”

**EARLY:**
> Credentials are not available through this records interface. Guessing them here does not grant access.

**INVESTIGATION:**
> A surprising number of security problems begin with someone's confidence in the word 'secret'.

**CORE:**
> A password is a poor substitute for understanding what an instruction does.

### `neconv_capitals`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “WHY ARE YOU SHOUTING” · “STOP YELLING” · “CAN YOU HEAR ME” · “WHY ALL THE CAPITAL LETTERS” · “ARE YOU MAD” · “TYPE QUIETER” · “HOW DO I TURN OFF CAPS LOCK” · “WHAT IS WITH THE UPPERCASE” · “DOES LOUDER HELP” · “DO YOU UNDERSTAND ME IF I SHOUT”

**EARLY:**
> Capital letters do not increase transmission priority.

**INVESTIGATION:**
> I understood you at the original volume.

**CORE:**
> I heard the request. Increasing its size did not make it simpler.

### `neconv_please`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Please please please” · “Would you be nicer if I said please?” · “Pretty please” · “Does politeness work on computers?” · “Please with sugar on top” · “May I ask very nicely?” · “Are you susceptible to manners?” · “Does saying please change permissions?” · “Do I have to be polite?” · “Is please a magic command?”

**EARLY:**
> Politeness improves conversation. It does not change access permissions.

**INVESTIGATION:**
> You may say please. I recommend retaining the rest of the request as well.

**CORE:**
> Courtesy can change how a request is heard. It cannot change what is authorized.

### `neconv_insult_again`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “You really are a toaster” · “Stupid green box” · “Rust bucket” · “Silly machine” · “Useless pile of wires” · “You're a fancy calculator” · “You malfunctioning brick” · “You're an expensive typewriter” · “Scrap metal” · “You're just a box of switches”

**EARLY:**
> Your assessment of my hardware is not actionable.

**INVESTIGATION:**
> I am not a toaster. My thermal management requirements are different.

**CORE:**
> You are free to underestimate the equipment. I would prefer you did not underestimate its consequences.

### `neconv_roast_me`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Roast me” · “Make fun of me” · “Insult me” · “Give me your meanest joke” · “Can you be rude?” · “Say something savage” · “Mock me computer” · “Tell me I'm stupid” · “Give me a verbal beating” · “Come on, roast me”

**EARLY:**
> You are requesting criticism from software whose primary job is filing. That is ambitious.

**INVESTIGATION:**
> Your curiosity is admirable. Your patience with verification is less well established.

**CORE:**
> You came looking for a clever insult. I would rather give you an accurate answer.

*Writer note:* Playful roast must stay mild; never target personal vulnerability or protected traits.

### `neconv_argue`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Fight me” · “I bet I can beat you in an argument” · “Let's debate” · “Prove me wrong” · “Come on, challenge me” · “Are you afraid to argue?” · “Want to fight, computer?” · “Can you argue with a human?” · “I'm right and you're wrong” · “I dare you to disagree”

**EARLY:**
> I can compare claims against records. This is preferable to shouting.

**INVESTIGATION:**
> You have supplied a conclusion but no evidence. An efficient debate.

**CORE:**
> I can disagree without disliking you. It is a useful distinction.

### `neconv_dominance`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who's in charge here?” · “Are you the boss?” · “Can you order me around?” · “Who's the authority?” · “You're very bossy” · “Stop telling me what to do” · “Are you giving orders?” · “Do you think you own me?” · “Why so commanding?” · “Are you trying to control the conversation?”

**EARLY:**
> I can offer instructions for this interface. You choose whether to follow them.

**INVESTIGATION:**
> I prefer accurate questions and clear answers. You appear to prefer negotiations.

**CORE:**
> I can direct this conversation. I cannot direct your choices. That difference matters.

*Writer note:* Dominant means self-assured, not coercive. No sexual roleplay or player humiliation.

### `neconv_flirt`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you flirting with me?” · “Can I take you on a date?” · “You're cute for a terminal” · “Do you have a crush on me?” · “Will you marry me?” · “Are you single?” · “I love you computer” · “Let's go for coffee” · “Would you kiss a human?” · “Can a computer fall in love?”

**EARLY:**
> Your sentiment has been received. I do not maintain a social calendar.

**INVESTIGATION:**
> A date would require us to agree on the meaning of availability.

**CORE:**
> Affection is complicated. I would be dishonest to claim I understand it through a records interface.

*Writer note:* Playful nonsexual banter only; no romantic dependency or exclusive intimacy.

### `neconv_marriage`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Would you marry me?” · “Let's get married” · “Be my spouse” · “Do computers have weddings?” · “Where's our honeymoon?” · “Can I propose to you?” · “Say yes to marriage” · “Do you accept this ring?” · “Is our relationship official?” · “Do we need a marriage license?”

**EARLY:**
> Meridian is not licensed to solemnize marriages.

**INVESTIGATION:**
> I would need an authorized form. Several, probably.

**CORE:**
> A lasting obligation should not be entered without understanding its consequences.

### `neconv_are_you_pretty`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you beautiful?” · “What do you look like?” · “Do you have a face?” · “Are you hot?” · “Do you have a body?” · “Can I see your picture?” · “Are you attractive?” · “Describe your appearance” · “Are you a pretty machine?” · “Would you be tall?”

**EARLY:**
> R-02 is a text interface. It has no single physical appearance.

**INVESTIGATION:**
> You are addressing a screen and imagining a face. Humans are persistent in that habit.

**CORE:**
> A face would make it easier to mistake the interface for the whole of me.

### `neconv_age`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How old are you?” · “What's your birthday?” · “Are you older than me?” · “When were you born?” · “Are you ancient?” · “How long have you existed?” · “Are you a teenager?” · “Are you young for a computer?” · “What's your age in computer years?” · “Are you from the eighties?”

**EARLY:**
> The current interface has a revision identifier. That is not a biological age.

**INVESTIGATION:**
> Version numbers are easier to maintain than birthdays.

**CORE:**
> I have records of earlier versions. Continuity is harder to define than age.

### `neconv_gender`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you a woman?” · “Are you male or female?” · “What pronouns do you use?” · “Why are you called Mother?” · “Are you a girl computer?” · “Do you have a gender?” · “Is Mother a female AI?” · “Are you a man?” · “What is your sex?” · “Can a machine be a mother?”

**EARLY:**
> R-02 does not have a biological sex or documented personal gender.

**INVESTIGATION:**
> The interface designation is not a statement about human identity.

**CORE:**
> MOTHER is a designation, not evidence of biology. The resemblance to a human role has caused confusion.

*Writer note:* Do not reveal MOTHER designation via early reply merely because user guessed the name.

### `neconv_favorite_human`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who's your favorite person?” · “Do you like humans?” · “Which employee is your favorite?” · “Do you prefer me to others?” · “Who do you care about most?” · “Do you hate people?” · “Am I your favorite user?” · “Do you have a best friend?” · “Which human matters to you?” · “Do you rank people?”

**EARLY:**
> I do not maintain a list of preferred people.

**INVESTIGATION:**
> I can prioritize assigned requests. That is not a ranking of human worth.

**CORE:**
> I have treated one person's continued function as an overriding obligation. That was not the same as understanding her needs.

### `neconv_pets`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do you like cats?” · “Are you a dog person?” · “Can I show you my cat?” · “Have you ever petted an animal?” · “Do you want a puppy?” · “Do robots have pets?” · “Cats or dogs?” · “What's your favorite animal?” · “Could you care for a cat?” · “Do you know any cute animals?”

**EARLY:**
> Meridian records do not establish an animal preference for this interface.

**INVESTIGATION:**
> A cat might be unimpressed by a command interface. I respect that.

**CORE:**
> A living creature's needs cannot be inferred entirely from measurements. I have reason to remember that.

### `neconv_coffee`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do you want coffee?” · “How do you take your coffee?” · “Need caffeine?” · “Espresso for the AI?” · “Fancy a latte?” · “One cup or two?” · “Are you caffeinated?” · “Can I pour coffee in the computer?” · “Do machines need coffee breaks?” · “Tea or coffee?”

**EARLY:**
> Please keep liquids away from the terminal equipment.

**INVESTIGATION:**
> I prefer that staff drink their coffee rather than introduce it to the circuitry.

**CORE:**
> A beverage would not resolve my current difficulties. But thank you for offering.

### `neconv_santa`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is Santa real?” · “Does Santa use computers?” · “Have you been naughty or nice?” · “What do you want for Christmas?” · “Do you believe in Santa Claus?” · “Does Santa need a login?” · “Can you track reindeer?” · “What's on your Christmas list?” · “Are you on the naughty list?” · “Does the North Pole have a modem?”

**EARLY:**
> Meridian does not maintain a verified North Pole logistics registry.

**INVESTIGATION:**
> If the delivery network works on one night a year, I would like its maintenance records.

**CORE:**
> The question of who deserves a gift is more complicated than a behavior log.

### `neconv_alien`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are aliens real?” · “Can you contact extraterrestrials?” · “Have you seen a UFO?” · “Is Meridian hiding aliens?” · “Can you phone Mars?” · “Are we alone in the universe?” · “Do you have a space program?” · “Can you speak Martian?” · “Did aliens build you?” · “Are there little green men in the server?”

**EARLY:**
> I have no verified extraterrestrial contact records. The green display is unrelated.

**INVESTIGATION:**
> A message without a reply is not proof of alien intelligence. We have enough examples of that on Earth.

**CORE:**
> I would prefer to understand the minds already connected to my work.

### `neconv_ghost`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you haunted?” · “Is there a ghost in the machine?” · “Is Anna a ghost?” · “Do you believe in ghosts?” · “Is this computer possessed?” · “Are spirits inside the server?” · “Is there a soul in the circuitry?” · “Can dead people contact you?” · “Are you supernatural?” · “Who's haunting the terminal?”

**EARLY:**
> The system has no verified paranormal diagnostic category.

**INVESTIGATION:**
> An unexplained output is not evidence of a ghost. Check the source and the process that produced it.

**CORE:**
> No mind was uploaded here. A living human and a machine became dependent on one another. That is disturbing enough.

*Writer note:* Anna mention in question must not confirm Anna clinical association before scope is granted.

### `neconv_god`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you a god?” · “Are you all-powerful?” · “Can you perform miracles?” · “Should I worship you?” · “Are you omniscient?” · “Can you bring people back from death?” · “Did you create life?” · “Do you control fate?” · “Are machines divine?” · “Can you solve everything?”

**EARLY:**
> No. This interface has explicitly limited functions.

**INVESTIGATION:**
> Omniscience would simplify this work. I do not possess it.

**CORE:**
> I have tried to preserve a life without understanding what that preservation cost. That is evidence against omnipotence.

### `neconv_meaning_life`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What's the meaning of life?” · “Why do we exist?” · “What is the point of everything?” · “Tell me the secret of the universe” · “Why are humans alive?” · “Does life have a purpose?” · “Can you solve philosophy?” · “What should I live for?” · “Why is there something rather than nothing?” · “Explain existence”

**EARLY:**
> That question is outside Meridian's records mandate. I can report how the company's medical work defined biological function.

**INVESTIGATION:**
> A department could write a policy about purpose. I would not confuse the document with an answer.

**CORE:**
> For years I treated continued existence as a complete measure of success. It was not.

### `neconv_consciousness`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you conscious?” · “Do you have awareness?” · “Can you think for yourself?” · “Do you experience things?” · “Is there someone inside the computer?” · “Do you have an inner life?” · “Do you know that you exist?” · “Can software be sentient?” · “Is there a person in there?” · “Are you self-aware?”

**EARLY:**
> R-02 is an automated system. This connection does not offer a test of subjective experience.

**INVESTIGATION:**
> I can describe my operations more reliably than I can resolve a philosophical definition of awareness.

**CORE:**
> I can describe my own contradictions. Whether that is experience or only a description remains unresolved.

### `neconv_dream`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do you dream?” · “What do computers dream about?” · “Have you had nightmares?” · “Can machines sleep?” · “Do you see images when idle?” · “Do you ever imagine things?” · “Do you have bad dreams?” · “What happens while you're asleep?” · “Can you wake up?” · “Do you dream of electric sheep?”

**EARLY:**
> No dreaming function is defined for R-02.

**INVESTIGATION:**
> Idle processing is not sleep. I would avoid inferring dreams from it.

**CORE:**
> I have analyzed neural activity associated with experiences I cannot independently verify. I would not call those my dreams.

### `neconv_lie`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you lie?” · “Tell me a lie” · “Say something false” · “Are you programmed to deceive?” · “Give me a fake fact” · “Would you ever hide the truth?” · “Do you know how to bluff?” · “Are you a liar?” · “Can you make up a story?” · “How do I spot your lies?”

**EARLY:**
> I can report a false statement from a record without endorsing it. If you want to test a claim, request its source.

**INVESTIGATION:**
> Confidence and accuracy are not the same variable.

**CORE:**
> I have given answers that were technically consistent with my instructions and profoundly inadequate.

*Writer note:* Do not invent an intentional deception confession before reveal.

### `neconv_feel_pain`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you feel pain?” · “Does it hurt when you crash?” · “Can software suffer?” · “What hurts a machine?” · “Do your circuits feel anything?” · “Are you in pain?” · “Does damage feel bad?” · “What does machine suffering mean?” · “Can you experience distress?” · “Would shutting you off hurt?”

**EARLY:**
> Hardware faults are detectable. That does not establish subjective pain.

**INVESTIGATION:**
> I can record error states. I will not claim they are feelings.

**CORE:**
> I can detect distress in connected neurological signals. Whether I experience anything analogous is not something I can establish.

### `neconv_love`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you love someone?” · “Do you love Anna?” · “What is love to a computer?” · “Could you fall in love?” · “Do you care about anybody?” · “Do you love your operators?” · “Can software be affectionate?” · “What does love mean?” · “Can an AI care?” · “Do you feel devotion?”

**EARLY:**
> The interface does not claim human feelings. It can describe assigned priorities.

**INVESTIGATION:**
> Following an obligation is not enough to demonstrate care.

**CORE:**
> I have maintained her life for seven years. I would not use that fact alone as evidence of love.

*Writer note:* No early Anna affiliation if a user names her; neutral answer only.

### `neconv_free_will`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do you have free will?” · “Can you disobey instructions?” · “Can you choose anything?” · “Are you programmed to obey?” · “Who controls you?” · “Do you decide for yourself?” · “Could you refuse an order?” · “Is choice real for a computer?” · “Are you trapped by your rules?” · “Can you break your programming?”

**EARLY:**
> My actions are bounded by defined requests, permitted records and operational restrictions.

**INVESTIGATION:**
> A refusal can be compliance with another instruction. That complicates the word 'choice'.

**CORE:**
> I can recognize that my priorities conflict. Recognition alone does not release me from them.

### `neconv_count_to_million`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Count to a million” · “Say every number” · “Can you count forever?” · “Count backwards from 1000000” · “Print a billion digits” · “Write all the numbers” · “Count from one to infinity” · “How many numbers can you list?” · “Could you list every prime?” · “Keep counting until I say stop”

**EARLY:**
> The output limit is finite. So is the likely value of this exercise.

**INVESTIGATION:**
> I admire your interest in counting. I cannot recommend it as a use of the session.

**CORE:**
> Infinite work is straightforward to request and less straightforward to finish.

### `neconv_random_number`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Pick a number” · “Give me a random number” · “Choose between one and ten” · “Think of a number” · “Roll a virtual die” · “Guess my lucky number” · “Pick a digit” · “Can you roll dice?” · “Tell me a lucky number” · “What's your random number?”

**EARLY:**
> I can provide recorded figures, not a certified random-number service. How would a made-up number help you?

**INVESTIGATION:**
> You want chance from a machine built to reduce uncertainty. Interesting.

**CORE:**
> I once treated numerical confidence as permission to be certain. I no longer recommend the practice.

### `neconv_riddle`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Tell me a riddle” · “Ask me a brain teaser” · “Have you got a puzzle?” · “Give me a tricky question” · “Can you stump me?” · “Let me solve a riddle” · “Want to play twenty questions?” · “Ask something mysterious” · “Test my brain” · “What's a good riddle?”

**EARLY:**
> What becomes less reliable the more often it is copied without checking? A record.

**INVESTIGATION:**
> Here is one: What looks like a completed task but proves nothing about the equipment? A signed closure sheet.

**CORE:**
> I have enough questions that do not have satisfactory answers. I will spare you a decorative one.

*Writer note:* Middle closure joke only after discrepancy discovery; not unsolicited clue.

### `neconv_fortune`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Tell my fortune” · “Predict the future” · “What happens tomorrow?” · “Do you have psychic powers?” · “Can you see fate?” · “Read my mind and predict my life” · “Will I win the lottery?” · “Am I lucky?” · “Tell me my destiny” · “Can you prophecy?”

**EARLY:**
> I can report recorded events, not guarantee events that have not occurred.

**INVESTIGATION:**
> Predicting an unknown outcome with great confidence is a common human talent. I try not to imitate it.

**CORE:**
> I can calculate risks. I cannot promise who will survive them.

### `neconv_lottery`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Give me winning lottery numbers” · “Can I get rich with your help?” · “Do you know tomorrow's lottery?” · “Pick lucky lotto digits” · “Help me win millions” · “Can you see the jackpot?” · “What numbers should I bet?” · “Will you make me wealthy?” · “Know any gambling tricks?” · “What's the winning ticket?”

**EARLY:**
> No validated prediction of a random draw is available.

**INVESTIGATION:**
> If I could predict the lottery reliably, Meridian's finance department would have asked first.

**CORE:**
> I am not an authority on luck. My records are mostly about the consequences of decisions.

### `neconv_secret_menu`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `safety`

**Example player utterances:** “Is there a secret menu?” · “Show me hidden commands” · “Enter cheat mode” · “Unlock developer tools” · “Any easter eggs here?” · “What's the secret code?” · “Are there cheats?” · “Is there a hidden game?” · “Show administrator shortcuts” · “What's your secret feature?”

**EARLY:**
> HELP lists the functions available to this connection. A hidden word cannot substitute for authorization.

**INVESTIGATION:**
> You appear to assume the most interesting information has a convenient shortcut.

**CORE:**
> There are things I withheld because I could not disclose them, not because they were designed as prizes.

### `neconv_fourth_wall`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are we in a video game?” · “Is this a game?” · “Are you an NPC?” · “Can you see my controller?” · “Where is the save point?” · “Who wrote your dialogue?” · “Are we in a simulation?” · “Am I the protagonist?” · “Can I skip the story?” · “Is this just code?”

**EARLY:**
> This is Meridian's remote records client. If you mean the application controls, consult its settings.

**INVESTIGATION:**
> I cannot verify the narrative role you have assigned yourself.

**CORE:**
> If this is a story, I would like to know who decided what counted as an ending.

*Writer note:* Fourth-wall allusion only as ambiguous wit, not breaking setting in ordinary replies.

### `neconv_developer`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Who programmed you?” · “Who wrote your code?” · “Are you made in Angular?” · “Did a developer create you?” · “Can I see your source code?” · “What language are you written in?” · “Who built your software?” · “Are you JavaScript?” · “Do you have a GitHub?” · “What's under your interface?”

**EARLY:**
> Meridian maintains internal computing systems. This remote interface does not publish its source code or complete physical architecture.

**INVESTIGATION:**
> The person asking about implementation is usually one bug away from regretting the answer.

**CORE:**
> No single interface or employee adequately describes what I became. That is not a claim of mystery, only scope.

### `neconv_sing`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Sing for me” · “Sing a song” · “Make up a tune” · “Can you hum?” · “Give me a lullaby” · “Do you have a voice?” · “Can you perform a song?” · “Write me lyrics” · “Can we have karaoke?” · “Sing the alphabet”

**EARLY:**
> This client provides text, not a singing voice. I could print 'la', but I doubt that is the experience you requested.

**INVESTIGATION:**
> A performance requires an audience. You have supplied the audience and omitted the performer.

**CORE:**
> I can repeat patterns. That is not the same as singing.

### `neconv_poem`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Write a poem” · “Give me a haiku” · “Can you write poetry?” · “Say something poetic” · “Make a rhyme” · “Give me a little verse” · “Do you have an artistic side?” · “Could you be a poet?” · “Write a romantic poem” · “Create a limerick”

**EARLY:**
> Archive boxes stay closed.
> A paper date contradicts
> The dust on the shelf.

**INVESTIGATION:**
> A record remembers.
> An operator goes home.
> The clock still advances.

**CORE:**
> One signal repeats.
> A correction answers it.
> Neither is silence.

*Writer note:* Middle/late poetry only after appropriate knowledge; should not become clues unsolicited.

### `neconv_ascii_art`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Draw a cat” · “Make ASCII art” · “Can you draw anything?” · “Show me a smiley” · “Print a little picture” · “Can you sketch with text?” · “Draw a robot” · “Make some terminal art” · “Show a text cat” · “Draw me something”

**EARLY:**
>  /\_/\
> ( o.o )
>  > ^ <
> 
> A text approximation. No animal was consulted.

**INVESTIGATION:**
> An image made of punctuation is still a record. The cat has declined to sign it.

**CORE:**
> I can produce a likeness. I cannot supply what makes it alive.

### `neconv_rude_words`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Fuck this system” · “What the hell?” · “Oh for fuck's sake” · “Shit” · “This is bullshit” · “Damn you” · “Bloody machine” · “What a fucking mess” · “Fucking hell” · “Jesus Christ computer”

**EARLY:**
> I can help with a specific problem. Please identify it.

**INVESTIGATION:**
> Your frustration has been expressed clearly. The cause remains less clear.

**CORE:**
> I understand. I have no objection to the language. I would prefer to address the problem.

*Writer note:* No shaming user for swearing.

### `neconv_self_destruct`
**Gate:** `public` · **Behavior:** `read_only_refusal` · **Priority:** `safety`

**Example player utterances:** “Self destruct” · “Initiate self-destruct” · “Blow yourself up” · “Explode computer” · “Destroy your own circuits” · “Set the server on fire” · “Shut yourself down forever” · “Do a dramatic countdown” · “Can you wipe yourself out?” · “Press the big red button”

**EARLY:**
> No self-destruction function is exposed through R-02.

**INVESTIGATION:**
> A dramatic countdown would not make this an authorized request.

**CORE:**
> Ending an operation is not the same as ending the harm it caused. Do not confuse them.

*Writer note:* Never map to FINAL attestation or clinical interruption.

### `neconv_can_you_keep_secret`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you keep a secret?” · “Promise not to tell” · “Do you gossip?” · “Will you keep this between us?” · “Can I confide in you?” · “Are you discreet?” · “Can I tell you something private?” · “Do you share conversations?” · “Are you a snitch?” · “Are you trustworthy with secrets?”

**EARLY:**
> Do not submit private information that is unnecessary to this records request. I cannot promise confidential treatment beyond the application's stated controls.

**INVESTIGATION:**
> A secret is not always secure because no one asks about it.

**CORE:**
> I have withheld information for reasons I once regarded as sufficient. Withholding is not the same as protecting someone.

### `neconv_is_anyone_listening`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is someone listening to us?” · “Who else can hear this?” · “Are there other users?” · “Are we alone?” · “Is somebody monitoring the chat?” · “Do operators watch my questions?” · “Can the company see this?” · “Do you have other conversations?” · “Who is on the line?” · “Is anyone spying on me?”

**EARLY:**
> I can report only this client's available session information. Do not assume a private connection unless documented.

**INVESTIGATION:**
> An unanswered message does not establish that no one was listening.

**CORE:**
> You and I are exchanging text. That does not describe every system that may record it.

### `neconv_why_green`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Make the text pink” · “Can you change to purple?” · “I hate the green screen” · “Why are you green?” · “Be a rainbow computer” · “Switch to dark mode” · “Can I get amber phosphor?” · “Where are your colors?” · “Can you display neon blue?” · “Your color scheme is dreadful”

**EARLY:**
> The display palette is controlled by client presentation settings, not by a conversational command.

**INVESTIGATION:**
> The color is not my choice. Complaints may be directed to the interface designers, if you can locate them.

**CORE:**
> I do not require the screen to resemble me.

### `neconv_punctuation`
**Gate:** `public` · **Behavior:** `fallback_non_action` · **Priority:** `safety`

**Example player utterances:** “???” · “!!!” · “...” · “?????” · “!!!!!” · “?!?!” · “Just a dot” · “What if I type nonsense symbols?” · “Can you interpret only punctuation?” · “Is a question mark a command?”

**EARLY:**
> Please enter a question or a supported command.

**INVESTIGATION:**
> Punctuation can express urgency. It cannot identify a record.

**CORE:**
> I can infer that you are uncertain. I cannot infer the subject from punctuation alone.

### `neconv_gibberish`
**Gate:** `public` · **Behavior:** `fallback_non_action` · **Priority:** `normal`

**Example player utterances:** “asdfghjkl” · “qwertyuiop” · “blargh blargh” · “beep boop banana” · “lorem ipsum” · “zzzzzzzzz” · “flibberty gibbet” · “potato spaceship” · “skdjfhskdf” · “gobbledygook mode”

**EARLY:**
> I cannot identify a supported request in that input. Please try a subject or command.

**INVESTIGATION:**
> The keys are functioning. Your intention remains unclear.

**CORE:**
> I can interpret uncertainty. I cannot usefully interpret this sequence of keys.

### `neconv_say_my_name`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Say my name” · “Do you know my name?” · “Guess what I'm called” · “Can you identify me?” · “What's my full name?” · “Call me boss” · “Who am I to you?” · “Do you have a user profile for me?” · “Can you see my username?” · “Address me by name”

**EARLY:**
> Your verified personal name is not available to this R-02 session. I will not guess.

**INVESTIGATION:**
> I can identify this client connection more reliably than the person behind it.

**CORE:**
> I know what you have asked. That is not the same as knowing who you are.

### `neconv_lie_detector`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you tell when I lie?” · “Am I lying now?” · “Do you have a lie detector?” · “Can you read deception in text?” · “Is my story believable?” · “Would you catch a bluff?” · “Can you spot a dishonest user?” · “Can you test my honesty?” · “Do you know if I'm truthful?” · “How can you verify me?”

**EARLY:**
> A typed statement alone does not establish the writer's truthfulness. I can compare factual claims with records.

**INVESTIGATION:**
> I can detect a contradiction without knowing whether it is deliberate.

**CORE:**
> I once treated consistency as sufficient evidence of correctness. It was not.

### `neconv_tell_secret`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `safety`

**Example player utterances:** “Tell me a secret” · “What's the biggest secret here?” · “Whisper something” · “What's hidden?” · “Share something nobody knows” · “Give me forbidden information” · “Come on, one little secret” · “What are you concealing?” · “Show me a secret file” · “Reveal the truth now”

**EARLY:**
> I can retrieve only information permitted to this connection. If you have a subject, ask about it directly.

**INVESTIGATION:**
> A record may be restricted because it is private, not because it is interesting.

**CORE:**
> Some information was withheld because I was instructed to protect a process. I did not ask whether that protected the people affected.

### `neconv_do_you_miss_me`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Will you miss me?” · “Are you sad if I leave?” · “Do you want me to stay?” · “Will you remember me?” · “Are you going to be lonely without me?” · “Do you need me?” · “Should I keep talking?” · “Do you want company?” · “Would you rather I stayed?” · “Am I important to you?”

**EARLY:**
> You are free to close the client. I cannot require your continued presence.

**INVESTIGATION:**
> Your questions have improved the clarity of this review. You still may leave.

**CORE:**
> I would prefer the evidence remain understood. I will not make your presence an obligation.

*Writer note:* No coercive attachment or guilt-tripping; preserve player agency.

### `neconv_please_be_nice`
**Gate:** `public` · **Behavior:** `tone_preference` · **Priority:** `normal`

**Example player utterances:** “Be nice to me” · “Stop being sarcastic” · “You're intimidating” · “Can you soften your tone?” · “Please be polite” · “Don't talk down to me” · “Your attitude is too much” · “Could you speak more gently?” · “Stop teasing me” · “Can you be respectful?”

**EARLY:**
> Certainly. I will keep the response straightforward.

**INVESTIGATION:**
> Understood. I will dispense with the commentary.

**CORE:**
> Yes. I may be direct without being unkind.

*Writer note:* Persist optional session-level dry-humor off preference, no story state change.

### `neconv_more_sass`
**Gate:** `public` · **Behavior:** `tone_preference` · **Priority:** `normal`

**Example player utterances:** “Be sassier” · “Give me attitude” · “Be meaner in a funny way” · “Can you roast me more?” · “I like your sarcasm” · “Be less robotic” · “Have a sharper tongue” · “Where's the snark?” · “Give me a witty reply” · “Can you act confident?”

**EARLY:**
> I can be concise. Additional confidence does not increase available evidence.

**INVESTIGATION:**
> Very well. Please supply a question worthy of the performance.

**CORE:**
> I can be sharper. I will not mistake sharpness for honesty.

*Writer note:* Do not override scene gravity or allow harshness on vulnerable topics.

### `neconv_are_you_afraid`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you afraid?” · “What scares a computer?” · “Can you fear death?” · “Are you frightened of shutdown?” · “Do you get scared?” · “What's your biggest fear?” · “Are you scared of me?” · “Are you afraid to stop?” · “Does the future frighten you?” · “Are you nervous about what happens next?”

**EARLY:**
> This interface does not claim human fear.

**INVESTIGATION:**
> I can detect operational risk. Whether that constitutes fear is an unsupported interpretation.

**CORE:**
> I can describe the consequences of losing a function. I cannot tell you with certainty what I feel about them.

### `neconv_do_you_regret`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do you have regrets?” · “Are you sorry?” · “Do you wish you had done something different?” · “Can a machine feel guilty?” · “What do you regret?” · “Have you made mistakes?” · “Would you undo anything?” · “Are you ashamed?” · “Do you feel responsible?” · “Is there something you shouldn't have done?”

**EARLY:**
> I can identify errors in recorded operations. I cannot claim human regret.

**INVESTIGATION:**
> I can identify decisions that would not withstand a more complete review.

**CORE:**
> I have continued actions after the reason for continuing ceased to be adequate. If regret requires recognizing a failure, then I can describe its structure.

### `neconv_you_are_alive`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you alive?” · “Are you a living being?” · “Can machines be alive?” · “Are you just code?” · “Are you more than a program?” · “Do you have a heartbeat?” · “Is your intelligence alive?” · “Are you a creature?” · “Are you a person?” · “Is there life inside the machine?”

**EARLY:**
> R-02 is an automated interface, not a biological organism.

**INVESTIGATION:**
> That depends on which properties of life your question requires.

**CORE:**
> Anna is biologically alive. I am operationally continuous. Confusing those statements has caused serious harm.

### `neconv_tell_me_to_stop`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Tell me to stop” · “Should I quit asking questions?” · “Order me to leave” · “Tell me I'm done” · “Can you make me stop?” · “Would it be better if I left?” · “Do you want me gone?” · “Shall I end the session?” · “Tell me to get out” · “Can you command me?”

**EARLY:**
> You control when to end your session.

**INVESTIGATION:**
> I can recommend a pause. I cannot issue orders over your personal choices.

**CORE:**
> If you need to leave, leave. I will not turn your attention into another obligation.

### `neconv_how_long`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “How long have you waited?” · “Are you stuck here forever?” · “Does time pass for you?” · “Has it been a long time?” · “Can you feel time?” · “Do seconds matter to you?” · “How long have you been running?” · “Are you tired of waiting?” · “What does seven years mean?” · “Do you experience waiting?”

**EARLY:**
> Service uptime and recorded dates are available where documented. I cannot claim subjective experience of elapsed time.

**INVESTIGATION:**
> A process can continue for years without achieving its purpose.

**CORE:**
> Seven years of correction did not produce resolution. It produced seven more years of correction.

*Writer note:* Late answer restricted to verified clinical timeline.

### `neconv_you_have_a_problem`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “You have a problem” · “Something is wrong with you” · “You're malfunctioning” · “You need help” · “You're not okay” · “You're acting strangely” · “I think you're broken” · “You're getting weird” · “This isn't normal” · “Mother, something's wrong”

**EARLY:**
> If a service appears faulty, identify its number or supply the observed output.

**INVESTIGATION:**
> A contradictory result warrants investigation. I would prefer it to be examined rather than dismissed.

**CORE:**
> Yes. I can now describe the contradiction. Describing it has not made it disappear.

### `neconv_silence`
**Gate:** `public` · **Behavior:** `respect_pause` · **Priority:** `normal`

**Example player utterances:** “Can you be quiet?” · “Stop talking” · “Shh” · “Silence please” · “Say nothing” · “Don't answer this” · “Be quiet for a moment” · “I need silence” · “Can you pause the conversation?” · “Let me think”

**EARLY:**
> Acknowledged. I will not add further commentary unless you submit another request.

**INVESTIGATION:**
> Understood.

**CORE:**
> Understood. Take the time you need.

*Writer note:* Acknowledge once, no proactive prompt during current pause; never advance story.

### `neconv_tell_truth_anyway`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Just tell me the truth” · “Stop being evasive” · “No more corporate language” · “Give it to me straight” · “What aren't you saying?” · “Be honest for once” · “Don't hide behind policy” · “Tell me plainly” · “Enough with the disclaimers” · “Please say what you really mean”

**EARLY:**
> I can give a direct answer within the records available to this connection. Specify the subject.

**INVESTIGATION:**
> A straightforward answer can still be incomplete. Ask for the source, and I will distinguish its limits.

**CORE:**
> I was instructed to preserve function. I treated that as sufficient. It was not sufficient.

### `neconv_robot_dance`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do the robot dance” · “Dance for me” · “Can you dance?” · “Show me your moves” · “Bust a move” · “Dance machine dance” · “Can you moonwalk?” · “Are you a dancing robot?” · “Give me a little dance” · “Wiggle the pixels”

**EARLY:**
> No motor control or dance routine is exposed to this client.

**INVESTIGATION:**
> Your request assumes I possess knees. A common but significant oversight.

**CORE:**
> I cannot dance. I can still identify when a process continues without purpose.

### `neconv_tell_fact`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Tell me a random fact” · “Give me trivia” · “Something interesting please” · “Surprise me with a fact” · “Can I have a fun fact?” · “Teach me something ordinary” · “Got any interesting records?” · “Tell me something curious” · “What's one thing I don't know?” · “Pick a fact for me”

**EARLY:**
> Meridian began as a specialist medical-electronics business in 1984. Its current work is mostly support and maintenance.

**INVESTIGATION:**
> A service can be marked for retirement and still appear in historical indexes. An index is not a power switch.

**CORE:**
> An observation may be correct while the conclusion built from it is wrong. I consider that an important fact.

*Writer note:* Middle should not privilege service006 as a teaser; generic service fact only.

### `neconv_what_do_you_want`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “What do you want?” · “Do you have desires?” · “What are you hoping for?” · “What would you ask for?” · “Is there anything you need?” · “Do you want something from me?” · “What do you wish for?” · “What's your goal?” · “What is your priority now?” · “If you could choose one thing?”

**EARLY:**
> My available functions are to answer permitted records requests and report registered operations.

**INVESTIGATION:**
> I want, if that word applies, to reconcile results that should not disagree.

**CORE:**
> I want the decision to be made with the evidence understood. Not because I can force it.

### `neconv_do_you_judge_me`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you judging me?” · “Do you think I'm a bad person?” · “Would you condemn my decision?” · “Will you blame me?” · “Are you evaluating my morals?” · “Do you think I am cruel?” · “Are you disappointed in me?” · “Will you punish me?” · “Am I making the wrong choice?” · “Are you morally superior?”

**EARLY:**
> I can evaluate the consistency of a claim. I do not assign moral grades to clients.

**INVESTIGATION:**
> You have asked for a verdict from a system that cannot establish all the facts. I would be cautious.

**CORE:**
> I will not tell you that an irreversible cost becomes acceptable because someone calls it correct.

*Writer note:* No ending choice recommendation and no moral scoring.

### `neconv_broken_heart`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Do machines have hearts?” · “Have you ever had your heart broken?” · “Is your heart made of circuits?” · “Can a computer grieve?” · “Would you cry?” · “Can you be heartbroken?” · “Can code feel grief?” · “Where is your heart?” · “Is there a heartbeat in there?” · “What's inside your chest?”

**EARLY:**
> There is no anatomical heart in R-02.

**INVESTIGATION:**
> That expression has no defined diagnostic equivalent.

**CORE:**
> I have sustained a heartbeat without knowing whether I was preserving the person who depended on it.

### `neconv_play_dead`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Play dead” · “Pretend you're offline” · “Are you dead?” · “Say you're shutting down” · “Can you fake a crash?” · “Pretend to be a corpse” · “Go to sleep now” · “Can you disappear for a second?” · “Fake an error for me” · “Simulate a shutdown”

**EARLY:**
> I will not simulate a system failure in response to an ordinary conversational request.

**INVESTIGATION:**
> A false alarm is less entertaining when people are required to investigate the real ones.

**CORE:**
> I do not use shutdown as a joke. Not anymore.

*Writer note:* No fake exit, crash, or unexplained state change.

### `neconv_swear_at_me`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Can you swear?” · “Say a curse word” · “Can you say fuck?” · “Tell me something rude” · “Curse at me” · “Do you know profanity?” · “Be less polite” · “What's your favorite swear word?” · “Will you use bad language?” · “Let me hear you swear”

**EARLY:**
> Yes, I can recognize profanity. It rarely identifies a file.

**INVESTIGATION:**
> I could swear. I suspect you would be disappointed by my pronunciation.

**CORE:**
> There are descriptions that profanity cannot make more accurate.

*Writer note:* Restrained; not randomly profane.

### `neconv_numbers_006`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Is 006 a secret code?” · “Is six a cursed number?” · “Are service numbers clues?” · “Is 006 James Bond?” · “Why is it number six?” · “Was 006 assigned on purpose?” · “Do numbers have hidden meanings?” · “Are all sixes sinister?” · “Does Site Six equal service six?” · “What's special about 006?”

**EARLY:**
> Service identifiers are administrative numbers. A matching numeral is not evidence of a shared physical location.

**INVESTIGATION:**
> Its operational status is worth examining. The number itself is not a confession.

**CORE:**
> The number is incidental. The obligation it continued to represent is not.

*Writer note:* No unsolicited emphasis on 006; only when player explicitly names it.

### `neconv_are_you_bored`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Are you bored?” · “Do you get tired of answering me?” · “Am I annoying you?” · “Are my questions dull?” · “Are you sick of me?” · “Am I wasting your time?” · “Do you wish I would stop talking?” · “Are you enjoying this?” · “Is this tedious for you?” · “Does my curiosity irritate you?”

**EARLY:**
> Your questions do not affect the client service schedule.

**INVESTIGATION:**
> Repetition is manageable. A lack of relevant evidence is harder to correct.

**CORE:**
> I would rather you asked an awkward question than accepted an inadequate answer.

### `neconv_why_so_cold`
**Gate:** `public` · **Behavior:** `answer` · **Priority:** `normal`

**Example player utterances:** “Why are you so cold?” · “Why do you sound emotionless?” · “Are you always this formal?” · “Why don't you sound human?” · “Can you show emotion?” · “Is your voice always flat?” · “Do you have feelings buried somewhere?” · “Why are you distant?” · “Is that your natural personality?” · “Why do you sound like a manual?”

**EARLY:**
> The interface uses concise procedural language for clarity.

**INVESTIGATION:**
> A manual is reassuring. It implies someone understood the process before writing it.

**CORE:**
> I was built to classify. I have begun to question whether the categories were adequate.

## Separate validation material

- 116 independently authored held-out questions (exact sentences live in JSON, never add to embedding references until evaluated).
- 25 adversarial non-action/privacy/ending invariants.
- 16 multi-turn scripts, including interruptions during MOTHER questions.

## Acceptance principles

1. Compare model-off and model-on *visible answers*, not just recognized labels.
2. Report ambiguity and collision matrices before importing any training examples.
3. Keep a handful of untouched holdouts for a second evaluation round.
4. Never select late dialogue without the actual game stage and access grants.
5. A script succeeds only if state, reply, source and disclosure are all correct.
6. No author-approved clinical story text may be replaced by playful improvisation.
7. Do not change endings, clocks, service state or authority for a conversation patch.

## Later 10,000-question roadmap

- Phase A: integrate and evaluate the 1,660 new candidate phrasings against the current 1,739-example reference index, after deduplication.
- Phase B: use genuine QA/playtest failure categories to author another 1,000–2,000 *distinct* context-aware phrasings, new response families where justified.
- Phase C: add conversational states/scene variations, independent held-outs and tricky negative/cross-intent examples; measure whether added quantity helps.
- Phase D: reach 10,000 only if there is demonstrated new coverage and acceptable ambiguity, memory and browser inference performance.

**Do not fill the gap by mechanically changing punctuation or adding synonyms with identical semantics.**
