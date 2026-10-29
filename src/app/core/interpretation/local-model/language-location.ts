/** Production workers are emitted beside index.html; the dev server can nest worker URLs. */
export function modelAssetBase(root: string, workerUrl: string): URL {
    const base = new URL(root);
    const worker = new URL(workerUrl);
    const deployed = new URL('language/v1/', worker);
    if (base.origin !== worker.origin || base.username || base.password || base.search || base.hash
        || (base.href !== deployed.href && base.pathname !== '/language/v1/')) {
        throw new Error('Invalid model location.');
    }
    return base;
}
