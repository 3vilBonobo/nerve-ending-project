# Implementation 03 — Meridian legacy bitmap records

Delivered 23 October 2026 against the initially clean working tree at `153afbd`. The actual Implementation 01 corporate layer and Implementation 02 eight-service layer were inspected and retained. The narrative index, unchanged world/personnel/infrastructure sources, canon conflicts and impact map remain the reference boundaries. Their authoring instructions are source material; the explicit Implementation 03 brief authorizes this limited media infrastructure and ordinary demo content, without story changes.

## Delivered behavior

Three ordinary bitmap demonstrations can be found in the existing ARCHIVE folder, searched through the terminal/file browser and opened by virtual path, filename or title. The existing document window hosts a reusable bitmap component; text records retain their original text branch. There is no new desktop, backend, dependency, external image API or runtime image-generation model.

All three images are **deterministic engineering placeholders**, not author-approved final art. They deliberately have no named employee, product model, actual camera, mapped facility, capture date or story association. Their record titles, summary text and viewer prominently label them as demonstrations. No personnel profile was changed, and no patient/clinical image was created.

| Runtime ID | Virtual archive path | Category | Public native bitmap | Original source | Art status |
| --- | --- | --- | --- | --- | --- |
| `demo-employee-bitmap` | `/ARCHIVE/DEMO_EMPLOYEE_ID.BIT` | Personnel photograph | `/bitmaps/demo-employee-id.png`, **128×128** | **32×32** grayscale drawing | Placeholder; unidentified person |
| `demo-equipment-bitmap` | `/ARCHIVE/DEMO_EQUIPMENT_LAYOUT.BIT` | Technical diagram | `/bitmaps/demo-equipment-layout.png`, **160×120** | **160×120** grayscale drawing | Placeholder; INPUT → UNIT → DISPLAY, explicitly not a wiring/product specification |
| `demo-room-bitmap` | `/ARCHIVE/DEMO_EQUIPMENT_ROOM.BIT` | Surveillance-style still | `/bitmaps/demo-equipment-room.png`, **160×120** | **40×30** grayscale drawing | Placeholder; two cabinets in an unmapped, empty equipment room |

Their existing `modified` field reads `DEMO / UNDATED`; optional archival timestamps and originating departments are omitted. `DEMO-PORTRAIT`, `DEMO-DIAGRAM` and `DEMO-ROOM` are explicitly demonstration source identifiers, not invented camera registrations or personnel numbers. None of these files supplies evidence, revelations or permission.

Try:

```text
DIR /ARCHIVE
SEARCH equipment diagram
OPEN /ARCHIVE/DEMO_EQUIPMENT_LAYOUT.BIT
READ DEMO_EMPLOYEE_ID.BIT
OPEN "Demo equipment-room still"
```

Terminal search adds a `TYPE: BITMAP` line and permitted category/placeholder status. Virtual paths remain ordinary inert references in terminal output; no clickable image carousel or mystery shortcut is introduced. Unknown paths receive the existing file-not-found behavior. No service command or story-response example is added or changed.

## Record model and viewer architecture

`ArchiveFile.bitmap` is optional. Its `ArchiveBitmap` descriptor contains category (`personnel`, `surveillance`, `clinical`, `diagram`), local asset reference, native width/height, safe description and alternative text, artwork status, and optional originating department, archival timestamp and source identifier. Existing text bodies, stable IDs, paths, access fields and save meanings remain intact. The body of an image record is a short safe textual summary for the existing search/navigation workflow.

The four-category contract supports future clinical imagery without adding any clinical record, patient association, bedside asset or restricted layout now. Author-only writer fields and secret associations are absent from these descriptors and from the placeholder assets.

`DocumentWindow` checks current readability before displaying record metadata or mounting a media component. `BitmapViewer` receives only the permitted media descriptor. The app's cached open-document projection now also filters through `session.files()`, preventing stale inaccessible IDs from rendering. The existing pure `canRead` policy remains unchanged.

The viewer displays a readable title/path in the document chrome, a placeholder notice, description, native dimensions, category, available metadata, useful alternative text and a plain magnification toolbar. FIT selects an integer scale from 1× to 4× that fits the available width; explicit 1×–4× controls are also available. Native data is never fractionally shrunk. If an enlarged image exceeds the available area, the image viewport/document can scroll while controls wrap. The existing mobile RECORDS tab hosts the viewer; terminal OPEN retains the existing terminal-focus workflow until that tab is selected.

Image load errors, invalid local PNG references and loaded dimensions that disagree with metadata show an accessible `BITMAP UNAVAILABLE` fallback, retaining the record and descriptive text. No remote URL or data URI is accepted by the media-reference validator. This validation is input/format checking, not authorization or asset secrecy.

Keyboard users can tab through standard buttons and the scrollable image viewport. Escape closes an image without affecting the terminal's Escape-to-finish-printing behavior. RETURN TO TERMINAL retains the open record and focuses terminal input. Closing a record restores the previous open document, or the terminal when none remains. No terminal history or game action is synthesized by these viewer controls.

