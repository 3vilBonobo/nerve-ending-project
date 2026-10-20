# Static deployment

The public game is a static Angular application. No application server, database, credentials, model API, or connection to the creator's PC is required. A friend can play a public static deployment using only a modern browser. The hosting account belongs to the creator; the application itself has no player accounts.

## Build and verify

```powershell
npm ci
npm test
npm run build
npm run preview
```

Build output: **`dist/client`**. Serve it at a site's root over HTTPS. The local production preview is `http://127.0.0.1:4173/`; its server supplies SPA navigation fallback. `npm start` is development only and does not activate the service worker.

## Cloudflare Pages

1. Put the project source into your chosen Git repository and connect it in Cloudflare Pages, or upload the production directory using Pages Direct Upload.
2. Set build command to `npm run build`, build output directory to `dist/client`, and repository root to this project folder. Use a supported Node runtime, for example Node 22.22.3 or newer in its compatible line; `NODE_VERSION` controls the Pages build image runtime. The Angular packages are locked in `package-lock.json`.
3. Publish using the platform's generated `pages.dev` domain and verify the setup page, a completed investigation, reload/resume, icons, and manifest. HTTPS is supplied by the host.
4. Keep Pages' default SPA behavior. This app has no top-level `404.html`, so navigation requests can fall back to `index.html`. Do not redirect JS, CSS, icon, manifest, or service-worker files to HTML.

Cloudflare's framework examples use generic output names; this repository's actual output path above takes precedence. See [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [serving Pages / SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/), and [Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/).

Expected hosting cost: **€0 for this static app within the selected free tier**, excluding an optional paid domain and any future paid services. Static asset requests are free; build/file limits still apply. Check the current [Pages limits](https://developers.cloudflare.com/pages/platform/limits/) and [Workers/Pages pricing](https://developers.cloudflare.com/workers/platform/pricing/) before changing the architecture or plan. This prototype uses no Functions.

## Sites preview

`.openai/hosting.json` records the private Sites project identity and static directory. The deployed private preview, if publication succeeds, is for the owner and follows Sites access controls. It is separate from a public no-account playtest deployment. Preserve that identity on updates; do not register duplicate projects. Deploy only an archive built from the matching pushed source commit.

## Offline / PWA behavior

Production builds generate Angular's service worker and `ngsw.json`. It prefetches the app shell, authored content included in JavaScript, manifest, and local icons. Registration occurs after the app stabilizes. A first successful visit and completed cache are needed before offline use; browser storage eviction can remove the cache. Optional language weights and runtime are excluded from prefetch. They load only after opt-in, under `/language/v1/`, and the worker keeps them in its own versioned Cache API store. Later cached loads use these bytes and fall back to a cached manifest when the network is unavailable. Uncached assets cannot be used offline.

The app manifest uses **Nerve Ending** for both name and short name. Browsers decide whether and when an install prompt appears. When the native `beforeinstallprompt` event is available, settings show an accurate installation control. Other browsers may offer installation through their own menus. Installation is optional and separate from a language model.

Service workers require HTTPS or trusted localhost. Test the production build, not `ng serve`, when verifying caching. Host `ngsw-worker.js`, `ngsw.json`, `index.html`, and `manifest.webmanifest` with update-friendly cache headers; hashed bundles may be cached long term. The bundled preview sends `no-cache` headers to simplify local update tests.

## Moving the app

Deploy at a root origin for the supplied configuration. If you need a subdirectory, rebuild with an appropriate `--base-href`, align the service-worker scope and manifest start/scope, and verify asset URLs rather than copying the root build unchanged. Progress is per browser and origin, so changing ports, domains, or browsers creates a different save location.

Never expose the optional Ollama daemon publicly. No localhost model endpoint is needed by the deployed game. Local classifier settings are hidden in production.
