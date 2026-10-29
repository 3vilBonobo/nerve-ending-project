# GitHub Pages deployment audit — 29 October 2026

## Exact cause observed on the public site

<https://3vilbonobo.github.io/nerve-ending-project/> returns a Jekyll-generated README, with `generator="Jekyll v3.10.0"`, the title `Nerve Ending | nerve-ending-project`, and the theme stylesheet `assets/css/style.css?v=ab8a2ad126c87488d1f60bff0fc551e2ff5afbbe`. It does not load the compiled Angular application.

The only remote workflow was `pages-build-deployment` at `dynamic/pages/pages-build-deployment`. [Run 40857040137](https://github.com/3vilBonobo/nerve-ending-project/actions/runs/40857040137) successfully deployed commit `ab8a2ad126c87488d1f60bff0fc551e2ff5afbbe` from `master`. Its build steps were checkout, **Build with Jekyll**, and upload artifact. There was no dependency installation or Angular production build. Public artifact metadata identifies `github-pages`, ID `12889238663`, compressed size `25,463,384` bytes. This audit inspected that metadata and the publicly served output, rather than downloading the authenticated artifact archive.

Public HTTP responses prove that the repository tree was published:

| Requested project-relative path | Response |
| --- | --- |
| `src/index.html` | 200; uncompiled Angular host, base href `/` |
| `angular.json` | 200; repository build configuration |
| `public/language/v1/manifest.json` | 200; model left inside source `public/` directory |
| `ngsw.json` | 404 |
| `manifest.webmanifest` | 404 |
| `language/v1/manifest.json` | 404 |
| `bitmaps/demo-equipment-layout.png` | 404 |

The checkout had no `.github/workflows` directory. Together these establish that the automatic Jekyll pipeline published repository files, rather than the required `dist/client` contents. A successful Pages deployment therefore did not mean the game had been built.

The owner-only Pages settings screen and REST Pages settings endpoint were unavailable to this unauthenticated session. The observed behavior is consistent with publishing `master / (root)` through the branch/Jekyll pipeline; the exact selected settings could not be read. The required final source setting is **GitHub Actions**.

## Deployment changes

- `.github/workflows/deploy-pages.yml` uses Node 22, `npm ci`, the existing model checksum check, and `npm run build:pages`. It uploads only `dist/client`, then deploys that artifact with the official Pages actions. It targets `master` and supports manual dispatch.
- `build:pages` explicitly selects production and `/nerve-ending-project/` as the base href. Root-hosted builds remain available through `npm run build`.
- `src/styles.css` lets Angular emit the local font as a hashed, relative `media/` asset. The old `/fonts/…` URL escaped the project path. `ngsw-config.json` now includes `/media/**` in app-shell caching.
- The bitmap viewer retains approved asset metadata and validation, then removes the metadata's leading slash only for the HTTP image request. The old request paths escaped the project directory.
- The local model worker validates the model location against the emitted worker's directory, while preserving root-hosted development. Its old exact `/language/v1/` check rejected the already-correct project-relative URL sent by `LocalLanguage`.
- The existing relative service-worker registration and web manifest already support a subdirectory. Angular generates project-prefixed `ngsw.json` entries. Model weights, runtime modules and WASM stay outside app-shell prefetch and retain the existing opt-in cache behavior.
- `scripts/validation/validate-pages-artifact.mjs` validates the compiled output and all model/public assets. The preview server in `scripts/preview/serve.mjs` mounts the actual built base href; `--dir` supports isolated artifact verification.

No gameplay rules, dialogue, story records, or model/reference contents were changed by this deployment fix. Other work was already modifying and reorganizing the shared source tree during the audit; those edits were preserved. No commit, push, remote settings change, or deployment was performed.

## Validation results

- `npm run build:pages` passed using the original production budgets: **748.87 kB** initial JavaScript/CSS, estimated **200.34 kB** transferred. The existing 550 kB warning remains; the 750 kB error limit is unchanged. An earlier concurrent working-tree snapshot exceeded that limit, but the final build did not.
- Artifact checks passed for `dist/client`: correct base href, compiled entry/styles/worker, **23 copied public files**, **16 service-worker checksum entries**, and **10 model/runtime/reference assets totaling 48,628,056 bytes**. All public bytes and model SHA-256 checksums matched; service-worker SHA-1 checksums matched. No repository files were present at the artifact root.
- An isolated production build was also validated in `tmp/pages-audit-build/browser`, because concurrent builds were replacing the shared `dist` output. This frozen artifact was served at `http://127.0.0.1:48741/nerve-ending-project/` for browser and HTTP checks.
- HTTP checks returned 200 with appropriate content types for compiled JavaScript, CSS, icons, PNGs, font, web manifest and service-worker files. All ten downloaded model assets matched their declared sizes and SHA-256 checksums; WASM returned `application/wasm`. Root-level font/image/model requests and a missing JavaScript file correctly returned 404.
- The browser loaded the actual Angular welcome screen with project-prefixed hashed bundle URLs. Enabling Improved questions reached **IMPROVED QUESTIONS: READY / LOCAL**, confirming worker/model/WASM initialization. Settings reported active offline support. The demo equipment diagram loaded from `/nerve-ending-project/bitmaps/demo-equipment-layout.png`, complete with intrinsic dimensions **160 × 120**. No browser console errors or warnings were recorded for these checks.
- All **33 targeted regression tests across three test files passed**, including a repeat after the concurrent directory reorganization. They cover base-path model validation, bitmap requests beneath a project base, existing invalid-image protections, and the optional model lifecycle.
- A tar archive of the isolated validated artifact is retained at `tmp/pages-validated-artifact.tar`; its listing contains the compiled app and public assets, with no repository source/configuration tree. CI creates its own Pages archive from the canonical `dist/client` directory.

The public website remains on the old Jekyll deployment until the approved changes are pushed and the Pages publishing source is changed to GitHub Actions. See [DEPLOYMENT.md](DEPLOYMENT.md) for the exact publishing steps. Verify the real public site again after that deployment; the local checks do not claim the fix has already gone live.
