# Visual references and the two eras

The access client and the retained system intentionally belong to different eras. The outside page is a restrained circa-2003 connection utility: one beveled dialog, system-style controls, a short explanation, and Start/Resume. Technical/browser/module details belong in settings. It is not a marketing landing page.

The retained terminal and record viewers draw from late-1980s/early-1990s monochrome systems. These are visual references, not a claim of cycle-accurate VT emulation.

## Sources reviewed

- [Centre for Computing History: Digital VT220](https://www.computinghistory.org.uk/det/70526/Digital-VT220/) — museum collection record and artifact photographs; green, amber and white variants, with 80/132-column, 24-line character displays.
- [DEC VT420 Programmer Reference Manual](https://vt100.net/mirror/mds-199909/cd3/term/vt420rm2.pdf#page=198) — Chapter 10, printed page 176 / PDF page 198, documents blinking/steady block and underscore cursor options. The manual also describes a default 80-column, 24-line window and terminal line-drawing characters.
- [DEC Installing and Using the VT320 Video Terminal, June 1987](https://bitsavers.org/pdf/dec/terminal/vt320/EK-VT320-UU-001_Installing_and_Using_The_VT320_Video_Terminal_Jun87.pdf) — original document reference, archived at Bitsavers. Its searchable index was available; direct PDF rendering was unavailable in the research browser.
- [Peter Hull's VT323 project](https://github.com/phoikoi/VT323) and [Google Fonts description](https://github.com/google/fonts/blob/main/ofl/vt323/DESCRIPTION.en_us.html) — the designer describes deriving the glyphs from VT320 characters and accounting for CRT pixel proportions and phosphor spread.
- [Font distribution and license](https://github.com/google/fonts/tree/main/ofl/vt323) — unmodified `VT323-Regular.ttf`, 153,116 bytes, distributed locally with the accompanying SIL Open Font License 1.1.

## Applied choices

Terminal and document body text uses VT323 at 24px desktop / 22px narrow viewport, with the existing text-size setting applied. The surrounding client uses system fonts and larger conventional controls. Terminal output is fixed-pitch, sparse, procedural, and monochrome, with simple line borders rather than decorative cards. This is a responsive browser interface rather than a rigid 80-column emulator: long records wrap on narrow screens.

The cursor is a one-character-wide, thick blinking underline following the actual input selection position and horizontal scroll. Block cursors were also common, but the underscore matches the requested appearance. Reduced-motion preferences keep it steadily visible.

CRT softness is a restrained rendering approximation using a small blur, phosphor halo and scanline overlay. It is not a claim that every original terminal was blurry. Turning CRT effects off removes the halo, blur and scanlines. No strong flicker, flashing, or forced distortion is introduced.

VT323 is self-hosted and included in the production offline cache. No external fonts, museum photos, model weights or third-party scripts are requested at runtime.
