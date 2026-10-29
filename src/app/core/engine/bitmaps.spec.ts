import { describe, expect, it } from 'vitest';
import { BITMAP_FILES, validBitmap } from '../bitmap-records';
import { FILES } from '../content';
import type { ArchiveFile, GameState } from '../models';
import { decodeSave } from '../persistence/saves';
import { qaInteraction, transitionObservations } from '../qa/events';
import { canRead } from './continuation';
import { accessibleFiles, newGame, newLegacyGame, runInput } from './game';

const critical = (s: GameState): unknown => ({ knowledge: s.knowledge, permissions: s.permissions, operating: s.operating, investigation: s.investigation, pendingOperation: s.pendingOperation, pendingClarification: s.pendingClarification, evidence: s.discoveredEvidenceIds, events: s.events, archive006Recovered: s.archive006Recovered, act01Complete: s.act01Complete, completedActions: s.completedActions });
describe('ordinary bitmap archive integration', () => {
  it('registers only three explicit demo records, without an employee, clinical image, date or facility claim', () => {
    expect(FILES.filter(file => file.bitmap)).toHaveLength(3);
    expect(BITMAP_FILES.map(file => file.bitmap?.category)).toEqual(['personnel', 'diagram', 'surveillance']);
    for (const file of BITMAP_FILES) {
      expect(file.title).toMatch(/^Demo /); expect(file.modified).toBe('DEMO / UNDATED');
      expect(file.bitmap?.artwork).toBe('placeholder'); expect(file.bitmap?.archivedAt).toBeUndefined();
      expect(file.bitmap?.department).toBeUndefined(); expect(file.evidence).toEqual([]); expect(file.reveals).toBeUndefined();
      expect(JSON.stringify(file)).not.toMatch(/Anna|AV-?06|Site 6|MOTHER|author_only|writer_depth|story_role|cause_ref/i);
    }
  });
  it.each(BITMAP_FILES)('opens $path through path, title and filename without story effects', file => {
    for (const name of [file.path, file.title, file.path.split('/').at(-1)!]) {
      const s = newGame(); s.lastTopic = 'service-003';
      const result = runInput(s, `OPEN "${name}"`);
      expect(result.openFileId).toBe(file.id); expect(result.state.viewedFileIds).toContain(file.id);
      expect(result.state.openFileIds).toContain(file.id); expect(result.state.lastTopic).toBe('service-003');
      expect(critical(result.state)).toEqual(critical(s));
      expect(result.state.terminalHistory.at(-1)?.input).toBe(`OPEN "${name}"`);
      expect(decodeSave(JSON.stringify(result.state)).state).toEqual(result.state);
    }
  });
  it('finds safe image metadata through the existing terminal and leaves references inert', () => {
    const result = runInput(newGame(), 'SEARCH equipment diagram');
    expect(result.output.links.map(link => link.fileId)).toEqual(['demo-equipment-bitmap']);
    expect(result.output.lines.join(' ')).toContain('TYPE: BITMAP / DIAGRAM / PLACEHOLDER');
    expect(result.output.links[0].label).toBe('/ARCHIVE/DEMO_EQUIPMENT_LAYOUT.BIT');
    expect(critical(result.state)).toEqual(critical(newGame()));
  });
  it.each(['OPEN /ARCHIVE/MISSING.BIT', 'READ /CLINICAL/ANNA_BEDSIDE.BIT', 'OPEN /SITE6/ROOM.BIT'])('returns a normal unknown-file error without exposing a protected image: %s', input => {
    const result = runInput(newGame(), input);
    expect(result.openFileId).toBeUndefined(); expect(result.output.code).toBe('error');
    expect(result.state.openFileIds).toEqual([]); expect(result.state.permissions).toEqual([]);
    expect(result.output.links).toEqual([]);
  });
  it('keeps protected fixture metadata, counts, titles and filename aliases behind the existing rules', () => {
    // Test-only record; no corresponding image bytes are created or packaged.
    const restricted: ArchiveFile = { ...BITMAP_FILES[0], id: 'test-restricted-bitmap', path: '/ARCHIVE/PRIVATE_TEST.BIT', title: 'Private test bitmap', body: 'PRIVATE-METADATA-SENTINEL', access: 'clinicalRecordAccess', requiresKnowledge: 'annaIdentified' };
    const records = FILES as ArchiveFile[]; records.push(restricted);
    try {
      const s = newLegacyGame();
      expect(accessibleFiles(s).some(file => file.id === restricted.id)).toBe(false);
      const search = runInput(s, 'SEARCH PRIVATE-METADATA-SENTINEL');
      expect(search.output.lines).toEqual(['SEARCH: PRIVATE-METADATA-SENTINEL / FILES FOUND: 0']); expect(search.output.links).toEqual([]);
      expect(runInput(s, 'DIR /ARCHIVE').output.lines.join(' ')).not.toContain(restricted.title);
      for (const name of [restricted.path, restricted.title, 'PRIVATE_TEST.BIT']) {
        const result = runInput(s, `OPEN "${name}"`);
        expect(result.output.code).toBe('denied'); expect(result.openFileId).toBeUndefined();
        expect(result.state.openFileIds).toEqual([]); expect(result.output.lines.join(' ')).not.toContain('PRIVATE-METADATA-SENTINEL');
      }
      s.permissions = ['clinicalRecordAccess']; expect(canRead(s, restricted)).toBe(false);
      s.knowledge = ['annaIdentified']; expect(canRead(s, restricted)).toBe(true);
    } finally { records.pop(); }
  });
  it('retains an active review and pending clarification when images are read', () => {
    let s = runInput(newGame(), 'Investigate 006').state;
    s.pendingOperation = 'restore-bridge';
    s.pendingClarification = { input: 'Who approved it?', interpretation: { intent: 'ask_authorization', needsClarification: true, provider: 'fallback' } };
    for (const file of BITMAP_FILES) { const t = runInput(s, `READ ${file.path}`); expect(critical(t.state)).toEqual(critical(s)); s = t.state; }
  });
  it('keeps text records, corporate exploration and eight-service commands functional after bitmap browsing', () => {
    const s = BITMAP_FILES.reduce((state, file) => runInput(state, `OPEN ${file.path}`).state, newGame());
    expect(runInput(s, 'OPEN Office notice').openFileId).toBe('company');
    expect(runInput(s, 'Who is Leah Morgan?').output.lines.join(' ')).toContain('Leah Morgan');
    expect(runInput(s, 'STATUS').output.lines.filter(line => /^00[1-8]  /.test(line))).toHaveLength(8);
    expect(runInput(s, 'INFO 003').output.lines).toContain('STATE: STANDBY');
    expect(runInput(s, 'LOG 006').output.lines.join(' ')).toContain('03:14:09');
    for (const term of ['Anna bedside', 'Site 6 bitmap', 'AV-06 image']) expect(runInput(s, `SEARCH ${term}`).output.links).toEqual([]);
  });
  it('records a normal QA file open without an evidence, permission, act or ending event', () => {
    const s = newGame(); const input = `OPEN ${BITMAP_FILES[0].path}`; const t = runInput(s, input);
    const events = transitionObservations(s, t, { source: 'terminal', name: input, interaction: qaInteraction(input, s, 'terminal') });
    expect(events.find(event => event.type === 'file_opened')?.data['fileId']).toBe(BITMAP_FILES[0].id);
    expect(events.some(event => ['milestone_reached', 'act_transition', 'ending_selected', 'encounter_completed'].includes(event.type))).toBe(false);
  });
  it('does not change older schema-5 saves or introduce persistent image bytes', () => {
    const old = newLegacyGame('2003-11-06T02:14:00Z', 'IMAGE-COMPAT');
    expect(decodeSave(JSON.stringify(old)).state).toEqual(old);
    const state = runInput(old, `OPEN ${BITMAP_FILES[0].path}`).state; const encoded = JSON.stringify(state);
    expect(encoded).not.toMatch(/data:image|pixels|nativeWidth|DEMO-PORTRAIT/); expect(state.schemaVersion).toBe(5);
  });
});

describe('permitted bitmap contract validation', () => {
  const bitmap = BITMAP_FILES[0].bitmap!;
  it('accepts the four categories without creating clinical records', () => {
    for (const category of ['personnel', 'surveillance', 'clinical', 'diagram'] as const) expect(validBitmap({ ...bitmap, category })).toBe(true);
  });
  it.each(['https://example.com/image.png', '/bitmaps/../secret.png', '/bitmaps/%2e%2e.png', 'data:image/png;base64,abc', '/clinical/hidden.png'])('rejects an invalid or external asset reference: %s', asset => {
    expect(validBitmap({ ...bitmap, asset })).toBe(false);
  });
  it.each([0, -1, 1.5, Number.NaN, 2048])('rejects invalid native dimensions: %s', width => expect(validBitmap({ ...bitmap, width })).toBe(false));
});
