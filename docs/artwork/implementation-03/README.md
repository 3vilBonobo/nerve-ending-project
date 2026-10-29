# Bitmap demonstration sources

These three original procedural fixtures are engineering placeholders, not approved final artwork or new narrative records about an actual employee, product or location. They contain no protected imagery. No photographs, external image service, runtime generation or third-party image dependency is used.

| Fixture | Original grayscale source | Public native bitmap | Treatment |
| --- | --- | --- | --- |
| Unidentified employee portrait | `demo-employee-id.pgm`, 32×32 | `/bitmaps/demo-employee-id.png`, 128×128 | Coarse four-tone ordered dither |
| Generic equipment diagram | `demo-equipment-layout.pgm`, 160×120 | `/bitmaps/demo-equipment-layout.png`, 160×120 | Sharp lines and 5×7 bitmap labels; no dither |
| Unmapped equipment-room still | `demo-equipment-room.pgm`, 40×30 | `/bitmaps/demo-equipment-room.png`, 160×120 | Coarse four-tone ordered dither |

The PGM files and procedural drawing/pipeline code in `scripts/bitmap-fixtures.mjs` stay outside `public/`. Native PNGs are indexed images using only RGB (5,11,5), (45,65,34), (104,137,78) and (164,204,124). The process uses integer RGB luminance, nearest-source sampling, four-level quantization and optional deterministic 4×4 Bayer thresholds on 2×2 pixel blocks. The source data deliberately contains little visual information. No random noise, photograph filter, animation or invented archival timestamp is involved.

Regenerate with `node scripts/bitmap-fixtures.mjs`. Verify byte-for-byte regeneration with `node scripts/bitmap-fixtures.mjs --check`; run `node scripts/validate-bitmaps.mjs --dist` after building to check data, PNG structure, native resolutions, palette, pipeline behavior, source separation and offline packaging. The viewer performs no per-frame image processing and only scales these native assets by integer factors.

Only these ordinary demo PNGs belong in the public build. Any future clinical or spoiler-sensitive art needs separate author approval, disclosure timing and packaging decisions before its bytes are placed in `public/`; UI access checks do not make a static asset secret.
