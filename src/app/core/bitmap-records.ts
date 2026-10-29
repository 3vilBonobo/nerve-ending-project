import type { ArchiveBitmap, ArchiveFile } from './models';

/** A local asset reference is not an authorization or a guarantee of asset secrecy. */
export function validBitmap(bitmap: ArchiveBitmap): boolean {
  return /^\/bitmaps\/[a-z0-9-]+\.png$/.test(bitmap.asset)
    && Number.isInteger(bitmap.width) && bitmap.width > 0 && bitmap.width <= 1024
    && Number.isInteger(bitmap.height) && bitmap.height > 0 && bitmap.height <= 1024
    && ['personnel', 'surveillance', 'clinical', 'diagram'].includes(bitmap.category)
    && ['placeholder', 'approved'].includes(bitmap.artwork) && typeof bitmap.alt === 'string' && !!bitmap.alt.trim();
}

/** Demo fixtures only: no employee association, dated event, mapped facility or technical claim. */
export const BITMAP_FILES: readonly ArchiveFile[] = [
  {
    id: 'demo-employee-bitmap', path: '/ARCHIVE/DEMO_EMPLOYEE_ID.BIT', title: 'Demo employee portrait', modified: 'DEMO / UNDATED', evidence: [],
    body: 'DEMONSTRATION BITMAP / PLACEHOLDER\nGeneric employee identification portrait. No personnel identity is assigned. This is a rendering sample, not an employment record.',
    bitmap: { category: 'personnel', asset: '/bitmaps/demo-employee-id.png', width: 128, height: 128, artwork: 'placeholder', sourceId: 'DEMO-PORTRAIT',
      description: 'Generic identification portrait; no employee association or archival date.',
      alt: 'Placeholder identification portrait of an unidentified person, head and shoulders against a plain background, drawn in coarse green pixels.' },
  },
  {
    id: 'demo-equipment-bitmap', path: '/ARCHIVE/DEMO_EQUIPMENT_LAYOUT.BIT', title: 'Demo equipment diagram', modified: 'DEMO / UNDATED', evidence: [],
    body: 'DEMONSTRATION BITMAP / PLACEHOLDER\nGeneric equipment diagram with INPUT, UNIT and DISPLAY blocks. Not a wiring plan, Meridian product specification or compatibility record.',
    bitmap: { category: 'diagram', asset: '/bitmaps/demo-equipment-layout.png', width: 160, height: 120, artwork: 'placeholder', sourceId: 'DEMO-DIAGRAM',
      description: 'Illustrative equipment layout; no product model, wiring or compatibility claim.',
      alt: 'Placeholder technical diagram: three rectangular blocks labeled INPUT, UNIT and DISPLAY, connected left to right by arrows. Marked DEMO and DEMONSTRATION ONLY.' },
  },
  {
    id: 'demo-room-bitmap', path: '/ARCHIVE/DEMO_EQUIPMENT_ROOM.BIT', title: 'Demo equipment-room still', modified: 'DEMO / UNDATED', evidence: [],
    body: 'DEMONSTRATION BITMAP / PLACEHOLDER\nGeneric equipment-room image containing two cabinets. No Meridian facility, camera, timestamp or real location is assigned.',
    bitmap: { category: 'surveillance', asset: '/bitmaps/demo-equipment-room.png', width: 160, height: 120, artwork: 'placeholder', sourceId: 'DEMO-ROOM',
      description: 'Unmapped equipment-room sample; no facility, camera or capture time is assigned.',
      alt: 'Placeholder camera-style still of an empty, simply drawn equipment room with two cabinets, a ceiling light and a tiled floor, in coarse green pixels.' },
  },
];
