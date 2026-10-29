import { describe, expect, it } from 'vitest';
import { CORPORATE_FILES, findPublicPersonnel, PUBLIC_PERSONNEL } from '../corporate-records';
import { accessibleFiles, inspectFile, newGame, newLegacyGame, OPENING, runInput } from './game';
import { classify } from '../interpretation/fallback';
import { directInterpretation, selectMeaning } from '../interpretation/semantic';
import { decodeSave } from '../persistence/saves';
import { actOf } from './continuation';
import { GOLDEN_PATHS, INVESTIGATION_PATH, OPENING_PATH } from './playthroughs';
import type { GameState } from '../models';

const forbidden = /AV-06|Site 6|MS-06|MOTHER|author_only_note|writer_depth|DOC-CLN|subsequent status restricted/i;
const story = (s: GameState) => ({ knowledge: s.knowledge, permissions: s.permissions, evidence: s.discoveredEvidenceIds, operating: s.operating, investigation: s.investigation, events: s.events, completed: s.completedActions, recovered: s.archive006Recovered, complete: s.act01Complete, pending: s.pendingOperation, act: actOf(s) });
const contractors = ['Dr. Helen Marsh', 'Dana Wren', 'Pauline Cross', 'Evan Brooks', 'Amir Patel', 'June Hargrove'];