## Native processing and display

`scripts/bitmap-fixtures.mjs` draws the deliberately limited-information grayscale sources. It converts RGB through integer luminance, uses nearest-source sampling, quantizes four intensity levels and optionally applies a deterministic 4×4 Bayer threshold on 2×2 pixel blocks. Portrait and room use coarse ordered dithering; the diagram preserves sharp lines and 5×7 bitmap labels without dithering. There is no random noise, high-resolution photograph, cinematic lighting or photographic CSS recoloring.

The indexed PNG palette is exactly:

```text
RGB (5, 11, 5)
RGB (45, 65, 34)
RGB (104, 137, 78)
RGB (164, 204, 124)
```

The three public PNG files total **1,878 bytes**. Original PGM sources and drawing/processing code remain outside the public bundle under `docs/artwork/implementation-03/` and `scripts/`. The source files are retained for revision; no external artwork or person likeness was used.

The runtime performs no canvas processing, image quantization or per-change-detection image transformation. It loads native assets and applies integer display dimensions with `image-rendering: pixelated`. A resize observer recomputes fit when needed; initial measurement is deferred until after rendering and its lifecycle is cleaned up on close. Image content is excluded from the existing CRT blur, keeping pixels and metadata sharp. The enabled CRT treatment is static and follows the existing preference; no animation, flicker, glitch or transition was added. Existing font scale and reduced-motion rules remain in effect.

Only the three demo PNGs are added to app-shell offline prefetch. Packaging verification checks their exact build bytes and service-worker manifest entries, and verifies that PGM sources/generator code are not distributed as public assets. An offline browser session itself was not manually exercised.

## Access, static asset security and compatibility

Path, title and filename lookup still pass through `inspectFile` and the existing locked/backup/access/knowledge checks. Image searches and file listings use the same permitted-file projection as text. A test-only restricted media descriptor verifies that its title, path, description and result count stay hidden, and that alternate OPEN forms do not bypass the existing policy. That fixture has no image bytes and is not a production record.

**A UI permission check does not secure public static bytes.** The three ordinary demo images are intentionally public and may be directly downloaded or cached. No Anna bedside image, Site 6 image, protected original or spoiler-sensitive image asset is included. Future protected art must stay out of `public/` and the build until its disclosure/packaging strategy is specified. No encryption, authenticated asset server or secure-download claim is made.

There are now **46 archive objects: 43 existing text records and 3 demo bitmaps**. Existing text bodies, the eight-service registry/INFO/LOG semantics, the 006 closure/restart contradiction, encounter answer rules, dialogue catalogue, clinical mechanics, characters, acts, consequential operations, permissions and endings remain unchanged. The four supplied narrative sources retain their original hashes and statuses.

Save schema **5**, keys, decoder, QA schema/database/event types and their meanings are unchanged. Existing record-ID lists store image observations/open tabs; image bytes, pixels and media metadata are not saved. Normal file-open QA records apply, with no image-induced knowledge, authority, act or ending milestone. Corporate profiles, service follow-ups and every existing ending path continue to pass validation.

Small compatibility edits are explicit: the optional media descriptor/text summary, image type in search/browser rows, permitted cached-document filtering, a document readability guard, image Escape/return handling, focus restoration on record close, CRT-blur exclusion and offline prefetch for these demo assets. They change presentation/navigation and disclosure enforcement, not story authority or persistence meaning.

## Validation actually performed

| Check | Actual result |
| --- | --- |
| `npm.cmd test` | **377 tests passed, 17 files.** Includes existing text/service/corporate suites and new record, native-size, integer-fit, nonzero viewport lifecycle, invalid/missing asset, metadata, keyboard/close/focus, disclosure, save and QA checks. |
| `npm.cmd run game:validate` | Passed, zero errors; 46 records, unchanged 22 operations, 205 intents, 1,638 recognition examples and all three ending paths with save round trips. Generated coverage JSON refreshed to 46 records. |
| `npm.cmd run build` | Passed existing budgets; initial output approximately **508.10 kB raw / 137.29 kB estimated transfer**. |
| `node scripts/bitmap-fixtures.mjs --check` | All three PNGs and all three original PGM sources regenerate byte-for-byte. |
| `node scripts/validate-bitmaps.mjs --dist` | Passed: deterministic luminance, quantization, dither and nearest-source checks; native PNG dimensions/palette/pixels; only three public demo assets; safe data; source separation; exact production bytes and offline prefetch entries. |
| `node scripts/validate-corporate.mjs --model --dist` | Passed 34 profiles, 6 exclusions, 4 unchanged authored bodies, **48 real local-model inferences** and privacy scan of 13 production JS/JSON/MD assets. |
| `node scripts/validate-services.mjs --model` | Passed eight services, 27 retained events, 9 exclusions, 4 unchanged source hashes and **27 real local-model inferences** with output/save parity. |
| `node scripts/validate-opening.mjs` | Passed 12 question regressions and 3 opening paths in both modes; **40 real local inferences**, reloading after every input. |
| `npm.cmd run model:verify` | All 10 original assets verified; 41,906,219 bytes. No corpus/reference regeneration was required. |
| Native visual inspection | All three generated PNGs were opened and inspected directly: primitive portrait, readable diagram and coarse room still. |
| Live browser / mobile visual validation | **Not completed.** The separate preview origin timed out. The local socket check was blocked by sandbox permissions, and the request for an unsandboxed connectivity check was declined. No existing saved game was resumed, changed or cleared. Temporary preview processes were stopped. |

Responsive behavior is covered by component tests for fit/resize and native magnification, wrapping CSS and the existing document/mobile structure; it is **not** a claim of an exercised phone viewport, device, screen reader or live browser session. Those manual checks remain outstanding. The generated dialogue report retains the pre-existing “Are you a robot?” classifier-label mismatch; no new catalogue mismatch is introduced. An early test compile exposed unsupported NodeList spread syntax; it was corrected to the project's supported form before the successful final suite.

## Exact files created or modified

**30 project files: 17 added, 13 modified**, measured against a 131-file starting hash inventory. The other 118 existing files retain their bytes. Ignored `dist/`, `.angular/` and `tmp/` build/diagnostic outputs are excluded. No commit, push, deployment, deletion, dependency installation or source-reference rewrite was performed.

| Action | Path | Purpose |
| --- | --- | --- |
| Add | `src/app/core/bitmap-records.ts` | Three safe demo descriptors and local media-format validation |
| Add | `src/app/features/documents/bitmap-viewer.ts` | Reusable native-size viewer, fit/zoom and load/lifecycle handling |
| Add | `src/app/features/documents/bitmap-viewer.html` | Permitted metadata, magnification, image, alt text and fallback |
| Add | `src/app/features/documents/bitmap-viewer.css` | Sharp pixels, wrapping controls and scrollable viewport |
| Add | `src/app/features/documents/bitmap-viewer.spec.ts` | Viewer, display, error, sizing and access regression tests |
| Add | `src/app/core/engine/bitmaps.spec.ts` | Archive/search/access/state/save/QA compatibility tests |
| Add | `src/app/app-bitmaps.spec.ts` | Browser-row, document navigation, focus, history and settings tests |
| Add | `scripts/bitmap-fixtures.mjs` | Deterministic drawing/processing and reproducibility checker |
| Add | `scripts/validate-bitmaps.mjs` | Pipeline, record, PNG and production packaging checks |
| Add | `public/bitmaps/demo-employee-id.png` | Native 128×128 portrait placeholder |
| Add | `public/bitmaps/demo-equipment-layout.png` | Native 160×120 diagram placeholder |
| Add | `public/bitmaps/demo-equipment-room.png` | Native 160×120 room placeholder |
| Add | `docs/artwork/implementation-03/demo-employee-id.pgm` | Original 32×32 portrait source |
| Add | `docs/artwork/implementation-03/demo-equipment-layout.pgm` | Original 160×120 diagram source |
| Add | `docs/artwork/implementation-03/demo-equipment-room.pgm` | Original 40×30 room source |
| Add | `docs/artwork/implementation-03/README.md` | Art status, pipeline and revision instructions |
| Add | `docs/IMPLEMENTATION_03_LEGACY_BITMAPS.md` | This report |
| Modify | `src/app/core/models.ts` | Optional typed bitmap descriptor, preserving text/access fields |
| Modify | `src/app/core/content.ts` | Register three ordinary demo archive objects |
| Modify | `src/app/core/engine/game.ts` | Permitted image type in existing search excerpts |
| Modify | `src/app/features/files/file-browser.ts` | BITMAP type in existing rows |
| Modify | `src/app/features/documents/document.ts` | Media branch, readability check, image return/Escape |
| Modify | `src/app/app.ts` | Filter accessible cached documents and restore focus on close |
| Modify | `src/app/app.html` | Wire document close navigation |
| Modify | `src/styles.css` | Exclude bitmap content from CRT blur |
| Modify | `ngsw-config.json` | Prefetch the three ordinary demo PNGs |
| Modify | `README.md` | Bitmap usage, status and report links |
| Modify | `docs/ARCHITECTURE.md` | Media contract, rendering, access and compatibility boundaries |
| Modify | `docs/narrative/README.md` | Record this narrowly authorized placeholder/media phase |
| Modify, generated | `docs/DIALOGUE_COVERAGE.json` | Archive-object count 43 → 46 |

## Remaining decisions and checks

Final approved artwork, actual employee portrait associations, authored product/diagram meaning, real camera/facility identity and archival timestamps require author decisions. Do not infer these from demo IDs or drawing geometry. Anna's ordinary work portrait and her future protected bedside image remain separate, unauthored assets. Clinical imagery needs its own scene timing, safe metadata, access and packaging strategy; no canonical Site 6 layout is supplied here.

Complete a live desktop/mobile visual pass and keyboard/screen-reader review once local preview access is available. The placeholder assets can validate the infrastructure but do not constitute final art approval or story conformity. No new narrative act, clinical revelation or consequential authority is delivered by this pass.