describe('Implementation 01 corporate exploration', () => {
  it('uses the exact neutral startup and keeps the historical call out of its references', () => {
    expect(OPENING.join('\n')).toBe('MERIDIAN SYSTEMS\nREMOTE ACCESS CLIENT 2.04\n\n06 NOV 2003\n\nConnection established.\nRecords and service interface ready.\n\nType HELP for instructions.');
    expect(newGame().terminalHistory[0].links).toEqual([]);
    expect(OPENING.join(' ')).not.toMatch(/006|night desk|no answer|MOTHER|clinical|hidden/i);
    expect(runInput(newGame(), 'HELP').output.lines.join(' ')).not.toMatch(/006|night desk|MOTHER|hidden/i);
  });
  it.each([
    ['What is Meridian Systems?', /monitoring and rehabilitation/],
    ['Who founded Meridian?', /Ruth Calder and Martin Shaw.*1984/],
    ['Where is the company based?', /Providence, Rhode Island/],
    ['Are they still operating?', /still operating in 2003/],
    ['What do they manufacture?', /C-Series.*R-Series/s],
    ['What was the N-Series?', /two-way neural interfaces/],
    ['Tell me about N-Series', /two-way neural interfaces/],
    ['Tell me about Lowell Technical Center', /engineering and device testing/],
    ['Why did the company downsize?', /funding.*competition/],
    ['What departments does Meridian have?', /Corporate Administration/],
    ['What is Meridian history?', /founded in 1984/],
    ['What facilities does Meridian have?', /Lowell.*Worcester/s],
    ['Who runs Meridian?', /Daniel Price/],
    ['What does Meridian do?', /monitoring and rehabilitation/],
    ['How many people work at Meridian?', /70 employees/],
  ])('answers %s offline and through model recognition without a story transition', (input, expected) => {
    for (const model of [false, true]) {
      const s = newGame();
      const interpretation = model ? selectMeaning(input, s, [{ intent: 'q_site_identity', score: .99 }]) : classify(input, s);
      expect(interpretation.intent).toBe('ask_company');
      const t = runInput(s, input, interpretation);
      expect(t.output.lines.join('\n')).toMatch(expected);
      expect(JSON.stringify(t.output)).not.toMatch(forbidden);
      expect(JSON.stringify(t.output)).not.toMatch(/006|handover|preservation/i);
      expect(story(t.state)).toEqual(story(s));
      expect(t.encounters).toBeUndefined();
    }
  });
  it('selects exactly the 34 permitted work records with only explicit safe fields', () => {
    expect(PUBLIC_PERSONNEL).toHaveLength(34);
    expect(new Set(PUBLIC_PERSONNEL.map(p => p.id)).size).toBe(34);
    for (const person of PUBLIC_PERSONNEL) {
      expect(Object.keys(person).sort()).toEqual(['dates', 'department', 'id', 'name', 'profile', 'role']);
      expect(Number(person.id.slice(1))).toBeLessThanOrEqual(34);
    }
    expect(JSON.stringify(PUBLIC_PERSONNEL)).not.toMatch(forbidden);
  });
  it.each(PUBLIC_PERSONNEL.map(person => [person.name, person.id]))('makes %s searchable and queryable without clinical associations', (name, id) => {
    const person = PUBLIC_PERSONNEL.find(p => p.id === id)!;
    for (const input of [`Who is ${name}?`, `SEARCH ${name}`]) {
      for (const model of [false, true]) {
        const s = newGame();
        const t = runInput(s, input, model ? selectMeaning(input, s, [{ intent: 'q_anna_identity', score: .99 }]) : undefined);
        expect(t.output.lines.join(' '), input).toContain(person.profile);
        expect(JSON.stringify(t.output)).not.toMatch(forbidden);
        expect(story(t.state)).toEqual(story(s));
      }
    }
  });
  it('searches departments and roles and clarifies both Bell records across a save/reload', () => {
    expect(findPublicPersonnel('Engineering').map(p => p.name)).toContain('Nina Park');
    expect(runInput(newGame(), 'SEARCH coordinator').output.lines.join(' ')).toContain('Leah Morgan');
    expect(runInput(newGame(), 'Who works in Research?').output.lines.join(' ')).toContain('Anna Voss');
    expect(runInput(newGame(), 'Who is the head researcher?').output.lines.join(' ')).toContain('Anna Voss');
    expect(runInput(newGame(), 'List engineers').output.lines.join(' ')).toContain('Nina Park');
    expect(runInput(newGame(), 'SEARCH staff').output.lines.join(' ')).toContain('PUBLIC WORK PROFILES: 34');
    const ambiguous = runInput(newGame(), 'Who is Bell?');
    expect(ambiguous.output.code).toBe('notice');
    expect(ambiguous.output.lines.join(' ')).toMatch(/Andrew Bell.*Iris Bell/s);
    expect(runInput(decodeSave(JSON.stringify(ambiguous.state)).state, 'neuroscience').output.lines.join(' ')).toContain('Studied sensory encoding');
    expect(runInput(ambiguous.state, 'first').output.lines.join(' ')).toContain('Repairs returned');
    expect(runInput(ambiguous.state, 'Iris').output.lines.join(' ')).toContain('Studied sensory encoding');
  });
  it.each(contractors)('keeps %s out of general search, aliases, counts and profile responses', name => {
    const s = newGame();
    expect(JSON.stringify(PUBLIC_PERSONNEL)).not.toContain(name);
    expect(JSON.stringify(accessibleFiles(s))).not.toContain(name);
    const searched = runInput(s, `SEARCH ${name}`);
    expect(searched.output.lines).toEqual([`SEARCH: ${name} / FILES FOUND: 0`]);
    expect(searched.output.links).toEqual([]);
    const queried = runInput(s, `Who is ${name}?`);
    expect(queried.output.lines).toEqual(['No matching public work profile is available.']);
    expect(JSON.stringify(queried.output)).not.toContain(name);
    expect(runInput(s, `OPEN ${name}`).openFileId).toBeUndefined();
  });
  it('opens only the four approved ordinary documents without replacing closure evidence', () => {
    expect(CORPORATE_FILES.map(f => f.provenance?.split(' / ')[0])).toEqual(['DOC-COR-01','DOC-HR-01','DOC-OFF-03','DOC-QA-03']);
    let s = newGame();
    for (const file of CORPORATE_FILES) {
      const before = story(s);
      const t = runInput(s, `OPEN ${file.path}`);
      expect(t.openFileId).toBe(file.id);
      expect(story(t.state)).toEqual(before);
      expect(file.body).not.toMatch(forbidden);
      s = decodeSave(JSON.stringify(t.state)).state;
    }
    expect(runInput(s, 'OPEN Company profile').openFileId).toBe('corporate-profile');
    expect(runInput(s, 'OPEN Office notice').openFileId).toBe('company');
    expect(runInput(s, 'OPEN Closure list').openFileId).toBe('authorization');
    const call = accessibleFiles(s).find(f => f.id === 'call')!;
    expect(call.body).toContain('No answer');
    expect(call.references).toContain('ledger');
    expect(accessibleFiles(s).find(f => f.id === 'status-log')!.body).toContain('03:14:09');
  });
  it('lets ordinary curiosity continue during a pending review without answering or starting it', () => {
    const ordinary = ['What is Meridian Systems?', 'Are they still operating?', 'Why did the company downsize?', 'Who is Anna Voss?', 'Who is Leah Morgan?', 'Who is Dana Wren?', 'Where are Meridian headquarters?'];
    for (const s of [newGame(), runInput(newGame(), 'Investigate 006').state]) {
      let next = s;
      for (const input of ordinary) {
        const t = runInput(next, input);
        expect(story(t.state), input).toEqual(story(s));
        expect(t.encounters).toBeUndefined();
        next = decodeSave(JSON.stringify(t.state)).state;
      }
    }
  });
  it('keeps existing settings, pending actions and ending outcomes compatible', () => {
    for (const steps of Object.values(GOLDEN_PATHS)) {
      let s = steps.reduce((s, input) => runInput(s, input).state, newGame());
      const before = story(s);
      s = runInput(s, 'Who is Leah Morgan?').state;
      expect(story(decodeSave(JSON.stringify(s)).state)).toEqual(before);
    }
    const ready = OPENING_PATH.reduce((s, input) => runInput(s, input).state, newGame());
    ready.ui = { crtEnabled: false, fontScale: 1.2, terminalMode: 'restored' };
    const t = runInput(ready, 'Who founded Meridian?');
    expect(decodeSave(JSON.stringify(t.state)).state.ui).toEqual(ready.ui);
    const clinical = INVESTIGATION_PATH.reduce((s, input) => runInput(s, input).state, newLegacyGame());
    const pending = runInput(clinical, 'RELEASE PATIENT').state;
    expect(pending.pendingOperation).toBe('release-patient');
    expect(story(decodeSave(JSON.stringify(runInput(pending, 'Who is Leah Morgan?').state)).state)).toEqual(story(pending));
  });
  it('uses bounded limitations without inventing personal facts or advertising new commands', () => {
    expect(runInput(newGame(), 'Where is Meridian exact street address?').output.lines.join(' ')).toContain('not included');
    expect(runInput(newGame(), 'Tell me about Leah Morgan experiments').output.lines.join(' ')).toContain('does not include');
    expect(directInterpretation('What was the N-Series?', {})?.method).toBe('deterministic');
  });
  it('does not turn ordinary identity or clinical follow-ups into company answers', () => {
    const s = runInput(newGame(), 'What is Meridian Systems?').state;
    expect(runInput(s, 'Who are you?').output.lines.join(' ')).toContain('R-02');
    expect(runInput(s, 'Where is your server located?').output.lines.join(' ')).toContain('physical server location');
    expect(runInput(s, 'Is Anna alive?').output.lines.join(' ')).toContain('not available through this work-records connection');
    expect(classify('What is the price of a new phone?').intent).toBe('unknown');
  });
});
